import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.schema';
import { register, login } from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;