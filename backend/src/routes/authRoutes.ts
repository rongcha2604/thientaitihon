import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
  updateProfile,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);
router.patch('/profile', authenticateToken, updateProfile);

export default router;

