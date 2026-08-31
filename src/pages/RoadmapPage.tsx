import React from 'react';
import { useGuide } from '../context/GuideContext';
import { ROADMAP_PHASES } from '../data/roadmapData';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  MessageSquare, 
  PackageCheck, 
  Star, 
  TrendingUp,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { 
    completedSteps, 
    toggleStepCompleted, 
    setActivePage,
    setActiveGuideId, 
    language,
    resetProgress
  } = useGuide();

  const isBn = language === 'bn';

  const iconMap: Record<string, any> = {
    Shield: ShieldCheck,
    UserCheck: UserCheck,
    Sparkles: Sparkles,
    MessageSquare: MessageSquare,
    Clock: Clock,
    PackageCheck: PackageCheck,
    Star: Star,
    TrendingUp: TrendingUp
  };

  // Helper to normalize milestone item
  const getMilestoneInfo = (phaseId: string, m: any, index: number) => {
    if (typeof m === 'string') {
      return {
        id: `${phaseId}_m_${index}`,
        title: m,
        titleBn: m,
        description: '',
        descriptionBn: '',
        guideId: undefined
      };
    }
    return {
      id: m.id || `${phaseId}_m_${index}`,
      title: m.title || '',
      titleBn: m.titleBn || m.title || '',
      description: m.description || '',
      descriptionBn: m.descriptionBn || '',
      guideId: m.guideId
    };
  };

  // Calculate overall milestone completion
  const totalMilestonesCount = ROADMAP_PHASES.reduce((acc, p) => acc + p.milestones.length, 0);
  let completedCount = 0;
  ROADMAP_PHASES.forEach(p => {
    p.milestones.forEach((m, idx) => {
      const info = getMilestoneInfo(p.id, m, idx);
      if (completedSteps[info.id]) {
        completedCount++;
      }
    });
  });

  const progressPercent = totalMilestonesCount > 0 ? Math.round((completedCount / totalMilestonesCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? '৮-ধাপের ফ্রিল্যান্সিং ক্যারিয়ার রোডম্যাপ' : '8-Phase Strategic Journey'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isBn ? 'বিগিনার থেকে টপ রেটেড ফ্রিল্যান্সার রোডম্যাপ' : 'The Complete Fiverr Career Roadmap'}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {isBn
              ? 'ফাইভারের শুরু থেকে সফল ক্যারিয়ার গড়া পর্যন্ত প্রতিটি ধাপ ক্রমানুসারে সাজানো হয়েছে। প্রতিটি মাইলস্টোন সম্পন্ন করে ফ্রিল্যান্সিংয়ে দ্রুত অগ্রগতি আনুন।'
              : 'Follow this sequential blueprint to move methodically from zero experience to a thriving freelance business with repeat clients.'}
          </p>

          {/* Progress bar */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>{isBn ? 'রোডম্যাপ সম্পন্ন হওয়ার অগ্রগতি:' : 'Roadmap Progress:'}</span>
              <span className="text-emerald-400">{completedCount} / {totalMilestonesCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 8-Phase Timeline */}
      <div className="space-y-6">
        {ROADMAP_PHASES.map((phase) => {
          const Icon = (phase.icon && iconMap[phase.icon]) || Sparkles;
          
          const phaseMilestones = phase.milestones.map((m, idx) => getMilestoneInfo(phase.id, m, idx));
          const isPhaseCompleted = phaseMilestones.every(m => completedSteps[m.id]);
          const doneInPhase = phaseMilestones.filter(m => completedSteps[m.id]).length;

          return (
            <div
              key={phase.id}
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                isPhaseCompleted
                  ? 'bg-slate-50/80 dark:bg-slate-900/40 border-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                        PHASE 0{phase.phaseNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{phase.estimatedDuration || phase.estimatedTime || 'Step-by-Step'}</span>
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {isBn ? (phase.titleBn || phase.title) : phase.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-start sm:self-center">
                  {doneInPhase} / {phase.milestones.length} {isBn ? 'চেকপয়েন্ট সম্পন্ন' : 'Milestones Done'}
                </div>
              </div>

              {/* Phase Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 py-4 leading-relaxed">
                {isBn ? (phase.descriptionBn || phase.description) : phase.description}
              </p>

              {/* Milestones Checklist */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-400 block">
                  {isBn ? 'বাস্তবায়ন চেকপয়েন্টসমূহ:' : 'Actionable Milestones:'}
                </span>

                <div className="grid gap-2">
                  {phaseMilestones.map((m) => {
                    const isMCompleted = !!completedSteps[m.id];
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isMCompleted
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleStepCompleted(m.id)}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 mt-0.5 cursor-pointer ${
                              isMCompleted
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                          >
                            {isMCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <h4 className={`text-xs sm:text-sm font-bold ${
                              isMCompleted ? 'text-emerald-950 dark:text-emerald-200 line-through opacity-80' : 'text-slate-900 dark:text-slate-100'
                            }`}>
                              {isBn ? m.titleBn : m.title}
                            </h4>
                            {m.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {isBn ? m.descriptionBn : m.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {m.guideId && (
                          <button
                            onClick={() => setActiveGuideId(m.guideId!)}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-end sm:self-center shrink-0 cursor-pointer"
                          >
                            <span>{isBn ? 'গাইড পড়ুন' : 'Read Guide'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Related Guides Links */}
              {phase.relatedGuides && phase.relatedGuides.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {isBn ? 'সম্পর্কিত গাইডসমূহ:' : 'Related Guides:'}
                  </span>
                  {phase.relatedGuides.map(guideSlug => (
                    <button
                      key={guideSlug}
                      onClick={() => setActiveGuideId(guideSlug)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      #{guideSlug}
                    </button>
                  ))}
                </div>
              )}

              {/* Key Outcome box */}
              {(phase.keyOutcome || phase.keyTakeaway) && (
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">💡 {isBn ? 'মূল লক্ষ্য / ফলাফল:' : 'Key Outcome:'}</span>
                  <span>{isBn ? (phase.keyTakeawayBn || phase.keyOutcome) : (phase.keyTakeaway || phase.keyOutcome)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset Progress Action */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={resetProgress}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isBn ? 'প্রোগ্রেস রিসেট করুন (Reset Learning Progress)' : 'Reset Roadmap Progress'}</span>
        </button>
      </div>

    </div>
  );
};
