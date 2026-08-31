import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { 
  Search, 
  X, 
  Sparkles, 
  Users, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  DollarSign,
  TrendingUp,
  BrainCircuit,
  Code2,
  Palette
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
    setActivePage
  } = useGuide();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'freelancers' | 'services'>('all');

  if (!isSearchModalOpen) return null;

  const filteredFreelancers = freelancers.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const quickPills = [
    'Figma Design',
    'AI Agents',
    'React 19',
    'Kubernetes',
    'SEO Growth',
    'Full-Stack SaaS'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-150">
      
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSearchModalOpen(false)} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl rounded-[28px] ios-glass text-[#1A1633] shadow-[0_25px_80px_rgba(26,22,51,0.35)] border border-white/80 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#A38BFF]/20 flex items-center gap-3">
          <TalentioLogo size="xs" variant="black" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search vetted talent by skill, role, or fixed service..."
            autoFocus
            className="w-full text-sm sm:text-base font-medium text-[#1A1633] placeholder:text-slate-400 focus:outline-none bg-transparent min-h-[36px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 min-w-[36px] min-h-[36px] rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-3.5 py-2 min-h-[44px] rounded-xl bg-slate-100/80 hover:bg-slate-200 border border-[#A38BFF]/30 text-xs font-semibold text-slate-600 cursor-pointer flex items-center justify-center"
          >
            Esc
          </button>
        </div>

        {/* Filter Tabs & Quick Suggestions */}
        <div className="p-3.5 sm:p-4 bg-[#F2F0FF]/80 backdrop-blur-md border-b border-[#A38BFF]/20 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl font-semibold transition-all cursor-pointer flex items-center justify-center ${
                filterType === 'all'
                  ? 'bg-[#3D2FD1] text-white shadow-sm'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-[#A38BFF]/20'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setFilterType('freelancers')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl font-semibold transition-all cursor-pointer flex items-center justify-center ${
                filterType === 'freelancers'
                  ? 'bg-[#3D2FD1] text-white shadow-sm'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-[#A38BFF]/20'
              }`}
            >
              Talent ({filteredFreelancers.length})
            </button>
            <button
              onClick={() => setFilterType('services')}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl font-semibold transition-all cursor-pointer flex items-center justify-center ${
                filterType === 'services'
                  ? 'bg-[#3D2FD1] text-white shadow-sm'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-[#A38BFF]/20'
              }`}
            >
              Services ({filteredServices.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Quick:</span>
            {quickPills.slice(0, 3).map(pill => (
              <button
                key={pill}
                onClick={() => setQuery(pill)}
                className="px-2.5 py-1.5 rounded-lg bg-white/90 text-[#3D2FD1] font-medium hover:bg-white border border-[#A38BFF]/20"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#A38BFF]/15">
          
          {/* Freelancers Match Section */}
          {(filterType === 'all' || filterType === 'freelancers') && filteredFreelancers.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Vetted Freelancers
              </span>
              <div className="space-y-2">
                {filteredFreelancers.map(f => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedFreelancer(f);
                      setIsHireModalOpen(true);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-3.5 min-h-[48px] rounded-2xl hover:bg-white/90 bg-white/40 backdrop-blur-sm border border-transparent hover:border-[#A38BFF]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#A38BFF]/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-[#1A1633] group-hover:text-[#3D2FD1]">
                            {f.name}
                          </h4>
                          {f.verifiedBadge && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                          )}
                          <span className="text-[10px] text-slate-400">{f.countryFlag}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{f.title}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#3D2FD1]">${f.hourlyRate}/hr</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 justify-end">
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
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Direct Services & Gigs
              </span>
              <div className="space-y-2">
                {filteredServices.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s);
                      setIsServiceModalOpen(true);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-3.5 min-h-[48px] rounded-2xl hover:bg-white/90 bg-white/40 backdrop-blur-sm border border-transparent hover:border-[#A38BFF]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.coverImage}
                        alt={s.title}
                        className="w-12 h-10 rounded-xl object-cover ring-1 ring-[#A38BFF]/30"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1633] group-hover:text-[#3D2FD1] line-clamp-1">
                          {s.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>by {s.freelancerName}</span>
                          <span>•</span>
                          <span>{s.deliveryDays}d delivery</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-[#3D2FD1]">From ${s.startingPrice}</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 justify-end">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{s.rating} ({s.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredFreelancers.length === 0 && filteredServices.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center mx-auto border border-[#A38BFF]/30">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1633]">No exact match found for "{query}"</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader skills like "Figma", "React", "AI Agent", or post a custom job project with escrow protection.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/80 backdrop-blur-md border-t border-[#A38BFF]/20 flex items-center justify-between text-[11px] text-slate-500">
          <span>Escrow Protected Marketplace</span>
          <span className="font-mono">Press ↵ to select</span>
        </div>

      </div>

    </div>
  );
};
