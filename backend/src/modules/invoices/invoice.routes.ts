import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { createInvoiceSchema, updateInvoiceSchema } from './invoice.schema';
import {
  getNextInvoiceNumber,
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  getInvoicePreview,
  getInvoicePDF,
  deleteInvoice,
  getTrashedInvoices,
  restoreInvoice,
} from './invoice.controller';

const router = Router();

router.use(requireAuth);

router.get('/next-number', getNextInvoiceNumber);
router.post('/', validate(createInvoiceSchema), createInvoice);
router.get('/', getAllInvoices);
router.get('/trash', getTrashedInvoices);
router.get('/:id', getInvoice);
router.get('/:id/preview', getInvoicePreview);
router.get('/:id/pdf', getInvoicePDF);
router.patch('/:id', validate(updateInvoiceSchema), updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);
router.patch('/:id/restore', restoreInvoice);

export default router;
