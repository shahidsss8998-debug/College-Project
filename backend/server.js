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

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Seed Dummy Users (One-time check)
const seedPortalData = async () => {
  const Announcement = require('./models/Announcement');
  const Event = require('./models/Event');
  const Resource = require('./models/Resource');
  const User = require('./models/User');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) return;

  const annCount = await Announcement.countDocuments();
  if (annCount === 0) {
    await Announcement.insertMany([
      { title: 'Annual Sports Meet 2026', content: 'Our annual sports meet starts next week. All students are invited to participate.', department: 'All', createdBy: admin._id },
      { title: 'BCA Project Submission', content: 'Final year BCA students must submit their projects by Friday.', department: 'BCA', createdBy: admin._id },
      { title: 'Holiday Notice', content: 'College will remain closed on Friday for the local festival.', department: 'All', createdBy: admin._id }
    ]);
  }

  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany([
      { title: 'Tech Workshop 2026', description: 'A full day workshop on Modern Web Technologies.', date: new Date(Date.now() + 86400000), venue: 'Main Hall', createdBy: admin._id },
      { title: 'Cultural Fest', description: 'Join us for a night of music and dance.', date: new Date(Date.now() + 172800000), venue: 'Campus Ground', createdBy: admin._id }
    ]);
  }

  const resCount = await Resource.countDocuments();
  if (resCount === 0) {
    await Resource.insertMany([
      { title: 'Java Programming Notes', subject: 'Core Java', department: 'BCA', semester: 3, fileUrl: 'https://www.tutorialspoint.com/java/java_tutorial.pdf', uploadedBy: admin._id },
      { title: 'Data Structures Syllabus', subject: 'Data Structures', department: 'B.Sc CS', semester: 2, fileUrl: 'https://www.uobabylon.edu.iq/eprints/publication_2_22893_6215.pdf', uploadedBy: admin._id }
    ]);
  }

  // Shahid Attendance Seeding (Forced)
  try {
    const shahids = await User.find({ name: { $regex: /shahid/i } });

    if (shahids.length > 0) {
      for (const shahid of shahids) {
        const records = [];
        const startDate = new Date('2026-01-01');
        const endDate = new Date('2026-04-30');
        const holidays = ['2026-01-26', '2026-04-14'];
        const dayOrders = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
        let currentDate = new Date(startDate);
        let workingDaysCount = 0;

        while (currentDate <= endDate && workingDaysCount < 90) {
          const dateString = currentDate.toISOString().split('T')[0];
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6 && !holidays.includes(dateString)) {
            const periods = Array.from({ length: 5 }, () => Math.random() > 0.15 ? 'present' : 'absent');
            const dayOrder = dayOrders[workingDaysCount % 6];
            records.push({ date: dateString, dayOrder, periods });
            workingDaysCount++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const existing = await Attendance.findOne({ studentId: shahid._id });
        if (existing) {
          existing.records = records;
          await existing.save();
        } else {
          await Attendance.create({ studentId: shahid._id, records });
        }
        console.log(`Successfully FORCE seeded ${workingDaysCount} days of attendance for ${shahid.name} (${shahid.email})`);
      }
    } else {
      console.log('No student named Shahid found to seed attendance.');
    }
  } catch (err) {
    console.error('Attendance seeding error:', err.message);
  }
};

const seedUsers = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const users = [
      { name: 'Student Name', email: 'student@college.com', password: '123456', role: 'student' },
      { name: 'Admin User', email: 'admin@college.com', password: 'admin123', role: 'admin' },
      { name: 'Arun', email: 'arun@college.com', password: 'password', role: 'student' },
      { name: 'Bala', email: 'bala@college.com', password: 'password', role: 'student' },
      { name: 'Kumar', email: 'kumar@college.com', password: 'password', role: 'student' }
    ];
    await User.insertMany(users);
    console.log('Dummy users seeded');
  }
  await seedPortalData();
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
