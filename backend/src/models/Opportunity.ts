import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOpportunity extends Document {
  companyName: string;
  jobTitle: string;
  description: string;
  location: string;
  ctc: string; // e.g. "12 LPA", "8 - 10 LPA", "45,000 / month"
  eligibility: string; // e.g. "B.Tech CSE/IT with 7.0+ CGPA, No Active Backlogs"
  requiredSkills: string[];
  deadline: Date;
  jobType: 'Full-time' | 'Internship' | 'Intern + PPO';
  status: 'Active' | 'Upcoming' | 'Closed';
  openings?: number;
  applyLink?: string;
  isDemoData?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    ctc: {
      type: String,
      required: [true, 'Package/CTC is required'],
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Intern + PPO'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Closed'],
      default: 'Active',
    },
    openings: {
      type: Number,
      default: 1,
    },
    applyLink: {
      type: String,
      trim: true,
      default: '',
    },
    isDemoData: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Opportunity: Model<IOpportunity> = mongoose.model<IOpportunity>('Opportunity', opportunitySchema);
