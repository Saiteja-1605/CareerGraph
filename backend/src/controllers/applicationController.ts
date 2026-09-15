import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Application } from '../models/Application';
import { Opportunity } from '../models/Opportunity';

export const getStudentApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.user?._id;
  const { status } = req.query;

  const query: any = { student: studentId };
  if (status && status !== 'All') {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('opportunity')
    .sort({ appliedAt: -1 });

  // Compute status metrics for dashboard tabs
  const allStudentApps = await Application.find({ student: studentId });
  const statusCounts: Record<string, number> = {
    Total: allStudentApps.length,
    Saved: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Shortlisted: 0,
    Rejected: 0,
    Selected: 0,
  };

  allStudentApps.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status] += 1;
    }
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    statusCounts,
    applications,
  });
};

export const applyToOpportunity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { opportunityId, status, notes } = req.body;
  const studentId = req.user?._id;

  if (!opportunityId) {
    res.status(400).json({ success: false, message: 'Opportunity ID is required' });
    return;
  }

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    res.status(404).json({ success: false, message: 'Opportunity not found' });
    return;
  }

  // Check if already applied or saved
  let application = await Application.findOne({
    student: studentId,
    opportunity: opportunityId,
  });

  if (application) {
    // If it was just saved and student wants to mark Applied
    if (status && application.status !== status) {
      application.status = status;
      if (notes) application.notes = notes;
      await application.save();
      res.status(200).json({
        success: true,
        message: `Application updated to ${status}`,
        application,
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `You have already tracked this opportunity as "${application.status}".`,
    });
    return;
  }

  application = await Application.create({
    student: studentId,
    opportunity: opportunityId,
    status: status || 'Applied',
    notes: notes || '',
    appliedAt: new Date(),
  });

  const populated = await Application.findById(application._id).populate('opportunity');

  res.status(201).json({
    success: true,
    message: status === 'Saved' ? 'Opportunity saved to your watchlist' : 'Application marked as submitted',
    application: populated,
  });
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, notes, interviewDate, assessmentScore } = req.body;
  const studentId = req.user?._id;

  // If student, ensure it's their application; if admin, allow updating any application
  const query: any = { _id: id };
  if (req.user?.role !== 'admin') {
    query.student = studentId;
  }

  const application = await Application.findOne(query);
  if (!application) {
    res.status(404).json({ success: false, message: 'Application record not found' });
    return;
  }

  if (status) application.status = status;
  if (notes !== undefined) application.notes = notes;
  if (interviewDate !== undefined) application.interviewDate = interviewDate ? new Date(interviewDate) : undefined;
  if (assessmentScore !== undefined) application.assessmentScore = assessmentScore;

  await application.save();
  const populated = await Application.findById(application._id).populate('opportunity').populate('student', 'name email college degree');

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    application: populated,
  });
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const studentId = req.user?._id;

  const query: any = { _id: id };
  if (req.user?.role !== 'admin') {
    query.student = studentId;
  }

  const result = await Application.findOneAndDelete(query);
  if (!result) {
    res.status(404).json({ success: false, message: 'Application not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Application removed successfully',
  });
};
