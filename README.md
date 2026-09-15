# CareerGraph 🎓📈

> **A Full-Stack Placement & Skill Management Platform for Engineering Students and College Placement Cells.**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v6-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Summary

**CareerGraph** is a comprehensive, production-grade placement preparation and management ecosystem built to bridge the gap between college engineering students and on-campus recruitment directorates.

Unlike generic job portals or superficial trackers, CareerGraph introduces a **transparent, rule-based Career Readiness Score (0–100%)** that evaluates candidate profile completion, technical skill breadth and depth, DSA problem-solving volume across 12 core data structures, CS fundamentals readiness, and active application pipeline velocity.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Smart Career Readiness Score**: Transparent 0–100% calculation weighted across Profile Completion (15%), Technical Skills (20%), DSA Practice (25%), Interview Prep (25%), and Placement Pipeline Activity (15%). Includes actionable recommendations on how to advance between tiers (*Beginning*, *Developing*, *Competitive*, *Placement Ready*).
- **DSA Preparation Tracker**: Granular milestone tracking across 12 foundational computer science topics (Arrays, Strings, Linked Lists, Stack, Queue, Hashing, Recursion, Sorting, Searching, Trees, Graphs, Dynamic Programming) with Easy, Medium, Hard problem counters and personal notes.
- **Core CS & Behavioral Interview Prep**: Interactive checklists covering 10 structured disciplines: DSA, OOP, DBMS, Operating Systems, Computer Networks, SQL, Aptitude, HR Questions, STAR Behavioral Answers, and Mock Technical Interviews.
- **Technical Skills Inventory**: Categorize proficiencies (*Beginner*, *Intermediate*, *Advanced*, *Expert*) across Programming, Frontend, Backend, Database, CS Fundamentals, and Tools & DevOps.
- **Placement Drives Directory**: Live search, filtering by job type (*Full-time*, *Internship*, *Intern + PPO*), salary packages (CTC), location, and application deadline countdowns.
- **Application Pipeline Tracker**: Stage-by-stage progression tracker (*Saved*, *Applied*, *Assessment*, *Interview*, *Shortlisted*, *Selected*, *Rejected*) with interview dates and personal progress notes.

### 🛡️ For University Placement Officers & Admins
- **Placement Directorate Dashboard**: High-level telemetry displaying total candidate enrollment, active drives, total applications, selection rates, average DSA problem-solving count, and interview syllabus coverage.
- **Recruitment Funnel & Skill Analytics**: Interactive data visualizations featuring pipeline stage conversions (Recharts Bar Charts) and batch skill supply vs. industry demand distributions.
- **Student Candidate Directory**: Searchable directory with live readiness score badges, profile dossiers, and detailed preparation inspection.
- **Placement Drive Management**: Full CRUD capabilities to publish, update, and manage on-campus recruitment drives with customizable eligibility criteria, salary brackets, and required skills.
- **Application Evaluation & Status Updates**: Advance students through test and interview rounds, schedule assessment dates, and log official administrative feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios |
| **Backend** | Node.js, Express.js, TypeScript, ts-node-dev |
| **Database** | MongoDB & Mongoose *(with auto-fallback to in-memory MongoDB for instant offline demo)* |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (Salt rounds: 10), Role-based authorization middleware |
| **Architecture** | Clean Layered REST Architecture (Controllers, Services, Models, Routes, Middleware) |

---

## 📐 Architecture & System Design

