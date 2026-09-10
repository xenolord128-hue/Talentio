import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TALENTIO_CATEGORIES } from '../data/talentioData';
import { PROFESSIONAL_CATEGORIES } from '../data/categoriesData';
import { FreelancerCard } from '../components/FreelancerCard';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Star, 
  SlidersHorizontal, 
  Award, 
  ShieldCheck, 
  ArrowUpDown,
  Sparkles,
  Users,
  Briefcase,
  Send,
  DollarSign,
  Clock,
  PlusCircle
} from 'lucide-react';

export const FreelancersPage: React.FC = () => {
  const { 
    freelancers, 
    postedJobs,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setSelectedFreelancer,
    setIsHireModalOpen,
    setIsPostJobModalOpen,
    openProposalModal,
    savedFreelancerIds,
    user
  } = useGuide();

  // Mode: 'talent' (Browse Freelancers) vs 'jobs' (Browse Job Postings & RFPs)
  const [viewMode, setViewMode] = useState<'talent' | 'jobs'>('talent');

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [proOnly, setProOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(150);
  const [sortBy, setSortBy] = useState<'rating' | 'rate_low' | 'rate_high' | 'orders'>('rating');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Filtered Freelancers
  const filteredFreelancers = freelancers.filter(f => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (proOnly && !f.proBadge) return false;
    if (availableOnly && !f.availableNow) return false;
    if (showSavedOnly && !savedFreelancerIds.includes(f.id)) return false;
    if (f.hourlyRate > maxHourlyRate) return false;
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchSkill = f.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchSkill) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'rate_low') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'rate_high') return b.hourlyRate - a.hourlyRate;
    if (sortBy === 'orders') return b.completedOrdersCount - a.completedOrdersCount;
    return 0;
  });

  // Filtered Jobs
  const filteredJobs = postedJobs.filter(job => {
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchSkill = job.skillsRequired.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#1A1633] text-white border border-[#3D2FD1]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3D2FD1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#6E5BFF]/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#3D2FD1]/50 backdrop-blur-md text-[#A38BFF] border border-[#6E5BFF]/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#A38BFF]" />
            <span>Vetted Freelance Talent &amp; Jobs in Bangladesh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display leading-tight">
            {viewMode === 'talent' ? 'Hire Freelancers in Bangladesh & Global Talent' : 'Freelance Jobs & Client Contracts in Bangladesh'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            {viewMode === 'talent' 
              ? 'Connect with top vetted freelancers in Bangladesh and international experts in web development, design, SEO, and marketing — all protected under Talentio Escrow.'
              : 'Explore verified freelance jobs in Bangladesh and international remote projects. Apply with tailored milestone proposals and guaranteed escrow payment.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-bold relative z-10 shadow-lg w-full sm:w-auto">
          <button
            onClick={() => setViewMode('talent')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'talent' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Freelancers ({freelancers.length})</span>
          </button>

          <button
            onClick={() => setViewMode('jobs')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'jobs' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Openings ({postedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        
        {/* Row 1: Search and Category Pills */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-[#3D2FD1] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={localSearch}
              onChange={e => {
                setLocalSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder={viewMode === 'talent' ? "Search by skill, name, or role..." : "Search project contracts..."}
              className="w-full bg-slate-50 text-[#1A1633] placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#6E5BFF] focus:bg-white focus:outline-none text-xs font-medium"
            />
          </div>

          {/* Category Dropdown / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 scrollbar-none">
            {TALENTIO_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#3D2FD1] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-[#F2F0FF] text-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Row 2: Fine-grained Filters for Talent */}
        {viewMode === 'talent' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Pro Badge Filter */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={proOnly}
                  onChange={e => setProOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#3D2FD1] focus:ring-[#6E5BFF]"
                />
                <span className="font-bold text-[#1A1633]">Talentio Pro Only</span>
              </label>

              {/* Available Filter */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={e => setAvailableOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#3D2FD1] focus:ring-[#6E5BFF]"
                />
                <span className="font-medium text-slate-700">Available Now</span>
              </label>

              {/* Saved Only Filter */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSavedOnly}
                  onChange={e => setShowSavedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#3D2FD1] focus:ring-[#6E5BFF]"
                />
                <span className="font-medium text-slate-700">Saved Shortlist ({savedFreelancerIds.length})</span>
              </label>

              {/* Max Hourly Rate Slider */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-500 font-medium">Max Rate:</span>
                <span className="font-bold text-[#3D2FD1]">${maxHourlyRate}/hr</span>
                <input
                  type="range"
                  min="40"
                  max="200"
                  step="10"
                  value={maxHourlyRate}
                  onChange={e => setMaxHourlyRate(Number(e.target.value))}
                  className="w-24 accent-[#3D2FD1] cursor-pointer"
                />
              </div>

            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 text-[#1A1633] px-3 py-1.5 rounded-xl border border-slate-200 focus:border-[#6E5BFF] focus:outline-none font-bold"
              >
                <option value="rating">Top Rated (4.9+ ★)</option>
                <option value="rate_low">Price: Low to High</option>
                <option value="rate_high">Price: High to Low</option>
                <option value="orders">Most Projects Completed</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* TALENT VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'talent' && (
        filteredFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map(freelancer => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                onSelectProfile={f => {
                  setSelectedFreelancer(f);
                  setIsHireModalOpen(true);
                }}
                onHireDirect={f => {
                  setSelectedFreelancer(f);
                  setIsHireModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1A1633]">No freelancers matched your filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your category or rate filter to view our complete global talent database.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setProOnly(false);
                setAvailableOnly(false);
                setShowSavedOnly(false);
                setMaxHourlyRate(200);
                setLocalSearch('');
              }}
              className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* JOBS & RFP VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1A1633]">
              Available Client Project Contracts ({filteredJobs.length})
            </h3>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F2F0FF] text-[#3D2FD1]">
                      {job.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Posted {job.postedAgo}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#1A1633] mb-2 leading-snug">
                    {job.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(job.skills || []).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-700 font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified Budget</span>
                    <strong className="text-sm font-extrabold text-[#3D2FD1] font-mono">
                      ${job.budget} USD ({job.budgetType === 'hourly' ? 'Hourly' : 'Fixed'})
                    </strong>
                  </div>

                  <button
                    onClick={() => openProposalModal(job)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply / Submit Bid</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
