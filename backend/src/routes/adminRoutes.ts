import { Router } from 'express';
import {
  adminLogin,
  getUsers,
  getUserDetails,
  updateUser,
  updateAdminUser,
  getAnalyticsDashboard,
  getProgressSummary,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from '../controllers/adminController.js';

const router = Router();

// Admin login (public)
router.post('/login', adminLogin);

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Audit logging middleware for admin actions
router.use(async (req, res, next) => {
  // Track admin actions
  res.on('finish', async () => {
    if (req.user && req.path !== '/login') {
      try {
        await createAuditLog(
          req.user.userId,
          `${req.method} ${req.path}`,
          req.params.id ? 'user' : undefined,
          req.params.id,
          req.ip || req.socket.remoteAddress || undefined
        );
      } catch (error) {
        console.error('Audit log error:', error);
      }
    }
  });
  next();
});

router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.put('/admins/:id', updateAdminUser);
router.get('/analytics', getAnalyticsDashboard);
router.get('/progress', getProgressSummary);
router.get('/audit-logs', getAuditLogs);

export default router;

