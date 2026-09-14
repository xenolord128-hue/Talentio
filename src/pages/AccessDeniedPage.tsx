import React from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from '../components/TalentioLogo';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedProps> = ({
  title = "Access Denied",
  message = "You do not have permission to view or execute operations on this resource.",
  requiredRole
}) => {
  const { user, setActivePage } = useGuide();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md text-center space-y-6 bg-[#171330] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="inline-flex justify-center mb-2">
          <TalentioLogo size="md" variant="white" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {requiredRole && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 font-mono">
            <span>Required Role: </span>
            <span className="text-amber-400 font-bold uppercase">{requiredRole}</span>
            {user && (
              <div>
                <span>Your Current Role: </span>
                <span className="text-slate-200 font-bold uppercase">{user.role || user.userType || 'Unassigned'}</span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActivePage('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#3D2FD1]/30"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
          <button
            onClick={() => setActivePage('explore')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Marketplace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
