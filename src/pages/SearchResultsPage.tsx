import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { ServiceCard } from '../components/ServiceCard';
import { FreelancerCard } from '../components/FreelancerCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  Layers, 
  Users, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    services, 
    freelancers,
    setActivePage,
    setSelectedCategory,
    openGigDetails,
    setSelectedFreelancer,
    setIsHireModalOpen
  } = useGuide();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState<'gigs' | 'freelancers'>('gigs');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'delivery'>('rating');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
  };

  const q = searchQuery.toLowerCase().trim();

  // Filter Gigs
  let matchingServices = services.filter(s => {
    if (!q) return true;
    const matchTitle = s.title.toLowerCase().includes(q);
    const matchSeller = s.freelancerName.toLowerCase().includes(q);
    const matchCategory = s.category.toLowerCase().includes(q);
    const matchTag = s.tags.some(t => t.toLowerCase().includes(q));
    return matchTitle || matchSeller || matchCategory || matchTag;
  });

  // Sort Gigs
  matchingServices = [...matchingServices].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
    if (sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    return 0;
  });

  // Filter Freelancers
  const matchingFreelancers = freelancers.filter(f => {
    if (!q) return true;
    const matchName = f.name.toLowerCase().includes(q);
    const matchTitle = f.title.toLowerCase().includes(q);
    const matchSkill = f.skills.some(sk => sk.toLowerCase().includes(q));
    const matchBio = f.bio.toLowerCase().includes(q);
    return matchName || matchTitle || matchSkill || matchBio;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      
      {/* Search Header Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
          <Search className="w-5 h-5 text-[#3D2FD1] absolute left-4 top-4" />
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search gigs, skills, talent (e.g. Figma, Next.js, AI Agent)..."
            className="w-full bg-white text-[#1A1633] placeholder:text-slate-400 pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus:border-[#3D2FD1] focus:outline-none text-sm sm:text-base font-medium"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                setSearchQuery('');
              }}
              className="absolute right-20 top-4 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-2 bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Marketplace Gigs'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Found {matchingServices.length} gigs and {matchingFreelancers.length} talent profiles
            </p>
          </div>

          {/* View Tabs & Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab('gigs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'gigs' ? 'bg-white text-[#3D2FD1] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gigs ({matchingServices.length})
              </button>
              <button
                onClick={() => setActiveTab('freelancers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'freelancers' ? 'bg-white text-[#3D2FD1] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Talent ({matchingFreelancers.length})
              </button>
            </div>

            {activeTab === 'gigs' && (
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#3D2FD1]"
              >
                <option value="rating">Sort: Highest Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="delivery">Fastest Delivery</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main Results View */}
      {activeTab === 'gigs' ? (
        matchingServices.length > 0 ? (
          /* 2-Column Marketplace Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {matchingServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelectService={s => openGigDetails(s)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No gigs matching "{searchQuery}"</h3>
            <p className="text-xs text-slate-500">
              Try searching with broader terms such as "Figma", "Design", "Python", "React", or "AI".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInputVal('');
              }}
              className="px-4 py-2 bg-[#3D2FD1] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Clear Search Query
            </button>
          </div>
        )
      ) : (
        matchingFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingFreelancers.map(freelancer => (
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
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No freelancers found</h3>
            <p className="text-xs text-slate-500">
              Try exploring all available verified talent profiles.
            </p>
            <button
              onClick={() => setActivePage('freelancers')}
              className="px-4 py-2 bg-[#3D2FD1] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Browse All Freelancers
            </button>
          </div>
        )
      )}

    </div>
  );
};
