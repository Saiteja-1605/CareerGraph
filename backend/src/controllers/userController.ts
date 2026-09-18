import { Response } from 'express';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { calculateStudentReadiness } from '../services/readinessService';
import { StudentSkill } from '../models/StudentSkill';
import { DsaProgress } from '../models/DsaProgress';
import { InterviewPrep } from '../models/InterviewPrep';
import { Application } from '../models/Application';
import { Opportunity } from '../models/Opportunity';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const allowedFields = [
    'name',
    'phone',
    'college',
    'degree',
    'graduationYear',
    'bio',
    'profilePhoto',
    'githubUrl',
    'linkedinUrl',
    'resumeUrl',
  ];

  const updateData: Record<string, any> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user?._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
};

export const getReadinessScore = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || (req.user.role !== 'student' && req.user.role !== 'alumni')) {
    res.status(400).json({
      success: false,
      message: 'Career readiness score is calculated for student and alumni profiles.',
    });
    return;
  }

  const result = await calculateStudentReadiness(req.user._id.toString());
  res.status(200).json({
    success: true,
    readiness: result,
  });
};

export const getStudentDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const studentId = req.user._id;

  // 1. Calculate readiness score & recommendations
  const readiness = await calculateStudentReadiness(studentId.toString());

  // 2. Skills summary
  const skills = await StudentSkill.find({ student: studentId }).sort({ createdAt: -1 });
  const skillsCount = skills.length;

  // 3. DSA summary
  const dsaProgress = await DsaProgress.find({ student: studentId });
  let totalDsaSolved = 0;
  let totalDsaGoal = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  dsaProgress.forEach((t) => {
    totalDsaSolved += t.solvedProblems;
    totalDsaGoal += t.totalProblems;
    easySolved += t.easySolved;
    mediumSolved += t.mediumSolved;
    hardSolved += t.hardSolved;
  });

  // 4. Interview Prep summary
  const prepProgress = await InterviewPrep.find({ student: studentId });
  let prepAvg = 0;
  if (prepProgress.length > 0) {
    const sum = prepProgress.reduce((acc, curr) => acc + curr.percentage, 0);
    prepAvg = Math.round(sum / prepProgress.length);
  }

  // 5. Applications summary
  const applications = await Application.find({ student: studentId })
    .populate('opportunity')
    .sort({ appliedAt: -1 });

  const totalApplications = applications.length;
  const shortlistedCount = applications.filter((a) =>
    ['Shortlisted', 'Interview', 'Selected'].includes(a.status)
  ).length;

  // 6. Upcoming placement deadlines
  const upcomingOpportunities = await Opportunity.find({
    status: 'Active',
    deadline: { $gte: new Date() },
  })
    .sort({ deadline: 1 })
    .limit(5);

  // 7. Recent activity feed (derived from recent updates)
  const recentActivity: any[] = [];
  applications.slice(0, 3).forEach((app: any) => {
    recentActivity.push({
      type: 'application',
      title: `Applied to ${app.opportunity?.companyName || 'Company'}`,
      description: `Status: ${app.status}`,
      date: app.appliedAt,
    });
  });

  res.status(200).json({
    success: true,
    data: {
      student: req.user,
      readiness,
      stats: {
        skillsCount,
        totalDsaSolved,
        totalDsaGoal,
        easySolved,
        mediumSolved,
        hardSolved,
        interviewPrepPercentage: prepAvg,
        totalApplications,
        shortlistedCount,
      },
      skills: skills.slice(0, 8),
      dsaOverview: dsaProgress.slice(0, 6),
      prepOverview: prepProgress.slice(0, 6),
      recentApplications: applications.slice(0, 5),
      upcomingDeadlines: upcomingOpportunities,
      recentActivity,
    },
  });
};
