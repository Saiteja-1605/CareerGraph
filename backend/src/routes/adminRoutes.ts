import { Router } from 'express';
import {
  getAdminDashboard,
  getStudentsList,
  getStudentDetail,
  getAllApplications,
  getPlatformAnalytics,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require authentication
router.use(protect);

router.get('/dashboard', authorize('admin', 'lecturer'), getAdminDashboard);
router.get('/students', authorize('admin', 'lecturer', 'industry', 'alumni'), getStudentsList);
router.get('/students/:id', authorize('admin', 'lecturer', 'industry', 'alumni'), getStudentDetail);
router.get('/applications', authorize('admin', 'lecturer', 'industry'), getAllApplications);
router.get('/analytics', authorize('admin', 'lecturer'), getPlatformAnalytics);

export default router;
