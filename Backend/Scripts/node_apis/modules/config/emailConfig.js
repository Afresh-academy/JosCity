const nodemailer = require("nodemailer");
require("dotenv").config();

// Check if email credentials are provided
const hasEmailConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

// Create transporter only if credentials are provided
let transporter = null;

if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection asynchronously (non-blocking)
  transporter.verify(function (error, success) {
    if (error) {
      console.log("⚠️  Email configuration warning:", error.message);
      console.log(
        "   Email functionality will be disabled. Registration will still work, but emails will not be sent."
      );
      console.log(
        "   To fix: Update SMTP_USER and SMTP_PASS in your .env file with valid Gmail App Password."
      );
    } else {
      console.log("✅ Email server is ready to send messages");
    }
  });
} else {
  console.log(
    "⚠️  Email service not configured (SMTP_USER or SMTP_PASS missing)"
  );
  console.log("   Registration will work, but emails will not be sent.");
}

// Send email function
const sendEmail = async (to, subject, html) => {
  // If email is not configured, log and return without error
  if (!transporter || !hasEmailConfig) {
    console.log(`⚠️  Email not sent to ${to} (email service not configured)`);
    console.log(`   Subject: ${subject}`);
    return { messageId: null, skipped: true };
  }

  try {
    const mailOptions = {
      from:
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        '"JOSCITY" <noreply@joscity.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
    return result;
  } catch (error) {
    // Log error but don't throw - allow registration to continue
    console.error("❌ Email sending failed:", error.message);
    console.error(
      "   Registration will continue, but email notification was not sent."
    );
    // Return a result object instead of throwing
    return { messageId: null, error: error.message };
  }
};

module.exports = { sendEmail };
