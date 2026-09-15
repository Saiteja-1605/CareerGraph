import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  Users,
  Search,
  Award,
  BookOpen,
  Briefcase,
  ExternalLink,
  Mail,
  Phone,
  GraduationCap,
  Building,
} from 'lucide-react';

export const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Student Detail Modal
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await adminService.getStudents({ search: search || undefined });
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenStudentDetail = async (studentId: string) => {
    setModalLoading(true);
    try {
      const res = await adminService.getStudentDetail(studentId);
      if (res.success) {
        setSelectedStudentDetail(res.data);
      }
    } catch (err) {
      console.error('Failed to load student detail:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const getReadinessLevelBadge = (level: string) => {
    switch (level) {
      case 'Placement Ready':
        return <Badge variant="success">{level}</Badge>;
      case 'Competitive':
        return <Badge variant="primary">{level}</Badge>;
      case 'Developing':
        return <Badge variant="warning">{level}</Badge>;
      default:
        return <Badge variant="default">{level}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Student Directory</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {students.length} Candidates
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor batch career readiness scores, verified skill sets, and application activities.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate by name, email, or college..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading student directory...</div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="No student profiles matched your search terms."
          actionLabel="Clear Search"
          onAction={() => {
            setSearch('');
            fetchStudents();
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">College & Degree</th>
                  <th className="px-6 py-3.5">Career Readiness</th>
                  <th className="px-6 py-3.5">Skills</th>
                  <th className="px-6 py-3.5">Applications</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm shrink-0 border border-indigo-100">
                          {st.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-slate-900 block truncate">{st.name}</span>
                          <span className="text-slate-400 block truncate text-[11px]">
                            {st.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block truncate max-w-xs">
                        {st.degree || 'B.Tech'}
                      </span>
                      <span className="text-slate-500 block truncate max-w-xs text-[11px]">
                        {st.college || 'Engineering College'} ({st.graduationYear || 2026})
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-indigo-600">
                          {st.readinessScore}%
                        </span>
                        {getReadinessLevelBadge(st.readinessLevel)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{st.skillsCount} skills</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{st.applicationsCount} drives</span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenStudentDetail(st._id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      <Modal
        isOpen={!!selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        title="Student Performance Dossier"
        maxWidth="2xl"
      >
        {selectedStudentDetail && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
            {/* Header Profile Summary */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedStudentDetail.student.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStudentDetail.student.email} • {selectedStudentDetail.student.phone || 'No phone'}
                </p>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {selectedStudentDetail.student.degree} — {selectedStudentDetail.student.college} (Class of {selectedStudentDetail.student.graduationYear})
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-indigo-600 block leading-none">
                  {selectedStudentDetail.readiness?.overallScore}%
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Readiness</span>
              </div>
            </div>

            {/* Readiness Breakdown */}
            {selectedStudentDetail.readiness && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                  Readiness Score Components
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {Object.entries(selectedStudentDetail.readiness.breakdown).map(
                    ([key, item]: any) => (
                      <div key={key} className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-[10px] font-semibold truncate">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                          {item.score}/{item.maxScore}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          {item.details}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Skills List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                Verified Technical Skills ({selectedStudentDetail.skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentDetail.skills.map((sk: any) => (
                  <span
                    key={sk._id}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    {sk.name} <span className="text-slate-400 text-[10px]">({sk.proficiency})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Applications History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                Placement Applications ({selectedStudentDetail.applications.length})
              </h4>
              <div className="space-y-2">
                {selectedStudentDetail.applications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No applications filed yet.</p>
                ) : (
                  selectedStudentDetail.applications.map((app: any) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {app.opportunity?.companyName}
                        </span>
                        <span className="text-slate-500 ml-2">{app.opportunity?.jobTitle}</span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
