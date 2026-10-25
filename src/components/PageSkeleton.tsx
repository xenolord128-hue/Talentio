import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse" role="status" aria-label="Loading page content">
      {/* Top Banner Skeleton */}
      <div className="h-40 sm:h-56 w-full rounded-2xl bg-slate-200/60 dark:bg-[#354a6b]/40 border border-slate-300/40 dark:border-[#3A5A86]/30 flex flex-col justify-end p-6 space-y-3">
        <div className="h-6 w-1/3 bg-slate-300/70 dark:bg-[#E3EDF9]/20 rounded-lg" />
        <div className="h-4 w-1/2 bg-slate-300/50 dark:bg-[#E3EDF9]/10 rounded-md" />
      </div>

      {/* Filter / Tabs Bar Skeleton */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden py-1">
        <div className="h-9 w-20 sm:w-24 bg-slate-200/70 dark:bg-[#354a6b]/50 rounded-full flex-shrink-0" />
        <div className="h-9 w-24 sm:w-28 bg-slate-200/50 dark:bg-[#354a6b]/30 rounded-full flex-shrink-0" />
        <div className="h-9 w-20 sm:w-24 bg-slate-200/50 dark:bg-[#354a6b]/30 rounded-full flex-shrink-0" />
        <div className="h-9 w-28 sm:w-32 bg-slate-200/40 dark:bg-[#354a6b]/20 rounded-full flex-shrink-0 hidden xs:block" />
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl p-4 bg-slate-100/70 dark:bg-[#2c3e5a]/50 border border-slate-200/60 dark:border-[#3A5A86]/30 space-y-4"
          >
            <div className="h-40 w-full rounded-xl bg-slate-200/80 dark:bg-[#354a6b]/60" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-slate-300/70 dark:bg-[#E3EDF9]/20 rounded" />
              <div className="h-3 w-1/2 bg-slate-300/50 dark:bg-[#E3EDF9]/15 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-[#3A5A86]/20">
              <div className="h-5 w-16 bg-slate-300/60 dark:bg-[#E3EDF9]/20 rounded" />
              <div className="h-7 w-20 bg-slate-300/70 dark:bg-[#3A5A86]/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
};
