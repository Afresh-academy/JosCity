import { Request, Response } from 'express';
import db from '../../config/database';

interface AuthRequest extends Request {
  user?: {
    user_id: number;
  };
}

// Get all users with filters, also guess why we are doing this
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      group,
      account_type
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    let whereClause = 'WHERE 1=1';
    let queryParams: any[] = [];
    
    // Status filters
    if (status === 'pending') {
      whereClause += ' AND user_approved = "0" AND account_status = "pending"';
    } else if (status === 'banned') {
      whereClause += ' AND user_banned = "1"';
    } else if (status === 'not_activated') {
      whereClause += ' AND user_activated = "0"';
    } else if (status === 'approved') {
      whereClause += ' AND user_approved = "1"';
    } else if (status === 'online') {
      whereClause += ' AND user_last_seen >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)';
    }

    if (account_type) {
      whereClause += ' AND account_type = ?';
      queryParams.push(account_type);
    }

    // User group filter
    if (group) {
      whereClause += ' AND user_group = ?';
      queryParams.push(group);
    }

    // Search filter
    if (search) {
      whereClause += ` AND (user_name LIKE ? OR user_firstname LIKE ? OR user_lastname LIKE ? OR user_email LIKE ? OR user_phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Get users
    const [users] = await db.execute(
      `SELECT user_id, user_name, user_firstname, user_lastname, user_email, user_phone, 
              user_gender, user_picture, user_cover, user_registered, user_last_seen,
              user_activated, user_approved, user_banned, user_verified, user_group,
              account_status, nin_number, address
       FROM users ${whereClause} 
       ORDER BY user_id DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), offset]
    ) as [any[], any];
    
    // Get total count
    const [total] = await db.execute(
      `SELECT COUNT(*) as count FROM users ${whereClause}`,
      queryParams
    ) as [any[], any];
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: total[0].count,
        totalPages: Math.ceil(total[0].count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user details
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const [users] = await db.execute(
      `SELECT * FROM users WHERE user_id = ?`,
      [id]
    ) as [any[], any];
    
    if (users.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Get user sessions
    const [sessions] = await db.execute(
      'SELECT * FROM users_sessions WHERE user_id = ? ORDER BY last_activity DESC',
      [id]
    ) as [any[], any];
    
    // Get user posts count
    const [postsCount] = await db.execute(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND user_type = "user"',
      [id]
    ) as [any[], any];
    
    const user = users[0];
    user.sessions = sessions;
    user.posts_count = postsCount[0].count;
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Approve user
export const approveUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'UPDATE users SET user_approved = "1", account_status = "approved" WHERE user_id = ?',
      [id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_approval', `Approved user ID: ${id}`]
    );
    
    res.json({
      success: true,
      message: 'User approved successfully'
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

// Ban user
export const banUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await db.execute(
      'UPDATE users SET user_banned = "1", user_banned_message = ? WHERE user_id = ?',
      [reason, id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_ban', `Banned user ID: ${id}. Reason: ${reason}`]
    );
    
    res.json({
      success: true,
      message: 'User banned successfully'
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

// Unban user
export const unbanUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'UPDATE users SET user_banned = "0", user_banned_message = NULL WHERE user_id = ?',
      [id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_unban', `Unbanned user ID: ${id}`]
    );
    
    res.json({
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Failed to unban user' });
  }
};

// Verify user
export const verifyUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'UPDATE users SET user_verified = "1" WHERE user_id = ?',
      [id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_verification', `Verified user ID: ${id}`]
    );
    
    res.json({
      success: true,
      message: 'User verified successfully'
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

// Update user group
export const updateUserGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_group } = req.body;
    
    await db.execute(
      'UPDATE users SET user_group = ? WHERE user_id = ?',
      [user_group, id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_group_update', `Updated user group to ${user_group} for user ID: ${id}`]
    );
    
    res.json({
      success: true,
      message: 'User group updated successfully'
    });
  } catch (error) {
    console.error('Update user group error:', error);
    res.status(500).json({ error: 'Failed to update user group' });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );
    
    // Log admin action
    await db.execute(
      'INSERT INTO admin_logs (admin_id, action_type, action_details) VALUES (?, ?, ?)',
      [req.user!.user_id, 'user_delete', `Deleted user ID: ${id}`]
    );
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

