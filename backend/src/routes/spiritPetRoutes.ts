import { Router } from 'express';
import {
  getSpiritPets,
  getUserSpiritPets,
  unlockSpiritPet,
  upgradeSpiritPet,
  toggleActiveSpiritPet,
} from '../controllers/spiritPetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public route: Lấy danh sách linh vật (không cần auth)
router.get('/pets', getSpiritPets);

// Protected routes: Cần authentication
router.use(authenticateToken);

router.get('/user/pets', getUserSpiritPets);
router.post('/user/pets/unlock', unlockSpiritPet);
router.post('/user/pets/upgrade', upgradeSpiritPet);
router.post('/user/pets/toggle-active', toggleActiveSpiritPet);

export default router;