```
CareerGraph/
├── package.json               # Root orchestrator scripts (dev, build, seed)
├── .env.example               # Environment variable specification
├── README.md                  # Comprehensive documentation
├── backend/
│   ├── src/
│   │   ├── config/            # Database connection & ENV configuration
│   │   ├── models/            # Mongoose Schemas (User, Skill, Opportunity, Application, DsaProgress, InterviewPrep)
│   │   ├── middleware/        # JWT Authentication, Role Authorization, Input Validation, Error Handling
│   │   ├── controllers/       # Modular Express route controllers
│   │   ├── services/          # Transparent Rule-Based Career Readiness Engine
│   │   ├── routes/            # REST API route endpoints (/api/*)
│   │   ├── utils/             # Seed data scripts & verification test suite
│   │   ├── app.ts             # Express application configuration
│   │   └── server.ts          # Server bootstrap & self-healing auto-seed
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/            # Static media and SVG icons
    │   ├── components/        # Reusable UI widgets (ReadinessGauge, StatCard, Badge, Modal, Navbar, Sidebar)
    │   ├── context/           # AuthContext (JWT persistence, role state, session refresh)
    │   ├── pages/
    │   │   ├── public/        # LandingPage, LoginPage, RegisterPage
    │   │   ├── student/       # StudentDashboard, Profile, Skills, DSA, Interview Prep, Opportunities, Applications
    │   │   └── admin/         # AdminDashboard, ManageStudents, ManageOpportunities, ManageApplications, Analytics
    │   ├── services/          # Typed Axios REST API client
    │   ├── types/             # Shared TypeScript models & interfaces
    │   ├── App.tsx            # Protected client-side routing
    │   └── main.tsx           # React DOM bootstrap
    └── package.json
```

---

## 🔐 Authentication & Security Features

- **Passwords**: Never stored in plain text; salted and hashed with `bcryptjs`.
- **Stateless Tokens**: Signed JWT tokens verifying role privileges (`student` vs. `admin`).
- **Route Protection**: Backend endpoints strictly guarded with `protect` and `authorize('admin')` middleware; frontend guarded with `<ProtectedRoute allowedRole="...">`.
- **CORS & Input Validation**: Explicit CORS origins and `express-validator` schema validation on all mutation endpoints.
- **Safe Secrets Handling**: No secrets committed to git; template variables provided in `.env.example`.
- **Graceful Error Sanitization**: Centralized error middleware prevents database error internals or call stacks from leaking to clients in production.

---

## 🎯 Rule-Based Career Readiness Score Algorithm

Unlike ambiguous "AI scores", CareerGraph calculates an objective, explainable score out of 100 points:

$$\text{Readiness Score} = \text{Profile} (15) + \text{Skills} (20) + \text{DSA} (25) + \text{Interview Prep} (25) + \text{Applications} (15)$$

1. **Profile Completeness (Max 15 pts)**: Contact details, college, major, resume URL, GitHub repository, and LinkedIn profile.
2. **Technical Skills (Max 20 pts)**: Points awarded for skill volume (up to 8 verified skills), domain diversity across categories, and proficiency weighting (*Advanced/Expert* multiplier).
3. **DSA Mastery (Max 25 pts)**: Solved problem volume (benchmark 150+ problems), difficulty weighting (Medium/Hard problem ratio), and breadth across 12 algorithmic topics.
4. **Interview Syllabus Coverage (Max 25 pts)**: Completion ratio across the 10 Core CS and behavioral checklist modules.
5. **Application Velocity (Max 15 pts)**: Active recruitment drives applied to, assessments cleared, and interview shortlists achieved.

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- *(Optional)* **MongoDB**: Local MongoDB daemon or MongoDB Atlas connection string. If MongoDB is not installed locally, CareerGraph automatically boots an embedded in-memory MongoDB in development mode!

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/CareerGraph.git
cd CareerGraph

# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Configure Environment Variables

```bash
# Copy example configuration for backend
cp backend/.env.example backend/.env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/careergraph
JWT_SECRET=super_secret_jwt_key_careergraph_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demonstration Data

Populate the platform with demo accounts, master skill catalogs, 8 placement postings, and student records:

```bash
npm run seed
```

### 4. Start the Application

You can run both backend and frontend concurrently with a single command:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`
- **Health Check API**: `http://localhost:5000/api/health`

---

## 🔑 Demo Login Credentials

The seed script automatically provisions pre-configured accounts:

