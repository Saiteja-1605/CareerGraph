import { Router } from 'express';
import { getProfile, updateProfile, getReadinessScore, getStudentDashboardData } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/readiness', protect, authorize('student', 'alumni'), getReadinessScore);
router.get('/dashboard', protect, authorize('student', 'alumni'), getStudentDashboardData);

export default router;
