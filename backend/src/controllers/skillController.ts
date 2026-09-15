import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Skill } from '../models/Skill';
import { StudentSkill } from '../models/StudentSkill';

export const getCatalogSkills = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const skills = await Skill.find().sort({ category: 1, name: 1 });
  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
};

export const getStudentSkills = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id;
  const skills = await StudentSkill.find({ student: studentId }).sort({ createdAt: -1 });

  // Group by category for easy frontend display
  const categorized: Record<string, any[]> = {};
  skills.forEach((s) => {
    if (!categorized[s.category]) {
      categorized[s.category] = [];
    }
    categorized[s.category].push(s);
  });

  res.status(200).json({
    success: true,
    totalCount: skills.length,
    skills,
    categorized,
  });
};

export const addStudentSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, category, proficiency } = req.body;
  const studentId = req.user?._id;

  if (!name) {
    res.status(400).json({ success: false, message: 'Skill name is required' });
    return;
  }

  // Check if student already has this skill
  const existing = await StudentSkill.findOne({
    student: studentId,
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
  });

  if (existing) {
    res.status(400).json({
      success: false,
      message: `You have already added "${existing.name}" to your profile.`,
    });
    return;
  }

  // Determine category if not provided, check if it exists in catalog
  let skillCategory = category;
  if (!skillCategory) {
    const catalogSkill = await Skill.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    skillCategory = catalogSkill ? catalogSkill.category : 'Other';
  }

  const newSkill = await StudentSkill.create({
    student: studentId,
    name: name.trim(),
    category: skillCategory || 'Programming',
    proficiency: proficiency || 'Intermediate',
  });

  res.status(201).json({
    success: true,
    message: 'Skill added successfully',
    skill: newSkill,
  });
};

export const updateStudentSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { proficiency, category } = req.body;
  const studentId = req.user?._id;

  const skill = await StudentSkill.findOne({ _id: id, student: studentId });
  if (!skill) {
    res.status(404).json({ success: false, message: 'Skill not found in your profile' });
    return;
  }

  if (proficiency) skill.proficiency = proficiency;
  if (category) skill.category = category;
  await skill.save();

  res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    skill,
  });
};

export const deleteStudentSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const studentId = req.user?._id;

  const result = await StudentSkill.findOneAndDelete({ _id: id, student: studentId });
  if (!result) {
    res.status(404).json({ success: false, message: 'Skill not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Skill removed from profile',
  });
};

// Admin endpoint: add a new predefined skill to master catalog
export const createPredefinedSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, category, description } = req.body;

  const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
  if (existing) {
    res.status(400).json({ success: false, message: 'Skill already exists in catalog' });
    return;
  }

  const skill = await Skill.create({
    name: name.trim(),
    category: category || 'Other',
    description: description || '',
    isPredefined: true,
  });

  res.status(201).json({
    success: true,
    message: 'Skill added to master catalog',
    skill,
  });
};

export const deletePredefinedSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await Skill.findByIdAndDelete(id);
  if (!result) {
    res.status(404).json({ success: false, message: 'Skill not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Skill deleted from master catalog',
  });
};
