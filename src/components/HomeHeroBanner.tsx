import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Headphones, 
  Briefcase, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useGuide } from '../context/GuideContext';
import talentioBannerFlippedImg from '../assets/images/talentio_banner_flipped.jpg';

const DESKTOP_BANNER_IMG = 'https://i.ibb.co.com/pjRVkqkn/file-00000000243881fda51e55d49f3fd5f8.png';
const MOBILE_BANNER_IMG = 'https://i.ibb.co.com/LXsgHy6p/file-00000000fb6881f893219df2cf9b39c9.png';

export const HomeHeroBanner: React.FC = () => {
  const { 
    setActivePage, 
    setIsPostJobModalOpen, 
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setIsSearchModalOpen
  } = useGuide();

  const [heroSearch, setHeroSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const openAppleSearchModal = (initialText?: string) => {
    if (initialText !== undefined && initialText.trim()) {
      setSearchQuery(initialText);
    }
    setIsSearchModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      if (searchCategory !== 'all') {
        setSelectedCategory(searchCategory);
      }
    }
    openAppleSearchModal(heroSearch);
  };

  return (
    <section 
      id="homepage-hero-banner"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2"
      aria-label="Talentio Marketplace Hero & Social Banner"
    >
      {/* Semantic Primary SEO Heading */}
      <h1 className="sr-only">Talentio — Freelance Marketplace Bangladesh | Hire Freelancers &amp; Find Jobs</h1>

      {/* ========================================================================= */}
      {/* SOCIAL BANNER WITH EMBEDDED CONTROLS:                                     */}
      {/* - Top Left: Top 1% Vetted Freelancers                                     */}
      {/* - Top Right: 24/7 Live Support                                            */}
      {/* - Bottom Left (Above Search): Post a Project                              */}
      {/* - Bottom (Very Bottom of Photo): Search Bar                               */}
      {/* ========================================================================= */}
      <div 
        id="social-banner-container"
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0C091C] border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_36px_rgb(0,0,0,0.5)] group"
      >
        {/* Banner Images for Mobile & Desktop */}
        <picture className="w-full block">
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
            alt="Talentio — Freelance Marketplace Bangladesh"
            referrerPolicy="no-referrer"
            width={1024}
            height={512}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = talentioBannerFlippedImg;
            }}
            className="w-full h-auto object-cover sm:object-contain object-center block mx-auto"
            loading="eager"
          />
        </picture>

        {/* Soft Contrast Gradients: Ensures all text and controls are 100% crystal clear */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 bg-gradient-to-t from-[#0C091C]/95 via-[#0C091C]/60 to-transparent pointer-events-none" />

        {/* ======================================================================= */}
        {/* OVERLAY CONTROLS DIRECTLY INSIDE THE BANNER PHOTO                      */}
        {/* ======================================================================= */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5 md:p-6 pointer-events-none">
          
          {/* TOP ROW: Top 1% (LEFT) & 24/7 Live Support (RIGHT) */}
          <div className="flex items-center justify-between w-full gap-2 sm:gap-6 pointer-events-auto">
            
            {/* Top 1% Vetted Freelancers Badge (TOP LEFT) */}
            <div 
              id="banner-top-vetted-badge"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/65 hover:bg-black/80 border border-white/25 backdrop-blur-md shadow-lg transition-all shrink-0"
            >
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6E5BFF] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#6E5BFF]" />
              </span>
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#A38BFF] shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold sm:font-bold text-white tracking-wide whitespace-nowrap">
                Top 1% Vetted Freelancers
              </span>
            </div>

            {/* 24/7 Live Support Button (TOP RIGHT) */}
            <button
              id="banner-support-btn"
              type="button"
              onClick={() => setActivePage('help')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/65 hover:bg-[#3D2FD1] border border-white/25 hover:border-transparent text-white text-[10px] sm:text-xs md:text-sm font-semibold sm:font-bold backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group shrink-0"
              title="Contact Talentio 24/7 Support"
            >
              <Headphones className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#A38BFF] group-hover:text-white transition-colors shrink-0" />
              <span className="whitespace-nowrap">24/7 Live Support</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5 shrink-0" />
            </button>
          </div>

          {/* BOTTOM CONTROLS: Post a Project (LEFT) & Search Bar (VERY BOTTOM) */}
          <div className="w-full space-y-2 sm:space-y-3 pointer-events-auto">
            
            {/* Post a Project Button (LEFT SIDE, ABOVE SEARCH BAR) */}
            <div className="flex items-center justify-start">
              <button
                id="banner-post-project-btn"
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#5644FF] to-[#3D2FD1] hover:from-[#4D3EE0] hover:to-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/50 border border-white/25 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="whitespace-nowrap">Post a Project</span>
              </button>
            </div>

            {/* Search Bar (AT THE VERY BOTTOM OF THE PHOTO) */}
            <form 
              onSubmit={handleSearchSubmit}
              onClick={() => openAppleSearchModal(heroSearch)}
              className="relative flex items-center bg-white/95 dark:bg-[#120F24]/95 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/40 dark:border-[#6E5BFF]/40 p-1 sm:p-1.5 gap-1 sm:gap-2 backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-[#6E5BFF]/60 cursor-pointer group/search"
            >
              {/* Category dropdown on desktop */}
              <div 
                className="hidden md:flex items-center gap-2 px-3 py-1 border-r border-slate-200 dark:border-slate-800 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#3D2FD1] dark:text-[#A38BFF] shrink-0" />
                <select
                  value={searchCategory}
                  onChange={e => {
                    setSearchCategory(e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer pr-1"
                  aria-label="Filter category"
                >
                  <option value="all" className="dark:bg-[#120F24]">All Categories</option>
                  <option value="web-dev" className="dark:bg-[#120F24]">Web & SaaS</option>
                  <option value="ui-ux" className="dark:bg-[#120F24]">UI/UX Design</option>
                  <option value="ai-ml" className="dark:bg-[#120F24]">AI & ML</option>
                  <option value="mobile" className="dark:bg-[#120F24]">Mobile Apps</option>
                  <option value="cloud-devops" className="dark:bg-[#120F24]">Cloud & DevOps</option>
                  <option value="growth-seo" className="dark:bg-[#120F24]">Growth & SEO</option>
                </select>
              </div>

              {/* Input field */}
              <div className="relative flex-1 flex items-center px-2 py-0.5 sm:py-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 group-hover/search:text-[#3D2FD1] transition-colors shrink-0 mr-1.5 sm:mr-2" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => {
                    setHeroSearch(e.target.value);
                    openAppleSearchModal(e.target.value);
                  }}
                  onFocus={() => openAppleSearchModal(heroSearch)}
                  placeholder="Search freelancers by skill, service, or role..."
                  className="w-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none py-1 truncate cursor-pointer"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroSearch('');
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                  openAppleSearchModal(heroSearch);
                }}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#3D2FD1] hover:bg-[#2F23A3] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Search</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
