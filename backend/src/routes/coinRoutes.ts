import { Router } from 'express';
import {
  getUserCoins,
  awardCoins,
  getCoinTransactions,
} from '../controllers/coinController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // All coin routes require authentication

router.get('/', getUserCoins);
router.post('/award', awardCoins);
router.get('/transactions', getCoinTransactions);

export default router;

