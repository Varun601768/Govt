const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const Admin = require('../models/Admin');
const Feedback = require('../models/Feedback');

const router = express.Router();


// ======================
// 🔐 ADMIN LOGIN
// ======================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Find admin
    const admin = await Admin.findOne({ username, isActive: true });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password (bcrypt)
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔒 VERIFY ADMIN TOKEN
// ======================
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// ======================
// 🌱 SEED DATA (IMPORTANT)
// ======================
router.post('/seed', async (req, res) => {
  try {
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    // 🔥 Password will be hashed automatically (if model is correct)
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@hospital.gov.in',
      role: 'admin'
    });

    await admin.save();

    const hospitals = await Hospital.insertMany([
      {
        name: 'Wenlock Hospital',
        location: 'Mangalore',
        phone: '+91-824-2422271',
        email: 'wenlock@gov.in',
        address: 'Hampankatta, Mangalore',
        emergency: '108',
        departments: ['Cardiology', 'Neurology'],
        image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
      }
    ]);

    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        qualification: 'MBBS, MD',
        experience: 10,
        hospitalId: hospitals[0]._id
      }
    ]);

    await Schedule.insertMany([
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD'
      }
    ]);

    res.json({ message: 'Database seeded successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🏥 HOSPITAL APIs
// ======================
router.get('/hospitals', verifyAdmin, async (req, res) => {
  try {
    const data = await Hospital.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/hospitals', verifyAdmin, async (req, res) => {
  try {
    const data = new Hospital(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/hospitals/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/hospitals/:id', verifyAdmin, async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 👨‍⚕️ DOCTOR APIs
// ======================
router.get('/doctors', verifyAdmin, async (req, res) => {
  try {
    const data = await Doctor.find().populate('hospitalId');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/doctors', verifyAdmin, async (req, res) => {
  try {
    const data = new Doctor(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/doctors/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/doctors/:id', verifyAdmin, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 📅 SCHEDULE APIs
// ======================
router.get('/schedules', verifyAdmin, async (req, res) => {
  try {
    const data = await Schedule.find().populate('doctorId');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/schedules', verifyAdmin, async (req, res) => {
  try {
    const data = new Schedule(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/schedules/:id', verifyAdmin, async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 💬 FEEDBACK
// ======================
router.post('/feedbacks', async (req, res) => {
  try {
    const data = new Feedback(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/feedbacks', verifyAdmin, async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
