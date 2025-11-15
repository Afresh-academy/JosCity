const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.log(' Email configuration error:', error);
  } else {
    console.log(' Email server is ready to send messages');
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Your Social Network" <noreply@yoursite.com>',
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(' Email sent to:', to);
    return result;
  } catch (error) {
    console.error(' Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };