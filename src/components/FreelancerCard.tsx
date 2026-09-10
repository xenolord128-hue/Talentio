import React from 'react';
import { Freelancer } from '../types';
import { useGuide } from '../context/GuideContext';
import { formatPrice } from '../utils/currency';
import { 
  Star, 
  Bookmark, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Briefcase,
  Zap
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface FreelancerCardProps {
  freelancer: Freelancer;
  onSelectProfile: (freelancer: Freelancer) => void;
  onHireDirect: (freelancer: Freelancer) => void;
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({
  freelancer,
  onSelectProfile,
  onHireDirect
}) => {
  const { savedFreelancerIds, toggleSaveFreelancer, currency } = useGuide();
  const isSaved = savedFreelancerIds.includes(freelancer.id);

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 hover:border-[#A38BFF] shadow-sm hover:shadow-xl hover:shadow-[#3D2FD1]/15 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Card Header & Avatar */}
      <div className="p-5 sm:p-6 space-y-4">
        
        <div className="flex items-start justify-between gap-3">
          
          {/* Avatar with Status */}
          <div className="relative">
            <img
              src={freelancer.avatar}
              alt={`${freelancer.name} - ${freelancer.title} in ${freelancer.location}`}
              loading="lazy"
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-2 ring-[#F2F0FF] group-hover:scale-105 transition-transform duration-200 shadow-sm"
            />
            {freelancer.availableNow && (
              <span 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Available for new projects"
              />
            )}
          </div>

          {/* Badges & Save Button */}
          <div className="flex items-center gap-2">
            {freelancer.proBadge && (
              <span className="px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30 shadow-xs">
                Talentio Pro
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveFreelancer(freelancer.id);
              }}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer min-w-[48px] min-h-[48px] flex items-center justify-center ${
                isSaved
                  ? 'bg-[#3D2FD1] text-white border-[#3D2FD1]'
                  : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-[#3D2FD1] border-[#A38BFF]/30 hover:border-[#A38BFF] hover:bg-[#F2F0FF]'
              }`}
              title={isSaved ? 'Saved' : 'Save to Shortlist'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

        </div>

        {/* Name, Title, Country */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              onClick={() => onSelectProfile(freelancer)}
              className="font-extrabold text-base sm:text-lg text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors cursor-pointer font-display"
            >
              {freelancer.name}
            </h3>
            {freelancer.verifiedBadge && (
              <VerifiedBadge size="sm" />
            )}
            <span className="text-sm text-slate-400 font-normal">{freelancer.countryFlag}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold line-clamp-1">
            {freelancer.title}
          </p>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-normal">
          {freelancer.bio}
        </p>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {freelancer.skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2F0FF]/90 text-[#3D2FD1] border border-[#A38BFF]/20"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills.length > 4 && (
            <span className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100">
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>

      </div>

      {/* Card Footer: Metrics & Actions */}
      <div className="p-5 sm:p-6 pt-0 space-y-4">
        
        {/* Statistics Strip with Glassmorphism */}
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/25 flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono font-semibold block">Hourly Rate</span>
            <span className="text-sm sm:text-base font-black text-[#3D2FD1]">
              {formatPrice(freelancer.hourlyRate, currency)}/hr
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase font-mono font-semibold block">Job Success</span>
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-[#1A1633]">{freelancer.rating}</span>
              <span className="text-slate-400 text-xs font-medium">({freelancer.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          
          <button
            onClick={() => onSelectProfile(freelancer)}
            className="py-3.5 px-4 rounded-2xl border border-[#3D2FD1] text-[#3D2FD1] hover:bg-[#F2F0FF] text-xs sm:text-sm font-bold transition-all text-center cursor-pointer min-h-[48px] flex items-center justify-center bg-white/60 backdrop-blur-xs"
          >
            View Profile
          </button>

          <button
            onClick={() => onHireDirect(freelancer)}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#6E5BFF] hover:to-[#A38BFF] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#3D2FD1]/25 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>Hire Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
