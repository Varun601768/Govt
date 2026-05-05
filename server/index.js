const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env', override: true });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://goverment-hospital-portal1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:4vp23mc033@cluster.mongodb.net/hospital-management';

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.warn('Proceeding without an active MongoDB connection. Ensure MongoDB is running or update MONGODB_URI in config.env');
  });

// Routes
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital Management API is running' });
});

// Start server with automatic port fallback if EADDRINUSE
const startServer = (initialPort, maxAttempts = 20) => {
  let currentPort = initialPort;
  let attempts = 0;

  const tryListen = () => {
    const server = app
      .listen(currentPort, () => {
        console.log(`Server running on port ${currentPort}`);
      })
      .on('error', (error) => {
        if (error && error.code === 'EADDRINUSE' && attempts < maxAttempts) {
          attempts += 1;
          const nextPort = currentPort + 1;
          console.warn(
            `Port ${currentPort} is in use. Trying port ${nextPort} (attempt ${attempts}/${maxAttempts})...`
          );
          currentPort = nextPort;
          setTimeout(tryListen, 100);
        } else {
          console.error('Failed to start server:', error);
          process.exit(1);
        }
      });
  };

  tryListen();
};

startServer(PORT);
