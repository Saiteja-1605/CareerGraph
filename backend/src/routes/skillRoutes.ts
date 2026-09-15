import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCatalogSkills,
  getStudentSkills,
  addStudentSkill,
  updateStudentSkill,
  deleteStudentSkill,
  createPredefinedSkill,
  deletePredefinedSkill,
} from '../controllers/skillController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/catalog', protect, getCatalogSkills);
router.get('/', protect, getStudentSkills);
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    validate,
  ],
  addStudentSkill
);
router.put('/:id', protect, updateStudentSkill);
router.delete('/:id', protect, deleteStudentSkill);

// Admin catalog routes
router.post(
  '/catalog',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validate,
  ],
  createPredefinedSkill
);
router.delete('/catalog/:id', protect, authorize('admin'), deletePredefinedSkill);

export default router;
