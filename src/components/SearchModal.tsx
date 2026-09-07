import React, { useState, useEffect, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Search, 
  X, 
  Sparkles, 
  Users, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Briefcase,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    freelancers, 
    services, 
    setSelectedFreelancer, 
    setIsHireModalOpen,
    setSelectedService,
    setIsServiceModalOpen,
    setActivePage,
    searchQuery,
    setSearchQuery
  } = useGuide();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'freelancers' | 'services'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with global searchQuery when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery(searchQuery || '');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isSearchModalOpen, searchQuery]);

  // Keyboard shortcut handler (Esc to close, Enter to submit search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchModalOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSearchModalOpen(false);
      } else if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        handleSearchAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, query]);

  if (!isSearchModalOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredFreelancers = freelancers.filter(f => {
    if (!normalizedQuery) return true;
    return (
      f.name.toLowerCase().includes(normalizedQuery) ||
      f.title.toLowerCase().includes(normalizedQuery) ||
      f.skills.some(s => s.toLowerCase().includes(normalizedQuery)) ||
      (f.category && f.category.toLowerCase().includes(normalizedQuery)) ||
      (f.country && f.country.toLowerCase().includes(normalizedQuery))
    );
  });

  const filteredServices = services.filter(s => {
    if (!normalizedQuery) return true;
    return (
      s.title.toLowerCase().includes(normalizedQuery) ||
      (s.freelancerName && s.freelancerName.toLowerCase().includes(normalizedQuery)) ||
      (s.category && s.category.toLowerCase().includes(normalizedQuery)) ||
      s.tags.some(t => t.toLowerCase().includes(normalizedQuery))
    );
  });

  const quickPills = [
    'Figma UI/UX',
    'AI Agents',
    'React 19',
    'Python SaaS',
    'Mobile Apps',
    'DevOps Cloud',
    'SEO Growth'
  ];

  const handleSearchAll = (customQuery?: string) => {
    const term = customQuery !== undefined ? customQuery : query;
    if (term.trim()) {
      setSearchQuery(term.trim());
      if (filterType === 'services') {
        setActivePage('services');
      } else {
        setActivePage('freelancers');
      }
    }
    setIsSearchModalOpen(false);
  };

  const handleSelectFreelancer = (f: typeof freelancers[0]) => {
    setSelectedFreelancer(f);
    setIsHireModalOpen(true);
    setIsSearchModalOpen(false);
  };

  const handleSelectService = (s: typeof services[0]) => {
    setSelectedService(s);
    setIsServiceModalOpen(true);
    setIsSearchModalOpen(false);
  };

  return (
    <div 
      id="apple-spotlight-search-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 bg-black/60 dark:bg-black/75 backdrop-blur-xl sm:backdrop-blur-2xl animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
      aria-label="Spotlight Search"
    >
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={() => setIsSearchModalOpen(false)} 
        aria-hidden="true"
      />

      {/* Apple-Themed Glassmorphism Modal Panel */}
      <div 
        id="apple-spotlight-modal-panel"
        className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white/85 dark:bg-[#120D26]/85 backdrop-blur-2xl border border-white/60 dark:border-white/15 text-slate-900 dark:text-white shadow-[0_25px_80px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.7)] overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Apple Spotlight Top Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200/70 dark:border-white/10 flex items-center gap-2.5 sm:gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-md">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3D2FD1]/10 dark:bg-[#6E5BFF]/20 flex items-center justify-center text-[#3D2FD1] dark:text-[#A38BFF] shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search talent, skills, services, or categories..."
            className="w-full text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent min-h-[38px]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/15 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Apple-style Desktop ESC pill & Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
            title="Close modal (Esc)"
          >
            <span className="hidden sm:inline font-mono">esc</span>
            <X className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        {/* Filter Segmented Controls & Quick Trending Pills */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50/60 dark:bg-white/5 border-b border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-black/40 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#3D2FD1] text-[#3D2FD1] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('freelancers')}
              className={`px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterType === 'freelancers'
                  ? 'bg-white dark:bg-[#3D2FD1] text-[#3D2FD1] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Talent ({filteredFreelancers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('services')}
              className={`px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                filterType === 'services'
                  ? 'bg-white dark:bg-[#3D2FD1] text-[#3D2FD1] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Services ({filteredServices.length})
            </button>
          </div>

          {/* Quick Trending Suggestions */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 overflow-x-auto py-0.5">
            <span className="shrink-0 flex items-center gap-1 font-semibold text-slate-400">
              <TrendingUp className="w-3 h-3 text-[#3D2FD1] dark:text-[#A38BFF]" />
              Trending:
            </span>
            {quickPills.slice(0, 4).map(pill => (
              <button
                key={pill}
                type="button"
                onClick={() => {
                  setQuery(pill);
                  handleSearchAll(pill);
                }}
                className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/10 hover:bg-[#3D2FD1] hover:text-white dark:hover:bg-[#3D2FD1] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Action Row: Press Enter or Tap to view all matching results */}
        {query.trim() && (
          <div 
            onClick={() => handleSearchAll()}
            className="px-4 py-2.5 bg-[#3D2FD1]/10 dark:bg-[#6E5BFF]/15 hover:bg-[#3D2FD1]/20 border-b border-[#3D2FD1]/20 flex items-center justify-between text-xs font-semibold text-[#3D2FD1] dark:text-[#A38BFF] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search all results for <strong className="underline">"{query}"</strong> in marketplace</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="hidden sm:inline">Press ↵</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Results List Section */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 divide-y divide-slate-200/60 dark:divide-white/10">
          
          {/* Freelancers Match Section */}
          {(filterType === 'all' || filterType === 'freelancers') && filteredFreelancers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#3D2FD1] dark:text-[#A38BFF]" />
                  Top Vetted Freelancers ({filteredFreelancers.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleSearchAll()}
                  className="text-[11px] font-bold text-[#3D2FD1] dark:text-[#A38BFF] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1.5">
                {filteredFreelancers.slice(0, 5).map(f => (
                  <div
                    key={f.id}
                    onClick={() => handleSelectFreelancer(f)}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-transparent hover:border-slate-200 dark:hover:border-white/15 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#3D2FD1]/30"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#120D26]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3D2FD1] dark:group-hover:text-[#A38BFF] truncate transition-colors">
                            {f.name}
                          </h4>
                          {f.verifiedBadge && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF] shrink-0" />
                          )}
                          <span className="text-[10px] text-slate-400 shrink-0">{f.countryFlag}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{f.title}</p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {f.skills.slice(0, 3).map(skill => (
                            <span 
                              key={skill} 
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-[#3D2FD1] dark:text-[#A38BFF] block">
                        ${f.hourlyRate}/hr
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 justify-end mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{f.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Match Section */}
          {(filterType === 'all' || filterType === 'services') && filteredServices.length > 0 && (
            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#3D2FD1] dark:text-[#A38BFF]" />
                  Direct Fixed Gigs & Services ({filteredServices.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(query);
                    setActivePage('services');
                    setIsSearchModalOpen(false);
                  }}
                  className="text-[11px] font-bold text-[#3D2FD1] dark:text-[#A38BFF] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1.5">
                {filteredServices.slice(0, 5).map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectService(s)}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-transparent hover:border-slate-200 dark:hover:border-white/15 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.coverImage}
                        alt={s.title}
                        className="w-12 h-10 rounded-xl object-cover ring-1 ring-[#3D2FD1]/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3D2FD1] dark:group-hover:text-[#A38BFF] truncate transition-colors">
                          {s.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          <span>by {s.freelancerName}</span>
                          <span>•</span>
                          <span>{s.deliveryDays}d delivery</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-[#3D2FD1] dark:text-[#A38BFF] block">
                        From ${s.startingPrice}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 justify-end mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{s.rating} ({s.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no matches */}
          {filteredFreelancers.length === 0 && filteredServices.length === 0 && (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 text-[#3D2FD1] dark:text-[#A38BFF] flex items-center justify-center mx-auto border border-slate-200 dark:border-white/10">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No exact match found for "{query}"
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try searching for broader skills like "Figma", "React", "AI Agent", or post a custom project with Escrow protection.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer"
                >
                  Clear Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setActivePage('post-job');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3D2FD1] text-xs font-bold text-white shadow-sm hover:bg-[#2F23A3] cursor-pointer"
                >
                  Post a Project
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Apple Spotlight Footer */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-black/30 backdrop-blur-md border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Escrow Protected Talent Marketplace</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
            <span>Navigate: [Click/Tap]</span>
            <span>Select: [↵ Enter]</span>
            <span>Dismiss: [esc]</span>
          </div>
        </div>

      </div>

    </div>
  );
};
