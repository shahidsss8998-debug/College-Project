require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.EMAIL_USER || 'shahiiilaap@gmail.com';

const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'MERITS College', email: SENDER_EMAIL },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Brevo Email Error:', data);
    throw new Error(data.message || 'Email sending failed');
  }

  console.log('✅ Email sent successfully via Brevo:', data);
  return data;
};

module.exports = { sendEmail };
