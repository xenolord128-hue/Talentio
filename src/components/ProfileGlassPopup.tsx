import React, { useEffect, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  IdCard, 
  CheckCircle2, 
  ChevronRight, 
  LayoutDashboard,
  ExternalLink,
  LogIn
} from 'lucide-react';

interface ProfileGlassPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileGlassPopup: React.FC<ProfileGlassPopupProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    isAuthenticated, 
    activePage, 
    setActivePage, 
    logout, 
    setIsOnboardingModalOpen 
  } = useGuide();

  const popupRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Account Type Label
  const getAccountTypeLabel = () => {
    if (!user) return 'Member';
    if (user.role === 'admin' || user.role === 'ADMIN') return 'Super Admin';
    if (user.userType === 'client') return 'Client Buyer';
    if (user.userType === 'agency') return 'Digital Agency';
    return 'Pro Freelancer';
  };

  const getStatusBadge = () => {
    if (!user) return null;
    const isApproved = user.accountStatus === 'approved' || user.verifiedBadge;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
        isApproved 
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        {isApproved ? 'Verified Account' : 'Standard Account'}
      </span>
    );
  };

  return (
    <>
      {/* Subtle backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Glassmorphic Profile Popup */}
      <div
        ref={popupRef}
        role="dialog"
        aria-label="User Profile Menu"
        aria-modal="true"
        className="fixed top-16 sm:top-20 right-3 sm:right-24 lg:right-28 z-50 w-[310px] sm:w-[330px] max-w-[calc(100vw-24px)] rounded-3xl bg-[#130E2C]/95 backdrop-blur-2xl border border-[#A38BFF]/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white p-5 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#3D2FD1]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6E5BFF]/15 rounded-full blur-2xl pointer-events-none" />

        {isAuthenticated && user ? (
          <div className="relative z-10 space-y-4">
            
            {/* User Identity Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 shadow-inner">
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#3D2FD1] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#130E2C]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-white truncate font-display">
                    {user.name}
                  </h3>
                  {user.verifiedBadge && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                
                <p className="text-[11px] text-slate-300 font-mono truncate">
                  {user.handle ? `@${user.handle.replace('@', '')}` : user.email}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#3D2FD1]/40 text-[#A38BFF] border border-[#6E5BFF]/30 uppercase tracking-wide">
                    {getAccountTypeLabel()}
                  </span>
                  {getStatusBadge()}
                </div>
              </div>
            </div>

            {/* Profile Completion Indicator */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A38BFF]" />
                  <span>Profile Strength</span>
                </span>
                <span className="font-mono font-extrabold text-emerald-400">95%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] w-[95%] transition-all duration-500" />
              </div>
              <span className="text-[10px] text-slate-400 block pt-0.5">
                Escrow Level: Tier {user.escrowTier || 1} Pro Verified
              </span>
            </div>

            {/* Menu Links */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => {
                  setActivePage('profile');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePage === 'profile'
                    ? 'bg-[#3D2FD1] text-white shadow-sm font-extrabold'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#A38BFF]" />
                  <span>View Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsOnboardingModalOpen(true);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-4 h-4 text-[#A38BFF]" />
                  <span>Edit Profile & Skills</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setActivePage('kyc');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePage === 'kyc'
                    ? 'bg-[#3D2FD1] text-white shadow-sm font-extrabold'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IdCard className="w-4 h-4 text-emerald-400" />
                  <span>KYC Identity Verification</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user.kycStatus === 'verified' || user.verifiedBadge ? 'Verified' : 'Review'}
                </span>
              </button>

              <button
                onClick={() => {
                  setActivePage('settings');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePage === 'settings'
                    ? 'bg-[#3D2FD1] text-white shadow-sm font-extrabold'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#A38BFF]" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-white/10 my-1" />

            {/* Logout Action */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

          </div>
        ) : (
          /* Guest State */
          <div className="relative z-10 space-y-4 py-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3D2FD1] to-[#6E5BFF] flex items-center justify-center mx-auto shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>

            <div>
              <h3 className="text-base font-black text-white font-display">Welcome to Talentio</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-[240px] mx-auto">
                Sign in to access milestone escrow, live chat, and seller workstations.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setActivePage('login');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Account</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('register');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#A38BFF]" />
                <span>Create New Account</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
