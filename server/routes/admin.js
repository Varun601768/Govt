// routes/admin.js

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

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Find active admin (case-insensitive because schema lowercases username)
    const admin = await Admin.findOne({ username: username.toLowerCase().trim(), isActive: true });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password using bcrypt
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
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
        role: admin.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔒 VERIFY ADMIN TOKEN (middleware)
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
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// ======================
// 🌱 SEED DATA
// ======================
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    // Create admin — password gets hashed by pre('save') hook in Admin.js
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@hospital.gov.in',
      role: 'admin',
      isActive: true,
    });
    await admin.save();

    // Seed hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: 'Wenlock Hospital',
        location: 'Mangalore',
        phone: '+91-824-2422271',
        email: 'wenlock@gov.in',
        address: 'Hampankatta, Mangalore',
        emergency: '108',
        departments: ['Cardiology', 'Neurology'],
        image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
      },
      {
        name: 'District Hospital Udupi',
        location: 'Udupi',
        phone: '+91-820-2520247',
        email: 'udupi@gov.in',
        address: 'Court Road, Udupi',
        emergency: '108',
        departments: ['Orthopedics', 'Pediatrics', 'General Medicine'],
        image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg',
      },
    ]);

    // Seed doctors
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        qualification: 'MBBS, MD (Cardiology)',
        experience: 10,
        hospitalId: hospitals[0]._id,
      },
      {
        name: 'Dr. Priya Sharma',
        department: 'Neurology',
        qualification: 'MBBS, DM (Neurology)',
        experience: 8,
        hospitalId: hospitals[0]._id,
      },
      {
        name: 'Dr. Suresh Nair',
        department: 'Orthopedics',
        qualification: 'MBBS, MS (Ortho)',
        experience: 12,
        hospitalId: hospitals[1]._id,
      },
    ]);

    // Seed schedules
    await Schedule.insertMany([
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
      },
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
      },
      {
        doctorId: doctors[1]._id,
        dayOfWeek: 'Tuesday',
        startTime: '10:00',
        endTime: '13:00',
        type: 'OPD',
      },
      {
        doctorId: doctors[2]._id,
        dayOfWeek: 'Thursday',
        startTime: '08:00',
        endTime: '11:00',
        type: 'OPD',
      },
    ]);

    res.json({
      message: 'Database seeded successfully',
      data: {
        admins: 1,
        hospitals: hospitals.length,
        doctors: doctors.length,
        schedules: 4,
      },
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔍 DEBUG ROUTE (remove in production)
// ======================
router.get('/debug-admin', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) return res.json({ exists: false });
    res.json({
      exists: true,
      username: admin.username,
      email: admin.email,
      isActive: admin.isActive,
      role: admin.role,
      passwordHashed: admin.password.startsWith('$2'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const data = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Hospital not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/hospitals/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Hospital.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 👨‍⚕️ DOCTOR APIs
// ======================
router.get('/doctors', verifyAdmin, async (req, res) => {
  try {
    const data = await Doctor.find().populate('hospitalId').sort({ createdAt: -1 });
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
    const data = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Doctor not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/doctors/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Doctor.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 📅 SCHEDULE APIs
// ======================
router.get('/schedules', verifyAdmin, async (req, res) => {
  try {
    const data = await Schedule.find().populate('doctorId').sort({ createdAt: -1 });
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

router.put('/schedules/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Schedule not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/schedules/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Schedule.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// 💬 FEEDBACK APIs
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

router.delete('/feedbacks/:id', verifyAdmin, async (req, res) => {
  try {
    const data = await Feedback.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
