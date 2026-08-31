import React, { useState } from 'react';
import { Freelancer, ConversationParticipant } from '../../types';
import { TALENTIO_FREELANCERS } from '../../data/talentioData';
import { 
  X, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (participant: ConversationParticipant) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onSelectContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const contacts: ConversationParticipant[] = [
    ...TALENTIO_FREELANCERS.map(f => ({
      id: f.id,
      name: f.name,
      handle: f.handle,
      avatar: f.avatar,
      role: 'freelancer' as const,
      title: f.title,
      countryFlag: f.countryFlag,
      verified: f.verifiedBadge,
      online: f.availableNow,
      lastSeen: f.availableNow ? 'Online' : 'Active recently',
      escrowTier: 3
    })),
    {
      id: 'client-1',
      name: 'Julian Sterling',
      handle: '@julian_curve',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      role: 'client' as const,
      title: 'VP of Product @ Curve Fintech',
      countryFlag: '🇺🇸',
      verified: true,
      online: true,
      lastSeen: 'Online',
      escrowTier: 3
    },
    {
      id: 'client-2',
      name: 'Dr. Sarah Lin',
      handle: '@sarah_medtech',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      role: 'client' as const,
      title: 'CTO @ MedTech Health Labs',
      countryFlag: '🇩🇪',
      verified: true,
      online: false,
      lastSeen: 'Last seen yesterday',
      escrowTier: 3
    },
    {
      id: 'support-1',
      name: 'Talentio Escrow Concierge',
      handle: '@talentio_support',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      role: 'admin' as const,
      title: '24/7 Priority Dispute & Contract Specialist',
      countryFlag: '🛡️',
      verified: true,
      online: true,
      lastSeen: 'Online 24/7',
      escrowTier: 3
    }
  ];

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg rounded-[28px] ios-glass-dark text-white p-6 shadow-2xl border border-white/20 z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3D2FD1] flex items-center justify-center text-white shadow-md">
              <UserPlus className="w-4 h-4 text-[#A38BFF]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Start New Conversation</h3>
              <p className="text-xs text-slate-300">Connect with verified talent, clients, or escrow advisors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="my-4 relative shrink-0">
          <Search className="w-4 h-4 text-[#A38BFF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, handle, skill or role..."
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF] focus:bg-white/15 transition-all"
            autoFocus
          />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No contacts found matching "{searchTerm}"
            </div>
          ) : (
            filtered.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  onSelectContact(contact);
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
                    />
                    {contact.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#1A1633]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-[#A38BFF] transition-colors">
                        {contact.name}
                      </span>
                      {contact.countryFlag && (
                        <span className="text-xs">{contact.countryFlag}</span>
                      )}
                      {contact.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {contact.title || contact.handle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 group-hover:bg-[#3D2FD1] group-hover:text-white transition-all uppercase">
                    {contact.role}
                  </span>
                  <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-[#A38BFF] transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
