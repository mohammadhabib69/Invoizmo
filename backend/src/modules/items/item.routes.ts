import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { createItemSchema, updateItemSchema } from './item.schema';
import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
  getTrashedItems,
  restoreItem,
} from './item.controller';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createItemSchema), createItem);
router.get('/', getAllItems);
router.get('/trash', getTrashedItems);
router.get('/:id', getItem);
router.patch('/:id', validate(updateItemSchema), updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/restore', restoreItem);

export default router;
