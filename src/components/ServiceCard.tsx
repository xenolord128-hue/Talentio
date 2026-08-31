import React from 'react';
import { TalentioService } from '../types';
import { useGuide } from '../context/GuideContext';
import { formatPrice } from '../utils/currency';
import { 
  Star, 
  Clock, 
  ShieldCheck,
  Heart,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface ServiceCardProps {
  service: TalentioService;
  onSelectService?: (service: TalentioService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService
}) => {
  const { currency, isGigSaved, toggleSaveGig, openGigDetails } = useGuide();
  const saved = isGigSaved(service.id);

  const handleCardClick = () => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      openGigDetails(service);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveGig(service.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-[#3D2FD1]/60 shadow-sm hover:shadow-xl hover:shadow-[#3D2FD1]/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Top Media & Image Header */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={service.coverImage}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Floating Category & Escrow Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1A1633]/90 backdrop-blur-md text-white border border-white/20 shadow-sm">
            {service.category.replace('-', ' ')}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#3D2FD1]/90 backdrop-blur-md text-white flex items-center gap-1 shadow-sm border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A38BFF]" />
            <span>Escrow Protected</span>
          </span>
        </div>

        {/* Floating Bookmark/Favorite Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${
            saved 
              ? 'bg-rose-500 text-white scale-110' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title={saved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Delivery Time Pill on Image Bottom */}
        <div className="absolute bottom-3 left-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/15">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{service.deliveryDays} Days Delivery</span>
          </div>
        </div>
      </div>

      {/* Card Body with Generous Spacing */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        
        <div className="space-y-3">
          {/* Freelancer Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={service.freelancerAvatar}
                alt={service.freelancerName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-[#3D2FD1]/20 shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#1A1633] truncate">
                    {service.freelancerName}
                  </span>
                  <VerifiedBadge size="xs" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 block truncate">
                  {service.freelancerBadge}
                </span>
              </div>
            </div>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-extrabold">{service.rating.toFixed(1)}</span>
              <span className="text-[11px] text-amber-700/80">({service.reviewsCount})</span>
            </div>
          </div>

          {/* Gig Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors line-clamp-2 leading-snug font-display">
            {service.title}
          </h3>

          {/* Short Description excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {service.packages?.basic?.description || 'Professional milestone-based delivery with full source files, milestone escrow protection, and rapid delivery turnaround.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Info Strip */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Starting at</span>
            <span className="text-lg sm:text-2xl font-black text-[#3D2FD1]">
              {formatPrice(service.startingPrice, currency)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openGigDetails(service);
            }}
            className="px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/20 flex items-center gap-1.5 transition-all cursor-pointer group-hover:gap-2 active:scale-95"
          >
            <span>View Gig</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
