import { Router } from 'express';
import {
  getDsaProgress,
  updateDsaTopic,
  getInterviewPrep,
  updateInterviewCategory,
  toggleChecklistItem,
} from '../controllers/preparationController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All preparation endpoints are student-focused
router.use(protect);
router.use(authorize('student'));

router.get('/dsa', getDsaProgress);
router.put('/dsa/:id', updateDsaTopic);

router.get('/interview', getInterviewPrep);
router.put('/interview/:id', updateInterviewCategory);
router.post('/interview/:id/toggle', toggleChecklistItem);

export default router;
