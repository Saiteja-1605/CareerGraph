import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Browse opportunities (optional protect to attach student application status if logged in)
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    protect(req, res, next);
  } else {
    next();
  }
}, getAllOpportunities);

router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    protect(req, res, next);
  } else {
    next();
  }
}, getOpportunityById);

// Admin-only management endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('ctc').trim().notEmpty().withMessage('Package/CTC is required'),
    body('eligibility').trim().notEmpty().withMessage('Eligibility criteria is required'),
    body('deadline').isISO8601().withMessage('Valid deadline date is required'),
    validate,
  ],
  createOpportunity
);

router.put('/:id', protect, authorize('admin'), updateOpportunity);
router.delete('/:id', protect, authorize('admin'), deleteOpportunity);

export default router;
