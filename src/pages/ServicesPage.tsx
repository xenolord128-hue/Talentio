import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TALENTIO_CATEGORIES } from '../data/talentioData';
import { ServiceCard } from '../components/ServiceCard';
import { 
  Search, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Filter, 
  X,
  SlidersHorizontal
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { 
    services, 
    selectedCategory, 
    setSelectedCategory, 
    openGigDetails 
  } = useGuide();

  const [search, setSearch] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | '3' | '7'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'delivery'>('rating');

  let filtered = services.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (deliveryFilter === '3' && s.deliveryDays > 3) return false;
    if (deliveryFilter === '7' && s.deliveryDays > 7) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchSeller = s.freelancerName.toLowerCase().includes(q);
      const matchTag = s.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSeller && !matchTag) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
    if (sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      {/* Header Banner - Open & Spacious */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30">
          <Layers className="w-4 h-4 text-[#3D2FD1]" />
          <span>Talentio Verified Marketplace</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1633] tracking-tight font-display">
              Explore Professional Gigs
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal mt-1 max-w-2xl">
              Browse pre-scoped services with milestone deliverables, transparent pricing, and 100% smart escrow vault protection.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Escrow Protected Checkout</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="space-y-4">
        
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#3D2FD1] absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gigs by title, skill, or keyword (e.g. Next.js, Figma, AI Agent)..."
              className="w-full bg-white text-[#1A1633] placeholder:text-slate-400 pl-11 pr-10 py-3 rounded-2xl border border-slate-200 shadow-xs focus:border-[#3D2FD1] focus:outline-none text-xs sm:text-sm font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-2xl focus:outline-none focus:border-[#3D2FD1] shadow-xs cursor-pointer w-full sm:w-auto"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="delivery">Fastest Delivery</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TALENTIO_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#3D2FD1] text-white shadow-sm shadow-[#3D2FD1]/20'
                  : 'bg-white border border-slate-200/80 hover:bg-[#F2F0FF] text-slate-700 hover:border-[#A38BFF]/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Delivery speed filter & total counter */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Delivery:</span>
            <button
              onClick={() => setDeliveryFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                deliveryFilter === 'all' ? 'bg-[#1A1633] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Timelines
            </button>
            <button
              onClick={() => setDeliveryFilter('3')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                deliveryFilter === '3' ? 'bg-[#1A1633] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Fast (≤ 3 Days)
            </button>
            <button
              onClick={() => setDeliveryFilter('7')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                deliveryFilter === '7' ? 'bg-[#1A1633] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ≤ 7 Days
            </button>
          </div>

          <span className="text-slate-500 font-bold text-xs">
            Showing <strong className="text-[#1A1633]">{filtered.length}</strong> Gigs
          </span>
        </div>

      </div>

      {/* 2-Column Marketplace Grid: Desktop/Tablet 2 cards, Mobile 1 card */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filtered.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={s => openGigDetails(s)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#1A1633] font-display">No gigs found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No active gigs matched your selected filters. Try changing your search keywords or category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setDeliveryFilter('all');
            }}
            className="px-5 py-2.5 bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold rounded-2xl cursor-pointer transition-all shadow-md shadow-[#3D2FD1]/20"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
