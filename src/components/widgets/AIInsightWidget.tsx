import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AIInsightItem } from './types';
import { DEFAULT_AI_INSIGHTS } from './mockWidgetData';

interface AIInsightWidgetProps {
  title?: string;
  subtitle?: string;
  insights?: AIInsightItem[];
  className?: string;
  onApplyAction?: (insight: AIInsightItem) => void;
  onDismiss?: (insightId: string) => void;
}

export const AIInsightWidget: React.FC<AIInsightWidgetProps> = ({
  title = 'AI Talent & Market Intelligence',
  subtitle = 'Automated escrow, rate optimization, and proposal velocity analytics',
  insights = DEFAULT_AI_INSIGHTS,
  className = '',
  onApplyAction,
  onDismiss,
}) => {
  const [items, setItems] = useState<AIInsightItem[]>(insights);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeItems = items.filter((item) => !dismissedIds.includes(item.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    if (onDismiss) onDismiss(id);
  };

  const getInsightIcon = (type: AIInsightItem['type']) => {
    switch (type) {
      case 'growth':
      case 'revenue':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#A38BFF]" />;
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-[#1A1633]/95 backdrop-blur-md text-white border border-[#A38BFF]/40 shadow-xl relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#3D2FD1]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#6E5BFF]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3D2FD1] to-[#6E5BFF] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white font-display">
                  {title}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#3D2FD1]/60 text-[#A38BFF] border border-[#6E5BFF]/40">
                  Adaptive
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Insight Cards List */}
        <div className="space-y-3.5">
          {activeItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              All insights reviewed. Check back as new contracts execute.
            </div>
          ) : (
            activeItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-[#A38BFF]/25 hover:border-[#A38BFF]/50 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      {getInsightIcon(item.type)}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A38BFF] transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.highlightMetric && (
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.highlightMetric}
                      </span>
                    )}
                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {item.insight}
                </p>

                {/* Recommended action footer */}
                {item.recommendedAction && (
                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.recommendedAction}</span>
                    </span>

                    <button
                      onClick={() => onApplyAction && onApplyAction(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#A38BFF] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Calculated with zero client data leakage</span>
        </span>
        <span className="text-[#A38BFF] font-mono text-[11px]">Private Engine</span>
      </div>
    </div>
  );
};
