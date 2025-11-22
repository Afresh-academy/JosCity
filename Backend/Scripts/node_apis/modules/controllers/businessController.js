const bcrypt = require("bcryptjs");
const db = require("../config/database");
const { sendEmail } = require("../config/emailConfig");

// Helper function to generate activation code (for future admin approval functionality)
const generateActivationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  // Accepts international format: +234, 234, or local format
  const phoneRegex =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateCACNumber = (cacNumber) => {
  // CAC numbers are typically alphanumeric, 6-12 characters
  const cacRegex = /^[A-Z0-9]{6,12}$/i;
  return cacRegex.test(cacNumber);
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  // Remove leading/trailing whitespace and prevent XSS
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Business Registration - Submit for Review
 */
exports.registerBusiness = async (req, res) => {
  try {
    const {
      business_name,
      business_location,
      phone_number,
      email,
      CAC_number,
      address,
      password,
      business_type,
    } = req.body;

    // ========== INPUT VALIDATION ==========

    // Check all required fields
    if (
      !business_name ||
      !business_location ||
      !phone_number ||
      !email ||
      !CAC_number ||
      !address ||
      !password ||
      !business_type
    ) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
        missing_fields: {
          business_name: !business_name,
          business_location: !business_location,
          phone_number: !phone_number,
          email: !email,
          CAC_number: !CAC_number,
          address: !address,
          password: !password,
          business_type: !business_type,
        },
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      business_name: sanitizeInput(business_name),
      business_location: sanitizeInput(business_location),
      phone_number: sanitizeInput(phone_number),
      email: sanitizeInput(email).toLowerCase(),
      CAC_number: sanitizeInput(CAC_number).toUpperCase(),
      address: sanitizeInput(address),
      business_type: sanitizeInput(business_type),
    };

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      return res.status(400).json({
        error: true,
        message: "Invalid email format",
      });
    }

    // Validate phone number format
    if (!validatePhoneNumber(sanitizedData.phone_number)) {
      return res.status(400).json({
        error: true,
        message: "Invalid phone number format",
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        error: true,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    // Validate CAC number format
    if (!validateCACNumber(sanitizedData.CAC_number)) {
      return res.status(400).json({
        error: true,
        message:
          "Invalid CAC number format. Must be 6-12 alphanumeric characters",
      });
    }

    // Validate field lengths to prevent database errors
    if (sanitizedData.business_name.length > 255) {
      return res.status(400).json({
        error: true,
        message: "Business name is too long (maximum 255 characters)",
      });
    }

    if (sanitizedData.business_location.length > 255) {
      return res.status(400).json({
        error: true,
        message: "Business location is too long (maximum 255 characters)",
      });
    }

    if (sanitizedData.business_type.length > 255) {
      return res.status(400).json({
        error: true,
        message: "Business type is too long (maximum 255 characters)",
      });
    }

    // ========== SECURITY CHECKS ==========

    // Check if email already exists (SQL injection prevented by parameterized query)
    const [existingEmail] = await db.execute(
      "SELECT business_id FROM business_profile WHERE email = ?",
      [sanitizedData.email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({
        error: true,
        message: "Email already registered",
      });
    }

    // Check if CAC number already exists
    const [existingCAC] = await db.execute(
      "SELECT business_id FROM business_profile WHERE CAC_number = ?",
      [sanitizedData.CAC_number]
    );

    if (existingCAC.length > 0) {
      return res.status(409).json({
        error: true,
        message: "CAC number already registered",
      });
    }

    // Check if phone number already exists
    const [existingPhone] = await db.execute(
      "SELECT business_id FROM business_profile WHERE phone_number = ?",
      [sanitizedData.phone_number]
    );

    if (existingPhone.length > 0) {
      return res.status(409).json({
        error: true,
        message: "Phone number already registered",
      });
    }

    // ========== PASSWORD HASHING ==========
    // Hash password with bcrypt (salt rounds: 12 for security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // ========== DATABASE TRANSACTION ==========
    // Use transaction to ensure data consistency
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert business with "pending" status
      // Using parameterized queries to prevent SQL injection
      const [businessResult] = await connection.execute(
        `INSERT INTO business_profile 
         (business_name, business_location, phone_number, email, CAC_number, 
          address, password, business_type, account_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          sanitizedData.business_name,
          sanitizedData.business_location,
          sanitizedData.phone_number,
          sanitizedData.email,
          sanitizedData.CAC_number,
          sanitizedData.address,
          hashedPassword,
          sanitizedData.business_type,
        ]
      );

      await connection.commit();

      // ========== EMAIL NOTIFICATION ==========
      // Send "under review" email to business
      try {
        await sendEmail(
          sanitizedData.email,
          "Business Registration Under Review",
          `
          <h2>Business Registration Under Review</h2>
          <p>Dear ${sanitizedData.business_name},</p>
          <p>Your business registration has been received and is currently under review.</p>
          <p><strong>Registration Details:</strong></p>
          <ul>
            <li>Business Name: ${sanitizedData.business_name}</li>
            <li>Location: ${sanitizedData.business_location}</li>
            <li>CAC Number: ${sanitizedData.CAC_number}</li>
            <li>Type: ${sanitizedData.business_type}</li>
          </ul>
          <p>We will verify your details and notify you once your account is approved.</p>
          <p>You will receive an activation code via email when your account is approved.</p>
          <br>
          <p>Thank you for your patience.</p>
          `
        );
      } catch (emailError) {
        // Log email error but don't fail the registration
        console.error("Email sending failed:", emailError);
      }

      // ========== SUCCESS RESPONSE ==========
      res.status(201).json({
        success: true,
        message:
          "Business registration submitted for review. You will receive an email once approved.",
        business_id: businessResult.insertId,
        status: "under_review",
        data: {
          business_name: sanitizedData.business_name,
          email: sanitizedData.email,
          CAC_number: sanitizedData.CAC_number,
        },
      });
    } catch (dbError) {
      // Rollback transaction on error
      await connection.rollback();

      // Handle specific database errors
      if (dbError.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: true,
          message: "Duplicate entry detected. Please check your information.",
        });
      }

      if (dbError.code === "ER_NO_SUCH_TABLE") {
        console.error("Database table error:", dbError);
        return res.status(500).json({
          error: true,
          message: "Database configuration error. Please contact support.",
        });
      }

      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Business registration error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      stack: error.stack,
    });

    // Don't expose internal error details to client
    res.status(500).json({
      error: true,
      message: "Business registration failed. Please try again later.",
      // Include error code in development for debugging
      ...(process.env.NODE_ENV === "development" && {
        debug: {
          code: error.code,
          message: error.message,
        },
      }),
    });
  }
};

/**
 * Get Business Profile (Protected route - requires authentication)
 */
exports.getBusinessProfile = async (req, res) => {
  try {
    const { business_id } = req.params;

    // Validate business_id
    if (!business_id || isNaN(business_id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid business ID",
      });
    }

    // Fetch business profile (excluding password)
    const [businesses] = await db.execute(
      `SELECT business_id, business_name, business_location, phone_number, 
              email, CAC_number, address, business_type, account_status, 
              is_verified, business_registered
       FROM business_profile 
       WHERE business_id = ?`,
      [business_id]
    );

    if (businesses.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Business not found",
      });
    }

    res.json({
      success: true,
      data: businesses[0],
    });
  } catch (error) {
    console.error("Get business profile error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch business profile",
    });
  }
};

/**
 * Get All Pending Business Approvals (Admin only)
 */
exports.getPendingBusinesses = async (req, res) => {
  try {
    const [pendingBusinesses] = await db.execute(
      `SELECT business_id, business_name, business_location, phone_number, 
              email, CAC_number, address, business_type, business_registered
       FROM business_profile
       WHERE account_status = 'pending'
       ORDER BY business_registered DESC`
    );

    res.json({
      success: true,
      count: pendingBusinesses.length,
      data: pendingBusinesses,
    });
  } catch (error) {
    console.error("Get pending businesses error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch pending business approvals",
    });
  }
};
