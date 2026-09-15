import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'Database' | 'CS Fundamentals' | 'Tools & DevOps' | 'Other';
  description?: string;
  isPredefined: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Programming', 'Frontend', 'Backend', 'Database', 'CS Fundamentals', 'Tools & DevOps', 'Other'],
      default: 'Other',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isPredefined: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Skill: Model<ISkill> = mongoose.model<ISkill>('Skill', skillSchema);
