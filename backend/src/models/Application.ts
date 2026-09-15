import mongoose, { Document, Model, Schema } from 'mongoose';

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Shortlisted'
  | 'Rejected'
  | 'Selected';

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  opportunity: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  appliedAt: Date;
  notes?: string;
  interviewDate?: Date;
  assessmentScore?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    opportunity: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Shortlisted', 'Rejected', 'Selected'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    interviewDate: {
      type: Date,
    },
    assessmentScore: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One application record per student per opportunity
applicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

export const Application: Model<IApplication> = mongoose.model<IApplication>('Application', applicationSchema);
