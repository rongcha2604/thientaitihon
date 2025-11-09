import { Router } from 'express';
import {
  getAlbumItems,
  purchaseItem,
  getMyItems,
} from '../controllers/albumController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken); // All album routes require authentication

router.get('/items', getAlbumItems);
router.post('/purchase', purchaseItem);
router.get('/my-items', getMyItems);

export default router;

