import { Router } from 'express';
import { body } from 'express-validator';
import {
  getStudentApplications,
  applyToOpportunity,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', protect, getStudentApplications);

router.post(
  '/',
  protect,
  [
    body('opportunityId').notEmpty().withMessage('Opportunity ID is required'),
    validate,
  ],
  applyToOpportunity
);

router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

export default router;
