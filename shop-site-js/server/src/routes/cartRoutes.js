import { Router } from 'express';
import {
  addToCart,
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Every cart route belongs to the signed-in user; guests keep their cart in
// localStorage on the client and merge it in via POST /merge after logging in.
router.use(protect);

router.route('/').get(getCart).post(addToCart).delete(clearCart);
router.post('/merge', mergeCart);
router.route('/:productId').put(updateCartItem).delete(removeCartItem);

export default router;
