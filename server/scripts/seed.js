const mongoose = require('mongoose');
require('dotenv').config({ path: '../config.env' });

const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    console.log('Cleared existing data');

    // Create default admin
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@hospital.gov.in',
      role: 'admin'
    });
    console.log('Created admin user:', admin.username);

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
        image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        name: 'Government Hospital Puttur',
        location: 'Puttur',
        phone: '+91-8251-234567',
        email: 'puttur@gov.in',
        address: 'Hospital Road, Puttur, Dakshina Kannada, Karnataka 574201',
        emergency: '108',
        departments: ['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'Gynecology'],
        image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]);
    console.log('Created hospitals:', hospitals.length);

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
    console.log('Created doctors:', doctors.length);

    // Create schedules
    const schedules = await Schedule.insertMany([
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
    console.log('Created schedules:', schedules.length);

    console.log('Database seeded successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
