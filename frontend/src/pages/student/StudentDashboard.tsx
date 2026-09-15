import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import { ReadinessGauge } from '../../components/ReadinessGauge';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import {
  Code2,
  BookOpenCheck,
  Briefcase,
  Wrench,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getDashboardData();
        if (res.success) {
          setData(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-rose-600">
        <p>{error || 'Unable to display dashboard'}</p>
      </div>
    );
  }

  const { stats, readiness, upcomingDeadlines, recentApplications } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Placement Preparation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="mt-1 text-sm text-indigo-200 max-w-2xl">
            {user?.degree ? `${user.degree} • ` : ''}
            {user?.college || 'Engineering College'} • Class of {user?.graduationYear || 2026}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse Drives</span>
            </Link>
            <Link
              to="/dsa"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-700/80 hover:bg-indigo-600/80 text-white transition-colors border border-indigo-500/30"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Update DSA</span>
            </Link>
            <Link
              to="/interview-prep"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-700/80 hover:bg-indigo-600/80 text-white transition-colors border border-indigo-500/30"
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Interview Prep</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Skills"
          value={stats.skillsCount}
          subtitle="Cataloged in profile"
          icon={<Wrench className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="DSA Solved"
          value={stats.totalDsaSolved}
          subtitle={`${stats.mediumSolved} Med • ${stats.hardSolved} Hard`}
          icon={<Code2 className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Interview Prep"
          value={`${stats.interviewPrepPercentage}%`}
          subtitle="Core CS & Behavioral"
          icon={<BookOpenCheck className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Active Drives"
          value={stats.totalApplications}
          subtitle={`${stats.shortlistedCount} in shortlist/interview`}
          icon={<Briefcase className="w-6 h-6" />}
          color="sky"
        />
      </div>

      {/* Career Readiness Score Component */}
      <ReadinessGauge readiness={readiness} />

      {/* Two-Column Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Placement Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800">Upcoming Placement Drives</h3>
            </div>
            <Link
              to="/opportunities"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((opp: any) => {
                const daysLeft = Math.ceil(
                  (new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={opp._id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="overflow-hidden pr-2">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {opp.companyName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{opp.jobTitle}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>CTC: {opp.ctc}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          daysLeft <= 3
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{daysLeft <= 0 ? 'Closes Today' : `${daysLeft}d left`}</span>
                      </span>
                      <Link
                        to={`/opportunities/${opp._id}`}
                        className="block mt-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No upcoming deadlines at this time.</p>
          )}
        </div>

        {/* Recent Applications Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800">My Application Pipeline</h3>
            </div>
            <Link
              to="/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app: any) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <div className="overflow-hidden pr-2">
                    <h4 className="text-sm font-bold text-slate-800 truncate">
                      {app.opportunity?.companyName || 'Company'}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {app.opportunity?.jobTitle || 'Role'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-slate-500 mb-3">You haven't tracked any applications yet.</p>
              <Link
                to="/opportunities"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                Browse Campus Drives
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
