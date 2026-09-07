import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Headphones, 
  Briefcase, 
  Users,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useGuide } from '../context/GuideContext';
import talentioBannerFlippedImg from '../assets/images/talentio_banner_flipped.jpg';
import talentioUserBannerImg from '../assets/images/talentio_user_banner.jpg';

const DESKTOP_BANNER_IMG = 'https://i.ibb.co.com/pjRVkqkn/file-00000000243881fda51e55d49f3fd5f8.png';
const MOBILE_BANNER_IMG = 'https://i.ibb.co.com/LXsgHy6p/file-00000000fb6881f893219df2cf9b39c9.png';

export const HomeHeroBanner: React.FC = () => {
  const { 
    setActivePage, 
    setIsPostJobModalOpen, 
    setSearchQuery,
    setSelectedCategory
  } = useGuide();

  const [heroSearch, setHeroSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      if (searchCategory !== 'all') {
        setSelectedCategory(searchCategory);
      }
      setActivePage('freelancers');
    }
  };

  return (
    <section 
      id="homepage-hero-banner"
      className="relative text-white border-b border-[#3D2FD1]/40 overflow-hidden py-12 sm:py-16 lg:py-20 min-h-[460px] sm:min-h-[500px] flex items-center"
      aria-label="Talentio Marketplace Hero Banner"
    >
      {/* ========================================================================= */}
      {/* BANNER BACKGROUND: Responsive Desktop & Mobile Banner Imagery             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture className="w-full h-full block">
          <source
            media="(max-width: 639px)"
            srcSet={MOBILE_BANNER_IMG}
          />
          <source
            media="(min-width: 640px)"
            srcSet={DESKTOP_BANNER_IMG}
          />
          <img
            id="hero-background-image"
            src={DESKTOP_BANNER_IMG}
            alt="Talentio Marketplace Banner"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = talentioBannerFlippedImg;
            }}
            className="w-full h-full object-cover object-center sm:object-right sm:object-[95%_center] lg:object-[98%_center] transform scale-100 transition-transform duration-700"
            loading="eager"
          />
        </picture>
        {/* Soft directional gradient: dark on the left for crisp text contrast, transparent on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C091C]/92 via-[#0C091C]/55 sm:via-[#0C091C]/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0B1F]/60 via-transparent to-[#0E0B1F]/20 pointer-events-none" />
      </div>

      {/* Main Banner Content Container: Buttons, Texts, and Search Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-6 sm:space-y-7">
        
        {/* Top Badges Row: 24/7 Support + Vetted Talent Badge */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          {/* Top Vetted Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16122E]/90 border border-[#6E5BFF]/50 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6E5BFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6E5BFF]" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#A38BFF]" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Top 1% Vetted Freelancers
            </span>
          </div>

          {/* 24/7 Support Button in Banner */}
          <button
            id="banner-support-btn"
            type="button"
            onClick={() => setActivePage('help')}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16122E]/90 hover:bg-[#3D2FD1] border border-[#6E5BFF]/60 text-white text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg active:scale-95 group"
            title="Contact Talentio 24/7 Support"
          >
            <Headphones className="w-4 h-4 text-[#A38BFF] group-hover:text-white transition-colors" />
            <span className="text-white font-semibold">24/7 Live Support</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

        </div>

        {/* Headlines: Refined, subtle, premium drop-shadow for crystal-clear readability */}
        <div className="space-y-2.5 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            Find Talented Freelancers,{' '}
            <span className="text-[#C4B5FD] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Get Work Done
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium max-w-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Hire verified developers, designers, and specialists with institutional milestone escrow protection and 100% money-back guarantee.
          </p>
        </div>

        {/* Core Buttons & Actions Row Inside Banner */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          
          {/* Primary CTA: Explore Freelancers */}
          <button
            id="banner-explore-freelancers-btn"
            type="button"
            onClick={() => setActivePage('freelancers')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white font-bold text-xs sm:text-sm shadow-xl shadow-black/50 hover:shadow-[#6E5BFF]/50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-95 group"
          >
            <Users className="w-4 h-4 text-white" />
            <span>Explore Freelancers</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary CTA: Post a Project */}
          <button
            id="banner-post-project-btn"
            type="button"
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-[#0E0B1F]/90 hover:bg-[#1A1633] text-white border border-white/20 hover:border-white/40 font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-95 shadow-xl backdrop-blur-md"
          >
            <Briefcase className="w-4 h-4 text-[#A38BFF]" />
            <span>Post a Project</span>
          </button>

          {/* Escrow Guarantee Pill */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E0B1F]/90 border border-emerald-400/40 text-xs text-white shadow-xl backdrop-blur-md ml-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-300">100% Escrow Protected</span>
          </div>

        </div>

        {/* Professional Desktop & Mobile Search Bar */}
        <div className="pt-1.5 max-w-3xl">
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#120F24]/95 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/40 dark:border-[#6E5BFF]/30 p-2 gap-2 transition-all focus-within:ring-2 focus-within:ring-[#6E5BFF]/50 backdrop-blur-sm"
          >
            {/* Category dropdown on desktop */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border-r border-slate-200 dark:border-slate-800 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#3D2FD1] shrink-0" />
              <select
                value={searchCategory}
                onChange={e => {
                  setSearchCategory(e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer pr-1"
                aria-label="Filter category"
              >
                <option value="all">All Categories</option>
                <option value="web-dev">Web & SaaS</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="ai-ml">AI & ML</option>
                <option value="mobile">Mobile Apps</option>
                <option value="cloud-devops">Cloud & DevOps</option>
                <option value="growth-seo">Growth & SEO</option>
              </select>
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center px-2 py-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search freelancers by skill, service, or role (e.g. React, UI/UX, AI)..."
                className="w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none py-1.5"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => setHeroSearch('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/30 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Popular Trending Tags Below Search Bar */}
          <div className="flex items-center gap-2 flex-wrap pt-2.5 text-xs">
            <span className="font-bold text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Popular:
            </span>
            {['Web Development', 'UI/UX Design', 'AI Agent', 'Mobile Apps', 'WordPress', 'Python'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setHeroSearch(tag);
                  setSearchQuery(tag);
                  setActivePage('freelancers');
                }}
                className="px-3 py-1 rounded-full bg-[#0E0B1F]/80 hover:bg-[#3D2FD1] text-slate-200 hover:text-white text-xs font-semibold shadow-sm border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
