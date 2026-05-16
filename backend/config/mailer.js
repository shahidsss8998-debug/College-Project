const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(`📡 Attempting to connect to SMTP: smtp.gmail.com:587 (User: ${process.env.EMAIL_USER})`);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Email Server is ready to send messages');
  }
});

module.exports = transporter;
