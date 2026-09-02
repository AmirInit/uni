import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/me').get(protect, getProfile).put(protect, updateProfile);

export default router;
