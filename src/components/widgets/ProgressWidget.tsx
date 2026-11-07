import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Award
} from 'lucide-react';
import { ProgressGoal } from './types';
import { DEFAULT_PROGRESS_GOALS } from './mockWidgetData';

interface ProgressWidgetProps {
  title?: string;
  subtitle?: string;
  goals?: ProgressGoal[];
  primaryGoalId?: string;
  className?: string;
  onGoalAction?: (goal: ProgressGoal) => void;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  title = 'Goals & Milestone Velocity',
  subtitle = 'Progress toward top-tier escrow rating and monthly targets',
  goals = DEFAULT_PROGRESS_GOALS,
  primaryGoalId = 'goal-profile',
  className = '',
  onGoalAction,
}) => {
  const primaryGoal = goals.find((g) => g.id === primaryGoalId) || goals[0];
  const otherGoals = goals.filter((g) => g.id !== primaryGoal?.id);

  // Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = primaryGoal
    ? circumference - (primaryGoal.percentage / 100) * circumference
    : 0;

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1633] font-display">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center shrink-0 shadow-xs">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* Primary Radial Goal Card */}
        {primaryGoal && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1633] to-[#23324A] text-white border border-[#A38BFF]/30 shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3D2FD1]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10">
              {/* Radial Progress Ring */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="#2D3B54"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="url(#progressRingGrad)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressRingGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3D2FD1" />
                      <stop offset="50%" stopColor="#6E5BFF" />
                      <stop offset="100%" stopColor="#A38BFF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black font-display text-white">
                    {primaryGoal.percentage}%
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                    Done
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#A38BFF] mb-1">
                  <Award className="w-3 h-3" />
                  <span>Key Priority</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {primaryGoal.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {primaryGoal.supportingNote || 'Accelerating verified profile reach across top enterprise clients.'}
                </p>
                {onGoalAction && (
                  <button
                    onClick={() => onGoalAction(primaryGoal)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#A38BFF] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Complete Steps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Secondary Linear Progress Bars */}
        <div className="space-y-4">
          {otherGoals.map((goal) => (
            <div key={goal.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1633]">{goal.title}</span>
                <span className="font-mono font-extrabold text-[#3D2FD1]">
                  {goal.category === 'revenue_goal'
                    ? `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`
                    : `${goal.percentage}%`}
                </span>
              </div>

              {/* Bar track */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>

              {goal.supportingNote && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{goal.supportingNote}</span>
                  {goal.percentage >= 90 && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Almost there
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="mt-6 pt-4 border-t border-[#A38BFF]/20 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Talentio Verified Milestone Tracking</span>
        </span>
        <span className="font-mono font-bold text-[#3D2FD1]">Tier 1 Pro</span>
      </div>
    </div>
  );
};
