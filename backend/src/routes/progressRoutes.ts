import { Router } from 'express';
import {
  getProgress,
  saveProgress,
  getProgressByWeek,
} from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // All progress routes require authentication

router.get('/', getProgress);
router.post('/', saveProgress);
router.get('/week/:week', getProgressByWeek);

export default router;

