import mongoose from 'mongoose';
import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { getDashboardStats } from './analytics.controller';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', getDashboardStats);

export default router;
