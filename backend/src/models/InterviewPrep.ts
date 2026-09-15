import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IChecklistItem {
  title: string;
  completed: boolean;
}

export interface IInterviewPrep extends Document {
  student: mongoose.Types.ObjectId;
  category: string;
  checklist: IChecklistItem[];
  percentage: number;
  notes?: string;
  lastUpdated: Date;
}

export const INTERVIEW_DEFAULT_CATEGORIES: { category: string; items: string[] }[] = [
  {
    category: 'DSA',
    items: [
      'Time and Space Complexity Analysis (Big-O)',
      'Two Pointer & Sliding Window Techniques',
      'Binary Search & Variations',
      'Recursion & Backtracking (Subsets, Permutations)',
      'Tree Traversals (BFS, DFS, Lowest Common Ancestor)',
      'Graph Algorithms (Dijkstra, Topological Sort, Disjoint Set)',
      'Dynamic Programming (Knapsack, LCS, LIS, Interval DP)',
    ],
  },
  {
    category: 'OOP',
    items: [
      'Encapsulation, Abstraction, Inheritance, Polymorphism',
      'Static vs Dynamic Binding',
      'Interface vs Abstract Class',
      'SOLID Principles with Real-world Examples',
      'Design Patterns (Singleton, Factory, Observer)',
      'Garbage Collection & Memory Management',
    ],
  },
  {
    category: 'DBMS',
    items: [
      'ACID Properties & Transaction States',
      'Database Normalization (1NF, 2NF, 3NF, BCNF)',
      'Indexing & B-Tree / B+ Tree internals',
      'SQL Joins, Group By, Having, Aggregate functions',
      'Transactions, Locks, Concurrency Control, Deadlocks',
      'NoSQL vs Relational Databases (CAP Theorem)',
    ],
  },
  {
    category: 'Operating Systems',
    items: [
      'Process vs Thread & Process Lifecycle',
      'CPU Scheduling Algorithms (FCFS, SJF, Round Robin)',
      'Process Synchronization (Mutex, Semaphores, Critical Section)',
      'Deadlock Conditions, Prevention, Avoidance (Banker Algorithm)',
      'Virtual Memory, Paging, Page Replacement (LRU, FIFO)',
      'System Calls & Inter-Process Communication (IPC)',
    ],
  },
  {
    category: 'Computer Networks',
    items: [
      'OSI 7-Layer Model vs TCP/IP Model',
      'TCP 3-Way Handshake & Connection Teardown',
      'TCP vs UDP (Flow Control, Congestion Control)',
      'HTTP / HTTPS & SSL/TLS Handshake',
      'DNS Resolution Process',
      'IP Addressing, Subnetting & Routing protocols',
      'WebSockets, REST APIs, Cookies vs LocalStorage',
    ],
  },
  {
    category: 'SQL',
    items: [
      'Writing Complex Subqueries and CTEs',
      'Window Functions (ROW_NUMBER, RANK, DENSE_RANK)',
      'Optimizing Slow Queries & Analyzing EXPLAIN plans',
      'Database Constraints & Cascading rules',
      'Stored Procedures, Triggers, and Views',
    ],
  },
  {
    category: 'Aptitude',
    items: [
      'Quantitative: Percentages, Profit & Loss, Ratios',
      'Time, Speed & Distance / Time & Work',
      'Permutations, Combinations & Probability',
      'Logical Reasoning: Seating Arrangements, Blood Relations',
      'Data Interpretation: Bar charts, Pie charts, Tables',
    ],
  },
  {
    category: 'HR',
    items: [
      'Tell Me About Yourself (Elevator Pitch)',
      'Why This Company? & Why Should We Hire You?',
      'Strengths and Weaknesses with Improvement Examples',
      'Handling Conflict in a Team or Disagreement with Peers',
      '5-Year Career Vision & Aspirations',
    ],
  },
  {
    category: 'Behavioral Questions',
    items: [
      'STAR Method Mastery (Situation, Task, Action, Result)',
      'Describe a challenging project you overcame',
      'A time you failed or missed a deadline and how you resolved it',
      'Prioritizing under strict deadlines or changing requirements',
      'Collaborating with a difficult teammate or cross-functional team',
    ],
  },
  {
    category: 'Mock Interview',
    items: [
      'Peer Mock Technical Round (DSA + Problem Solving)',
      'CS Fundamentals Rapid Fire Review',
      'System Design / Architecture Basics Discussion',
      'Resume Walkthrough & Deep-dive into projects',
      'Behavioral & Managerial Round Simulation',
    ],
  },
];

const checklistItemSchema = new Schema<IChecklistItem>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const interviewPrepSchema = new Schema<IInterviewPrep>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    checklist: [checklistItemSchema],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

interviewPrepSchema.index({ student: 1, category: 1 }, { unique: true });

export const InterviewPrep: Model<IInterviewPrep> = mongoose.model<IInterviewPrep>('InterviewPrep', interviewPrepSchema);
