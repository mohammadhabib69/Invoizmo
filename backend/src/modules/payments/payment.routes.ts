import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { recordPaymentSchema } from './payment.schema';
import {
  recordPayment,
  getAllPayments,
  getPayment,
  deletePayment,
  getTrashedPayments,
  restorePayment,
} from './payment.controller';

const router = Router();

router.use(requireAuth);

router.post('/', validate(recordPaymentSchema), recordPayment);
router.get('/', getAllPayments);
router.get('/trash', getTrashedPayments);
router.get('/:id', getPayment);
router.delete('/:id', deletePayment);
router.patch('/:id/restore', restorePayment);

export default router;
