import React, { useState, useEffect } from 'react';
import { prepService } from '../../services/api';
import { DsaTopic } from '../../types';
import { StatCard } from '../../components/StatCard';
import { Modal } from '../../components/Modal';
import {
  Code2,
  CheckCircle,
  BarChart2,
  Edit3,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';

export const DsaTrackerPage: React.FC = () => {
  const [topics, setTopics] = useState<DsaTopic[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Topic Modal
  const [selectedTopic, setSelectedTopic] = useState<DsaTopic | null>(null);
  const [easyCount, setEasyCount] = useState(0);
  const [medCount, setMedCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [totalGoal, setTotalGoal] = useState(30);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDsaData = async () => {
    try {
      const res = await prepService.getDsaProgress();
      if (res.success) {
        setTopics(res.topics);
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load DSA data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaData();
  }, []);

  const handleOpenEdit = (topic: DsaTopic) => {
    setSelectedTopic(topic);
    setEasyCount(topic.easySolved);
    setMedCount(topic.mediumSolved);
    setHardCount(topic.hardSolved);
    setTotalGoal(topic.totalProblems);
    setNotes(topic.notes || '');
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;
    setSaving(true);

    try {
      const res = await prepService.updateDsaTopic(selectedTopic._id, {
        easySolved: easyCount,
        mediumSolved: medCount,
        hardSolved: hardCount,
        totalProblems: totalGoal,
        notes,
      });
      if (res.success) {
        setSelectedTopic(null);
        fetchDsaData();
      }
    } catch (err) {
      console.error('Failed to save DSA topic:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickIncrement = async (topic: DsaTopic, difficulty: 'easy' | 'med' | 'hard') => {
    const updateData: any = {
      easySolved: topic.easySolved,
      mediumSolved: topic.mediumSolved,
      hardSolved: topic.hardSolved,
    };
    if (difficulty === 'easy') updateData.easySolved += 1;
    if (difficulty === 'med') updateData.mediumSolved += 1;
    if (difficulty === 'hard') updateData.hardSolved += 1;

    try {
      await prepService.updateDsaTopic(topic._id, updateData);
      fetchDsaData();
    } catch (err) {
      console.error('Failed to update quick counter:', err);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading DSA tracker...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">DSA Problem Solving Tracker</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              12 Core Topics
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Systematic tracking of solved coding questions across data structures and algorithmic paradigms.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Solved"
            value={summary.totalSolved}
            subtitle={`Target: ${summary.totalGoal} problems (${summary.percentage}%)`}
            icon={<Code2 className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            title="Easy Problems"
            value={summary.totalEasy}
            subtitle="Foundation & pattern building"
            icon={<CheckCircle className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="Medium Problems"
            value={summary.totalMedium}
            subtitle="Interview benchmark difficulty"
            icon={<BarChart2 className="w-6 h-6" />}
            color="amber"
          />
          <StatCard
            title="Hard Problems"
            value={summary.totalHard}
            subtitle="High-frequency FAANG+ topics"
            icon={<Flame className="w-6 h-6" />}
            color="rose"
          />
        </div>
      )}

      {/* Global Progress Gauge */}
      {summary && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Overall DSA Milestone Completion</h3>
              <p className="text-xs text-slate-500">
                {summary.totalSolved} questions solved out of {summary.totalGoal} syllabus target
              </p>
            </div>
            <span className="text-2xl font-extrabold text-indigo-600">{summary.percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${summary.totalGoal > 0 ? (summary.totalEasy / summary.totalGoal) * 100 : 0}%` }}
              title={`Easy: ${summary.totalEasy}`}
            ></div>
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${summary.totalGoal > 0 ? (summary.totalMedium / summary.totalGoal) * 100 : 0}%` }}
              title={`Medium: ${summary.totalMedium}`}
            ></div>
            <div
              className="bg-rose-500 h-full transition-all"
              style={{ width: `${summary.totalGoal > 0 ? (summary.totalHard / summary.totalGoal) * 100 : 0}%` }}
              title={`Hard: ${summary.totalHard}`}
            ></div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Easy ({summary.totalEasy})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium ({summary.totalMedium})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Hard ({summary.totalHard})</span>
            </div>
          </div>
        </div>
      )}

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((t) => {
          const progressPercent = t.totalProblems > 0 ? Math.min(100, Math.round((t.solvedProblems / t.totalProblems) * 100)) : 0;

          return (
            <div
              key={t._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-800">{t.topic}</h3>
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit topic counts & notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                    <span>
                      {t.solvedProblems} / {t.totalProblems} Solved
                    </span>
                    <span className="font-bold text-indigo-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        progressPercent >= 80
                          ? 'bg-emerald-500'
                          : progressPercent >= 40
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Easy, Medium, Hard breakdown badges */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                      Easy
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">{t.easySolved}</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="block text-[10px] font-bold text-amber-700 uppercase">
                      Med
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">{t.mediumSolved}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-rose-700 uppercase">
                      Hard
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">{t.hardSolved}</span>
                  </div>
                </div>

                {t.notes && (
                  <p className="mt-3 text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    "{t.notes}"
                  </p>
                )}
              </div>

              {/* Quick +1 increment buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Quick Add:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickIncrement(t, 'easy')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    +1 Easy
                  </button>
                  <button
                    onClick={() => handleQuickIncrement(t, 'med')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    +1 Med
                  </button>
                  <button
                    onClick={() => handleQuickIncrement(t, 'hard')}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    +1 Hard
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        title={`Update DSA Topic: ${selectedTopic?.topic}`}
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">Easy Solved</label>
              <input
                type="number"
                min={0}
                value={easyCount}
                onChange={(e) => setEasyCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1">Medium Solved</label>
              <input
                type="number"
                min={0}
                value={medCount}
                onChange={(e) => setMedCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">Hard Solved</label>
              <input
                type="number"
                min={0}
                value={hardCount}
                onChange={(e) => setHardCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Problem Goal for Topic
            </label>
            <input
              type="number"
              min={5}
              max={150}
              value={totalGoal}
              onChange={(e) => setTotalGoal(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes / Tricks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mastered two-pointer pattern; review fast & slow pointers before interview."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
