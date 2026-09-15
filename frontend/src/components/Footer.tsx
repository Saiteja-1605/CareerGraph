import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CareerGraph</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              An integrated Placement & Skill Management Platform built to streamline college student technical readiness, DSA tracking, interview preparation, and placement drives.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Career Readiness Score
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  DSA Problem Tracker
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Core CS Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Campus Placement Drives
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Access Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Placement Officer Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CareerGraph. Built for B.Tech Campus Placements & Engineering Portfolios.</p>
          <p className="flex items-center gap-1">
            Engineered with React, TypeScript, Tailwind CSS, Express & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};
