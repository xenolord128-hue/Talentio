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
  ArrowRight,
  Sparkles,
  Code2,
  Palette,
  TrendingUp,
  Video,
  PenTool,
  Lock,
  Search
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
    openGigDetails,
    openCategoryMarketplace
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
              Find Skilled Freelancers &amp; Bangladeshi Talent
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
              Explore Freelance Services &amp; Popular Gigs in Bangladesh
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

      {/* 5. HOW TALENTIO WORKS: HOW CLIENTS HIRE & HOW FREELANCERS FIND WORK */}
      <section 
        id="home-how-it-works"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4"
        aria-label="How Talentio Works"
      >
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#3D2FD1]" />
            <span>Trusted Marketplace Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1633] font-display">
            How Talentio Works for Clients &amp; Freelancers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Talentio is Bangladesh&apos;s leading freelance marketplace connecting businesses, startups, and clients with skilled Bangladeshi freelancers and vetted international experts under smart escrow protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column A: For Clients - How to Hire Freelancers in Bangladesh */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1A1633] font-display">
                  For Clients: Hire Skilled Talent
                </h3>
                <p className="text-xs text-slate-500 font-medium">Safe milestone hiring with guaranteed deliverables</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Browse Profiles or Post a Job</strong>
                  <span>Discover top-rated Bangladeshi freelancers across web development, design, SEO, and marketing, or post your custom project requirements with budget and timeline.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Fund Escrow with Peace of Mind</strong>
                  <span>Lock project milestone payments into Talentio&apos;s cryptographic escrow vault. Freelancers commence work knowing funds are reserved, while you retain total approval control.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Review &amp; Release Payment</strong>
                  <span>Inspect submitted files and prototypes. Request revisions or approve deliverables to release milestone payments to the freelancer instantly.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActivePage('freelancers')}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#F2F0FF] hover:bg-[#3D2FD1] text-[#3D2FD1] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse Freelancers in Bangladesh</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column B: For Freelancers - How to Find Freelance Jobs & Work Online */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1A1633] font-display">
                  For Freelancers: Find Jobs &amp; Get Paid
                </h3>
                <p className="text-xs text-slate-500 font-medium">Verified contracts with secured escrow payouts</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D2FD1]/10 text-[#3D2FD1] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Build Your Professional Showcase</strong>
                  <span>Create your verified freelancer profile, list your technical competencies, set hourly rates, and publish fixed-price gigs with milestone breakdown.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D2FD1]/10 text-[#3D2FD1] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Submit Proposals to Verified Projects</strong>
                  <span>Browse open freelance jobs in Bangladesh and global remote client contracts. Apply with tailored milestone offers and clear delivery dates.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D2FD1]/10 text-[#3D2FD1] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <strong className="text-[#1A1633] block font-bold">Deliver Work &amp; Withdraw Earnings</strong>
                  <span>Upload completed milestones through the secure Workstation. Once accepted, earnings are available for withdrawal with real-time currency conversion.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActivePage('services')}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-[#1A1633] text-[#1A1633] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Open Services &amp; Gigs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. POPULAR FREELANCE SPECIALTIES IN BANGLADESH */}
      <section 
        id="home-specialties-grid"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5"
        aria-label="Popular Freelance Specialties in Bangladesh"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3D2FD1] uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
              <span>In-Demand Disciplines</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              Popular Freelance Disciplines in Bangladesh
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('categories')}
            className="text-xs sm:text-sm font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 cursor-pointer transition-colors p-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <button
            type="button"
            onClick={() => openCategoryMarketplace('web-dev')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">Web Development</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Next.js, React, Node.js</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCategoryMarketplace('ui-ux')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">Graphic Design</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Figma, Logo &amp; UI/UX</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCategoryMarketplace('growth-seo')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">SEO &amp; Growth</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Technical &amp; Local SEO</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCategoryMarketplace('growth-seo')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">Content Writing</div>
              <div className="text-[11px] text-slate-500 mt-0.5">SEO Articles &amp; Copy</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCategoryMarketplace('brand-3d')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">Video Editing</div>
              <div className="text-[11px] text-slate-500 mt-0.5">YouTube, Reels &amp; Motion</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCategoryMarketplace('ai-ml')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#3D2FD1] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">AI &amp; Automation</div>
              <div className="text-[11px] text-slate-500 mt-0.5">LLMs &amp; Workflows</div>
            </div>
          </button>

        </div>
      </section>

    </div>
  );
};
