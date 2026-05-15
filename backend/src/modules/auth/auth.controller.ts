import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models/User';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'EMAIL_IN_USE' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    const accessToken = signAccessToken({ id: user.id as string, plan: user.plan });
    const refreshToken = signRefreshToken({ id: user.id as string, plan: user.plan });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isDeleted) {
      return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(401).json({ success: false, error: 'ACCOUNT_LOCKED' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await user.save();
      return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    const accessToken = signAccessToken({ id: user.id as string, plan: user.plan });
    const refreshToken = signRefreshToken({ id: user.id as string, plan: user.plan });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};