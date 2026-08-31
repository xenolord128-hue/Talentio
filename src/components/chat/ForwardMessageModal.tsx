import React, { useState } from 'react';
import { Conversation, ChatMessage } from '../../types';
import { 
  X, 
  Search, 
  Send, 
  CornerUpRight,
  CheckCircle2
} from 'lucide-react';

interface ForwardMessageModalProps {
  isOpen: boolean;
  messageToForward: ChatMessage | null;
  conversations: Conversation[];
  onClose: () => void;
  onForward: (targetConversationId: string, message: ChatMessage) => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  messageToForward,
  conversations,
  onClose,
  onForward
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  if (!isOpen || !messageToForward) return null;

  const filtered = conversations.filter(c => 
    c.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.participant.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = () => {
    if (!selectedConvId) return;
    onForward(selectedConvId, messageToForward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md rounded-[28px] ios-glass-dark text-white p-6 shadow-2xl border border-white/20 z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <CornerUpRight className="w-4 h-4 text-[#A38BFF]" />
            <h3 className="text-sm font-bold text-white">Forward Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview snippet */}
        <div className="my-3 p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 line-clamp-2 italic">
          "{messageToForward.text}"
        </div>

        {/* Search */}
        <div className="relative mb-3 shrink-0">
          <Search className="w-4 h-4 text-[#A38BFF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF]"
          />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filtered.map((conv) => {
            const isSelected = selectedConvId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#3D2FD1] text-white' 
                    : 'hover:bg-white/10 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold">{conv.participant.name}</div>
                    <div className="text-[10px] text-slate-300">{conv.participant.handle}</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#A38BFF]" />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={!selectedConvId}
            onClick={handleSend}
            className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
