const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const portalRoutes = require('./routes/portalRoutes');
const User = require('./models/User');
const Attendance = require('./models/Attendance');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/portal', portalRoutes);

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Seed Dummy Users (One-time check)
const seedUsers = async () => {
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const users = [
      { name: 'Admin User', email: 'admin@college.com', password: 'admin123', role: 'admin' }
    ];
    await User.insertMany(users);
    console.log('Admin user seeded');
  }
};

const mongoose = require('mongoose');
mongoose.connection.once('connected', () => {
  seedUsers();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
