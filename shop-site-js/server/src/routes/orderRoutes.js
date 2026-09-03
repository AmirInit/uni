import { Router } from 'express';
import { checkout, getOrder, listOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

// /api/orders — checkout and the signed-in user's order history.
const router = Router();

router.use(protect);
router.route('/').get(listOrders).post(checkout);
router.get('/:id', getOrder);

export default router;
