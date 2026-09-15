import mongoose, { Document, Model, Schema } from 'mongoose';

export const DSA_DEFAULT_TOPICS = [
  { topic: 'Arrays', totalProblems: 50 },
  { topic: 'Strings', totalProblems: 40 },
  { topic: 'Linked Lists', totalProblems: 30 },
  { topic: 'Stack', totalProblems: 25 },
  { topic: 'Queue', totalProblems: 20 },
  { topic: 'Hashing', totalProblems: 30 },
  { topic: 'Recursion', totalProblems: 25 },
  { topic: 'Sorting', totalProblems: 25 },
  { topic: 'Searching', totalProblems: 20 },
  { topic: 'Trees', totalProblems: 45 },
  { topic: 'Graphs', totalProblems: 40 },
  { topic: 'Dynamic Programming', totalProblems: 50 },
];

export interface IDsaProgress extends Document {
  student: mongoose.Types.ObjectId;
  topic: string;
  totalProblems: number;
  solvedProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  notes?: string;
  lastUpdated: Date;
}

const dsaProgressSchema = new Schema<IDsaProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    totalProblems: {
      type: Number,
      default: 30,
      min: 0,
    },
    solvedProblems: {
      type: Number,
      default: 0,
      min: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

dsaProgressSchema.index({ student: 1, topic: 1 }, { unique: true });

export const DsaProgress: Model<IDsaProgress> = mongoose.model<IDsaProgress>('DsaProgress', dsaProgressSchema);
