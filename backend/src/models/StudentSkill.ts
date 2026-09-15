import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudentSkill extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  createdAt: Date;
  updatedAt: Date;
}

const studentSkillSchema = new Schema<IStudentSkill>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Programming',
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student doesn't add the exact same skill twice
studentSkillSchema.index({ student: 1, name: 1 }, { unique: true });

export const StudentSkill: Model<IStudentSkill> = mongoose.model<IStudentSkill>('StudentSkill', studentSkillSchema);
