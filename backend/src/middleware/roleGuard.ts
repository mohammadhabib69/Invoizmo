import { Request, Response, NextFunction } from 'express';

export const planGuard = (allowedPlans: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    }

    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({ success: false, error: 'PLAN_UPGRADE_REQUIRED' });
    }

    next();
  };
};