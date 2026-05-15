import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { createClientSchema, updateClientSchema } from './client.schema';
import {
  createClient,
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
  getTrashedClients,
  restoreClient,
} from './client.controller';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createClientSchema), createClient);
router.get('/', getAllClients);
router.get('/trash', getTrashedClients);
router.get('/:id', getClient);
router.patch('/:id', validate(updateClientSchema), updateClient);
router.delete('/:id', deleteClient);
router.patch('/:id/restore', restoreClient);

export default router;
