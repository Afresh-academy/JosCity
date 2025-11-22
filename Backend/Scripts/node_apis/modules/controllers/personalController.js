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

const validateNINNumber = (ninNumber) => {
  // NIN numbers are typically 11 digits
  const ninRegex = /^[0-9]{11}$/;
  return ninRegex.test(ninNumber);
};

const validateGender = (gender) => {
  return gender === "male" || gender === "female";
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  // Remove leading/trailing whitespace and prevent XSS
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Personal Registration - Submit for Review
 */
exports.registerPersonal = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      phone_number,
      email,
      nin_number,
      address,
      password,
    } = req.body;

    // ========== INPUT VALIDATION ==========

    // Check all required fields
    if (
      !first_name ||
      !last_name ||
      !gender ||
      !phone_number ||
      !email ||
      !nin_number ||
      !address ||
      !password
    ) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
        missing_fields: {
          first_name: !first_name,
          last_name: !last_name,
          gender: !gender,
          phone_number: !phone_number,
          email: !email,
          nin_number: !nin_number,
          address: !address,
          password: !password,
        },
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      first_name: sanitizeInput(first_name),
      last_name: sanitizeInput(last_name),
      gender: sanitizeInput(gender).toLowerCase(),
      phone_number: sanitizeInput(phone_number),
      email: sanitizeInput(email).toLowerCase(),
      nin_number: sanitizeInput(nin_number),
      address: sanitizeInput(address),
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

    // Validate NIN number format
    if (!validateNINNumber(sanitizedData.nin_number)) {
      return res.status(400).json({
        error: true,
        message: "Invalid NIN number format. Must be exactly 11 digits",
      });
    }

    // Validate gender
    if (!validateGender(sanitizedData.gender)) {
      return res.status(400).json({
        error: true,
        message: "Invalid gender. Must be 'male' or 'female'",
      });
    }

    // Validate field lengths to prevent database errors
    if (sanitizedData.first_name.length > 255) {
      return res.status(400).json({
        error: true,
        message: "First name is too long (maximum 255 characters)",
      });
    }

    if (sanitizedData.last_name.length > 255) {
      return res.status(400).json({
        error: true,
        message: "Last name is too long (maximum 255 characters)",
      });
    }

    // ========== SECURITY CHECKS ==========

    // Check if email already exists (SQL injection prevented by parameterized query)
    const [existingEmail] = await db.execute(
      "SELECT personal_id FROM personal_profile WHERE email = ?",
      [sanitizedData.email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({
        error: true,
        message: "Email already registered",
      });
    }

    // Check if NIN number already exists
    const [existingNIN] = await db.execute(
      "SELECT personal_id FROM personal_profile WHERE nin_number = ?",
      [sanitizedData.nin_number]
    );

    if (existingNIN.length > 0) {
      return res.status(409).json({
        error: true,
        message: "NIN number already registered",
      });
    }

    // Check if phone number already exists
    const [existingPhone] = await db.execute(
      "SELECT personal_id FROM personal_profile WHERE phone_number = ?",
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
      // Insert personal user with "pending" status
      // Using parameterized queries to prevent SQL injection
      const [personalResult] = await connection.execute(
        `INSERT INTO personal_profile 
         (first_name, last_name, gender, phone_number, email, nin_number, 
          address, password, account_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          sanitizedData.first_name,
          sanitizedData.last_name,
          sanitizedData.gender,
          sanitizedData.phone_number,
          sanitizedData.email,
          sanitizedData.nin_number,
          sanitizedData.address,
          hashedPassword,
        ]
      );

      await connection.commit();

      // ========== EMAIL NOTIFICATION ==========
      // Send "under review" email to user
      try {
        await sendEmail(
          sanitizedData.email,
          "Personal Registration Under Review",
          `
          <h2>Personal Registration Under Review</h2>
          <p>Dear ${sanitizedData.first_name} ${sanitizedData.last_name},</p>
          <p>Your personal registration has been received and is currently under review.</p>
          <p><strong>Registration Details:</strong></p>
          <ul>
            <li>Name: ${sanitizedData.first_name} ${sanitizedData.last_name}</li>
            <li>Gender: ${sanitizedData.gender}</li>
            <li>Phone: ${sanitizedData.phone_number}</li>
            <li>NIN Number: ${sanitizedData.nin_number}</li>
            <li>Address: ${sanitizedData.address}</li>
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
          "Personal registration submitted for review. You will receive an email once approved.",
        personal_id: personalResult.insertId,
        status: "under_review",
        data: {
          first_name: sanitizedData.first_name,
          last_name: sanitizedData.last_name,
          email: sanitizedData.email,
          nin_number: sanitizedData.nin_number,
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
    console.error("Personal registration error:", error);
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
      message: "Personal registration failed. Please try again later.",
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
 * Get Personal Profile (Protected route - requires authentication)
 */
exports.getPersonalProfile = async (req, res) => {
  try {
    const { personal_id } = req.params;

    // Validate personal_id
    if (!personal_id || isNaN(personal_id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid personal ID",
      });
    }

    // Fetch personal profile (excluding password)
    const [profiles] = await db.execute(
      `SELECT personal_id, first_name, last_name, gender, phone_number, 
              email, nin_number, address, account_status, 
              is_verified, personal_registered
       FROM personal_profile 
       WHERE personal_id = ?`,
      [personal_id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Personal profile not found",
      });
    }

    res.json({
      success: true,
      data: profiles[0],
    });
  } catch (error) {
    console.error("Get personal profile error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch personal profile",
    });
  }
};

/**
 * Get All Pending Personal Approvals (Admin only)
 */
exports.getPendingPersonals = async (req, res) => {
  try {
    const [pendingPersonals] = await db.execute(
      `SELECT personal_id, first_name, last_name, gender, phone_number, 
              email, nin_number, address, personal_registered
       FROM personal_profile
       WHERE account_status = 'pending'
       ORDER BY personal_registered DESC`
    );

    res.json({
      success: true,
      count: pendingPersonals.length,
      data: pendingPersonals,
    });
  } catch (error) {
    console.error("Get pending personals error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch pending personal approvals",
    });
  }
};

