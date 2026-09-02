import { Router } from 'express';
import { checkout, getOrder, listOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(listOrders).post(checkout);
router.get('/:id', getOrder);

export default router;
