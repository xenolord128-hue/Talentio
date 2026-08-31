import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TALENTIO_CATEGORIES } from '../data/talentioData';
import { FreelancerCard } from '../components/FreelancerCard';
import { ServiceCard } from '../components/ServiceCard';
import { TalentioLogo } from '../components/TalentioLogo';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Award, 
  Zap, 
  Lock, 
  Globe, 
  Users, 
  Layers, 
  Briefcase, 
  DollarSign, 
  Check, 
  TrendingUp,
  BrainCircuit,
  Code2,
  Palette,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    freelancers, 
    services, 
    postedJobs,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setActivePage,
    setSelectedFreelancer,
    setIsHireModalOpen,
    setSelectedService,
    setIsServiceModalOpen,
    setIsPostJobModalOpen,
    setIsSearchModalOpen,
    openGigDetails,
    currency
  } = useGuide();

  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      setActivePage('freelancers');
    }
  };

  const filteredFreelancers = freelancers.filter(f => 
    selectedCategory === 'all' || f.category === selectedCategory
  );

  const filteredServices = services.filter(s =>
    selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="space-y-12 sm:space-y-20 pb-24">
      
      {/* 1. HERO SECTION (Light Surface: #F2F0FF with Frosted Glass Accents) */}
      <section className="relative bg-gradient-to-b from-[#F2F0FF] via-[#F2F0FF]/90 to-slate-50 border-b border-[#3D2FD1]/10 overflow-hidden py-12 sm:py-24">
        
        {/* Glowing ambient orbs for frosted glassmorphism */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#6E5BFF]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#A38BFF]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#3D2FD1]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
          
          {/* Trust Pill with Glassmorphism & Brand Logo */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-[#1A1633] border border-white shadow-md text-xs sm:text-sm font-bold">
            <TalentioLogo size="xs" variant="black" />
            <div className="flex items-center gap-1.5">
              <span className="text-[#3D2FD1] font-black tracking-tight">TALENTIO</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-700">100% Escrow-Protected Global Marketplace</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl space-y-4 sm:space-y-5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1A1633] tracking-tight leading-[1.15] font-display">
              Hire Vetted Global Talent. <br className="hidden sm:inline" />
              <span className="text-[#3D2FD1] bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] bg-clip-text text-transparent">
                Execute with Escrow Protection.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
              Connect with the top 3% of international engineers, AI specialists, and product designers. Transparent milestone tracking and automated IP agreements built for modern enterprises.
            </p>
          </div>

          {/* Prominent Search Bar with Glassmorphic Frame */}
          <form 
            onSubmit={handleHeroSearchSubmit}
            className="max-w-3xl rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-2xl shadow-[#3D2FD1]/15 border border-white ring-1 ring-[#3D2FD1]/10 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="flex items-center gap-3 px-3.5 w-full flex-1 min-h-[48px]">
              <Search className="w-5 h-5 text-[#3D2FD1] shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search 'Figma SaaS Design', 'AI Agent LangGraph', 'React 19'..."
                className="w-full text-sm sm:text-base font-medium text-[#1A1633] placeholder:text-slate-400 focus:outline-none py-2 bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white text-sm font-bold shadow-lg shadow-[#3D2FD1]/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[48px] active:scale-95"
            >
              <span>Find Talent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm">
            <span className="font-bold text-[#1A1633]">Trending Specialties:</span>
            {[
              { label: 'AI & LangChain', cat: 'ai-ml' },
              { label: 'SaaS Figma UI/UX', cat: 'ui-ux' },
              { label: 'Next.js 15 Full-Stack', cat: 'web-dev' },
              { label: 'DevOps & Kubernetes', cat: 'cloud-devops' }
            ].map(tag => (
              <button
                key={tag.label}
                onClick={() => {
                  setSelectedCategory(tag.cat);
                  setActivePage('freelancers');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-sm hover:bg-white text-[#1A1633] hover:text-[#3D2FD1] border border-white/80 shadow-sm transition-all font-semibold cursor-pointer active:scale-95"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Verified Stats Strip with Glassmorphic Cards */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#3D2FD1] font-display">$48M+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">Escrow Funds Protected</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#1A1633] font-display">12,500+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">Vetted Global Freelancers</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#3D2FD1] font-display">99.4%</div>
              <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">On-Time Milestone Rate</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#1A1633] font-display">140+</div>
              <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">Countries Represented</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#3D2FD1] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#6E5BFF]" />
              <span>Explore Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1633] tracking-tight mt-1 font-display">
              Browse Top Digital Specialties
            </h2>
          </div>

          <button
            onClick={() => setActivePage('services')}
            className="text-xs sm:text-sm font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1.5 cursor-pointer transition-colors p-1"
          >
            <span>View All Fixed Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {TALENTIO_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-lg shadow-[#3D2FD1]/25 scale-102'
                    : 'bg-white hover:bg-[#F2F0FF] text-[#1A1633] border border-slate-200 shadow-sm active:scale-95'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-white/25 text-white' : 'bg-[#F2F0FF] text-[#3D2FD1]'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </section>

      {/* 3. FEATURED VETTED TALENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Featured Vetted Freelancers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Top-rated contractors with 100% verified identities and client reviews</p>
          </div>

          <button
            onClick={() => setActivePage('freelancers')}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-[#3D2FD1] text-[#3D2FD1] hover:bg-[#F2F0FF] text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center"
          >
            See All Talent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.slice(0, 3).map(freelancer => (
            <FreelancerCard
              key={freelancer.id}
              freelancer={freelancer}
              onSelectProfile={(f) => {
                setSelectedFreelancer(f);
                setIsHireModalOpen(true);
              }}
              onHireDirect={(f) => {
                setSelectedFreelancer(f);
                setIsHireModalOpen(true);
              }}
            />
          ))}
        </div>

      </section>

      {/* 4. TRENDING FIXED SERVICES & GIGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Popular Fixed-Price Milestone Packages
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Instant purchasing with transparent deliverables and milestone escrow</p>
          </div>

          <button
            onClick={() => setActivePage('services')}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-[#3D2FD1] text-[#3D2FD1] hover:bg-[#F2F0FF] text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center"
          >
            Explore Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredServices.slice(0, 4).map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={() => openGigDetails(service)}
            />
          ))}
        </div>

      </section>

      {/* 5. HOW TALENTIO ESCROW WORKS (Frosted Glassmorphism in Dark #1A1633 Canvas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1A1633] text-white p-6 sm:p-12 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden space-y-10">
          
          {/* Subtle frosted glass ambient glow behind the dark container */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#6E5BFF]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#3D2FD1]/30 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#3D2FD1]/50 text-[#A38BFF] border border-[#6E5BFF]/30 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-[#A38BFF]" />
              <span>Talentio Escrow Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display">
              Zero Risk. Total Security. Built for Enterprise Scale.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Traditional freelancing platforms expose clients to non-delivery and freelancers to non-payment. Talentio’s smart escrow eliminates both.
            </p>
          </div>

          {/* 3 Step Process with Frosted Glass Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10">
            
            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#6E5BFF]/50 hover:bg-white/10 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D2FD1] to-[#6E5BFF] text-white flex items-center justify-center font-black text-base shadow-md">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Fund Project Milestones</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deposit funds safely into Talentio Escrow. The freelancer begins work knowing payment is 100% secured in holding.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#6E5BFF]/50 hover:bg-white/10 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6E5BFF] to-[#A38BFF] text-white flex items-center justify-center font-black text-base shadow-md">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Collaborate in Workstation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Review work in progress, verify deliverables, and request revisions seamlessly with built-in IP ownership transfers.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4 hover:border-[#6E5BFF]/50 hover:bg-white/10 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A38BFF] to-[#F2F0FF] text-[#1A1633] flex items-center justify-center font-black text-base shadow-md">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Approve & Release Funds</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Release milestone payouts only when you are 100% satisfied. Multi-currency international payouts clear instantly.
              </p>
            </div>

          </div>

          {/* CTA Row */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-[#6E5BFF] shrink-0" />
              <span>Free project posting • No hidden fees • Verified talent network</span>
            </div>

            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#3D2FD1]/50 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Post a Project Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. OPEN CLIENT PROJECTS / JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Active Client Projects & RFP Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">High-budget contracts ready for proposals</p>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center"
          >
            Post Your Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {postedJobs.slice(0, 3).map(job => (
            <div
              key={job.id}
              className="p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-[#6E5BFF]/50 shadow-sm hover:shadow-xl hover:shadow-[#3D2FD1]/10 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F2F0FF] text-[#3D2FD1] border border-[#3D2FD1]/15">
                    {job.category}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">{job.postedAgo}</span>
                </div>

                <h4 className="font-extrabold text-base sm:text-lg text-[#1A1633] line-clamp-2">
                  {job.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#F2F0FF] text-[#3D2FD1]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Budget</span>
                  <span className="text-base sm:text-lg font-black text-[#3D2FD1]">
                    ${job.budget} {job.budgetType === 'hourly' ? '/hr' : 'Fixed'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActivePage('chat');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center cursor-pointer shadow-md shadow-[#3D2FD1]/20"
                >
                  Submit Proposal
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
