import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

// Must be declared before `/:id` so "categories" isn't parsed as an id.
router.get('/categories', listCategories);

router.route('/').get(listProducts).post(protect, adminOnly, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
