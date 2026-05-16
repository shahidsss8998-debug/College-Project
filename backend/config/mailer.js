const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,    // Log info to console
  debug: true,     // Include SMTP traffic in logs
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
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
