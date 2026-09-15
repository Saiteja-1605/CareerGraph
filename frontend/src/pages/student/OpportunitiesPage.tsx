import React, { useState, useEffect } from 'react';
import { opportunityService, applicationService } from '../../services/api';
import { Opportunity } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All');
  const [sort, setSort] = useState('deadline');

  // Application Modal
  const [applyingOpportunity, setApplyingOpportunity] = useState<Opportunity | null>(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      const res = await opportunityService.getAll({
        search: search || undefined,
        jobType: jobType !== 'All' ? jobType : undefined,
        sort,
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
  }, [jobType, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleApply = async (status: 'Applied' | 'Saved') => {
    if (!applyingOpportunity) return;
    setIsSubmitting(true);
    try {
      const res = await applicationService.apply({
        opportunityId: applyingOpportunity._id,
        status,
        notes: applicationNotes,
      });
      if (res.success) {
        setFeedbackMessage(`Opportunity successfully marked as ${status}!`);
        setTimeout(() => setFeedbackMessage(null), 4000);
        setApplyingOpportunity(null);
        setApplicationNotes('');
        fetchOpportunities();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSave = async (opp: Opportunity) => {
    try {
      const res = await applicationService.apply({
        opportunityId: opp._id,
        status: 'Saved',
        notes: 'Saved from placement board',
      });
      if (res.success) {
        fetchOpportunities();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save opportunity.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Campus Placement Drives</h1>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Hiring Board
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified campus recruitment opportunities, eligibility requirements, CTC packages, and deadlines.
          </p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, role, or required skill (e.g. Nexus, React, Java)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Intern + PPO">Intern + PPO</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="deadline">Nearest Deadline</option>
              <option value="company">Company Name (A-Z)</option>
              <option value="newest">Newly Posted</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading placement drives...</div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No opportunities found"
          description="Try adjusting your search criteria or removing filters to view more opportunities."
          actionLabel="Clear Search"
          onAction={() => {
            setSearch('');
            setJobType('All');
            fetchOpportunities();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {opportunities.map((opp) => {
            const deadlineDate = new Date(opp.deadline);
            const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isApplied = !!opp.applicationStatus;

            return (
              <div
                key={opp._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{opp.companyName}</h3>
                        {opp.isDemoData && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded">
                            Demo
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-indigo-600 mt-0.5">{opp.jobTitle}</h4>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge variant={opp.jobType === 'Full-time' ? 'primary' : 'purple'} size="sm">
                        {opp.jobType}
                      </Badge>
                      {opp.applicationStatus && (
                        <Badge variant={getStatusBadgeVariant(opp.applicationStatus)} size="sm">
                          {opp.applicationStatus}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">{opp.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">
                        Package / CTC
                      </span>
                      <span className="font-bold text-slate-800">{opp.ctc}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-400">
                        Location
                      </span>
                      <span className="font-medium text-slate-700 truncate block">{opp.location}</span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.requiredSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
                    <span
                      className={`ml-1 font-bold ${
                        daysLeft <= 3 ? 'text-rose-600' : 'text-slate-600'
                      }`}
                    >
                      ({daysLeft <= 0 ? 'Today' : `${daysLeft}d left`})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/opportunities/${opp._id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      View Details
                    </Link>

                    {isApplied ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tracked</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setApplyingOpportunity(opp)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Apply / Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply / Save Modal */}
      <Modal
        isOpen={!!applyingOpportunity}
        onClose={() => setApplyingOpportunity(null)}
        title={`Track Opportunity: ${applyingOpportunity?.companyName}`}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">{applyingOpportunity?.jobTitle}</h4>
            <p className="text-xs text-slate-500">
              Package: {applyingOpportunity?.ctc} • Location: {applyingOpportunity?.location}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Tracking Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              placeholder="e.g. Applied through referral / College campus drive ID: CG-2026-09"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {applyingOpportunity?.applyLink && (
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800 flex items-center justify-between">
              <span>External Company Portal:</span>
              <a
                href={applyingOpportunity.applyLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold flex items-center gap-1 hover:underline"
              >
                <span>Visit Company Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => handleApply('Saved')}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Save to Watchlist
            </button>
            <button
              type="button"
              onClick={() => handleApply('Applied')}
              disabled={isSubmitting}
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
