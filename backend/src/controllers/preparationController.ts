import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DsaProgress, DSA_DEFAULT_TOPICS } from '../models/DsaProgress';
import { InterviewPrep, INTERVIEW_DEFAULT_CATEGORIES } from '../models/InterviewPrep';

export const getDsaProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const studentId = req.user._id;

  let records: any[] = await DsaProgress.find({ student: studentId }).sort({ topic: 1 });

  // Self-heal: If user has no topics yet, initialize them
  if (records.length === 0) {
    const dsaDocs = DSA_DEFAULT_TOPICS.map((item) => ({
      student: studentId,
      topic: item.topic,
      totalProblems: item.totalProblems,
      solvedProblems: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
    }));
    records = (await DsaProgress.insertMany(dsaDocs)) as any[];
  }

  // Calculate summary metrics
  let totalSolved = 0;
  let totalGoal = 0;
  let totalEasy = 0;
  let totalMedium = 0;
  let totalHard = 0;

  records.forEach((r) => {
    totalSolved += r.solvedProblems;
    totalGoal += r.totalProblems;
    totalEasy += r.easySolved;
    totalMedium += r.mediumSolved;
    totalHard += r.hardSolved;
  });

  const percentage = totalGoal > 0 ? Math.round((totalSolved / totalGoal) * 100) : 0;

  res.status(200).json({
    success: true,
    summary: {
      totalSolved,
      totalGoal,
      totalEasy,
      totalMedium,
      totalHard,
      percentage,
      topicsCount: records.length,
    },
    topics: records,
  });
};

export const updateDsaTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { solvedProblems, easySolved, mediumSolved, hardSolved, totalProblems, notes } = req.body;
  const studentId = req.user?._id;

  const record = await DsaProgress.findOne({ _id: id, student: studentId });
  if (!record) {
    res.status(404).json({ success: false, message: 'DSA topic record not found' });
    return;
  }

  if (easySolved !== undefined) record.easySolved = Math.max(0, Number(easySolved));
  if (mediumSolved !== undefined) record.mediumSolved = Math.max(0, Number(mediumSolved));
  if (hardSolved !== undefined) record.hardSolved = Math.max(0, Number(hardSolved));
  if (totalProblems !== undefined) record.totalProblems = Math.max(1, Number(totalProblems));
  if (notes !== undefined) record.notes = notes;

  // Derive solvedProblems from easy + medium + hard or fallback to solvedProblems
  if (easySolved !== undefined || mediumSolved !== undefined || hardSolved !== undefined) {
    record.solvedProblems = record.easySolved + record.mediumSolved + record.hardSolved;
  } else if (solvedProblems !== undefined) {
    record.solvedProblems = Math.max(0, Number(solvedProblems));
  }

  record.lastUpdated = new Date();
  await record.save();

  res.status(200).json({
    success: true,
    message: 'DSA progress updated successfully',
    topic: record,
  });
};

export const getInterviewPrep = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const studentId = req.user._id;

  let records: any[] = await InterviewPrep.find({ student: studentId });

  // Self-heal: If user has no interview categories yet, initialize them
  if (records.length === 0) {
    const prepDocs = INTERVIEW_DEFAULT_CATEGORIES.map((cat) => ({
      student: studentId,
      category: cat.category,
      checklist: cat.items.map((item) => ({ title: item, completed: false })),
      percentage: 0,
    }));
    records = (await InterviewPrep.insertMany(prepDocs)) as any[];
  }

  // Calculate overall interview preparedness
  let totalItems = 0;
  let completedItems = 0;

  records.forEach((r) => {
    r.checklist.forEach((item: any) => {
      totalItems += 1;
      if (item.completed) completedItems += 1;
    });
  });

  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  res.status(200).json({
    success: true,
    summary: {
      overallPercentage,
      totalItems,
      completedItems,
      categoriesCount: records.length,
    },
    categories: records,
  });
};

export const updateInterviewCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { checklist, notes } = req.body;
  const studentId = req.user?._id;

  const record = await InterviewPrep.findOne({ _id: id, student: studentId });
  if (!record) {
    res.status(404).json({ success: false, message: 'Interview category not found' });
    return;
  }

  if (checklist && Array.isArray(checklist)) {
    record.checklist = checklist;
    const completed = checklist.filter((i: any) => i.completed).length;
    record.percentage = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;
  }

  if (notes !== undefined) record.notes = notes;
  record.lastUpdated = new Date();

  await record.save();

  res.status(200).json({
    success: true,
    message: 'Interview preparation updated successfully',
    category: record,
  });
};

export const toggleChecklistItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { itemIndex } = req.body;
  const studentId = req.user?._id;

  const record = await InterviewPrep.findOne({ _id: id, student: studentId });
  if (!record) {
    res.status(404).json({ success: false, message: 'Interview category not found' });
    return;
  }

  if (record.checklist[itemIndex] !== undefined) {
    record.checklist[itemIndex].completed = !record.checklist[itemIndex].completed;
    const completed = record.checklist.filter((i) => i.completed).length;
    record.percentage = Math.round((completed / record.checklist.length) * 100);
    record.lastUpdated = new Date();
    await record.save();
  }

  res.status(200).json({
    success: true,
    category: record,
  });
};
