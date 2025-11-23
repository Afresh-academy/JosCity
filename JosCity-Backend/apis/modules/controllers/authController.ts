import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../config/database';
import { sendEmail } from '../config/emailConfig';

interface SignUpBody {
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  nin_number?: string;
  email: string;
  password: string;
  address: string;
  account_type?: 'personal' | 'business';
  business_name?: string;
  business_type?: string;
  CAC_number?: string;
  business_location?: string;
}

// Helper function to generate activation code
const generateActivationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Helper function to generate reset code
const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

/**
 * User Registration - Submit for Review (Personal or Business)
 */
export const signUp = async (req: Request<{}, {}, SignUpBody>, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      gender,
      phone_number,
      nin_number,
      email,
      password,
      address,
      account_type = 'personal', // 'personal' or 'business'
      // Business-specific fields
      business_name,
      business_type,
      CAC_number,
      business_location
    } = req.body;

    // Common validation
    if (!first_name || !last_name || !gender || !phone_number || !email || !password || !address) {
      res.status(400).json({
        error: true,
        message: 'All basic fields are required'
      });
      return;
    }

    // Business account validation
    if (account_type === 'business') {
      if (!business_name || !business_type) {
        res.status(400).json({
          error: true,
          message: 'Business name and type are required for business accounts'
        });
        return;
      }
    }

    // Personal account validation
    if (account_type === 'personal' && !nin_number) {
      res.status(400).json({
        error: true,
        message: 'NIN number is required for personal accounts'
      });
      return;
    }

    // Check if email already exists
    const [existingEmail] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ?',
      [email]
    ) as [any[], any];

    if (existingEmail.length > 0) {
      res.status(400).json({
        error: true,
        message: 'Email already registered'
      });
      return;
    }

    // Check if NIN already exists (for personal accounts)
    if (account_type === 'personal' && nin_number) {
      const [existingNIN] = await db.execute(
        'SELECT user_id FROM users WHERE nin_number = ?',
        [nin_number]
      ) as [any[], any];

      if (existingNIN.length > 0) {
        res.status(400).json({
          error: true,
          message: 'NIN number already registered'
        });
        return;
      }
    }

    // Check if business registration number exists (for business accounts)
    if (account_type === 'business' && CAC_number) {
      const [existingBusiness] = await db.execute(
        'SELECT user_id FROM users WHERE CAC_number = ?',
        [CAC_number]
      ) as [any[], any];

      if (existingBusiness.length > 0) {
        res.status(400).json({
          error: true,
          message: 'Business registration number already registered'
        });
        return;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user_name = account_type === 'business' 
      ? business_name!.toLowerCase().replace(/\s+/g, '')
      : `${first_name}${last_name}`.toLowerCase().replace(/\s+/g, '');

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create user with "pending" status - NO ACTIVATION CODE YET
      const [userResult] = await connection.execute(
        `INSERT INTO users 
         (user_name, user_firstname, user_lastname, user_gender, user_phone, nin_number, 
          user_email, user_password, address, account_status, account_type, 
          business_name, business_type, CAC_number, business_location) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
        [
          user_name, first_name, last_name, gender, phone_number, nin_number, 
          email, hashedPassword, address, account_type,
          business_name, business_type, CAC_number, business_location
        ]
      ) as [any, any];

      await connection.commit();

      // Send "under review" email to user - NO ACTIVATION CODE IN THIS EMAIL
      const emailSubject = account_type === 'business' 
        ? 'Business Account Registration Under Review'
        : 'Account Registration Under Review';

      const emailTemplate = account_type === 'business' 
        ? `
          <h2>Business Registration Under Review</h2>
          <p>Dear ${business_name},</p>
          <p>Your business account registration has been received and is currently under review.</p>
          <p>We will verify your business details and notify you once your account is approved.</p>
          <p>You will receive an activation code via email when your account is approved.</p>
          <br>
          <p>Thank you for your patience.</p>
        `
        : `
          <h2>Registration Under Review</h2>
          <p>Dear ${first_name} ${last_name},</p>
          <p>Your account registration has been received and is currently under review.</p>
          <p>We will verify your details and notify you once your account is approved.</p>
          <p>You will receive an activation code via email when your account is approved.</p>
          <br>
          <p>Thank you for your patience.</p>
        `;

      await sendEmail(email, emailSubject, emailTemplate);

      res.status(201).json({
        success: true,
        message: 'Registration submitted for review. You will receive an email once approved.',
        user_id: (userResult as any).insertId,
        status: 'under_review',
        account_type: account_type
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
 * Get Pending Approvals (For Admin) - Updated for both account types
 */
export const getPendingApprovals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [pendingUsers] = await db.execute(
      `SELECT u.user_id, u.user_name, u.user_firstname, u.user_lastname, u.user_phone, u.nin_number, 
              u.user_email, u.address, u.user_registered, u.account_type,
              u.business_name, u.business_type, u.CAC_number, u.business_location
       FROM users u
       WHERE u.account_status = 'pending'
       ORDER BY u.user_registered DESC`
    ) as [any[], any];

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
 * Admin Approve Account - Updated for both account types
 */
export const approveAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;

    // Generate activation code (expires in 48 hours) - ONLY WHEN APPROVING
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
    ) as [any, any];

    if (result.affectedRows === 0) {
      res.status(404).json({
        error: true,
        message: 'User not found or already processed'
      });
      return;
    }

    // Get user details for email
    const [users] = await db.execute(
      'SELECT user_email, user_firstname, user_lastname, account_type, business_name FROM users WHERE user_id = ?',
      [user_id]
    ) as [any[], any];

    const user = users[0];

    // Send approval email with activation code - ONLY AFTER APPROVAL
    const emailSubject = user.account_type === 'business'
      ? 'Business Account Approved - Activation Code'
      : 'Account Approved - Activation Code';

    const emailTemplate = user.account_type === 'business'
      ? `
        <h2>Business Account Approved!</h2>
        <p>Dear ${user.business_name},</p>
        <p>Your business account has been approved! You can now login to your account.</p>
        <p><strong>Your Activation Code: ${activationCode}</strong></p>
        <p><em>This code will expire in 48 hours.</em></p>
        <br>
        <p>Use this code along with your email and password to login.</p>
        <p>Welcome to our platform!</p>
      `
      : `
        <h2>Account Approved!</h2>
        <p>Dear ${user.user_firstname} ${user.user_lastname},</p>
        <p>Your account has been approved! You can now login to your account.</p>
        <p><strong>Your Activation Code: ${activationCode}</strong></p>
        <p><em>This code will expire in 48 hours.</em></p>
        <br>
        <p>Use this code along with your email and password to login.</p>
        <p>Welcome to our platform!</p>
      `;

    await sendEmail(user.user_email, emailSubject, emailTemplate);

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
 * Admin Reject Account - Updated for both account types
 */
export const rejectAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, reason } = req.body;

    // Update user status to rejected
    const [result] = await db.execute(
      `UPDATE users 
       SET account_status = 'rejected'
       WHERE user_id = ? AND account_status = 'pending'`,
      [user_id]
    ) as [any, any];

    if (result.affectedRows === 0) {
      res.status(404).json({
        error: true,
        message: 'User not found or already processed'
      });
      return;
    }

    // Get user details for email
    const [users] = await db.execute(
      'SELECT user_email, user_firstname, user_lastname, account_type, business_name FROM users WHERE user_id = ?',
      [user_id]
    ) as [any[], any];

    const user = users[0];

    // Send rejection email
    const recipientName = user.account_type === 'business'
      ? user.business_name
      : `${user.user_firstname} ${user.user_lastname}`;

    await sendEmail(
      user.user_email,
      'Account Registration Update',
      `
      <h2>Registration Status Update</h2>
      <p>Dear ${recipientName},</p>
      <p>We regret to inform you that your ${user.account_type} account registration could not be approved at this time.</p>
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
 * User Login (After Approval) - Updated for both account types
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, activation_code } = req.body;

    // Find user
    const [users] = await db.execute(
      `SELECT user_id, user_email, user_password, user_firstname, user_lastname, 
              account_status, activation_code, activation_expires, is_verified, account_type,
              business_name, user_verified
       FROM users WHERE user_email = ?`,
      [email]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
      return;
    }

    const user = users[0];

    // Check account status
    if (user.account_status === 'pending') {
      res.status(401).json({
        error: true,
        message: 'Account is still under review. Please wait for approval.',
        status: 'pending'
      });
      return;
    }

    if (user.account_status === 'rejected') {
      res.status(401).json({
        error: true,
        message: 'Account registration was rejected. Please contact support.',
        status: 'rejected'
      });
      return;
    }

    // Verify activation code
    if (!activation_code || user.activation_code !== activation_code) {
      res.status(401).json({
        error: true,
        message: 'Invalid activation code'
      });
      return;
    }

    // Check if activation code expired
    if (new Date() > new Date(user.activation_expires)) {
      res.status(401).json({
        error: true,
        message: 'Activation code has expired. Please contact support for a new one.'
      });
      return;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword) {
      res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      });
      return;
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
        is_verified: true,
        account_type: user.account_type
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    // Prepare user response based on account type
    const userResponse: any = {
      user_id: user.user_id,
      email: user.user_email,
      is_verified: true,
      has_verified_badge: user.user_verified === '1',
      account_type: user.account_type
    };

    if (user.account_type === 'business') {
      userResponse.business_name = user.business_name;
      userResponse.display_name = user.business_name;
    } else {
      userResponse.first_name = user.user_firstname;
      userResponse.last_name = user.user_lastname;
      userResponse.display_name = `${user.user_firstname} ${user.user_lastname}`;
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: userResponse
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
export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const [users] = await db.execute(
      'SELECT user_id, user_firstname, user_lastname, business_name, account_type FROM users WHERE user_email = ? AND account_status = "approved"',
      [email]
    ) as [any[], any];

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      res.json({
        success: true,
        message: 'If the email exists, a reset code has been sent'
      });
      return;
    }

    const user = users[0];
    const resetCode = generateResetCode();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await db.execute(
      'UPDATE users SET reset_code = ?, reset_expires = ? WHERE user_id = ?',
      [resetCode, resetExpires, user.user_id]
    );

    const recipientName = user.account_type === 'business' 
      ? user.business_name 
      : `${user.user_firstname} ${user.user_lastname}`;

    // Send reset email
    await sendEmail(
      email,
      'Password Reset Code',
      `
      <h2>Password Reset Request</h2>
      <p>Dear ${recipientName},</p>
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
export const forgetPasswordConfirm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, reset_key } = req.body;

    const [users] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ? AND reset_code = ? AND reset_expires > NOW()',
      [email, reset_key]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(400).json({
        error: true,
        message: 'Invalid or expired reset code'
      });
      return;
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
export const forgetPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, reset_key, password, confirm } = req.body;

    if (password !== confirm) {
      res.status(400).json({
        error: true,
        message: 'Passwords do not match'
      });
      return;
    }

    const [users] = await db.execute(
      'SELECT user_id FROM users WHERE user_email = ? AND reset_code = ? AND reset_expires > NOW()',
      [email, reset_key]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(400).json({
        error: true,
        message: 'Invalid or expired reset code'
      });
      return;
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
export const resendActivation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const [users] = await db.execute(
      'SELECT user_id, user_firstname, user_lastname, business_name, account_type FROM users WHERE user_email = ? AND account_status = "approved"',
      [email]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(404).json({
        error: true,
        message: 'Email not found or account not approved'
      });
      return;
    }

    const user = users[0];
    const newActivationCode = generateActivationCode();
    const activationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.execute(
      'UPDATE users SET activation_code = ?, activation_expires = ? WHERE user_id = ?',
      [newActivationCode, activationExpires, user.user_id]
    );

    const recipientName = user.account_type === 'business' 
      ? user.business_name 
      : `${user.user_firstname} ${user.user_lastname}`;

    // Send new activation code
    await sendEmail(
      email,
      'New Activation Code',
      `
      <h2>New Activation Code</h2>
      <p>Dear ${recipientName},</p>
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
export const signOut = async (_req: Request, res: Response): Promise<void> => {
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

