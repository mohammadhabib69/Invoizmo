import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      plan: decoded.plan,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
  }
};