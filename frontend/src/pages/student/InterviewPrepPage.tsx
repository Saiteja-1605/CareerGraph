import React, { useState, useEffect } from 'react';
import { prepService } from '../../services/api';
import { InterviewCategory } from '../../types';
import { StatCard } from '../../components/StatCard';
import {
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Cpu,
  Layers,
  HelpCircle,
  Award,
  Sparkles,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('DSA');

  const fetchPrepData = async () => {
    try {
      const res = await prepService.getInterviewPrep();
      if (res.success) {
        setCategories(res.categories);
        setSummary(res.summary);
        if (res.categories.length > 0 && !activeCategory) {
          setActiveCategory(res.categories[0].category);
        }
      }
    } catch (err) {
      console.error('Failed to load interview prep data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrepData();
  }, []);

  const handleToggleItem = async (categoryId: string, itemIndex: number) => {
    try {
      // Optimistic local update
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat._id === categoryId) {
            const updatedChecklist = [...cat.checklist];
            updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed;
            const completedCount = updatedChecklist.filter((i) => i.completed).length;
            const percentage = Math.round((completedCount / updatedChecklist.length) * 100);
            return { ...cat, checklist: updatedChecklist, percentage };
          }
          return cat;
        })
      );

      const res = await prepService.toggleChecklistItem(categoryId, itemIndex);
      if (res.success) {
        // Re-sync summary
        fetchPrepData();
      }
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
      fetchPrepData(); // revert
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading interview prep modules...</div>;
  }

  const selectedCategoryData = categories.find((c) => c.category === activeCategory) || categories[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Technical & HR Interview Prep</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              10 Core Disciplines
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Master CS fundamentals, system concepts, problem-solving techniques, and behavioral interview questions.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Interview Readiness"
            value={`${summary.overallPercentage}%`}
            subtitle="Overall syllabus coverage"
            icon={<Award className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="Completed Topics"
            value={`${summary.completedItems} / ${summary.totalItems}`}
            subtitle="Verified checklist items"
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            title="Active Modules"
            value={summary.categoriesCount}
            subtitle="From CS core to behavioral"
            icon={<BookOpenCheck className="w-6 h-6" />}
            color="purple"
          />
        </div>
      )}

      {/* Main Category Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Category Menu */}
        <div className="lg:col-span-4 space-y-2 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm h-fit">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Modules & Disciplines
          </span>
          {categories.map((cat) => {
            const isSelected = cat.category === activeCategory;
            return (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.category)}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm">{cat.category}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {cat.checklist.filter((i) => i.completed).length} of {cat.checklist.length} items
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {cat.percentage}%
                  </span>
                  <div
                    className={`w-12 h-1.5 rounded-full overflow-hidden ${
                      isSelected ? 'bg-indigo-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`h-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Topic Checklist & Notes */}
        <div className="lg:col-span-8">
          {selectedCategoryData ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Module Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Selected Module
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedCategoryData.category}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Click each checklist item as you study or practice to update your progress.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-indigo-600">
                      {selectedCategoryData.percentage}%
                    </span>
                    <span className="block text-[11px] text-slate-500 font-medium">Completed</span>
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="p-6 space-y-3">
                {selectedCategoryData.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleItem(selectedCategoryData._id, idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      item.completed
                        ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 focus:outline-none shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a module from the left.</div>
          )}
        </div>
      </div>
    </div>
  );
};
