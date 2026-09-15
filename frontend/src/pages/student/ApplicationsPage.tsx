import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import { Application, ApplicationStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  FileCheck2,
  Building2,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statuses: { label: string; value: string }[] = [
    { label: 'All Applications', value: 'All' },
    { label: 'Saved', value: 'Saved' },
    { label: 'Applied', value: 'Applied' },
    { label: 'Assessment', value: 'Assessment' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Selected', value: 'Selected' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getStudentApplications({
        status: activeFilter !== 'All' ? activeFilter : undefined,
      });
      if (res.success) {
        setApplications(res.applications);
        setStatusCounts(res.statusCounts || {});
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeFilter]);

  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
    setInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : '');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setSubmitting(true);

    try {
      const res = await applicationService.update(editingApp._id, {
        status: newStatus,
        notes,
        interviewDate: interviewDate || undefined,
      });
      if (res.success) {
        setEditingApp(null);
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!window.confirm(`Are you sure you want to stop tracking your application to ${company}?`)) {
      return;
    }
    try {
      await applicationService.delete(id);
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Placement Application Tracker</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {statusCounts['Total'] || 0} Total Applications
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and advance your recruitment pipeline stages from initial screening to offer acceptance.
          </p>
        </div>

        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all shrink-0"
        >
          <span>Find Placement Drives</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((s) => {
          const count = s.value === 'All' ? statusCounts['Total'] || 0 : statusCounts[s.value] || 0;
          const isActive = activeFilter === s.value;

          return (
            <button
              key={s.value}
              onClick={() => setActiveFilter(s.value)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title={
            activeFilter === 'All'
              ? 'No applications tracked yet'
              : `No applications with status "${activeFilter}"`
          }
          description="Browse campus recruitment drives and apply or save them to start tracking your recruitment stages."
          actionLabel="Browse Placement Drives"
          onAction={() => setActiveFilter('All')}
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const opp = app.opportunity;
            if (!opp) return null;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">{opp.companyName}</h3>
                    <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-indigo-600">{opp.jobTitle}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>CTC: {opp.ctc}</span>
                    <span>•</span>
                    <span>{opp.location}</span>
                    <span>•</span>
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{app.notes}</span>
                    </p>
                  )}

                  {app.interviewDate && (
                    <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 mt-2 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>Scheduled Round: {new Date(app.interviewDate).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </button>

                  <button
                    onClick={() => handleDelete(app._id, opp.companyName)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove from tracker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Update Application Modal */}
      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title={`Update Status: ${editingApp?.opportunity?.companyName}`}
      >
        <form onSubmit={handleSaveUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recruitment Stage
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Saved">Saved (Watchlist)</option>
              <option value="Applied">Applied (Submitted Resume)</option>
              <option value="Assessment">Assessment (Online Coding/Aptitude Test)</option>
              <option value="Interview">Interview (Technical / Managerial Round)</option>
              <option value="Shortlisted">Shortlisted (Advanced to Next Round)</option>
              <option value="Selected">Selected (Job Offer Received! 🎉)</option>
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
              Progress Notes / Interview Feedback
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cleared round 1 technical interview on Trees & Graphs; round 2 scheduled next week."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingApp(null)}
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
