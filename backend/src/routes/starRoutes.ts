import { Router } from 'express';
import {
  getUserStars,
  awardStars,
  getStarTransactions,
} from '../controllers/starController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // All star routes require authentication

router.get('/', getUserStars);
router.post('/award', awardStars);
router.get('/transactions', getStarTransactions);

export default router;

