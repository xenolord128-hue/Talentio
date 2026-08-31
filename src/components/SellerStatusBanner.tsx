import React from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Ban, 
  Lock, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SellerStatusBannerProps {
  className?: string;
  showDetails?: boolean;
}

export const SellerStatusBanner: React.FC<SellerStatusBannerProps> = ({
  className = '',
  showDetails = true
}) => {
  const { user, switchDemoAccount, setIsCreateGigModalOpen } = useGuide();

  if (!user || user.userType === 'client') return null;

  const status = user.accountStatus || 'pending';

  if (status === 'approved') {
    return (
      <div className={`p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-emerald-200">
              Seller Account Approved
            </div>
            {showDetails && (
              <div className="text-[11px] text-emerald-300/90 mt-0.5">
                Your seller account has been verified by Talentio Administration. You can now create and publish milestone gigs.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCreateGigModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer hidden sm:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Publish Gig</span>
        </button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className={`p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-100 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-200 flex items-center gap-2">
              <span>Account Under Review (Pending Approval)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 uppercase">
                Under Admin Review
              </span>
            </div>
            {showDetails && (
              <div className="text-[11px] text-amber-200/85 mt-0.5">
                Your seller account is currently under review. You cannot publish gigs until your account has been approved by Talentio administration.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300/80 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Gigs Restricted</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className={`p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-100 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-rose-200">
              Seller Application Not Approved
            </div>
            <div className="text-[11px] text-rose-300/90 mt-0.5">
              {user.rejectionReason 
                ? `Reason: ${user.rejectionReason}`
                : 'Your seller account application was not approved by administration. Please update your profile information and contact support.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'suspended') {
    return (
      <div className={`p-3.5 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-100 flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-red-500/30 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-red-200">Account Temporarily Suspended</div>
          <div className="text-[11px] text-red-300/90 mt-0.5">
            Your account is currently suspended pending policy verification. Publishing and bidding are paused.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'banned') {
    return (
      <div className={`p-3.5 rounded-2xl bg-red-950/80 border border-red-700/60 text-red-200 flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-red-800/40 flex items-center justify-center shrink-0">
          <Ban className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-red-100">Account Restricted</div>
          <div className="text-[11px] text-red-300 mt-0.5">
            Your account has been permanently restricted according to Talentio moderation policy.
          </div>
        </div>
      </div>
    );
  }

  return null;
};
