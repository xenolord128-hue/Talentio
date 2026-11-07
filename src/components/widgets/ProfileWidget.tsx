import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Star, 
  User, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';
import { ProfileSummaryData } from './types';

interface ProfileWidgetProps {
  profile?: ProfileSummaryData;
  className?: string;
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

const DEFAULT_PROFILE: ProfileSummaryData = {
  name: 'Alexander Vance',
  username: 'alexandervance',
  email: 'alexander@vancefintech.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  role: 'Senior UI/UX & Design Systems Architect',
  isVerified: true,
  completionPercentage: 95,
  rating: 4.98,
  reviewsCount: 68,
  stats: [
    { label: 'Completed', value: '142' },
    { label: 'Win Rate', value: '42.8%' },
    { label: 'Earnings', value: '$24.8k' },
  ],
};

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({
  profile = DEFAULT_PROFILE,
  className = '',
  onViewProfile,
  onEditProfile,
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Top Avatar & Badges */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-[#3D2FD1]/20 shadow-md"
            />
            {profile.isVerified && (
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                title="Verified Pro Member"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="p-2 rounded-xl bg-[#F2F0FF] hover:bg-[#E3EDF9] text-[#3D2FD1] transition-colors cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-[#1A1633] font-display">
              {profile.name}
            </h3>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3D2FD1]/10 text-[#3D2FD1]">
                <Sparkles className="w-3 h-3" />
                <span>PRO</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-mono">@{profile.username}</p>
          <p className="text-xs text-[#3D2FD1] font-semibold">{profile.role}</p>
        </div>

        {/* Rating strip */}
        {profile.rating && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/50 text-xs mb-4">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="font-extrabold text-amber-900 font-mono">
              {profile.rating.toFixed(2)}
            </span>
            <span className="text-[11px] text-amber-700">
              ({profile.reviewsCount || 0} verified client reviews)
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 mb-5 text-center">
          {profile.stats.map((s, idx) => (
            <div key={idx} className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {s.label}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1A1633] font-display">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Profile Strength</span>
            <span className="font-mono font-extrabold text-[#3D2FD1]">
              {profile.completionPercentage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF]"
              style={{ width: `${profile.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-4 border-t border-[#A38BFF]/20">
        <button
          onClick={onViewProfile}
          className="w-full py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Public Profile</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
