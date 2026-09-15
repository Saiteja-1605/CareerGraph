import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { opportunityService, applicationService } from '../../services/api';
import { Opportunity } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  CheckCircle,
  ExternalLink,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOpportunity = async () => {
    if (!id) return;
    try {
      const res = await opportunityService.getById(id);
      if (res.success) {
        setOpportunity(res.opportunity);
      }
    } catch (err) {
      console.error('Failed to load opportunity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const handleApply = async (status: 'Applied' | 'Saved') => {
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await applicationService.apply({
        opportunityId: id,
        status,
        notes,
      });
      if (res.success) {
        setIsApplyModalOpen(false);
        fetchOpportunity();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error tracking application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading opportunity details...</div>;
  }

  if (!opportunity) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-600 mb-4">Placement opportunity not found.</p>
        <Link to="/opportunities" className="text-indigo-600 font-bold hover:underline">
          ← Back to all opportunities
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(opportunity.deadline);
  const isApplied = !!opportunity.userApplication;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Placement Opportunities</span>
      </Link>

      {/* Main Opportunity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {opportunity.companyName}
              </h1>
              {opportunity.isDemoData && (
                <span className="text-xs bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded">
                  Demo Opportunity
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-indigo-600">{opportunity.jobTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Deadline: {deadlineDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={opportunity.jobType === 'Full-time' ? 'primary' : 'purple'} size="md">
              {opportunity.jobType}
            </Badge>

            {isApplied ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">Your Status:</span>
                <Badge
                  variant={getStatusBadgeVariant(opportunity.userApplication.status)}
                  size="md"
                >
                  {opportunity.userApplication.status}
                </Badge>
              </div>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                Track / Apply
              </button>
            )}
          </div>
        </div>

        {/* Quick Spec Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Package / CTC</span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
              {opportunity.ctc}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">
              Application Deadline
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {deadlineDate.toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Open Positions</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {opportunity.openings || 1} Opening(s)
            </span>
          </div>
        </div>

        {/* Role Overview */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
            Role Overview & Responsibilities
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
            Eligibility Criteria
          </h3>
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-sm text-indigo-950 font-medium">
            {opportunity.eligibility}
          </div>
        </div>

        {/* Required Technical Skills */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
            Target Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills &&
              opportunity.requiredSkills.map((sk: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                >
                  {sk}
                </span>
              ))}
          </div>
        </div>

        {/* External Link if present */}
        {opportunity.applyLink && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Official Company Drive Portal:</span>
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <span>Visit External Application Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Track Application: ${opportunity.companyName}`}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">{opportunity.jobTitle}</h4>
            <p className="text-xs text-slate-500">{opportunity.ctc} • {opportunity.location}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Tracking Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Submitted resume on portal, scheduled test on Sunday."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => handleApply('Saved')}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Save to Watchlist
            </button>
            <button
              type="button"
              onClick={() => handleApply('Applied')}
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Mark as Applied
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
