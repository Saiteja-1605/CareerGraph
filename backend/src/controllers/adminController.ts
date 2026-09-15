import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Opportunity } from '../models/Opportunity';
import { Application } from '../models/Application';
import { StudentSkill } from '../models/StudentSkill';
import { DsaProgress } from '../models/DsaProgress';
import { InterviewPrep } from '../models/InterviewPrep';
import { calculateStudentReadiness } from '../services/readinessService';

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // 1. High level counters
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalOpportunities = await Opportunity.countDocuments();
  const activeOpportunities = await Opportunity.countDocuments({ status: 'Active' });
  const totalApplications = await Application.countDocuments();

  // 2. Applications by status breakdown
  const statusAggregation = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const applicationsByStatus: Record<string, number> = {
    Saved: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Shortlisted: 0,
    Rejected: 0,
    Selected: 0,
  };
  statusAggregation.forEach((item) => {
    if (item._id && applicationsByStatus[item._id] !== undefined) {
      applicationsByStatus[item._id] = item.count;
    }
  });

  // 3. Top student skills in database
  const popularSkillsAgg = await StudentSkill.aggregate([
    { $group: { _id: '$name', count: { $sum: 1 }, category: { $first: '$category' } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // 4. Overall student preparation metrics
  const dsaAgg = await DsaProgress.aggregate([
    {
      $group: {
        _id: null,
        totalSolved: { $sum: '$solvedProblems' },
        avgSolved: { $avg: '$solvedProblems' },
      },
    },
  ]);

  const prepAgg = await InterviewPrep.aggregate([
    {
      $group: {
        _id: null,
        avgPercentage: { $avg: '$percentage' },
      },
    },
  ]);

  // 5. Recent applications across platform
  const recentApplications = await Application.find()
    .populate('student', 'name email college degree')
    .populate('opportunity', 'companyName jobTitle ctc location')
    .sort({ createdAt: -1 })
    .limit(8);

  // 6. Recent student registrations
  const recentStudents = await User.find({ role: 'student' })
    .select('name email college degree graduationYear createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalStudents,
        totalOpportunities,
        activeOpportunities,
        totalApplications,
        selectedStudentsCount: applicationsByStatus['Selected'] || 0,
        avgDsaSolved: dsaAgg[0] ? Math.round(dsaAgg[0].avgSolved) : 0,
        avgInterviewPrep: prepAgg[0] ? Math.round(prepAgg[0].avgPercentage) : 0,
      },
      applicationsByStatus,
      popularSkills: popularSkillsAgg.map((s) => ({
        name: s._id,
        count: s.count,
        category: s.category,
      })),
      recentApplications,
      recentStudents,
    },
  });
};

export const getStudentsList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { search, college, degree } = req.query;

  const query: any = { role: 'student' };
  if (search) {
    const regex = new RegExp(String(search), 'i');
    query.$or = [{ name: regex }, { email: regex }, { college: regex }];
  }
  if (college && college !== 'All') {
    query.college = new RegExp(String(college), 'i');
  }
  if (degree && degree !== 'All') {
    query.degree = new RegExp(String(degree), 'i');
  }

  const students = await User.find(query)
    .select('name email phone college degree graduationYear bio createdAt')
    .sort({ createdAt: -1 });

  // Enrich students with their readiness score and application counts
  const enrichedStudents = await Promise.all(
    students.map(async (st) => {
      const studentId = st._id.toString();
      const readiness = await calculateStudentReadiness(studentId);
      const appCount = await Application.countDocuments({ student: st._id });
      const skillsCount = await StudentSkill.countDocuments({ student: st._id });

      return {
        ...st.toObject(),
        readinessScore: readiness.overallScore,
        readinessLevel: readiness.level,
        applicationsCount: appCount,
        skillsCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: enrichedStudents.length,
    students: enrichedStudents,
  });
};

export const getStudentDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const student = await User.findOne({ _id: id, role: 'student' });
  if (!student) {
    res.status(404).json({ success: false, message: 'Student not found' });
    return;
  }

  const readiness = await calculateStudentReadiness(id);
  const skills = await StudentSkill.find({ student: id });
  const dsaProgress = await DsaProgress.find({ student: id });
  const interviewPrep = await InterviewPrep.find({ student: id });
  const applications = await Application.find({ student: id })
    .populate('opportunity')
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      student,
      readiness,
      skills,
      dsaProgress,
      interviewPrep,
      applications,
    },
  });
};

export const getAllApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { status, search } = req.query;

  const query: any = {};
  if (status && status !== 'All') {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('student', 'name email college degree graduationYear phone')
    .populate('opportunity')
    .sort({ appliedAt: -1 });

  let filtered = applications;
  if (search) {
    const s = String(search).toLowerCase();
    filtered = applications.filter((app: any) => {
      const studentName = app.student?.name?.toLowerCase() || '';
      const company = app.opportunity?.companyName?.toLowerCase() || '';
      const title = app.opportunity?.jobTitle?.toLowerCase() || '';
      return studentName.includes(s) || company.includes(s) || title.includes(s);
    });
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    applications: filtered,
  });
};

export const getPlatformAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Compute readiness score distribution across all students
  const students = await User.find({ role: 'student' });
  const distribution = {
    beginning: 0, // 0 - 39
    developing: 0, // 40 - 59
    competitive: 0, // 60 - 79
    placementReady: 0, // 80 - 100
  };

  for (const st of students) {
    const res = await calculateStudentReadiness(st._id.toString());
    if (res.overallScore >= 80) distribution.placementReady += 1;
    else if (res.overallScore >= 60) distribution.competitive += 1;
    else if (res.overallScore >= 40) distribution.developing += 1;
    else distribution.beginning += 1;
  }

  // Applications funnel
  const funnel = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Skills demand from opportunities vs supply from students
  const studentSkillsAgg = await StudentSkill.aggregate([
    { $group: { _id: '$name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalStudents: students.length,
      distribution,
      funnel,
      topStudentSkills: studentSkillsAgg,
    },
  });
};
