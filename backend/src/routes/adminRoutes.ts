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

// All admin routes require authentication and appropriate role
router.use(protect);
router.use(authorize('admin', 'lecturer', 'industry'));

router.get('/dashboard', getAdminDashboard);
router.get('/students', getStudentsList);
router.get('/students/:id', getStudentDetail);
router.get('/applications', getAllApplications);
router.get('/analytics', getPlatformAnalytics);

export default router;