| Role | Email | Password | Profile Description |
| :--- | :--- | :--- | :--- |
| **Placement Admin** | `admin@careergraph.dev` | `Admin@123456` | University Placement Directorate Head |
| **Student (Ready)** | `rahul.sharma@college.edu` | `Student@123456` | Final year CS • **82% Readiness** • 165 DSA Solved • 4 Drives |
| **Student (Competitive)**| `priya.patel@college.edu` | `Student@123456` | IT Major • **58% Readiness** • Full Stack • 3 Drives |
| **Student (Developing)** | `amit.verma@college.edu` | `Student@123456` | ECE Major • **28% Readiness** • Starting DSA |

*(Note: The login page includes a **One-Click Demo Credentials** panel for rapid evaluation during interviews)*

---

## 📡 REST API Reference

### Authentication & User
- `POST /api/auth/register` — Register a new student or placement administrator
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve current authenticated session user
- `PUT /api/auth/update-password` — Change password
- `GET /api/users/profile` — Fetch student profile details
- `PUT /api/users/profile` — Update student profile
- `GET /api/users/readiness` — Calculate live career readiness score & recommendations
- `GET /api/users/dashboard` — Aggregated student dashboard metrics

### Skills Management
- `GET /api/skills/catalog` — Get master platform skills catalog
- `GET /api/skills` — Get current student's added skills
- `POST /api/skills` — Add skill to student profile
- `PUT /api/skills/:id` — Update skill proficiency or category
- `DELETE /api/skills/:id` — Delete skill from profile
- `POST /api/skills/catalog` — *(Admin)* Add skill to master catalog
- `DELETE /api/skills/catalog/:id` — *(Admin)* Delete skill from catalog

### Placement Opportunities
- `GET /api/opportunities` — Browse drives with search, filters (jobType, location, sort)
- `GET /api/opportunities/:id` — Retrieve detailed opportunity and applicant status
- `POST /api/opportunities` — *(Admin)* Create a new placement drive
- `PUT /api/opportunities/:id` — *(Admin)* Update opportunity
- `DELETE /api/opportunities/:id` — *(Admin)* Remove opportunity & linked applications

### Applications Pipeline
- `GET /api/applications` — Get student applications with status filtering
- `POST /api/applications` — Track or save an opportunity
- `PUT /api/applications/:id` — Update stage (`Applied`, `Assessment`, `Interview`, `Shortlisted`, `Selected`, `Rejected`)
- `DELETE /api/applications/:id` — Remove application record

### Preparation Trackers
- `GET /api/preparation/dsa` — Get 12 DSA topics with Easy/Med/Hard breakdown
- `PUT /api/preparation/dsa/:id` — Update topic solved problem counts
- `GET /api/preparation/interview` — Get 10 interview preparation checklist modules
- `POST /api/preparation/interview/:id/toggle` — Toggle checklist completion item

### Admin & Placement Directorate
- `GET /api/admin/dashboard` — Directorate high-level analytics & metrics
- `GET /api/admin/students` — Cohort directory with readiness scores
- `GET /api/admin/students/:id` — Complete candidate performance dossier
- `GET /api/admin/applications` — All student applications across companies
- `GET /api/admin/analytics` — Cohort readiness score distribution & funnel charts

---

## 📸 Screenshots & UI Preview

| Student Dashboard | Career Readiness Gauge |
| :---: | :---: |
| *Personalized welcome, key performance indicators, deadlines* | *Objective score breakdown across 5 weighted domains* |

| DSA Problem Tracker | Interview Preparation Checklists |
| :---: | :---: |
| *12 Data structure topics with Easy/Med/Hard counters* | *Core CS fundamentals & behavioral questions* |

| Placement Board | Admin Analytics & Funnel |
| :---: | :---: |
| *Campus recruitment listings with skill matching* | *Cohort intelligence, stage conversion rates, and skills demand* |

---

## 🔮 Future Enhancements
- Automated resume ATS compatibility score scanner
- Peer-to-peer mock technical interview scheduling calendar
- Push notification webhooks for placement drive deadlines
- College-wide leaderboards for DSA problem-solving streaks

---

## 👨‍💻 Author & License

Developed as a full-stack software engineering portfolio project for placement demonstrations.

- **License**: MIT
