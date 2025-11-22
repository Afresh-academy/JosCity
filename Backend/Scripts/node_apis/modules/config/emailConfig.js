const nodemailer = require("nodemailer");
require("dotenv").config();

// Check if email credentials are provided
const hasEmailConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

// Create transporter only if credentials are provided
let transporter = null;

if (hasEmailConfig) {
  // Determine secure connection based on port
  const port = parseInt(process.env.SMTP_PORT) || 587;
  const isSecure = port === 465;
  const smtpHost = process.env.SMTP_HOST || "localhost";

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // For webmail providers, try to use proper cert validation first
      // Set to false if your provider has self-signed certificates
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
      // Support newer TLS versions
      minVersion: "TLSv1.2",
    },
    // Connection timeout settings (in milliseconds)
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Keep connection alive to prevent socket closes
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Debug option (set SMTP_DEBUG=true in .env to see full SMTP conversation)
    debug: process.env.SMTP_DEBUG === "true",
    logger: process.env.SMTP_DEBUG === "true",
  });

  // Verify connection asynchronously (non-blocking)
  transporter.verify(function (error, success) {
    if (error) {
      console.log("⚠️  Email configuration warning:", error.message);
      console.log(
        "   Email functionality may be disabled. Registration will still work, but emails will not be sent."
      );
      console.log("   To fix: Check your SMTP settings in .env file:");
      console.log(
        "      - SMTP_HOST (e.g., mail.afresh.academy or smtp.afresh.academy)"
      );
      console.log("      - SMTP_PORT (usually 587 for TLS or 465 for SSL)");
      console.log(
        "      - SMTP_USER (your full email: support@afresh.academy)"
      );
      console.log("      - SMTP_PASS (your email password)");
      console.log("   For webmail providers, common SMTP hosts:");
      console.log("      - mail.yourdomain.com");
      console.log("      - smtp.yourdomain.com");
      console.log("      - mail.afresh.academy");
    } else {
      console.log("✅ Email server is ready to send messages");
      console.log(`   SMTP Host: ${smtpHost}:${port}`);
      console.log(
        `   From Email: ${process.env.SMTP_USER || "Not configured"}`
      );
    }
  });
} else {
  console.log(
    "⚠️  Email service not configured (SMTP_USER or SMTP_PASS missing)"
  );
  console.log("   Registration will work, but emails will not be sent.");
}

// Send email function with retry logic
const sendEmail = async (to, subject, html, retries = 2) => {
  // If email is not configured, log and return without error
  if (!transporter || !hasEmailConfig) {
    console.log(`⚠️  Email not sent to ${to} (email service not configured)`);
    console.log(`   Subject: ${subject}`);
    return { messageId: null, skipped: true };
  }

  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER ||
      '"JOSCITY" <noreply@joscity.com>',
    to: to,
    subject: subject,
    html: html,
  };

  // Retry logic for transient errors (like socket close)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Wait before retry (except first attempt)
      if (attempt > 0) {
        console.log(
          `   Retrying email send (attempt ${attempt + 1}/${retries + 1})...`
        );
        // Wait progressively longer between retries
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      const result = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent to:", to);
      return result;
    } catch (error) {
      const isLastAttempt = attempt === retries;

      // Log detailed error information
      console.error(
        `❌ Email sending failed${
          isLastAttempt ? "" : ` (attempt ${attempt + 1}/${retries + 1})`
        }:`,
        error.message
      );

      // Provide helpful error messages based on error type
      if (
        error.message.includes("socket") ||
        error.message.includes("close") ||
        error.message.includes("Unexpected socket close")
      ) {
        console.error("   💡 Possible causes for 'Unexpected socket close':");
        console.error(
          "      - Incorrect SMTP_HOST (try mail.afresh.academy or smtp.afresh.academy)"
        );
        console.error(
          "      - Wrong SMTP_PORT (try 587 for TLS or 465 for SSL)"
        );
        console.error("      - TLS/SSL configuration mismatch");
        console.error(
          "      - Firewall or security settings blocking the connection"
        );
        console.error(
          "      - Your webmail provider may require specific authentication methods"
        );
        console.error("");
        console.error("   💡 Try these steps:");
        console.error(
          "      1. Verify SMTP settings with your webmail provider/hosting"
        );
        console.error(
          "      2. Try setting SMTP_TLS_REJECT_UNAUTHORIZED=false in .env"
        );
        console.error(
          "      3. Check if your hosting requires specific SMTP ports"
        );
        console.error(
          "      4. Enable SMTP_DEBUG=true in .env to see detailed logs"
        );
      } else if (
        error.message.includes("authentication") ||
        error.message.includes("Invalid login") ||
        error.code === "EAUTH"
      ) {
        console.error("   💡 Authentication error:");
        console.error(
          "      - Verify SMTP_USER is your full email: support@afresh.academy"
        );
        console.error(
          "      - Verify SMTP_PASS is correct (may be case-sensitive)"
        );
        console.error(
          "      - Check if your webmail requires App Password or special auth"
        );
        console.error(
          "      - Some providers require the email address as both user and from"
        );
      } else if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET") {
        console.error("   💡 Connection timeout:");
        console.error(
          "      - Check your SMTP_HOST is correct (mail.afresh.academy?)"
        );
        console.error(
          "      - Verify the SMTP_PORT is not blocked by firewall"
        );
        console.error("      - Check network connectivity to the SMTP server");
        console.error("      - Your hosting provider may have IP restrictions");
      }

      // If this was the last attempt, log final error
      if (isLastAttempt) {
        console.error(
          "   Registration will continue, but email notification was not sent."
        );
        return { messageId: null, error: error.message };
      }
    }
  }
};

module.exports = { sendEmail };
