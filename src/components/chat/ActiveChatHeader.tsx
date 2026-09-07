import React, { useState, useRef, useEffect } from 'react';
import { ConversationParticipant } from '../../types';
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  ExternalLink, 
  BellOff, 
  Pin, 
  Trash2, 
  Lock,
  UserCheck,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';
import { VerifiedBadge } from '../VerifiedBadge';

interface ActiveChatHeaderProps {
  participant: ConversationParticipant;
  contractId?: string;
  isPinned: boolean;
  isMuted: boolean;
  isFreelancerView?: boolean;
  onBack: () => void;
  onToggleSearch: () => void;
  onTogglePin: () => void;
  onToggleMute: () => void;
  onClearChat: () => void;
  onViewProfile: () => void;
  onViewContract: () => void;
  onOpenConfirmOrderModal?: () => void;
}

export const ActiveChatHeader: React.FC<ActiveChatHeaderProps> = ({
  participant,
  contractId,
  isPinned,
  isMuted,
  isFreelancerView = true,
  onBack,
  onToggleSearch,
  onTogglePin,
  onToggleMute,
  onClearChat,
  onViewProfile,
  onViewContract,
  onOpenConfirmOrderModal
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-16 sm:h-18 px-3 sm:px-6 bg-[#1A1633] text-white border-b border-[#3D2FD1]/30 flex items-center justify-between shadow-md shrink-0 select-none z-20">
      
      {/* Left: Back (Mobile) + Avatar + User Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        
        {/* Mobile Back Button */}
        <button
          onClick={onBack}
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5 text-[#A38BFF]" />
        </button>

        {/* Avatar with Online indicator */}
        <div 
          onClick={onViewProfile}
          className="relative shrink-0 cursor-pointer group"
          title="View profile"
        >
          <img
            src={participant.avatar}
            alt={participant.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-[#6E5BFF]/60 group-hover:scale-105 transition-transform"
          />
          {participant.online ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1A1633]" />
          ) : (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-400 ring-2 ring-[#1A1633]" />
          )}
        </div>

        {/* Name and Status */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 
              onClick={onViewProfile}
              className="text-xs sm:text-sm font-extrabold text-white truncate cursor-pointer hover:text-[#A38BFF] transition-colors"
            >
              {participant.name}
            </h3>
            {participant.countryFlag && (
              <span className="text-xs">{participant.countryFlag}</span>
            )}
            {participant.verified && (
              <VerifiedBadge size="xs" />
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            {participant.isTyping ? (
              <span className="text-[#A38BFF] font-bold animate-pulse">
                typing a message...
              </span>
            ) : participant.online ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </span>
            ) : (
              <span className="text-slate-400">{participant.lastSeen}</span>
            )}

            {/* Escrow Tier Badge */}
            {participant.escrowTier && (
              <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Tier {participant.escrowTier}</span>
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Right: Contract Button, Search, Menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        
        {/* Active Contract Quick Link if applicable */}
        {contractId && (
          <button
            onClick={onViewContract}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            title="View Active Escrow Workstation"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Contract</span>
          </button>
        )}

        {/* Search in conversation */}
        <button
          onClick={onToggleSearch}
          className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Search in this chat"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* More Options Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl ios-glass-dark text-white p-1.5 shadow-2xl border border-white/20 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              
              {/* Confirm Order (Freelancer action) */}
              {isFreelancerView && onOpenConfirmOrderModal && (
                <button
                  onClick={() => { onOpenConfirmOrderModal(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 font-bold transition-colors cursor-pointer mb-1"
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <div className="flex-1 flex items-center justify-between">
                    <span>📋 Confirm Order</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono font-black">
                      HIRE
                    </span>
                  </div>
                </button>
              )}

              <button
                onClick={() => { onViewProfile(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#A38BFF]" />
                <span>View Full Profile</span>
              </button>

              {contractId && (
                <button
                  onClick={() => { onViewContract(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Escrow Contract Details</span>
                </button>
              )}

              <button
                onClick={() => { onTogglePin(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Pin className="w-4 h-4 text-[#6E5BFF]" />
                <span>{isPinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
              </button>

              <button
                onClick={() => { onToggleMute(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <BellOff className="w-4 h-4 text-amber-400" />
                <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => { onClearChat(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat History</span>
              </button>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
