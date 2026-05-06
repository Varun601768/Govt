const mongoose = require('mongoose');
require('dotenv').config({ path: '../config.env' });

const Admin = require('../models/Admin');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');

// ✅ FIXED MongoDB URI (NO "MONGODB_URI=" inside string)
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/hospital-management';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});

    console.log('🗑️ Old data cleared');

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123', // will be hashed automatically
      email: 'admin@hospital.gov.in',
      role: 'admin'
    });

    await admin.save();

    console.log('👤 Admin created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    // Create hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: 'Wenlock Hospital',
        location: 'Mangalore',
        phone: '+91-824-2422271',
        email: 'wenlock@gov.in',
        address: 'Hampankatta, Mangalore, Karnataka 575001',
        emergency: '108',
        departments: [
          'Cardiology',
          'Neurology',
          'Orthopedics',
          'General Medicine',
          'Pediatrics',
          'Gynecology'
        ],
        image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
      },
      {
        name: 'Government Hospital Puttur',
        location: 'Puttur',
        phone: '+91-8251-234567',
        email: 'puttur@gov.in',
        address: 'Hospital Road, Puttur, Karnataka 574201',
        emergency: '108',
        departments: [
          'General Medicine',
          'Surgery',
          'Pediatrics',
          'Orthopedics',
          'Gynecology'
        ],
        image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'
      }
    ]);

    console.log(`🏥 Hospitals created: ${hospitals.length}`);

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
        specialization: ['Heart Surgery'],
        opdDays: ['Monday', 'Tuesday', 'Wednesday'],
        image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg'
      }
    ]);

    console.log(`👨‍⚕️ Doctors created: ${doctors.length}`);

    // Create schedules
    const schedules = await Schedule.insertMany([
      {
        doctorId: doctors[0]._id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        type: 'OPD',
        isAvailable: true
      }
    ]);

    console.log(`📅 Schedules created: ${schedules.length}`);

    console.log('\n🎉 Database Seeded Successfully!');
    console.log('👉 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
