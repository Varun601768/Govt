const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const Admin = require('../models/Admin');
const Feedback = require('../models/Feedback');

const router = express.Router();


// 🔐 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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


// 🔐 VERIFY TOKEN
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


// 🌱 SEED (FIXED)
router.post('/seed', async (req, res) => {
  try {
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // ✅ CREATE ADMIN
    await Admin.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@hospital.gov.in',
      role: 'admin',
      isActive: true
    });

    // ✅ CREATE HOSPITALS
    const hospitals = await Hospital.insertMany([
      {
        name: 'Wenlock Hospital',
        location: 'Mangalore',
        phone: '+91-824-2422271',
        email: 'wenlock@gov.in',
        address: 'Hampankatta, Mangalore',
        emergency: '108',
        departments: ['Cardiology', 'Neurology'],
        image: '',
        mapUrl: ''
      }
    ]);

    // ✅ CREATE DOCTORS
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        qualification: 'MBBS, MD',
        experience: 10,
        hospitalId: hospitals[0]._id,
        phone: '9876543210',
        email: 'doctor@gov.in',
        specialization: ['Heart'],
        opdDays: ['Monday'],
        image: ''
      }
    ]);

    // ✅ CREATE SCHEDULE
    await Schedule.insertMany([
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
        isAvailable: true
      }
    ]);

    res.json({ message: 'Seed data created successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🏥 HOSPITALS
router.get('/hospitals', verifyAdmin, async (req, res) => {
  const data = await Hospital.find();
  res.json(data);
});

router.post('/hospitals', verifyAdmin, async (req, res) => {
  const data = await Hospital.create(req.body);
  res.json(data);
});

router.put('/hospitals/:id', verifyAdmin, async (req, res) => {
  const data = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
});

router.delete('/hospitals/:id', verifyAdmin, async (req, res) => {
  await Hospital.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


// 👨‍⚕️ DOCTORS
router.get('/doctors', verifyAdmin, async (req, res) => {
  const data = await Doctor.find().populate('hospitalId');
  res.json(data);
});

router.post('/doctors', verifyAdmin, async (req, res) => {
  const data = await Doctor.create(req.body);
  res.json(data);
});

router.put('/doctors/:id', verifyAdmin, async (req, res) => {
  const data = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
});

router.delete('/doctors/:id', verifyAdmin, async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


// 📅 SCHEDULES
router.get('/schedules', verifyAdmin, async (req, res) => {
  const data = await Schedule.find().populate('doctorId');
  res.json(data);
});

router.post('/schedules', verifyAdmin, async (req, res) => {
  const data = await Schedule.create(req.body);
  res.json(data);
});

router.put('/schedules/:id', verifyAdmin, async (req, res) => {
  const data = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
});

router.delete('/schedules/:id', verifyAdmin, async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


// 💬 FEEDBACK
router.post('/feedbacks', async (req, res) => {
  const data = await Feedback.create(req.body);
  res.json(data);
});

router.get('/feedbacks', verifyAdmin, async (req, res) => {
  const data = await Feedback.find();
  res.json(data);
});


module.exports = router;
