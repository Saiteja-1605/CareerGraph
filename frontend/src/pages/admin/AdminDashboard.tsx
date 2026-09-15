import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import {
  Users,
  Building2,
  FileCheck2,
  Award,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading admin directorate dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6 text-rose-500">Failed to load admin data.</div>;
  }

  const { metrics, applicationsByStatus, popularSkills, recentApplications, recentStudents } = data;

  // Chart data formatting
  const statusChartData = Object.entries(applicationsByStatus).map(([status, count]) => ({
    status,
    count,
  }));

  const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Directorate Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Placement Directorate Overview</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              University Admin Portal
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time campus placement drives, student readiness benchmarks, and recruitment funnel statistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/opportunities"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            + Post New Drive
          </Link>
          <Link
            to="/admin/students"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Student Directory
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents}
          subtitle="Enrolled batch candidates"
          icon={<Users className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Placement Drives"
          value={metrics.totalOpportunities}
          subtitle={`${metrics.activeOpportunities} currently accepting applications`}
          icon={<Building2 className="w-6 h-6" />}
          color="sky"
        />
        <StatCard
          title="Applications Tracked"
          value={metrics.totalApplications}
          subtitle={`${metrics.selectedStudentsCount} placement offers recorded`}
          icon={<FileCheck2 className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Avg DSA Solved"
          value={metrics.avgDsaSolved}
          subtitle={`Avg Interview Prep: ${metrics.avgInterviewPrep}%`}
          icon={<Award className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications Funnel Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Applications by Pipeline Stage</h3>
              <p className="text-xs text-slate-500">Distribution across active campus recruitments</p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View Records</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Skills Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Top Technical Skills in Batch</h3>
            <p className="text-xs text-slate-500">Most verified student competencies</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularSkills}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {popularSkills.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {popularSkills.slice(0, 5).map((sk: any, i: number) => (
              <span key={i} className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></span>
                <span>
                  {sk.name} ({sk.count})
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Applications & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Student Applications</h3>
            <Link to="/admin/applications" className="text-xs font-semibold text-indigo-600">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app: any) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {app.student?.name || 'Student'}
                    </span>
                    <span className="text-slate-500">
                      {app.opportunity?.companyName} • {app.opportunity?.jobTitle}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                    {app.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No applications logged yet.</p>
            )}
          </div>
        </div>

        {/* Recently Registered Students */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800">Newly Registered Students</h3>
            <Link to="/admin/students" className="text-xs font-semibold text-indigo-600">
              View Directory
            </Link>
          </div>

          <div className="space-y-3">
            {recentStudents && recentStudents.length > 0 ? (
              recentStudents.map((st: any) => (
                <div
                  key={st._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div className="overflow-hidden pr-2">
                    <span className="font-bold text-slate-800 block truncate">{st.name}</span>
                    <span className="text-slate-500 truncate block">
                      {st.degree || 'B.Tech'} • {st.college || 'College'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    Class of {st.graduationYear || 2026}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No students registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
