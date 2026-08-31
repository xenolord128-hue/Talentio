import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { ServiceCard } from '../components/ServiceCard';
import { FreelancerCard } from '../components/FreelancerCard';
import { 
  Heart, 
  Sparkles, 
  Layers, 
  Users, 
  ArrowRight,
  Bookmark
} from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { 
    savedGigIds, 
    savedFreelancerIds, 
    services, 
    freelancers,
    openGigDetails,
    setSelectedFreelancer,
    setIsHireModalOpen,
    setActivePage
  } = useGuide();

  const [activeTab, setActiveTab] = useState<'gigs' | 'freelancers'>('gigs');

  const savedGigs = services.filter(s => savedGigIds.includes(s.id));
  const savedTalent = freelancers.filter(f => savedFreelancerIds.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Saved Collections</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1A1633] font-display">
            Favorites & Shortlisted Talent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Quickly access your bookmarked marketplace gigs and shortlisted expert talent
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gigs' ? 'bg-white text-[#3D2FD1] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Gigs ({savedGigs.length})
          </button>
          <button
            onClick={() => setActiveTab('freelancers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'freelancers' ? 'bg-white text-[#3D2FD1] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shortlisted Talent ({savedTalent.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'gigs' ? (
        savedGigs.length > 0 ? (
          /* 2-Column Marketplace Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {savedGigs.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelectService={s => openGigDetails(s)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1A1633] font-display">No saved gigs yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Click the heart icon on any gig card in the marketplace to save it to this collection for quick reference.
            </p>
            <button
              onClick={() => setActivePage('marketplace')}
              className="px-5 py-2.5 bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold rounded-2xl cursor-pointer transition-all shadow-md shadow-[#3D2FD1]/20"
            >
              Explore Marketplace Gigs
            </button>
          </div>
        )
      ) : (
        savedTalent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTalent.map(freelancer => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                onHire={f => {
                  setSelectedFreelancer(f);
                  setIsHireModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1A1633] font-display">No shortlisted talent</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Bookmark top verified engineers, designers, and AI specialists to hire them for upcoming project milestones.
            </p>
            <button
              onClick={() => setActivePage('freelancers')}
              className="px-5 py-2.5 bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold rounded-2xl cursor-pointer transition-all shadow-md shadow-[#3D2FD1]/20"
            >
              Browse Top Talent
            </button>
          </div>
        )
      )}

    </div>
  );
};
