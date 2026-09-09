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
  ClipboardCheck,
  Sparkles,
  Mic
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
  onVoiceStart?: () => void;
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
  onOpenConfirmOrderModal,
  onVoiceStart
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAI = participant.role === 'bot' || participant.role === 'assistant' || participant.id === 'talentio-ai-bot';

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
          onClick={isAI ? undefined : onViewProfile}
          className={`relative shrink-0 ${isAI ? '' : 'cursor-pointer group'}`}
          title={isAI ? 'TALENTIO AI Assistant' : 'View profile'}
        >
          {isAI ? (
            <div className="p-[2px] rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-sm animate-pulse">
              <img
                src={participant.avatar}
                alt={participant.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] object-cover bg-[#120D26]"
              />
            </div>
          ) : (
            <img
              src={participant.avatar}
              alt={participant.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-[#6E5BFF]/60 group-hover:scale-105 transition-transform"
            />
          )}

          {isAI ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ring-2 ring-[#1A1633] shadow-xs" />
          ) : participant.online ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1A1633]" />
          ) : (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-400 ring-2 ring-[#1A1633]" />
          )}
        </div>

        {/* Name and Status */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 
              onClick={isAI ? undefined : onViewProfile}
              className={`text-xs sm:text-sm font-extrabold text-white truncate ${isAI ? '' : 'cursor-pointer hover:text-[#A38BFF] transition-colors'}`}
            >
              {participant.name}
            </h3>

            {isAI && (
              <span className="px-1.5 py-0.2 text-[9px] font-black tracking-wider uppercase rounded bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xs flex items-center gap-0.5 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                AI
              </span>
            )}

            {participant.countryFlag && !isAI && (
              <span className="text-xs">{participant.countryFlag}</span>
            )}
            {participant.verified && !isAI && (
              <VerifiedBadge size="xs" />
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            {participant.isTyping ? (
              <span className="text-[#A38BFF] font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A38BFF] animate-ping" />
                <span>{isAI ? 'TALENTIO AI is generating response...' : 'typing a message...'}</span>
              </span>
            ) : isAI ? (
              <span className="text-purple-200 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Official Assistant • Always Active</span>
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
            {participant.escrowTier && !isAI && (
              <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Tier {participant.escrowTier}</span>
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Right: Voice Button, Contract Button, Search, Menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        
        {/* If AI Chat: Voice Interaction Button */}
        {isAI && onVoiceStart && (
          <button
            onClick={onVoiceStart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#4a3be0] hover:to-[#7E6DFF] text-white text-xs font-bold shadow-md transition-all cursor-pointer border border-white/20"
            title="Start Voice Assistant (or say 'Talentio')"
          >
            <Mic className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Voice</span>
          </button>
        )}

        {/* Active Contract Quick Link if applicable */}
        {contractId && !isAI && (
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
