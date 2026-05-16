const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ from, to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: from || 'MERITS College <onboarding@resend.dev>',
    to: to,
    subject: subject,
    html: html,
  });

  if (error) {
    console.error('Resend Email Error:', error);
    throw new Error(error.message || 'Email sending failed');
  }

  console.log('✅ Email sent successfully via Resend:', data);
  return data;
};

module.exports = { sendEmail };
