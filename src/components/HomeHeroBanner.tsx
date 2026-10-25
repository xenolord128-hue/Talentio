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
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#23324A] border border-[#3A5A86]/30 shadow-[0_8px_30px_rgba(35,50,74,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] group"
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
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#23324A]/85 via-[#23324A]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 bg-gradient-to-t from-[#23324A]/95 via-[#23324A]/60 to-transparent pointer-events-none" />

        {/* ======================================================================= */}
        {/* OVERLAY CONTROLS DIRECTLY INSIDE THE BANNER PHOTO                      */}
        {/* ======================================================================= */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5 md:p-6 pointer-events-none">
          
          {/* TOP ROW: Top 1% (LEFT) & 24/7 Live Support (RIGHT) */}
          <div className="flex items-center justify-between w-full gap-2 sm:gap-6 pointer-events-auto">
            
            {/* Top 1% Vetted Freelancers Badge (TOP LEFT) */}
            <div 
              id="banner-top-vetted-badge"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#23324A]/80 hover:bg-[#23324A] border border-[#3A5A86]/40 backdrop-blur-md shadow-lg transition-all shrink-0"
            >
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E3EDF9] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#E3EDF9]" />
              </span>
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#E3EDF9] shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold sm:font-bold text-[#E3EDF9] tracking-wide whitespace-nowrap">
                Top 1% Vetted Freelancers
              </span>
            </div>

            {/* 24/7 Live Support Button (TOP RIGHT) */}
            <button
              id="banner-support-btn"
              type="button"
              onClick={() => setActivePage('help')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#23324A]/80 hover:bg-[#3A5A86] border border-[#3A5A86]/40 hover:border-transparent text-[#E3EDF9] text-[10px] sm:text-xs md:text-sm font-semibold sm:font-bold backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group shrink-0"
              title="Contact Talentio 24/7 Support"
            >
              <Headphones className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#E3EDF9] group-hover:text-white transition-colors shrink-0" />
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
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#3A5A86] via-[#2c4363] to-[#3A5A86] hover:from-[#3A5A86] hover:to-[#23324A] text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/50 border border-[#E3EDF9]/30 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="whitespace-nowrap">Post a Project</span>
              </button>
            </div>

            {/* Search Bar (AT THE VERY BOTTOM OF THE PHOTO) */}
            <form 
              onSubmit={handleSearchSubmit}
              onClick={() => openAppleSearchModal(heroSearch)}
              className="relative flex items-center bg-[#E3EDF9]/95 dark:bg-[#23324A]/95 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#3A5A86]/40 p-1 sm:p-1.5 gap-1 sm:gap-2 backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-[#3A5A86]/70 cursor-pointer group/search"
            >
              {/* Category dropdown on desktop */}
              <div 
                className="hidden md:flex items-center gap-2 px-3 py-1 border-r border-[#3A5A86]/20 dark:border-[#3A5A86]/40 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#3A5A86] dark:text-[#E3EDF9] shrink-0" />
                <select
                  value={searchCategory}
                  onChange={e => {
                    setSearchCategory(e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  className="text-xs font-bold text-[#23324A] dark:text-[#E3EDF9] bg-transparent focus:outline-none cursor-pointer pr-1"
                  aria-label="Filter category"
                >
                  <option value="all" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">All Categories</option>
                  <option value="web-dev" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">Web & SaaS</option>
                  <option value="ui-ux" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">UI/UX Design</option>
                  <option value="ai-ml" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">AI & ML</option>
                  <option value="mobile" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">Mobile Apps</option>
                  <option value="cloud-devops" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">Cloud & DevOps</option>
                  <option value="growth-seo" className="bg-[#E3EDF9] text-[#23324A] dark:bg-[#23324A] dark:text-[#E3EDF9]">Growth & SEO</option>
                </select>
              </div>

              {/* Input field */}
              <div className="relative flex-1 flex items-center px-2 py-0.5 sm:py-1 min-w-0">
                <Search className="w-4 h-4 text-[#3A5A86]/70 dark:text-[#E3EDF9]/70 group-hover/search:text-[#3A5A86] transition-colors shrink-0 mr-1.5 sm:mr-2" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => {
                    setHeroSearch(e.target.value);
                    openAppleSearchModal(e.target.value);
                  }}
                  onFocus={() => openAppleSearchModal(heroSearch)}
                  placeholder="Search freelancers by skill, service, or role..."
                  className="w-full text-xs sm:text-sm text-[#23324A] dark:text-[#E3EDF9] placeholder:text-[#23324A]/60 dark:placeholder:text-[#E3EDF9]/50 bg-transparent focus:outline-none py-1 truncate cursor-pointer"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroSearch('');
                    }}
                    className="p-1 rounded-md text-[#23324A]/60 hover:text-[#23324A] dark:text-[#E3EDF9]/60 dark:hover:text-[#E3EDF9] cursor-pointer mr-1"
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
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#3A5A86] hover:bg-[#23324A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3A5A86]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
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
