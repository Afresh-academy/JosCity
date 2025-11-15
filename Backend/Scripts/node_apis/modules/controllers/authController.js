const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendEmail } = require('../config/emailConfig');

// Helper function to generate activation code
const generateActivationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Helper function to generate reset code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

/**
 * User Registration - Submit for Review
 */
exports.signUp = async (req, res) => {
  try {
    const {
      full_name,
      phone_number,
      nin_number,
      email,
      password,
      address
    } = req.body;

    // Validation
    if (!full_name || !phone_number || !nin_number || !email || !password || !address) {
      return res.status(400).json({
        error: true,
        message: 'All fields are required'
      });
    }

    // Check if email already exists
    const [existingEmail] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'Email already registered'
      });
    }

    // Check if NIN already exists
    const [existingNIN] = await db.execute(
      'SELECT user_id FROM users WHERE nin_number = ?',
      [nin_number]
    );

    if (existingNIN.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'NIN number already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create user with "pending" status
      const [userResult] = await connection.execute(
        `INSERT INTO users 
         (full_name, phone_number, nin_number, user_email, user_password, address, account_status) 
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [full_name, phone_number, nin_number, email, hashedPassword, address]
      );

      // Add to pending approvals
      await connection.execute(
        `INSERT INTO pending_approvals (user_id, full_name, nin_number, user_email) 
         VALUES (?, ?, ?, ?)`,
        [userResult.insertId, full_name, nin_number, email]
      );

      await connection.commit();

      // Send "under review" email to user
      await sendEmail(
        email,
        'Account Registration Under Review',
        `
        <h2>Registration Under Review</h2>
        <p>Dear ${full_name},</p>
        <p>Your account registration has been received and is currently under review.</p>
        <p>We will verify your details and notify you once your account is approved.</p>
        <p>You will receive an activation code via email when your account is approved.</p>
        <br>
        <p>Thank you for your patience.</p>
        `
      );

      res.status(201).json({
        success: true,
        message: 'Registration submitted for review. You will receive an email once approved.',
        user_id: userResult.insertId,
        status: 'under_review'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: true,
      message: 'Registration failed. Please try again.'
    });
  }
};

/**
 * Get Pending Approvals (For Admin)
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const [pendingUsers] = await db.execute(
      `SELECT u.user_id, u.full_name, u.phone_number, u.nin_number, 
              u.user_email, u.address, u.user_registered
       FROM users u
       WHERE u.account_status = 'pending'
       ORDER BY u.user_registered DESC`
    );

    res.json({
      success: true,
      data: pendingUsers
    });

  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch pending approvals'
    });
  }
};

/**
 * Admin Approve Account
 */
exports.approveAccount = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Generate activation code (expires in 48 hours)
    const activationCode = generateActivationCode();
    const activationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // Update user status and set activation code
    const [result] = await db.execute(
      `UPDATE users 
       SET account_status = 'approved', 
           activation_code = ?, 
           activation_expires = ? 
       WHERE user_id = ? AND account_status = 'pending'`,
      [activationCode, activationExpires, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: 'User not found or already processed'
      });
    }

    // Get user details for email
    const [users] = await db.execute(
      'SELECT user_email, full_name FROM users WHERE user_id = ?',
      [user_id]
    );

    const user = users[0];

    // Update pending approvals
    await db.execute(
      'UPDATE pending_approvals SET status = "reviewed" WHERE user_id = ?',
      [user_id]
    );

    // Send approval email with activation code
    await sendEmail(
      user.user_email,
      'Account Approved - Activation Code',
      `
      <h2>Account Approved!</h2>
      <p>Dear ${user.full_name},</p>
      <p>Your account has been approved! You can now login to your account.</p>
      <p><strong>Your Activation Code: ${activationCode}</strong></p>
      <p><em>This code will expire in 48 hours.</em></p>
      <br>
      <p>Use this code along with your email and password to login.</p>
      <p>Welcome to our platform!</p>
      `
    );

    res.json({
      success: true,
      message: 'Account approved and activation code sent to user'
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      error: true,
      message: 'Account approval failed'
    });
  }
};

/**
 * Admin Reject Account
 */
exports.rejectAccount = async (req, res) => {
  try {
    const { user_id, reason } = req.body;

    // Update user status to rejected
    const [result] = await db.execute(
      `UPDATE users 
       SET account_status = 'rejected'
       WHERE user_id = ? AND account_status = 'pending'`,
      [user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: 'User not found or already processed'
      });
    }

    // Get user details for email
    const [users] = await db.execute(
      'SELECT user_email, full_name FROM users WHERE user_id = ?',
      [user_id]
    );

    const user = users[0];

    // Update pending approvals
    await db.execute(
      'UPDATE pending_approvals SET status = "reviewed" WHERE user_id = ?',
      [user_id]
    );

    // Send rejection email
    await sendEmail(
      user.user_email,
      'Account Registration Update',
      `
      <h2>Registration Status Update</h2>
      <p>Dear ${user.full_name},</p>
      <p>We regret to inform you that your account registration could not be approved at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <br>
      <p>If you believe this is an error, please contact our support team.</p>
      `
    );

    res.json({
      success: true,
      message: 'Account rejected and user notified'
    });

  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({
      error: true,
      message: 'Account rejection failed'
    });
  }
};

/**
 * User Login (After Approval)
 */
exports.signIn = async (req, res) => {
  try {
    const { email, password, activation_code } = req.body;

    // Find user
    const [users] = await db.execute(
      `SELECT user_id, user_email, user_password, full_name, 
              account_status, activation_code, activation_expires, is_verified
       FROM users WHERE user_email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check account status
    if (user.account_status === 'pending') {
      return res.status(401).json({
        error: true,
        message: 'Account is still under review. Please wait for approval.',
        status: 'pending'
      });
    }

    if (user.account_status === 'rejected') {
      return res.status(401).json({
        error: true,
        message: 'Account registration was rejected. Please contact support.',
        status: 'rejected'
      });
    }

    // Verify activation code
    if (!activation_code || user.activation_code !== activation_code) {
      return res.status(401).json({
        error: true,
        message: 'Invalid activation code'
      });
    }

    // Check if activation code expired
    if (new Date() > new Date(user.activation_expires)) {
      return res.status(401).json({
        error: true,
        message: 'Activation code has expired. Please contact support for a new one.'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
    }

    // Mark as verified on first successful login
    if (!user.is_verified) {
      await db.execute(
        'UPDATE users SET is_verified = 1, verified_at = NOW(), activation_code = NULL WHERE user_id = ?',
        [user.user_id]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.user_email,
        is_verified: true 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.user_email,
        is_verified: true,
        has_verified_badge: true // Green tick
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: 'Login failed'
    });
  }
};

/**
 * Forgot Password - Request reset
 */
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await db.execute(
      'SELECT user_id, full_name FROM users WHERE user_email = ? AND account_status = "approved"',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If the email exists, a reset code has been sent'
      });
    }

    const user = users[0];
    const resetCode = generateResetCode();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await db.execute(
      'UPDATE users SET reset_code = ?, reset_expires = ? WHERE user_id = ?',
      [resetCode, resetExpires, user.user_id]
    );

    // Send reset email
    await sendEmail(
      email,
      'Password Reset Code',
      `
      <h2>Password Reset Request</h2>
      <p>Dear ${user.full_name},</p>
      <p>You requested to reset your password. Use the code below to reset your password:</p>
      <p><strong>Reset Code: ${resetCode}</strong></p>
      <p><em>This code will expire in 1 hour.</em></p>
      <br>
      <p>If you didn't request this, please ignore this email.</p>
      `
    );

    res.json({
      success: true,
      message: 'If the email exists, a reset code has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: true,
      message: 'Password reset request failed'
    });
  }
};

