const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const Resource = require('../models/Resource');
const Event = require('../models/Event');

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const attendanceBatches = await Attendance.find({});

    // Map to track each student's attendance: { studentId: { presentDays: 0, recordedDays: 0 } }
    const studentStats = {};

    attendanceBatches.forEach(batch => {
      batch.students.forEach(s => {
        const sId = s.studentId.toString();
        if (!studentStats[sId]) {
          studentStats[sId] = { presentDays: 0, recordedDays: 0 };
        }

        studentStats[sId].recordedDays++;

        // Count periods present in this batch
        const periodsPresent = s.periods.filter(p => p === 'present').length;
        // A day is counted as present if attended >= 3 periods
        if (periodsPresent >= 3) {
          studentStats[sId].presentDays++;
        }
      });
    });

    let totalPercentageSum = 0;
    let lowAttendanceCount = 0;
    const studentsWithRecords = Object.keys(studentStats).length;

    Object.values(studentStats).forEach(stat => {
      const percentage = (stat.presentDays / stat.recordedDays) * 100;
      totalPercentageSum += percentage;
      if (percentage < 75) {
        lowAttendanceCount++;
      }
    });

    // Students with no records are also "Action Required" if we consider them as 0%
    // but for now let's only count those who have at least one record and are below 75%
    // Plus students with 0 records
    const studentsWithoutRecords = totalStudents - studentsWithRecords;
    const totalActionRequired = lowAttendanceCount + studentsWithoutRecords;

    const avgAttendance = studentsWithRecords > 0
      ? Math.round(totalPercentageSum / studentsWithRecords)
      : 0;

    res.json({
      activeStudents: totalStudents.toLocaleString(),
      avgAttendance: `${avgAttendance}%`,
      actionRequired: totalActionRequired
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Error calculating dashboard stats' });
  }
};

const getStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const course = req.query.course || '';
  const semester = req.query.semester || '';
  const academicYear = req.query.academicYear || '';

  try {
    const query = { role: 'student' };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (course) {
      query['profile.admission.course'] = course;
    }

    if (semester) {
      query['profile.admission.semester'] = semester;
    }

    if (academicYear) {
      query['profile.admission.academicYear'] = academicYear;
    }

    const count = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      students,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error('Fetch Students Error:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/mailer');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      let isMatch = false;
      // Check if password looks like a bcrypt hash (starts with $2a$ or $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // Fallback for legacy plain-text passwords
        isMatch = (user.password === password);
      }

      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '30d'
        });

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token
        });
        return;
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addStudent = async (req, res) => {
  const { name, email, password, profile } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Auto-generate Admission Number (e.g., ADM20260001)
    const year = new Date().getFullYear();
    // Find the student with the highest admission number for this year to avoid duplicates
    const lastStudent = await User.findOne({
      'profile.admission.admissionNo': new RegExp(`^ADM${year}`)
    }).sort({ 'profile.admission.admissionNo': -1 });

    let nextNumber = 1;
    if (lastStudent && lastStudent.profile.admission.admissionNo) {
      const lastNo = lastStudent.profile.admission.admissionNo.substring(7);
      nextNumber = parseInt(lastNo) + 1;
    }
    const admissionNo = `ADM${year}${nextNumber.toString().padStart(4, '0')}`;

    // Ensure admission info exists in profile
    const studentProfile = {
      ...profile,
      admission: {
        ...(profile?.admission || {}),
        admissionNo,
        admissionDate: profile?.admission?.admissionDate || new Date().toISOString().split('T')[0]
      }
    };

    // Generate a secure 8-character temporary password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let tempPassword = "";
    for (let i = 0; i < 8; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      profile: studentProfile
    });

    // Send styled email with credentials
    const mailOptions = {
      from: `"MERITS College Administration" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your MERITS College Portal Credentials",
      html: `
        <div style="background-color: #FAFAF8; padding: 20px; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1B3A5C;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
            
            <!-- Header Block -->
            <div style="background-color: #7B1113; padding: 30px 20px; text-align: center; border-bottom: 4px solid #C9A84C;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff; font-family: 'Playfair Display', serif; letter-spacing: 1px;">MERITS COLLEGE</h2>
              <p style="margin: 5px 0 0 0; font-size: 10px; color: #C9A84C; font-weight: bold; text-transform: uppercase; tracking-widest: 2px;">Arts & Science College</p>
            </div>

            <!-- Content Block -->
            <div style="padding: 30px 25px;">
              <h1 style="margin: 0 0 15px 0; font-size: 22px; color: #1B3A5C; font-family: 'Playfair Display', serif; text-align: center;">Portal Access Granted</h1>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #4b5563; line-height: 1.6; text-align: center;">
                Dear <strong>${name}</strong>,<br/>
                Your account has been successfully created. Use the credentials below to access your student portal.
              </p>
              
              <div style="background-color: #FDF8F0; border-left: 4px solid #C9A84C; border-radius: 4px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Email:</strong> <span style="color: #7B1113;">${email}</span></p>
                <p style="margin: 0; font-size: 13px;"><strong>Password:</strong> <span style="color: #7B1113;">${tempPassword}</span></p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://college-project-br9s.onrender.com/login" style="display: inline-block; background-color: #7B1113; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 14px; transition: background 0.3s ease;">
                  Login to Portal
                </a>
              </div>
            </div>

            <!-- Footer Block -->
            <div style="padding: 20px; text-align: center; background-color: #F9FAFB; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 MERITS College. All rights reserved.</p>
              <p style="margin: 4px 0 0 0; font-size: 10px; color: #1B3A5C; font-weight: 600;">"Enter To Learn, Leave To Serve"</p>
            </div>

          </div>
        </div>
      `
    };

    // Send email in the background (no await) so the response is instant
    transporter.sendMail(mailOptions).catch(err => {
      console.error('Background Email Error:', err);
    });

    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully. Login credentials generated and email sending in background.' 
    });
  } catch (error) {
    console.error('Registration Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Update nested profile fields if provided
      if (req.body.profile) {
        user.profile = {
          ...user.profile,
          ...req.body.profile,
          personal: { ...(user.profile?.personal || {}), ...(req.body.profile?.personal || {}) },
          parent: { ...(user.profile?.parent || {}), ...(req.body.profile?.parent || {}) },
          address: { ...(user.profile?.address || {}), ...(req.body.profile?.address || {}) },
          academic: { ...(user.profile?.academic || {}), ...(req.body.profile?.academic || {}) },
          admission: { ...(user.profile?.admission || {}), ...(req.body.profile?.admission || {}) },
          identification: { ...(user.profile?.identification || {}), ...(req.body.profile?.identification || {}) }
        };
      }

      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Student Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating student' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentFullProfile = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch Attendance
    const attendance = await Attendance.findOne({ studentId: req.params.id });

    let attendanceSummary = { present: 0, absent: 0, percentage: '0.0', total: 0, history: [] };
    if (attendance && attendance.records) {
      let present = 0;
      let total = 0;
      attendance.records.forEach(record => {
        record.periods.forEach(status => {
          total++;
          if (status === 'present') present++;
        });
      });
      attendanceSummary = {
        present,
        absent: total - present,
        percentage: total > 0 ? ((present / total) * 100).toFixed(1) : '0.0',
        total,
        history: attendance.records.sort((a, b) => new Date(b.date) - new Date(a.date))
      };
    }

    // Fetch Registered Events
    const events = await Event.find({
      participants: req.params.id
    }).sort({ date: -1 });

    res.json({
      student,
      attendance: attendanceSummary,
      events
    });
  } catch (error) {
    console.error('Full Profile Error:', error);
    res.status(500).json({ message: 'Server error fetching full profile' });
  }
};

const testEmail = async (req, res) => {
  try {
    const mailOptions = {
      from: `"MERITS College Administration" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "MERITS College SMTP Test",
      html: `
        <div style="background-color: #FAFAF8; padding: 20px; font-family: sans-serif; text-align: center;">
          <div style="max-width: 400px; margin: 0 auto; background: #fff; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
            <div style="background-color: #7B1113; padding: 15px; color: #fff; font-weight: bold;">SMTP TEST</div>
            <div style="padding: 20px;">
              <p style="color: #1B3A5C;">Nodemailer is working correctly with the MERITS theme!</p>
              <div style="margin-top: 15px; font-size: 12px; color: #7B1113; font-weight: bold;">Connection Verified ✅</div>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test Email Error:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
};

module.exports = {
  loginUser,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getUserProfile,
  getDashboardStats,
  getStudentFullProfile,
  testEmail
};
