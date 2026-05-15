import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Readable } from 'stream';
import { User } from '../../models/User';
import cloudinary from '../../config/cloudinary';

const uploadToCloudinary = (buffer: Buffer, folder: string = 'invoizmo'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const getProfile = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).select('-passwordHash -refreshTokens');
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: req.body },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'INCORRECT_PASSWORD' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = passwordHash;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'NO_FILE_UPLOADED' });
    }

    const logoUrl = await uploadToCloudinary(req.file.buffer, 'invoizmo/logos');
    
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: { logoUrl } },
      { new: true }
    ).select('-passwordHash -refreshTokens');

    if (!user) {
      return res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
