import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Opportunity } from '../models/Opportunity';
import { Application } from '../models/Application';

export const getAllOpportunities = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { search, jobType, location, status, sort } = req.query;

  const query: any = {};

  // Text search on companyName, jobTitle, description, requiredSkills
  if (search) {
    const searchRegex = new RegExp(String(search), 'i');
    query.$or = [
      { companyName: searchRegex },
      { jobTitle: searchRegex },
      { description: searchRegex },
      { requiredSkills: { $in: [searchRegex] } },
    ];
  }

  if (jobType && jobType !== 'All') {
    query.jobType = jobType;
  }

  if (location && location !== 'All') {
    query.location = new RegExp(String(location), 'i');
  }

  if (status && status !== 'All') {
    query.status = status;
  } else if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'industry' && req.user.role !== 'lecturer')) {
    // By default, students and unauthenticated users see Active & Upcoming opportunities
    query.status = { $in: ['Active', 'Upcoming'] };
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'deadline') {
    sortOption = { deadline: 1 };
  } else if (sort === 'company') {
    sortOption = { companyName: 1 };
  }

  const opportunities = await Opportunity.find(query).sort(sortOption);

  // If student is logged in, attach their application status to each opportunity
  let userApplicationsMap: Record<string, string> = {};
  if (req.user && req.user.role === 'student') {
    const studentApps = await Application.find({ student: req.user._id });
    studentApps.forEach((app) => {
      userApplicationsMap[app.opportunity.toString()] = app.status;
    });
  }

  const enriched = opportunities.map((opp) => ({
    ...opp.toObject(),
    applicationStatus: userApplicationsMap[opp._id.toString()] || null,
  }));

  res.status(200).json({
    success: true,
    count: enriched.length,
    opportunities: enriched,
  });
};

export const getOpportunityById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    res.status(404).json({ success: false, message: 'Placement opportunity not found' });
    return;
  }

  let userApplication: any = null;
  if (req.user && req.user.role === 'student') {
    userApplication = await Application.findOne({
      student: req.user._id,
      opportunity: opportunity._id,
    });
  }

  let applicantsCount = 0;
  if (req.user && req.user.role === 'admin') {
    applicantsCount = await Application.countDocuments({ opportunity: opportunity._id });
  }

  res.status(200).json({
    success: true,
    opportunity: {
      ...opportunity.toObject(),
      userApplication: userApplication
        ? { id: userApplication._id, status: userApplication.status, appliedAt: userApplication.appliedAt }
        : null,
      applicantsCount,
    },
  });
};

export const createOpportunity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const {
    companyName,
    jobTitle,
    description,
    location,
    ctc,
    eligibility,
    requiredSkills,
    deadline,
    jobType,
    status,
    openings,
    applyLink,
  } = req.body;

  const opportunity = await Opportunity.create({
    companyName,
    jobTitle,
    description,
    location,
    ctc,
    eligibility,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((s: string) => s.trim()),
    deadline: new Date(deadline),
    jobType: jobType || 'Full-time',
    status: status || 'Active',
    openings: openings || 1,
    applyLink: applyLink || '',
  });

  res.status(201).json({
    success: true,
    message: 'Placement opportunity created successfully',
    opportunity,
  });
};

export const updateOpportunity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const updateData = { ...req.body };
  if (updateData.requiredSkills && !Array.isArray(updateData.requiredSkills)) {
    updateData.requiredSkills = updateData.requiredSkills.split(',').map((s: string) => s.trim());
  }

  const updated = await Opportunity.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    res.status(404).json({ success: false, message: 'Opportunity not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Placement opportunity updated successfully',
    opportunity: updated,
  });
};

export const deleteOpportunity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleted = await Opportunity.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Opportunity not found' });
    return;
  }

  // Also remove associated applications
  await Application.deleteMany({ opportunity: id });

  res.status(200).json({
    success: true,
    message: 'Placement opportunity and associated application records removed',
  });
};
