import React, { useState, useEffect } from 'react';
import { adminService, applicationService } from '../../services/api';
import { Application, ApplicationStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  FileCheck2,
  Search,
  Edit2,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const ManageApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Change Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await adminService.getAllApplications({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: search || undefined,
      });
      if (res.success) {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleOpenEdit = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
    setInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSubmitting(true);

    try {
      const res = await applicationService.update(selectedApp._id, {
        status: newStatus,
        notes,
        interviewDate: interviewDate || undefined,
      });
      if (res.success) {
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Manage Batch Applications</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {applications.length} Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track and advance student candidate interview rounds, technical assessments, and final placement offers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, company, or job role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading student applications...</div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No applications found"
          description="No application records match your current filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('All');
            fetchApplications();
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Placement Drive</th>
                  <th className="px-6 py-3.5">Current Stage</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Notes</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold flex items-center justify-center text-xs text-slate-700">
                          {app.student?.name ? app.student.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {app.student?.name || 'Student'}
                          </span>
                          <span className="text-slate-400 block text-[11px]">
                            {app.student?.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">
                        {app.opportunity?.companyName}
                      </span>
                      <span className="text-slate-500 text-[11px] block">
                        {app.opportunity?.jobTitle} • {app.opportunity?.ctc}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                        {app.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate text-slate-500 text-[11px]">
                      {app.notes || '—'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Advance / Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Stage Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Advance Application: ${selectedApp?.student ? (selectedApp.student as any).name : 'Student'}`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase">Drive</span>
            <p className="text-sm font-bold text-slate-900">
              {selectedApp?.opportunity?.companyName} — {selectedApp?.opportunity?.jobTitle}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Recruitment Stage
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment (Coding Test)</option>
              <option value="Interview">Interview (Technical / HR)</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected (Placement Offer Issued) 🎉</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interview / Assessment Date (Optional)
            </label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Feedback / Admin Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Scored 94/100 on coding round. Recommended for final panel interview."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Update Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
