import { Router } from 'express';
import {
  getQuestionsMetadata,
  getQuestions,
  listQuestions,
  getAudio,
  listAudio,
  getSyncMetadata,
} from '../controllers/syncController.js';

const router = Router();

// Public routes (no authentication required for sync)
// Questions endpoints
router.get('/questions/metadata', getQuestionsMetadata);
router.get('/questions', getQuestions);
router.get('/questions/list', listQuestions);

// Audio endpoints
router.get('/audio/:filename', getAudio);
router.get('/audio', listAudio);

// Sync metadata
router.get('/metadata', getSyncMetadata);

export default router;