/**
 * Confirm Reset Code
 */
exports.forgetPasswordConfirm = async (req, res) => {
  try {
    const { email, reset_key } = req.body;

    const [users] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ? AND reset_code = ? AND reset_expires > NOW()',
      [email, reset_key]
    );

    if (users.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Invalid or expired reset code'
      });
    }

    res.json({
      success: true,
      message: 'Reset code verified successfully'
    });

  } catch (error) {
    console.error('Reset confirm error:', error);
    res.status(500).json({
      error: true,
      message: 'Reset code verification failed'
    });
  }
};

/**
 * Reset Password with new password
 */
exports.forgetPasswordReset = async (req, res) => {
  try {
    const { email, reset_key, password, confirm } = req.body;

    if (password !== confirm) {
      return res.status(400).json({
        error: true,
        message: 'Passwords do not match'
      });
    }

    const [users] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ? AND reset_code = ? AND reset_expires > NOW()',
      [email, reset_key]
    );

    if (users.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Invalid or expired reset code'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.execute(
      'UPDATE users SET user_password = ?, reset_code = NULL, reset_expires = NULL WHERE user_id = ?',
      [hashedPassword, users[0].user_id]
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: true,
      message: 'Password reset failed'
    });
  }
};

/**
 * Resend Activation Code
 */
exports.resendActivation = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await db.execute(
      'SELECT user_id, full_name FROM users WHERE user_email = ? AND account_status = "approved"',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Email not found or account not approved'
      });
    }

    const user = users[0];
    const newActivationCode = generateActivationCode();
    const activationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.execute(
      'UPDATE users SET activation_code = ?, activation_expires = ? WHERE user_id = ?',
      [newActivationCode, activationExpires, user.user_id]
    );

    // Send new activation code
    await sendEmail(
      email,
      'New Activation Code',
      `
      <h2>New Activation Code</h2>
      <p>Dear ${user.full_name},</p>
      <p>Your new activation code is: <strong>${newActivationCode}</strong></p>
      <p><em>This code will expire in 48 hours.</em></p>
      <p>Use this code along with your email and password to login.</p>
      `
    );

    res.json({
      success: true,
      message: 'New activation code sent to your email'
    });

  } catch (error) {
    console.error('Resend activation error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to resend activation code'
    });
  }
};

/**
 * User Logout
 */
exports.signOut = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: true,
      message: 'Logout failed'
    });
  }
};