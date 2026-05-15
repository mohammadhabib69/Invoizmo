import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
import { updateUserSchema, changePasswordSchema } from './user.schema';
import { getProfile, updateProfile, changePassword, uploadLogo } from './user.controller';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.patch('/me', requireAuth, validate(updateUserSchema), updateProfile);
router.patch('/me/change-password', requireAuth, validate(changePasswordSchema), changePassword);
router.post('/me/logo', requireAuth, upload.single('logo'), uploadLogo);

export default router;
