const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true, // Use connection pooling
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

console.log(`📡 Attempting to connect via Gmail Service (User: ${process.env.EMAIL_USER})`);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Email Server is ready to send messages');
  }
});

module.exports = transporter;
