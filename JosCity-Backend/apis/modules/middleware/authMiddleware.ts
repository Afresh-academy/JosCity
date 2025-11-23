import { Request, Response, NextFunction } from 'express';
import db from '../config/database';

interface User {
  user_id: number;
  user_group: number;
}

interface AuthRequest extends Request {
  user?: {
    user_id: number;
  };
  admin?: User;
}

// first check if user is admin
export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const [users] = await db.execute(
      'SELECT user_id, user_group FROM users WHERE user_id = ?',
      [req.user.user_id]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0] as User;
    
    // check if user is admin (user_group = 1) or moderator (user_group = 2)
    if (user.user_group !== 1 && user.user_group !== 2) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    req.admin = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// this is to check if user is super admin only
export const superAdminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const [users] = await db.execute(
      'SELECT user_id, user_group FROM users WHERE user_id = ?',
      [req.user.user_id]
    ) as [any[], any];

    if (users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0] as User;
    
    // This is to allow Only super admin (user_group = 1)
    if (user.user_group !== 1) {
      res.status(403).json({ error: 'Super admin access required' });
      return;
    }

    req.admin = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

