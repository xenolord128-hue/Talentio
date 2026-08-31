import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { GUIDE_SECTIONS, GUIDE_CATEGORIES } from '../data/guidesData';
import { StepCard } from '../components/StepCard';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { DeviceBadge } from '../components/DeviceBadge';
import { GuideSection } from '../types';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  Laptop,
  Smartphone,
  Check,
  Bookmark,
  Share2,
  Filter
} from 'lucide-react';

export const GuideDocsPage: React.FC = () => {
  const { 
    language, 
    activeGuideId, 
    setActiveGuideId, 
    activeDeviceFilter, 
    setActiveDeviceFilter,
    isStepCompleted,
    isGuideCompleted,
    toggleBookmark,
    isBookmarked,
    toastMessage
  } = useGuide();

  const isBn = language === 'bn';

  // Active guide selection
  const currentGuide: GuideSection = 
    GUIDE_SECTIONS.find(g => g.id === activeGuideId) || GUIDE_SECTIONS[0];

  const [wizardMode, setWizardMode] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter guides by category
  const filteredGuides = GUIDE_SECTIONS.filter(guide => {
    if (categoryFilter === 'all') return true;
    return guide.category === categoryFilter;
  });

  // Calculate completion percentage for current guide
  const totalSteps = currentGuide.steps.length;
  const completedStepsCount = currentGuide.steps.filter(s => isStepCompleted(s.id)).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>Fiverr Knowledge Base</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 capitalize">{currentGuide.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isBn ? currentGuide.titleBn || currentGuide.title : currentGuide.title}
          </h1>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Wizard Mode Toggle */}
          <button
            onClick={() => setWizardMode(!wizardMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              wizardMode
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? (wizardMode ? 'উইজার্ড মোড অন' : 'স্টেপ-বাই-স্টেপ মোড') : (wizardMode ? 'Wizard Mode ON' : 'Interactive Mode')}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentGuide.id)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked(currentGuide.id)
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
            }`}
            title="Bookmark this guide"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Guide Switcher vs Right Detailed Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Category Filter Tabs */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 px-1 block">
              {isBn ? 'ক্যাটাগরি অনুযায়ী ফিল্টার:' : 'Filter Topics:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isBn ? 'সব' : 'All'}
              </button>
              {GUIDE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === cat.slug
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isBn ? cat.nameBn : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Guide Sections List */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 px-1 block">
              {isBn ? 'সব গাইড ডকসমূহ:' : 'Guide Modules:'}
            </span>
            
            <div className="space-y-1.5">
              {filteredGuides.map(guide => {
                const isActive = guide.id === currentGuide.id;
                const isDone = isGuideCompleted(guide.id);

                return (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setActiveGuideId(guide.id);
                      setCurrentStepIndex(0);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 border border-emerald-500/40 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : guide.steps.length}
                      </div>
                      <span className="text-xs sm:text-sm truncate">
                        {isBn ? guide.titleBn || guide.title : guide.title}
                      </span>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'translate-x-1 text-emerald-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Filter Quick Select */}
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">{isBn ? 'ডিভাইস ভিউ ফিল্টার:' : 'Filter Steps by Device:'}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveDeviceFilter('all')}
                className={`p-2 rounded-xl font-semibold text-center transition-all cursor-pointer ${
                  activeDeviceFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isBn ? 'সব ডিভাইস' : 'All Devices'}
              </button>
              <button
                onClick={() => setActiveDeviceFilter('mobile')}
                className={`p-2 rounded-xl font-semibold text-center transition-all cursor-pointer ${
                  activeDeviceFilter === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isBn ? 'মোবাইল অপ্টিমাইজড' : 'Mobile Only'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Detailed Step List / Wizard Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Guide Metadata Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Badges & Reading Info */}
            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge level={currentGuide.difficulty} />
              <DeviceBadge availability={currentGuide.devices} />
              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentGuide.estimatedMinutes} {isBn ? 'মিনিট পাঠ' : 'min read'}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn ? currentGuide.descriptionBn || currentGuide.description : currentGuide.description}
            </p>

            {/* What you will learn */}
            {currentGuide.whatYouWillLearn && currentGuide.whatYouWillLearn.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  {isBn ? 'এই গাইডে আপনি শিখবেন:' : 'What You Will Master:'}
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {(isBn && currentGuide.whatYouWillLearnBn ? currentGuide.whatYouWillLearnBn : currentGuide.whatYouWillLearn).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Progress Bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>{isBn ? 'গাইড সমাপ্তির অগ্রগতি' : 'Guide Completion Progress'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

          </div>

          {/* Steps Display: Wizard View vs Full Scroll View */}
          {wizardMode ? (
            /* WIZARD MODE: One Step at a Time */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-1">
                <span>{isBn ? 'ধাপ' : 'Step'} {currentStepIndex + 1} of {currentGuide.steps.length}</span>
                <span>Wizard Mode Active</span>
              </div>

              <StepCard
                step={currentGuide.steps[currentStepIndex]}
                stepIndex={currentStepIndex}
              />

              {/* Wizard Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isBn ? 'আগের ধাপ' : 'Previous Step'}</span>
                </button>

                <button
                  disabled={currentStepIndex === currentGuide.steps.length - 1}
                  onClick={() => setCurrentStepIndex(prev => Math.min(currentGuide.steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* FULL SCROLL VIEW: All Steps Listed */
            <div className="space-y-6">
              {currentGuide.steps.map((step, idx) => (
                <StepCard
                  key={step.id}
                  step={step}
                  stepIndex={idx}
                />
              ))}
            </div>
          )}

          {/* Pro Tips & Mistakes Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Pro Tips */}
            {currentGuide.proTips && currentGuide.proTips.length > 0 && (
              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{isBn ? 'প্রো টিপস ও অভিজ্ঞতা' : 'Pro Tips for Success'}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {(isBn && currentGuide.proTipsBn ? currentGuide.proTipsBn : currentGuide.proTips).map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes */}
            {currentGuide.commonMistakes && currentGuide.commonMistakes.length > 0 && (
              <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{isBn ? 'যে ভুলগুলো এড়িয়ে চলবেন' : 'Common Pitfalls to Avoid'}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {(isBn && currentGuide.commonMistakesBn ? currentGuide.commonMistakesBn : currentGuide.commonMistakes).map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
