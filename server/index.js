const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env', override: true });

const app = express();
const PORT = Number(process.env.PORT) || 5000;


// ======================
// 🌐 CORS CONFIGURATION
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://goverment-hospital-portal1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());


// ======================
// 🏠 ROOT ROUTE (FIX)
// ======================
app.get('/', (req, res) => {
  res.json({
    status: "OK",
    message: "🚀 Hospital Management API is running",
    endpoints: {
      health: "/api/health",
      login: "/api/admin/login",
      hospitals: "/api/hospitals",
      doctors: "/api/doctors"
    }
  });
});


// ======================
// 🛢️ MONGODB CONNECTION
// ======================
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://username:4vp23mc033@cluster.mongodb.net/hospital-management';

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️ Running without DB connection. Check MONGODB_URI');
  });


// ======================
// 📦 API ROUTES
// ======================
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/admin', require('./routes/admin'));


// ======================
// ❤️ HEALTH CHECK
// ======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hospital Management API is running'
  });
});


// ======================
// 🚀 START SERVER
// ======================
const startServer = (initialPort, maxAttempts = 20) => {
  let currentPort = initialPort;
  let attempts = 0;

  const tryListen = () => {
    app.listen(currentPort, () => {
      console.log(`🚀 Server running on port ${currentPort}`);
    }).on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempts < maxAttempts) {
        attempts++;
        currentPort++;
        console.warn(`⚠️ Port in use, trying ${currentPort}...`);
        setTimeout(tryListen, 100);
      } else {
        console.error('❌ Server failed to start:', error);
        process.exit(1);
      }
    });
  };

  tryListen();
};

startServer(PORT);
