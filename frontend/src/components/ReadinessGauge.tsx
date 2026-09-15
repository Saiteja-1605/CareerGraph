import React from 'react';
import { ReadinessScore } from '../types';
import { Award, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

interface ReadinessGaugeProps {
  readiness: ReadinessScore | null;
  compact?: boolean;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ readiness, compact = false }) => {
  if (!readiness) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-slate-100 rounded mb-4"></div>
      </div>
    );
  }

  const { overallScore, level, breakdown, recommendations } = readiness;

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'Placement Ready':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Competitive':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Developing':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-indigo-500';
    if (percentage >= 30) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Career Readiness Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{overallScore}%</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getLevelColor(
                  level
                )}`}
              >
                {level}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(overallScore)}`}
            style={{ width: `${Math.min(100, overallScore)}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Career Readiness Score</h2>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-20">
                Transparent rule-based score computed across Profile (15%), Skills (20%), DSA (25%), Interview Prep (25%), and Applications (15%). Not an opaque AI prediction.
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic placement preparedness evaluation based on campus hiring benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl font-extrabold text-indigo-600 leading-none">
              {overallScore}%
            </div>
            <span
              className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getLevelColor(
                level
              )}`}
            >
              {level}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-5">
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(overallScore)}`}
            style={{ width: `${Math.min(100, overallScore)}%` }}
          ></div>
        </div>
      </div>

      {/* 5-Area Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {Object.entries(breakdown).map(([key, item]) => (
          <div key={key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
              <span>{item.label}</span>
              <span className="text-indigo-600 font-bold">
                {item.score}/{item.maxScore} pts
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${getBarColor(item.percentage)}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 truncate" title={item.details}>
              {item.details}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Recommended Action Items to Boost Your Score
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
