import React from 'react';
import { useGuide } from '../context/GuideContext';
import { FreelancerCard } from '../components/FreelancerCard';
import { ServiceCard } from '../components/ServiceCard';
import { HomeHeroBanner } from '../components/HomeHeroBanner';
import { 
  Users, 
  Briefcase, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    freelancers, 
    services, 
    selectedCategory, 
    setActivePage,
    setSelectedFreelancer,
    setIsHireModalOpen,
    setIsPostJobModalOpen,
    openGigDetails
  } = useGuide();

  const filteredFreelancers = freelancers.filter(f => 
    selectedCategory === 'all' || f.category === selectedCategory
  );

  const filteredServices = services.filter(s =>
    selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      
      {/* 1. COMPACT HERO BANNER WITH BACKGROUND IMAGE, 24/7 SUPPORT, AND ACTIONS */}
      <HomeHeroBanner />

      {/* 2. FREELANCER ACCOUNTS: EXACTLY 2 SIDE-BY-SIDE DIRECTLY UNDER BANNER */}
      <section 
        id="home-featured-freelancers"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
        aria-label="Featured Freelancer Profiles"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2FD1] uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-[#6E5BFF]" />
              <span>Verified Talent</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Featured Freelancers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('freelancers')}
            className="text-xs sm:text-sm font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 cursor-pointer transition-colors p-1"
          >
            <span>View All Freelancers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Freelancers Side-by-Side (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredFreelancers.slice(0, 2).map(freelancer => (
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

      {/* 3. POPULAR GIGS: EXACTLY 2 GIGS SIDE-BY-SIDE DIRECTLY UNDER FREELANCERS */}
      <section 
        id="home-featured-gigs"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
        aria-label="Popular Fixed-Price Gigs"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2FD1] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#6E5BFF]" />
              <span>Fixed-Price Milestone Packages</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Popular Gigs & Services
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('services')}
            className="text-xs sm:text-sm font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 cursor-pointer transition-colors p-1"
          >
            <span>View All Gigs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Gigs Side-by-Side (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredServices.slice(0, 2).map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={() => openGigDetails(service)}
            />
          ))}
        </div>
      </section>

      {/* 4. CLEAN TRUST REASSURANCE STRIP */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="rounded-2xl bg-gradient-to-r from-[#16122E] via-[#1A1633] to-[#16122E] p-5 sm:p-6 text-white border border-[#6E5BFF]/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D2FD1]/30 border border-[#6E5BFF]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#A38BFF]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Talentio Institutional Escrow</div>
              <div className="text-xs text-slate-300">Funds released only after you review and approve deliverables.</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95"
          >
            <span>Post a Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
};
