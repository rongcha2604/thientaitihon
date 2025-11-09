import { Router } from 'express';
import { trackEvent } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // All analytics routes require authentication

router.post('/track', trackEvent);

export default router;

