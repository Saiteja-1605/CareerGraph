import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { BarChart3, TrendingUp, Users, Award, PieChart as PieIcon } from 'lucide-react';
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

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading placement analytics...</div>;
  }

  if (!data) {
    return <div className="p-6 text-rose-500">Failed to load analytics data.</div>;
  }

  const { totalStudents, distribution, funnel, topStudentSkills } = data;

  const distributionData = [
    { name: 'Beginning (<40%)', count: distribution.beginning, color: '#94a3b8' },
    { name: 'Developing (40-59%)', count: distribution.developing, color: '#f59e0b' },
    { name: 'Competitive (60-79%)', count: distribution.competitive, color: '#6366f1' },
    { name: 'Placement Ready (80%+)', count: distribution.placementReady, color: '#10b981' },
  ];

  const funnelData = funnel.map((item: any) => ({
    stage: item._id,
    count: item.count,
  }));

  const skillsData = topStudentSkills.map((item: any) => ({
    name: item._id,
    students: item.count,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Placement Intelligence & Analytics</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Aggregate Batch Insights
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Institutional overview of candidate career preparedness, conversion funnel, and technical competencies.
          </p>
        </div>
      </div>

      {/* High-level summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Candidates"
          value={totalStudents}
          subtitle="Enrolled student cohort"
          icon={<Users className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Placement Ready"
          value={distribution.placementReady}
          subtitle="Candidates with score >= 80%"
          icon={<Award className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Competitive Tier"
          value={distribution.competitive}
          subtitle="Candidates with score 60-79%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="sky"
        />
      </div>

      {/* Chart Row 1: Readiness Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Career Readiness Distribution Across Cohort
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Categorized by objective rule-based score brackets
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruitment Pipeline Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Campus Recruitment Conversion Pipeline
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Candidate progression across application stages
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={85} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Top Skills In Demand vs Student Supply */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          Top Verified Technical Competencies
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Count of students possessing verified proficiencies in key engineering skills
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="students" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
