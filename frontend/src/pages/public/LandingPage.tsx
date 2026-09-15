import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Code2,
  BookOpenCheck,
  Briefcase,
  Award,
  CheckCircle,
  BarChart3,
  Layers,
  ShieldCheck,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Footer } from '../../components/Footer';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Award,
      color: 'bg-indigo-50 text-indigo-600',
      title: 'Career Readiness Score',
      desc: 'Transparent, rule-based algorithm evaluating your profile completion, verified skills, DSA volume, and interview checklist readiness.',
    },
    {
      icon: Code2,
      color: 'bg-sky-50 text-sky-600',
      title: 'DSA Problem Tracker',
      desc: 'Track your LeetCode and problem-solving milestone across 12 foundational topics with Easy, Medium, and Hard counters.',
    },
    {
      icon: BookOpenCheck,
      color: 'bg-emerald-50 text-emerald-600',
      title: 'Interview Preparation',
      desc: 'Structured curricula and topic checklists covering DBMS, Operating Systems, Computer Networks, OOP, SQL, HR, and STAR behavioural answers.',
    },
    {
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600',
      title: 'Placement Opportunities',
      desc: 'Discover campus drives, internships, and full-time hiring posts with granular skill matching, salary packages, and deadline alerts.',
    },
    {
      icon: Layers,
      color: 'bg-purple-50 text-purple-600',
      title: 'Technical Skills Matrix',
      desc: 'Catalog and categorize your tech stack across Programming, Frontend, Backend, Databases, and Tools with self-rated proficiencies.',
    },
    {
      icon: BarChart3,
      color: 'bg-rose-50 text-rose-600',
      title: 'Placement Cell Analytics',
      desc: 'Empowers university placement officers with real-time student batch statistics, readiness score distributions, and applicant funnels.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Build Your Technical Profile',
      desc: 'Add your education, resume links, project repositories, and technical skills across specialized categories.',
    },
    {
      number: '02',
      title: 'Track Problem Solving & Core CS',
      desc: 'Log solved DSA questions across data structure topics and master core interview concepts using comprehensive checklists.',
    },
    {
      number: '03',
      title: 'Monitor Your Readiness Score',
      desc: 'Receive transparent percentage ratings and targeted recommendations to close preparation gaps before company visits.',
    },
    {
      number: '04',
      title: 'Apply & Manage Placements',
      desc: 'Browse curated campus drives, track application pipeline stages from Assessment to Interview to Final Offer.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">CareerGraph</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200 text-xs font-semibold text-indigo-800 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement & Technical Readiness Ecosystem for Engineering Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Build Your Career.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
                Track Your Progress.
              </span>{' '}
              Get Placement Ready.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              CareerGraph provides college students with structured DSA problem tracking, CS fundamentals revision, job opportunity matching, and an objective Career Readiness Score.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Start Preparation Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-xs"
              >
                <span>Demo Accounts</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-8 border-t border-slate-200/80">
              <div>
                <div className="text-2xl font-bold text-slate-900">12+</div>
                <div className="text-xs text-slate-500 font-medium">DSA Core Topics</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">10+</div>
                <div className="text-xs text-slate-500 font-medium">Interview Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Transparent Metrics</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Role-Based</div>
                <div className="text-xs text-slate-500 font-medium">Student & Admin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 w-full">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Explore Pre-Seeded Profiles
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Experience Rahul's Placement-Ready Dashboard (82% Score)
              </h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Try logging into demo accounts to test the live DSA counters, interview checklists, applications pipeline, and admin controls.
              </p>
            </div>
            <Link
              to="/login"
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-indigo-500/30 transition-all"
            >
              Sign In to Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Everything You Need for Campus Hiring
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              End-to-End Preparation and Placement Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Step-by-Step Pathway
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">How CareerGraph Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <div key={idx} className="relative">
                <div className="text-4xl font-extrabold text-indigo-100 mb-2">{s.number}</div>
                <h4 className="text-base font-bold text-slate-800 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Accelerate Your Campus Placement Journey
          </h2>
          <p className="text-base text-indigo-100 max-w-xl mx-auto mb-8">
            Join other students preparing with structured metrics, curated company drives, and portfolio-ready progress tracking.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-indigo-900 bg-white hover:bg-slate-100 shadow-xl transition-all"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
