const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const Admin = require('../models/Admin');
const Feedback = require('../models/Feedback');
const router = express.Router();
const mongoose = require('mongoose');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
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

// Middleware to verify admin token
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

// Seed initial data
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    // Create default admin
    await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@hospital.gov.in',
      role: 'admin'
    });

    // Create hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: 'Wenlock Hospital',
        location: 'Mangalore',
        phone: '+91-824-2422271',
        email: 'wenlock@gov.in',
        address: 'Hampankatta, Mangalore, Karnataka 575001',
        emergency: '108',
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Gynecology'],
        image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.634998689849!2d74.84038587485252!3d12.866835487438966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4cf3b55ca3%3A0xd1a7e005cb1aa688!2sWenlock%20District%20Hospital!5e0!3m2!1sen!2sin!4v1776347611053!5m2!1sen!2sin'
      },
      {
        name: 'Government Hospital Puttur',
        location: 'Puttur',
        phone: '+91-8251-234567',
        email: 'puttur@gov.in',
        address: 'Hospital Road, Puttur, Dakshina Kannada, Karnataka 574201',
        emergency: '108',
        departments: ['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'Gynecology'],
        image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
        // mapUrl not provided; frontend will fall back to location-based embed.
        mapUrl: ''
      }
    ]);

    // Create doctors
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        qualification: 'MBBS, MD (Cardiology)',
        experience: 15,
        hospitalId: hospitals[0]._id,
        phone: '+91-9876543210',
        email: 'rajesh.kumar@wenlock.gov.in',
        specialization: ['Heart Surgery', 'Interventional Cardiology'],
        opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Dr. Priya Sharma',
        department: 'Neurology',
        qualification: 'MBBS, MD (Neurology)',
        experience: 12,
        hospitalId: hospitals[0]._id,
        phone: '+91-9876543211',
        email: 'priya.sharma@wenlock.gov.in',
        specialization: ['Stroke Treatment', 'Epilepsy Management'],
        opdDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        image: 'https://images.pexels.com/photos/559827/pexels-photo-559827.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        name: 'Dr. Meera Bhat',
        department: 'General Medicine',
        qualification: 'MBBS, MD (Medicine)',
        experience: 10,
        hospitalId: hospitals[1]._id,
        phone: '+91-9876543213',
        email: 'meera.bhat@puttur.gov.in',
        specialization: ['Diabetes Management', 'Hypertension'],
        opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ]);

    // Create schedules
    await Schedule.insertMany([
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
        isAvailable: true
      },
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
        isAvailable: true
      },
      {
        doctorId: doctors[1]._id,
        dayOfWeek: 'Monday',
        startTime: '10:00',
        endTime: '13:00',
        type: 'OPD',
        isAvailable: true
      },
      {
        doctorId: doctors[2]._id,
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '14:00',
        type: 'OPD',
        isAvailable: true
      }
    ]);

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all hospitals
router.get('/hospitals', verifyAdmin, async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new hospital
router.post('/hospitals', verifyAdmin, async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    const savedHospital = await hospital.save();
    res.status(201).json(savedHospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update hospital
router.put('/hospitals/:id', verifyAdmin, async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hospital id' });
    }
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete hospital
router.delete('/hospitals/:id', verifyAdmin, async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hospital id' });
    }
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    // Also delete associated doctors and their schedules
    const hospitalId = req.params.id;
    const doctors = await Doctor.find({ hospitalId });
    const doctorIds = doctors.map(d => d._id);
    await Doctor.deleteMany({ hospitalId });
    if (doctorIds.length > 0) {
      await Schedule.deleteMany({ doctorId: { $in: doctorIds } });
    }
    res.json({ message: 'Hospital and related doctors/schedules deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all doctors
router.get('/doctors', verifyAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('hospitalId', 'name location').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new doctor
router.post('/doctors', verifyAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.hospitalId && typeof payload.hospitalId === 'object') {
      payload.hospitalId = payload.hospitalId.id || payload.hospitalId._id;
    }
    const doctor = new Doctor(payload);
    const savedDoctor = await doctor.save();
    const populatedDoctor = await Doctor.findById(savedDoctor._id).populate('hospitalId', 'name location');
    res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update doctor
router.put('/doctors/:id', verifyAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.hospitalId && typeof payload.hospitalId === 'object') {
      payload.hospitalId = payload.hospitalId.id || payload.hospitalId._id;
    }
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ).populate('hospitalId', 'name location');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete doctor
router.delete('/doctors/:id', verifyAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    // Also delete associated schedules
    await Schedule.deleteMany({ doctorId: req.params.id });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all schedules
router.get('/schedules', verifyAdmin, async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('doctorId', 'name department')
      .sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new schedule
router.post('/schedules', verifyAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.doctorId && typeof payload.doctorId === 'object') {
      payload.doctorId = payload.doctorId.id || payload.doctorId._id;
    }
    const schedule = new Schedule(payload);
    const savedSchedule = await schedule.save();
    const populatedSchedule = await Schedule.findById(savedSchedule._id).populate('doctorId', 'name department');
    res.status(201).json(populatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update schedule
router.put('/schedules/:id', verifyAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.doctorId && typeof payload.doctorId === 'object') {
      payload.doctorId = payload.doctorId.id || payload.doctorId._id;
    }
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ).populate('doctorId', 'name department');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete schedule
router.delete('/schedules/:id', verifyAdmin, async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create feedback (public)
router.post('/feedbacks', async (req, res) => {
  try {
    const { name, subject, message } = req.body || {};
    if (!name || !subject || !message) {
      return res.status(400).json({ message: 'name, subject, and message are required' });
    }

    const feedback = new Feedback({ name, subject, message });
    const saved = await feedback.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get all feedback (admin)
router.get('/feedbacks', verifyAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;