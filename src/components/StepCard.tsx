import React, { useState } from 'react';
import { StepItem } from '../types';
import { DeviceBadge } from './DeviceBadge';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MapPin, 
  MousePointerClick, 
  PenTool, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle,
  Layout,
  ExternalLink
} from 'lucide-react';

interface StepCardProps {
  step: StepItem;
  guideId: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  activeDeviceFilter: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  isCompleted,
  onToggleComplete,
  activeDeviceFilter
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if step matches current device filter
  const isDeviceMatch = 
    activeDeviceFilter === 'all' || 
    step.device === 'all' || 
    (activeDeviceFilter === 'mobile' && (step.deviceAvailability === 'available' || step.deviceAvailability === 'limited')) ||
    (activeDeviceFilter === 'desktop' && (step.deviceAvailability === 'desktop_recommended' || step.deviceAvailability === 'desktop_required'));

  return (
    <div 
      id={`step-${step.stepNumber}`}
      className={`group relative rounded-2xl border transition-all duration-300 ${
        isCompleted 
          ? 'bg-slate-50/80 dark:bg-slate-900/50 border-emerald-300 dark:border-emerald-800/60 shadow-sm' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      } ${!isDeviceMatch ? 'opacity-60 hover:opacity-100' : ''}`}
    >
      {/* Top Header Strip */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs ${
              isCompleted 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
            }`}>
              {step.stepNumber.toString().padStart(2, '0')}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {step.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <DeviceBadge status={step.deviceAvailability} size="sm" />
            <button
              onClick={onToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
              title={isCompleted ? 'Click to unmark step' : 'Mark this step as complete'}
            >
              <CheckCircle2 size={14} className={isCompleted ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950' : 'text-slate-400'} />
              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
          {step.actionSummary}
        </p>
      </div>

      {/* Main Execution Grid */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Where to perform action */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <MapPin size={13} className="text-emerald-500" />
              Where in Fiverr
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {step.where}
            </p>
          </div>

          {/* What to select */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <MousePointerClick size={13} className="text-indigo-500" />
              What to Click / Select
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {step.whatToSelect}
            </p>
          </div>
        </div>

        {/* What to write or input template */}
        {step.whatToWrite && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                <PenTool size={12} />
                Exact Input Template / What to Write
              </span>
              <button
                onClick={() => handleCopyText(step.whatToWrite!)}
                className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy template text to clipboard"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {step.whatToWrite}
            </pre>
          </div>
        )}

        {/* Why this matters */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
          <HelpCircle size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold mr-1">Why this step matters:</span>
            <span>{step.why}</span>
          </div>
        </div>

        {/* Visual UI Indicator if available */}
        {step.uiIndicator && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/70 px-3 py-2 rounded-lg">
            <Layout size={13} className="text-slate-600 dark:text-slate-300" />
            <span>
              <strong className="text-slate-700 dark:text-slate-200">Look for: </strong> 
              {step.uiIndicator.elementName} ({step.uiIndicator.locationDesc})
            </span>
          </div>
        )}

        {/* Tips & Warnings */}
        <div className="space-y-2 pt-1">
          {step.tips && step.tips.length > 0 && (
            <div className="space-y-1.5">
              {step.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Pro Tip:</strong> {tip}</span>
                </div>
              ))}
            </div>
          )}

          {step.warnings && step.warnings.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {step.warnings.map((warn, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
                  <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Warning / Avoid:</strong> {warn}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
