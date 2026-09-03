import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

// /api/users — the signed-in user's own profile. There is no user list:
// this project has no user-administration screen.
const router = Router();

router.route('/me').get(protect, getProfile).put(protect, updateProfile);

export default router;
