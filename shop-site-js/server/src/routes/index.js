import { Router } from 'express';
import authRoutes from './authRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';

// Mounts every feature router under /api and adds the health check.
const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'سرور فروشگاه در دسترس است.', uptime: process.uptime() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
