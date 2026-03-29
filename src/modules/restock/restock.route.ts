import { Router } from 'express';
import { RestockController } from './restock.controller'

const router = Router();

router.post('/add', RestockController.addToRestockQueue);
router.get('/', RestockController.listQueue);
router.patch('/:id/restock', RestockController.restockFromQueue);
router.delete('/:id', RestockController.removeFromQueue);

export const RestockRoutes = router;