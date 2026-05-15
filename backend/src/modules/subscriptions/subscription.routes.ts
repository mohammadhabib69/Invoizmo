import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { updatePlanSchema } from './subscription.schema';
import {
  getSubscription,
  updatePlan,
  cancelSubscription,
} from './subscription.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getSubscription);
router.patch('/plan', validate(updatePlanSchema), updatePlan);
router.post('/cancel', cancelSubscription);

export default router;
