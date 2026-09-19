import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { StudentSkill } from '../models/StudentSkill';
import { Opportunity } from '../models/Opportunity';
import { Application } from '../models/Application';
import { DsaProgress, DSA_DEFAULT_TOPICS } from '../models/DsaProgress';
import { InterviewPrep, INTERVIEW_DEFAULT_CATEGORIES } from '../models/InterviewPrep';
import { SEED_SKILLS, SEED_OPPORTUNITIES } from './seedData';

export const runSeed = async (silent = false): Promise<void> => {
  const log = (...args: any[]) => {
    if (!silent) console.log(...args);
  };

  log('==================================================');
  log('   CareerGraph Database Seeding Starting...      ');
  log('==================================================');

  // 1. Clear existing collections to guarantee clean demo environment
  await User.deleteMany({});
  await Skill.deleteMany({});
  await StudentSkill.deleteMany({});
  await Opportunity.deleteMany({});
  await Application.deleteMany({});
  await DsaProgress.deleteMany({});
  await InterviewPrep.deleteMany({});

  log(' Cleaned existing records.');

  // 2. Insert master skills catalog
  await Skill.insertMany(SEED_SKILLS);
  log(` Seeded ${SEED_SKILLS.length} master skills across 6 technical domains.`);

  // 3. Create Admin Account
  const admin = await User.create({
    name: 'Placement Officer Admin',
    email: 'admin@careergraph.dev',
    password: 'Admin@123456',
    role: 'admin',
    phone: '+91 98765 43210',
    college: 'National Institute of Technology (NIT)',
    degree: 'Training & Placement Directorate',
    graduationYear: 2020,
    bio: 'Chief Placement Officer overseeing campus recruitment drives and student preparation.',
  });
  log(` Created Admin: ${admin.email}`);

  // 4. Create Demo Student 1: Rahul Sharma (Placement Ready: ~82%)
  const rahul = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    password: 'Student@123456',
    role: 'student',
    phone: '+91 98111 22334',
    college: 'National Institute of Technology (NIT)',
    degree: 'B.Tech in Computer Science and Engineering',
    graduationYear: 2026,
    bio: 'Final-year CS student passionate about backend systems, distributed databases, and high-performance APIs. LeetCode 350+ solved.',
    githubUrl: 'https://github.com/rahul-sharma-demo',
    linkedinUrl: 'https://linkedin.com/in/rahul-sharma-demo',
    resumeUrl: 'https://careergraph.dev/resumes/rahul-sharma-cv.pdf',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
  });

  // Rahul's Skills
  const rahulSkills = [
    { name: 'Java', category: 'Programming', proficiency: 'Advanced' as const },
    { name: 'C++', category: 'Programming', proficiency: 'Advanced' as const },
    { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Expert' as const },
    { name: 'Spring Boot', category: 'Backend', proficiency: 'Intermediate' as const },
    { name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Advanced' as const },
    { name: 'Operating Systems', category: 'CS Fundamentals', proficiency: 'Intermediate' as const },
    { name: 'Computer Networks', category: 'CS Fundamentals', proficiency: 'Advanced' as const },
    { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Advanced' as const },
  ];
  await StudentSkill.insertMany(rahulSkills.map((s) => ({ ...s, student: rahul._id })));

  // Rahul's DSA Progress (Strong: 165 problems solved)
  const rahulDsa = [
    { topic: 'Arrays', totalProblems: 50, solvedProblems: 32, easySolved: 12, mediumSolved: 16, hardSolved: 4 },
    { topic: 'Strings', totalProblems: 40, solvedProblems: 24, easySolved: 10, mediumSolved: 12, hardSolved: 2 },
    { topic: 'Linked Lists', totalProblems: 30, solvedProblems: 18, easySolved: 8, mediumSolved: 8, hardSolved: 2 },
    { topic: 'Stack', totalProblems: 25, solvedProblems: 15, easySolved: 6, mediumSolved: 7, hardSolved: 2 },
    { topic: 'Queue', totalProblems: 20, solvedProblems: 12, easySolved: 5, mediumSolved: 6, hardSolved: 1 },
    { topic: 'Hashing', totalProblems: 30, solvedProblems: 18, easySolved: 8, mediumSolved: 8, hardSolved: 2 },
    { topic: 'Recursion', totalProblems: 25, solvedProblems: 14, easySolved: 5, mediumSolved: 7, hardSolved: 2 },
    { topic: 'Sorting', totalProblems: 25, solvedProblems: 15, easySolved: 7, mediumSolved: 6, hardSolved: 2 },
    { topic: 'Searching', totalProblems: 20, solvedProblems: 12, easySolved: 5, mediumSolved: 6, hardSolved: 1 },
    { topic: 'Trees', totalProblems: 45, solvedProblems: 25, easySolved: 8, mediumSolved: 14, hardSolved: 3 },
    { topic: 'Graphs', totalProblems: 40, solvedProblems: 20, easySolved: 5, mediumSolved: 11, hardSolved: 4 },
    { topic: 'Dynamic Programming', totalProblems: 50, solvedProblems: 20, easySolved: 4, mediumSolved: 12, hardSolved: 4 },
  ];
  await DsaProgress.insertMany(rahulDsa.map((d) => ({ ...d, student: rahul._id })));

  // Rahul's Interview Prep (High progress)
  const rahulPrep = INTERVIEW_DEFAULT_CATEGORIES.map((cat, idx) => {
    // Rahul has completed most items in CS, OOP, DBMS, OS
    const markCompleted = idx < 6;
    const checklist = cat.items.map((item, itemIdx) => ({
      title: item,
      completed: markCompleted || itemIdx % 2 === 0,
    }));
    const completedCount = checklist.filter((i) => i.completed).length;
    return {
      student: rahul._id,
      category: cat.category,
      checklist,
      percentage: Math.round((completedCount / checklist.length) * 100),
      notes: `Reviewed prior mock questions for ${cat.category}.`,
    };
  });
  await InterviewPrep.insertMany(rahulPrep);

  // 5. Create Demo Student 2: Priya Patel (Developing/Competitive: ~58%)
  const priya = await User.create({
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    password: 'Student@123456',
    role: 'student',
    phone: '+91 98222 33445',
    college: 'Government Engineering College',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    bio: 'Full-stack web enthusiast with experience in React, Node.js, and modern UI/UX design. Building responsive applications.',
    githubUrl: 'https://github.com/priya-patel-demo',
    linkedinUrl: 'https://linkedin.com/in/priya-patel-demo',
    resumeUrl: 'https://careergraph.dev/resumes/priya-patel-cv.pdf',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  });

  const priyaSkills = [
    { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced' as const },
    { name: 'React.js', category: 'Frontend', proficiency: 'Advanced' as const },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Expert' as const },
    { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' as const },
    { name: 'MongoDB', category: 'Database', proficiency: 'Intermediate' as const },
    { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Intermediate' as const },
  ];
  await StudentSkill.insertMany(priyaSkills.map((s) => ({ ...s, student: priya._id })));

  const priyaDsa = DSA_DEFAULT_TOPICS.map((t, idx) => ({
    student: priya._id,
    topic: t.topic,
    totalProblems: t.totalProblems,
    solvedProblems: idx < 6 ? 12 : 5,
    easySolved: idx < 6 ? 8 : 4,
    mediumSolved: idx < 6 ? 4 : 1,
    hardSolved: 0,
  }));
  await DsaProgress.insertMany(priyaDsa);

  const priyaPrep = INTERVIEW_DEFAULT_CATEGORIES.map((cat, idx) => {
    const checklist = cat.items.map((item, itemIdx) => ({
      title: item,
      completed: idx < 4 && itemIdx < 3,
    }));
    const completedCount = checklist.filter((i) => i.completed).length;
    return {
      student: priya._id,
      category: cat.category,
      checklist,
      percentage: Math.round((completedCount / checklist.length) * 100),
    };
  });
  await InterviewPrep.insertMany(priyaPrep);

  // 6. Create Demo Student 3: Amit Verma (Beginning: ~28%)
  const amit = await User.create({
    name: 'Amit Verma',
    email: 'amit.verma@college.edu',
    password: 'Student@123456',
    role: 'student',
    phone: '+91 98333 44556',
    college: 'City Institute of Engineering',
    degree: 'B.Tech in Electronics & Communication',
    graduationYear: 2026,
    bio: 'ECE undergraduate transitioning to software engineering. Currently learning C++ and problem solving fundamentals.',
  });

  const amitSkills = [
    { name: 'C++', category: 'Programming', proficiency: 'Intermediate' as const },
    { name: 'Python', category: 'Programming', proficiency: 'Beginner' as const },
    { name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Beginner' as const },
  ];
  await StudentSkill.insertMany(amitSkills.map((s) => ({ ...s, student: amit._id })));

  const amitDsa = DSA_DEFAULT_TOPICS.map((t, idx) => ({
    student: amit._id,
    topic: t.topic,
    totalProblems: t.totalProblems,
    solvedProblems: idx < 3 ? 8 : 0,
    easySolved: idx < 3 ? 6 : 0,
    mediumSolved: idx < 3 ? 2 : 0,
    hardSolved: 0,
  }));
  await DsaProgress.insertMany(amitDsa);

  const amitPrep = INTERVIEW_DEFAULT_CATEGORIES.map((cat) => ({
    student: amit._id,
    category: cat.category,
    checklist: cat.items.map((item) => ({ title: item, completed: false })),
    percentage: 0,
  }));
  await InterviewPrep.insertMany(amitPrep);

  log(' Seeded 3 Demo Students with varying career readiness profiles.');

  // 7. Insert Opportunities
  const insertedOpportunities = await Opportunity.insertMany(SEED_OPPORTUNITIES);
  log(` Seeded ${insertedOpportunities.length} Placement Opportunities.`);

  // 8. Create Realistic Applications
  // Rahul: 4 applications
  await Application.create({
    student: rahul._id,
    opportunity: insertedOpportunities[0]._id, // Nexus Infotech
    status: 'Interview',
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: 'Technical round 1 cleared. Scheduled for System Architecture & Core CS interview.',
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assessmentScore: '92/100',
  });

  await Application.create({
    student: rahul._id,
    opportunity: insertedOpportunities[2]._id, // FinEdge Systems
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    notes: 'Online Coding Test cleared with full score on both questions.',
    assessmentScore: '100/100',
  });

  await Application.create({
    student: rahul._id,
    opportunity: insertedOpportunities[1]._id, // CloudScale Labs
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Submitted resume via campus drive portal.',
  });

  await Application.create({
    student: rahul._id,
    opportunity: insertedOpportunities[6]._id, // Velocity AI Labs
    status: 'Saved',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Reviewing requirements for AI pre-placement test.',
  });

  // Priya: 3 applications
  await Application.create({
    student: priya._id,
    opportunity: insertedOpportunities[4]._id, // AppSphere Mobile & Web
    status: 'Assessment',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: 'Frontend UI Take-home challenge in progress.',
  });

  await Application.create({
    student: priya._id,
    opportunity: insertedOpportunities[7]._id, // ZetaFlow Enterprise
    status: 'Selected',
    appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    notes: 'Offer letter received! Package: 8.5 LPA Full-time SDE.',
    assessmentScore: '88/100',
  });

  await Application.create({
    student: priya._id,
    opportunity: insertedOpportunities[3]._id, // DataPulse Analytics
    status: 'Applied',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  });

  // Amit: 1 application
  await Application.create({
    student: amit._id,
    opportunity: insertedOpportunities[7]._id, // ZetaFlow
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'First application submitted on campus portal.',
  });

  // 9. Create Lecturer Account: Dr. Ananya Iyer (Department Faculty & Career Mentor)
  const lecturer = await User.create({
    name: 'Dr. Ananya Iyer',
    email: 'faculty@college.edu',
    password: 'Faculty@123456',
    role: 'lecturer',
    phone: '+91 98444 55667',
    college: 'National Institute of Technology (NIT)',
    degree: 'Department of Computer Science & Engineering',
    graduationYear: 2012,
    bio: 'Associate Professor & Academic Career Mentor. Overseeing student technical tracks and curriculum alignment with hiring standards.',
  });
  log(` Created Lecturer: ${lecturer.email}`);

  // 10. Create Industry Recruiter Account: Vikram Malhotra (Campus Recruiter)
  const recruiter = await User.create({
    name: 'Vikram Malhotra',
    email: 'recruiter@techcorp.com',
    password: 'Industry@123456',
    role: 'industry',
    phone: '+91 98555 66778',
    college: 'Nexus Infotech Hiring Division',
    degree: 'Talent Acquisition & University Relations',
    graduationYear: 2016,
    bio: 'Lead Campus Recruiter for Nexus Infotech & FinEdge Systems. Hiring top engineering talent for SDE and cloud infrastructure roles.',
  });
  log(` Created Industry Recruiter: ${recruiter.email}`);

  // 11. Create Alumni Account: Sneha Rao (Alumni Mentor & SDE-2 at Microsoft)
  const alumni = await User.create({
    name: 'Sneha Rao',
    email: 'alumni@college.edu',
    password: 'Alumni@123456',
    role: 'alumni',
    phone: '+91 98666 77889',
    college: 'National Institute of Technology (NIT)',
    degree: 'B.Tech in Computer Science (Batch of 2024)',
    graduationYear: 2024,
    bio: 'Software Engineer at Microsoft, CareerGraph Mentor. Helping juniors crack DSA rounds, system design, and mock interviews.',
    githubUrl: 'https://github.com/sneha-rao-alumni',
    linkedinUrl: 'https://linkedin.com/in/sneha-rao-alumni',
  });
  log(` Created Alumni Mentor: ${alumni.email}`);

  log(' Seeded realistic application histories with varied statuses.');
  log('==================================================');
  log('   SEEDING COMPLETE - DEMO CREDENTIALS:           ');
  log('==================================================');
  log(' [ADMIN]    admin@careergraph.dev       | Admin@123456');
  log(' [LECTURER] faculty@college.edu         | Faculty@123456');
  log(' [INDUSTRY] recruiter@techcorp.com      | Industry@123456');
  log(' [ALUMNI]   alumni@college.edu          | Alumni@123456');
  log(' [STUDENT]  rahul.sharma@college.edu    | Student@123456 (High Readiness ~82%)');
  log(' [STUDENT]  priya.patel@college.edu     | Student@123456 (Moderate Readiness ~58%)');
  log(' [STUDENT]  amit.verma@college.edu      | Student@123456 (Beginner Readiness ~28%)');
  log('==================================================');
};

// ============================================================================
// Safe Idempotent Demo Seeding (Runs on every server start)
// Does NOT delete real users, does NOT duplicate data, ensures valid demo logins
// ============================================================================
export const DEMO_ACCOUNTS_CONFIG = [
  {
    name: 'Placement Officer Admin',
    email: 'admin@careergraph.dev',
    password: 'Admin@123456',
    role: 'admin' as const,
    phone: '+91 98765 43210',
    college: 'National Institute of Technology (NIT)',
    degree: 'Training & Placement Directorate',
    graduationYear: 2020,
    bio: 'Chief Placement Officer overseeing campus recruitment drives and student preparation.',
  },
  {
    name: 'Vikram Malhotra',
    email: 'recruiter@techcorp.com',
    password: 'Industry@123456',
    role: 'industry' as const,
    phone: '+91 98555 66778',
    college: 'Nexus Infotech Hiring Division',
    degree: 'Talent Acquisition & University Relations',
    graduationYear: 2016,
    bio: 'Lead Campus Recruiter for Nexus Infotech & FinEdge Systems. Hiring top engineering talent for SDE and cloud infrastructure roles.',
  },
  {
    name: 'Dr. Ananya Iyer',
    email: 'faculty@college.edu',
    password: 'Faculty@123456',
    role: 'lecturer' as const,
    phone: '+91 98444 55667',
    college: 'National Institute of Technology (NIT)',
    degree: 'Department of Computer Science & Engineering',
    graduationYear: 2012,
    bio: 'Associate Professor & Academic Career Mentor. Overseeing student technical tracks and curriculum alignment with hiring standards.',
  },
  {
    name: 'Sneha Rao',
    email: 'alumni@college.edu',
    password: 'Alumni@123456',
    role: 'alumni' as const,
    phone: '+91 98666 77889',
    college: 'National Institute of Technology (NIT)',
    degree: 'B.Tech in Computer Science (Batch of 2024)',
    graduationYear: 2024,
    bio: 'Software Engineer at Microsoft, CareerGraph Mentor. Helping juniors crack DSA rounds, system design, and mock interviews.',
    githubUrl: 'https://github.com/sneha-rao-alumni',
    linkedinUrl: 'https://linkedin.com/in/sneha-rao-alumni',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    password: 'Student@123456',
    role: 'student' as const,
    phone: '+91 98111 22334',
    college: 'National Institute of Technology (NIT)',
    degree: 'B.Tech in Computer Science and Engineering',
    graduationYear: 2026,
    bio: 'Final-year CS student passionate about backend systems, distributed databases, and high-performance APIs. LeetCode 350+ solved.',
    githubUrl: 'https://github.com/rahul-sharma-demo',
    linkedinUrl: 'https://linkedin.com/in/rahul-sharma-demo',
    resumeUrl: 'https://careergraph.dev/resumes/rahul-sharma-cv.pdf',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    password: 'Student@123456',
    role: 'student' as const,
    phone: '+91 98222 33445',
    college: 'Government Engineering College',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    bio: 'Full-stack web enthusiast with experience in React, Node.js, and modern UI/UX design. Building responsive applications.',
    githubUrl: 'https://github.com/priya-patel-demo',
    linkedinUrl: 'https://linkedin.com/in/priya-patel-demo',
    resumeUrl: 'https://careergraph.dev/resumes/priya-patel-cv.pdf',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@college.edu',
    password: 'Student@123456',
    role: 'student' as const,
    phone: '+91 98333 44556',
    college: 'City Institute of Engineering',
    degree: 'B.Tech in Electronics & Communication',
    graduationYear: 2026,
    bio: 'ECE undergraduate transitioning to software engineering. Currently learning C++ and problem solving fundamentals.',
  },
];

export const ensureDemoData = async (): Promise<void> => {
  console.log('[Init] Verifying platform catalog and demo accounts...');

  // 1. Ensure master skills catalog exists
  const skillsCount = await Skill.countDocuments();
  if (skillsCount === 0) {
    await Skill.insertMany(SEED_SKILLS);
    console.log(`[Init] Seeded ${SEED_SKILLS.length} master skills.`);
  }

  // 2. Ensure placement opportunities exist
  const oppCount = await Opportunity.countDocuments();
  let availableOpps: any[] = [];
  if (oppCount === 0) {
    availableOpps = await Opportunity.insertMany(SEED_OPPORTUNITIES);
    console.log(`[Init] Seeded ${availableOpps.length} placement opportunities.`);
  } else {
    availableOpps = await Opportunity.find().limit(8);
  }

  // 3. Ensure all 7 demo accounts exist with correct passwords and roles
  const userMap: Record<string, any> = {};

  for (const demo of DEMO_ACCOUNTS_CONFIG) {
    let user = await User.findOne({ email: demo.email.toLowerCase() }).select('+password');

    if (!user) {
      user = await User.create({
        name: demo.name,
        email: demo.email.toLowerCase(),
        password: demo.password, // hashed automatically by pre('save')
        role: demo.role,
        phone: demo.phone,
        college: demo.college,
        degree: demo.degree,
        graduationYear: demo.graduationYear,
        bio: demo.bio,
        profilePhoto: demo.profilePhoto,
        githubUrl: demo.githubUrl,
        linkedinUrl: demo.linkedinUrl,
        resumeUrl: demo.resumeUrl,
      });
      console.log(`[Init] Created missing demo account: ${demo.role} (${demo.email})`);
    } else {
      // Validate password and role
      const isPassValid = await user.comparePassword(demo.password);
      let needsSave = false;

      if (!isPassValid) {
        user.password = demo.password; // pre('save') hook re-hashes it
        needsSave = true;
      }
      if (user.role !== demo.role) {
        user.role = demo.role;
        needsSave = true;
      }
      if (demo.college && !user.college) {
        user.college = demo.college;
        needsSave = true;
      }
      if (demo.degree && !user.degree) {
        user.degree = demo.degree;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
        console.log(`[Init] Synchronized demo account credentials: ${demo.role} (${demo.email})`);
      }
    }

    userMap[demo.email.toLowerCase()] = user;

    // Ensure student/alumni tracking baseline docs exist
    if (user.role === 'student' || user.role === 'alumni') {
      const dsaCount = await DsaProgress.countDocuments({ student: user._id });
      if (dsaCount === 0) {
        const dsaDocs = DSA_DEFAULT_TOPICS.map((item) => ({
          student: user._id,
          topic: item.topic,
          totalProblems: item.totalProblems,
          solvedProblems: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
        }));
        await DsaProgress.insertMany(dsaDocs);
      }

      const prepCount = await InterviewPrep.countDocuments({ student: user._id });
      if (prepCount === 0) {
        const prepDocs = INTERVIEW_DEFAULT_CATEGORIES.map((cat) => ({
          student: user._id,
          category: cat.category,
          checklist: cat.items.map((item) => ({ title: item, completed: false })),
          percentage: 0,
        }));
        await InterviewPrep.insertMany(prepDocs);
      }
    }
  }

  // 4. Ensure Rahul Sharma has realistic demo skills and progress (~82% readiness)
  const rahul = userMap['rahul.sharma@college.edu'];
  if (rahul) {
    const rahulSkillCount = await StudentSkill.countDocuments({ student: rahul._id });
    if (rahulSkillCount === 0) {
      const rahulSkills = [
        { name: 'Java', category: 'Programming', proficiency: 'Advanced' as const },
        { name: 'C++', category: 'Programming', proficiency: 'Advanced' as const },
        { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Expert' as const },
        { name: 'Spring Boot', category: 'Backend', proficiency: 'Intermediate' as const },
        { name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Advanced' as const },
        { name: 'Operating Systems', category: 'CS Fundamentals', proficiency: 'Intermediate' as const },
        { name: 'Computer Networks', category: 'CS Fundamentals', proficiency: 'Advanced' as const },
        { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Advanced' as const },
      ];
      await StudentSkill.insertMany(rahulSkills.map((s) => ({ ...s, student: rahul._id })));

      await DsaProgress.deleteMany({ student: rahul._id });
      const rahulDsa = [
        { topic: 'Arrays', totalProblems: 50, solvedProblems: 32, easySolved: 12, mediumSolved: 16, hardSolved: 4 },
        { topic: 'Strings', totalProblems: 40, solvedProblems: 24, easySolved: 10, mediumSolved: 12, hardSolved: 2 },
        { topic: 'Linked Lists', totalProblems: 30, solvedProblems: 18, easySolved: 8, mediumSolved: 8, hardSolved: 2 },
        { topic: 'Stack', totalProblems: 25, solvedProblems: 15, easySolved: 6, mediumSolved: 7, hardSolved: 2 },
        { topic: 'Queue', totalProblems: 20, solvedProblems: 12, easySolved: 5, mediumSolved: 6, hardSolved: 1 },
        { topic: 'Hashing', totalProblems: 30, solvedProblems: 18, easySolved: 8, mediumSolved: 8, hardSolved: 2 },
        { topic: 'Recursion', totalProblems: 25, solvedProblems: 14, easySolved: 5, mediumSolved: 7, hardSolved: 2 },
        { topic: 'Sorting', totalProblems: 25, solvedProblems: 15, easySolved: 7, mediumSolved: 6, hardSolved: 2 },
        { topic: 'Searching', totalProblems: 20, solvedProblems: 12, easySolved: 5, mediumSolved: 6, hardSolved: 1 },
        { topic: 'Trees', totalProblems: 45, solvedProblems: 25, easySolved: 8, mediumSolved: 14, hardSolved: 3 },
        { topic: 'Graphs', totalProblems: 40, solvedProblems: 20, easySolved: 5, mediumSolved: 11, hardSolved: 4 },
        { topic: 'Dynamic Programming', totalProblems: 50, solvedProblems: 20, easySolved: 4, mediumSolved: 12, hardSolved: 4 },
      ];
      await DsaProgress.insertMany(rahulDsa.map((d) => ({ ...d, student: rahul._id })));

      await InterviewPrep.deleteMany({ student: rahul._id });
      const rahulPrep = INTERVIEW_DEFAULT_CATEGORIES.map((cat, idx) => {
        const markCompleted = idx < 6;
        const checklist = cat.items.map((item, itemIdx) => ({
          title: item,
          completed: markCompleted || itemIdx % 2 === 0,
        }));
        const completedCount = checklist.filter((i) => i.completed).length;
        return {
          student: rahul._id,
          category: cat.category,
          checklist,
          percentage: Math.round((completedCount / checklist.length) * 100),
          notes: `Reviewed prior mock questions for ${cat.category}.`,
        };
      });
      await InterviewPrep.insertMany(rahulPrep);
    }
  }

  // 5. Ensure Priya Patel has realistic skills (~58% readiness)
  const priya = userMap['priya.patel@college.edu'];
  if (priya) {
    const priyaSkillCount = await StudentSkill.countDocuments({ student: priya._id });
    if (priyaSkillCount === 0) {
      const priyaSkills = [
        { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced' as const },
        { name: 'React.js', category: 'Frontend', proficiency: 'Advanced' as const },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Expert' as const },
        { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' as const },
        { name: 'MongoDB', category: 'Database', proficiency: 'Intermediate' as const },
        { name: 'Git & GitHub', category: 'Tools & DevOps', proficiency: 'Intermediate' as const },
      ];
      await StudentSkill.insertMany(priyaSkills.map((s) => ({ ...s, student: priya._id })));

      await DsaProgress.deleteMany({ student: priya._id });
      const priyaDsa = DSA_DEFAULT_TOPICS.map((t, idx) => ({
        student: priya._id,
        topic: t.topic,
        totalProblems: t.totalProblems,
        solvedProblems: idx < 6 ? 12 : 5,
        easySolved: idx < 6 ? 8 : 4,
        mediumSolved: idx < 6 ? 4 : 1,
        hardSolved: 0,
      }));
      await DsaProgress.insertMany(priyaDsa);
    }
  }

  // 6. Ensure demo applications exist if total applications count is 0
  const totalApps = await Application.countDocuments();
  if (totalApps === 0 && availableOpps.length >= 4 && rahul && priya) {
    await Application.create({
      student: rahul._id,
      opportunity: availableOpps[0]._id,
      status: 'Interview',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      notes: 'Technical round 1 cleared. Scheduled for System Architecture & Core CS interview.',
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assessmentScore: '92/100',
    });
    await Application.create({
      student: rahul._id,
      opportunity: availableOpps[2]._id,
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      notes: 'Online Coding Test cleared with full score on both questions.',
      assessmentScore: '100/100',
    });
    await Application.create({
      student: priya._id,
      opportunity: availableOpps[1]._id,
      status: 'Assessment',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Frontend UI Take-home challenge in progress.',
    });
    console.log('[Init] Seeded baseline candidate applications.');
  }

  console.log('[Init] Demo environment verification complete.');
};

// Standalone execution handler
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await runSeed(false);
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}
