export type UserRole = 'student' | 'admin' | 'lecturer' | 'alumni' | 'industry';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  college?: string;
  degree?: string;
  graduationYear?: number;
  bio?: string;
  profilePhoto?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface StudentSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: SkillProficiency;
  createdAt: string;
}

export interface CatalogSkill {
  _id: string;
  name: string;
  category: string;
  description?: string;
  isPredefined: boolean;
}

export type JobType = 'Full-time' | 'Internship' | 'Intern + PPO';
export type OpportunityStatus = 'Active' | 'Upcoming' | 'Closed';

export interface Opportunity {
  _id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  location: string;
  ctc: string;
  eligibility: string;
  requiredSkills: string[];
  deadline: string;
  jobType: JobType;
  status: OpportunityStatus;
  openings?: number;
  applyLink?: string;
  isDemoData?: boolean;
  applicationStatus?: ApplicationStatus | null;
  applicantsCount?: number;
  createdAt: string;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Shortlisted'
  | 'Rejected'
  | 'Selected';

export interface Application {
  _id: string;
  student: User | string;
  opportunity: Opportunity;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
  interviewDate?: string;
  assessmentScore?: string;
  createdAt: string;
}

export interface DsaTopic {
  _id: string;
  topic: string;
  totalProblems: number;
  solvedProblems: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  notes?: string;
  lastUpdated: string;
}

export interface ChecklistItem {
  title: string;
  completed: boolean;
}

export interface InterviewCategory {
  _id: string;
  category: string;
  checklist: ChecklistItem[];
  percentage: number;
  notes?: string;
  lastUpdated: string;
}

export interface ReadinessScore {
  overallScore: number;
  level: 'Beginning' | 'Developing' | 'Competitive' | 'Placement Ready';
  breakdown: {
    profile: { score: number; maxScore: number; percentage: number; label: string; details: string };
    skills: { score: number; maxScore: number; percentage: number; label: string; details: string };
    dsa: { score: number; maxScore: number; percentage: number; label: string; details: string };
    interview: { score: number; maxScore: number; percentage: number; label: string; details: string };
    applications: { score: number; maxScore: number; percentage: number; label: string; details: string };
  };
  recommendations: string[];
}
