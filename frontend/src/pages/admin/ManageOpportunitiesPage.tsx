import React, { useState, useEffect } from 'react';
import { opportunityService } from '../../services/api';
import { Opportunity, JobType, OpportunityStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const ManageOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    description: '',
    location: '',
    ctc: '',
    eligibility: '',
    requiredSkills: '',
    deadline: '',
    jobType: 'Full-time' as JobType,
    status: 'Active' as OpportunityStatus,
    openings: 1,
    applyLink: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      const res = await opportunityService.getAll({
        search: search || undefined,
        status: 'All', // Admin views all statuses (Active, Closed, Upcoming)
      });
      if (res.success) {
        setOpportunities(res.opportunities);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleOpenCreate = () => {
    setEditingOpportunity(null);
    setFormData({
      companyName: '',
      jobTitle: '',
      description: '',
      location: '',
      ctc: '',
      eligibility: '',
      requiredSkills: '',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      jobType: 'Full-time',
      status: 'Active',
      openings: 5,
      applyLink: '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setEditingOpportunity(opp);
    setFormData({
      companyName: opp.companyName,
      jobTitle: opp.jobTitle,
      description: opp.description,
      location: opp.location,
      ctc: opp.ctc,
      eligibility: opp.eligibility,
      requiredSkills: opp.requiredSkills.join(', '),
      deadline: new Date(opp.deadline).toISOString().split('T')[0],
      jobType: opp.jobType,
      status: opp.status,
      openings: opp.openings || 1,
      applyLink: opp.applyLink || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingOpportunity) {
        await opportunityService.update(editingOpportunity._id, payload);
      } else {
        await opportunityService.create(payload);
      }
      setIsModalOpen(false);
      fetchOpportunities();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save opportunity.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the placement drive for "${name}"? This will also remove any associated student applications.`)) {
      return;
    }
    try {
      await opportunityService.delete(id);
      fetchOpportunities();
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Manage Placement Drives</h1>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {opportunities.length} Total Drives
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, update, and manage on-campus recruitment opportunities and company criteria.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading placement opportunities...</div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No opportunities found"
          description="Click the button above to publish your first campus placement drive."
          actionLabel="Post Opportunity"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900">{opp.companyName}</h3>
                  <Badge variant={opp.status === 'Active' ? 'success' : opp.status === 'Upcoming' ? 'info' : 'danger'}>
                    {opp.status}
                  </Badge>
                  <Badge variant={opp.jobType === 'Full-time' ? 'primary' : 'purple'}>
                    {opp.jobType}
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-indigo-600">{opp.jobTitle}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>CTC: {opp.ctc}</span>
                  <span>•</span>
                  <span>{opp.location}</span>
                  <span>•</span>
                  <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{opp.openings || 1} Openings</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {opp.requiredSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(opp)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(opp._id, opp.companyName)}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete Opportunity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpportunity ? 'Edit Placement Drive' : 'Post New Placement Drive'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Nexus Infotech Solutions"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. SDE-1 (Backend Engineer)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Package / CTC *</label>
              <input
                type="text"
                required
                value={formData.ctc}
                onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                placeholder="e.g. 12 LPA or ₹45,000 / month"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore (Hybrid)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Intern + PPO">Intern + PPO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as OpportunityStatus })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline *</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Eligibility Criteria *
            </label>
            <input
              type="text"
              required
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              placeholder="e.g. B.Tech (CSE/IT) with 7.5+ CGPA and no backlogs"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="e.g. Java, Spring Boot, DSA, SQL, Git"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed responsibilities, expectations, and interview process..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Portal Link (Optional)
            </label>
            <input
              type="url"
              value={formData.applyLink}
              onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
              placeholder="https://company.com/apply"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingOpportunity ? 'Update Drive' : 'Publish Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
