import { User } from '../models/User';
import { StudentSkill } from '../models/StudentSkill';
import { DsaProgress } from '../models/DsaProgress';
import { InterviewPrep } from '../models/InterviewPrep';
import { Application } from '../models/Application';

export interface ReadinessScoreResult {
  overallScore: number; // 0 - 100
  level: 'Beginning' | 'Developing' | 'Competitive' | 'Placement Ready';
  breakdown: {
    profile: {
      score: number;
      maxScore: number;
      percentage: number;
      label: string;
      details: string;
    };
    skills: {
      score: number;
      maxScore: number;
      percentage: number;
      label: string;
      details: string;
    };
    dsa: {
      score: number;
      maxScore: number;
      percentage: number;
      label: string;
      details: string;
    };
    interview: {
      score: number;
      maxScore: number;
      percentage: number;
      label: string;
      details: string;
    };
    applications: {
      score: number;
      maxScore: number;
      percentage: number;
      label: string;
      details: string;
    };
  };
  recommendations: string[];
}

export const calculateStudentReadiness = async (
  studentId: string
): Promise<ReadinessScoreResult> => {
  const recommendations: string[] = [];

  // 1. Profile Completion (Max: 15 points)
  const user = await User.findById(studentId);
  let profileScore = 0;
  const profileFields = [
    { field: user?.name, name: 'Full Name', weight: 1.5 },
    { field: user?.email, name: 'Email Address', weight: 1.5 },
    { field: user?.phone, name: 'Phone Number', weight: 1.5 },
    { field: user?.college, name: 'College Name', weight: 2.0 },
    { field: user?.degree, name: 'Degree Program', weight: 1.5 },
    { field: user?.graduationYear, name: 'Graduation Year', weight: 1.5 },
    { field: user?.bio, name: 'Professional Bio', weight: 1.5 },
    { field: user?.resumeUrl, name: 'Resume Link', weight: 2.0 },
    { field: user?.githubUrl, name: 'GitHub Profile', weight: 1.0 },
    { field: user?.linkedinUrl, name: 'LinkedIn Profile', weight: 1.0 },
  ];

  profileFields.forEach((item) => {
    if (item.field && String(item.field).trim().length > 0) {
      profileScore += item.weight;
    } else {
      if (['Resume Link', 'GitHub Profile', 'LinkedIn Profile', 'Professional Bio'].includes(item.name)) {
        recommendations.push(`Add your ${item.name} to strengthen your profile completion score.`);
      }
    }
  });
  profileScore = Math.min(15, Math.round(profileScore * 10) / 10);

  // 2. Technical Skills (Max: 20 points)
  const skills = await StudentSkill.find({ student: studentId });
  let skillsScore = 0;
  const skillCount = skills.length;
  const distinctCategories = new Set(skills.map((s) => s.category)).size;

  // Points for quantity (up to 8 skills = 10 pts)
  const quantityScore = Math.min(10, (skillCount / 8) * 10);

  // Points for breadth (up to 4 categories = 5 pts)
  const diversityScore = Math.min(5, (distinctCategories / 4) * 5);

  // Points for depth (Proficiency: Advanced/Expert)
  const advancedCount = skills.filter((s) => ['Advanced', 'Expert'].includes(s.proficiency)).length;
  const depthScore = Math.min(5, (advancedCount / 3) * 5);

  skillsScore = Math.min(20, Math.round((quantityScore + diversityScore + depthScore) * 10) / 10);

  if (skillCount < 6) {
    recommendations.push(`Add at least ${6 - skillCount} more verified technical skills across core domains.`);
  }
  if (distinctCategories < 3) {
    recommendations.push('Diversify your skill set across Frontend, Backend, Database, and CS Fundamentals.');
  }
  if (advancedCount < 2) {
    recommendations.push('Mark at least 2 primary technical skills where you have Advanced/Expert proficiency.');
  }

  // 3. DSA Problem Solving Progress (Max: 25 points)
  const dsaRecords = await DsaProgress.find({ student: studentId });
  let totalSolved = 0;
  let totalMediumHard = 0;
  let activeTopicsCount = 0;

  dsaRecords.forEach((item) => {
    totalSolved += item.solvedProblems || 0;
    totalMediumHard += (item.mediumSolved || 0) + (item.hardSolved || 0);
    if ((item.solvedProblems || 0) >= 10) {
      activeTopicsCount += 1;
    }
  });

  // Benchmark: 150 problems solved = 15 pts, 60+ med/hard = 5 pts, 8+ active topics = 5 pts
  const dsaVolumeScore = Math.min(15, (totalSolved / 150) * 15);
  const dsaDifficultyScore = Math.min(5, (totalMediumHard / 60) * 5);
  const dsaBreadthScore = Math.min(5, (activeTopicsCount / 8) * 5);

  let dsaScore = Math.min(25, Math.round((dsaVolumeScore + dsaDifficultyScore + dsaBreadthScore) * 10) / 10);

  if (totalSolved < 80) {
    recommendations.push(`Increase your DSA count: Aim for at least 100+ solved problems (currently ${totalSolved}).`);
  }
  if (totalMediumHard < 30) {
    recommendations.push('Focus on Medium and Hard difficulty problems to prepare for technical interview rounds.');
  }
  if (activeTopicsCount < 6) {
    recommendations.push('Cover foundational data structures: Dynamic Programming, Trees, Graphs, and Heaps.');
  }

  // 4. Interview Preparation (Max: 25 points)
  const prepRecords = await InterviewPrep.find({ student: studentId });
  let prepAvg = 0;
  if (prepRecords.length > 0) {
    const totalPerc = prepRecords.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    prepAvg = totalPerc / prepRecords.length;
  }
  let interviewScore = Math.min(25, Math.round(((prepAvg / 100) * 25) * 10) / 10);

  if (prepAvg < 60) {
    recommendations.push('Complete checklists in Core CS fundamentals: DBMS, Operating Systems, and Computer Networks.');
  }
  const behavioralRecord = prepRecords.find((p) => p.category === 'Behavioral Questions');
  if (!behavioralRecord || behavioralRecord.percentage < 50) {
    recommendations.push('Practice Behavioral questions using the STAR framework for HR & leadership rounds.');
  }

  // 5. Placement & Application Activity (Max: 15 points)
  const applications = await Application.find({ student: studentId });
  const appCount = applications.length;
  const inProgressCount = applications.filter((a) =>
    ['Assessment', 'Interview', 'Shortlisted', 'Selected'].includes(a.status)
  ).length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  let appScore = 0;
  if (appCount >= 1) appScore += 4;
  if (appCount >= 3) appScore += 4;
  if (inProgressCount >= 1) appScore += 4;
  if (selectedCount >= 1 || inProgressCount >= 2) appScore += 3;

  appScore = Math.min(15, appScore);

  if (appCount < 3) {
    recommendations.push('Browse open placement drives and submit at least 3 active job applications.');
  }

  // Overall Total
  const overallScore = Math.round(profileScore + skillsScore + dsaScore + interviewScore + appScore);

  let level: 'Beginning' | 'Developing' | 'Competitive' | 'Placement Ready' = 'Beginning';
  if (overallScore >= 80) {
    level = 'Placement Ready';
  } else if (overallScore >= 60) {
    level = 'Competitive';
  } else if (overallScore >= 40) {
    level = 'Developing';
  }

  return {
    overallScore,
    level,
    breakdown: {
      profile: {
        score: profileScore,
        maxScore: 15,
        percentage: Math.round((profileScore / 15) * 100),
        label: 'Profile Completion',
        details: `${Math.round((profileScore / 15) * 100)}% details provided`,
      },
      skills: {
        score: skillsScore,
        maxScore: 20,
        percentage: Math.round((skillsScore / 20) * 100),
        label: 'Technical Skills',
        details: `${skillCount} skills across ${distinctCategories} categories`,
      },
      dsa: {
        score: dsaScore,
        maxScore: 25,
        percentage: Math.round((dsaScore / 25) * 100),
        label: 'DSA Problem Solving',
        details: `${totalSolved} solved (${totalMediumHard} Med/Hard)`,
      },
      interview: {
        score: interviewScore,
        maxScore: 25,
        percentage: Math.round((interviewScore / 25) * 100),
        label: 'Interview Readiness',
        details: `${Math.round(prepAvg)}% overall prep syllabus covered`,
      },
      applications: {
        score: appScore,
        maxScore: 15,
        percentage: Math.round((appScore / 15) * 100),
        label: 'Application Activity',
        details: `${appCount} applications (${inProgressCount} active rounds)`,
      },
    },
    recommendations: recommendations.slice(0, 5), // Top 5 actionable improvements
  };
};
