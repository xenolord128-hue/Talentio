import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAttachment } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { OrderConfirmationCard } from './OrderConfirmationCard';
import { 
  Check, 
  CheckCheck, 
  Clock, 
  Pin, 
  CornerDownRight, 
  Smile, 
  Copy, 
  Edit3, 
  Trash2, 
  Forward, 
  FileText, 
  Download, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Maximize2,
  X,
  Sparkles,
  Info
} from 'lucide-react';

interface MessageTimelineProps {
  messages: ChatMessage[];
  searchQuery: string;
  isTyping: boolean;
  participantName: string;
  participantAvatar: string;
  pinnedMessageId?: string;
  onAcceptOffer: (messageId: string) => void;
  onConfirmOrderRequest?: (messageId: string) => void;
  onCancelOrderRequest?: (messageId: string) => void;
  onReplyMessage: (message: ChatMessage) => void;
  onEditMessage: (message: ChatMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  onTogglePinMessage: (messageId: string) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onForwardMessage: (message: ChatMessage) => void;
  onExecuteAction?: (action: { type: 'navigate' | 'modal'; target: string; label: string }) => void;
}

export const MessageTimeline: React.FC<MessageTimelineProps> = ({
  messages,
  searchQuery,
  isTyping,
  participantName,
  participantAvatar,
  pinnedMessageId,
  onAcceptOffer,
  onConfirmOrderRequest,
  onCancelOrderRequest,
  onReplyMessage,
  onEditMessage,
  onDeleteMessage,
  onTogglePinMessage,
  onReactMessage,
  onForwardMessage,
  onExecuteAction
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  // Quick reactions list
  const quickReactions = ['👍', '❤️', '🔥', '👏', '🎉', '🚀'];

  const scrollToMessage = (id: string) => {
    const el = messageRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-[#3D2FD1]/10');
      setTimeout(() => {
        el.classList.remove('bg-[#3D2FD1]/10');
      }, 1500);
    }
  };

  const handleCopyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setActiveMenuMsgId(null);
  };

  const pinnedMessage = messages.find(m => m.id === pinnedMessageId || m.isPinned);

  // Group messages by date
  const groupedMessages: Array<{ dateLabel: string; items: ChatMessage[] }> = [];
  messages.forEach(msg => {
    // Determine date label
    const dateLabel = msg.isoDate 
      ? new Date(msg.isoDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Today';

    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.dateLabel === dateLabel) {
      lastGroup.items.push(msg);
    } else {
      groupedMessages.push({ dateLabel, items: [msg] });
    }
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative bg-slate-50/50 custom-scrollbar">
      
      {/* Pinned Message Sticky Top Banner */}
      {pinnedMessage && (
        <div 
          onClick={() => scrollToMessage(pinnedMessage.id)}
          className="sticky top-0 z-10 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#6E5BFF]/30 shadow-sm flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-4 h-4 text-[#6E5BFF] shrink-0 rotate-45" />
            <div className="truncate">
              <span className="font-bold text-[#3D2FD1] mr-1">Pinned:</span>
              <span className="text-slate-600 truncate">{pinnedMessage.text}</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#6E5BFF] group-hover:underline shrink-0">
            Jump to message
          </span>
        </div>
      )}

      {/* Message Groups */}
      {groupedMessages.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          
          {/* Date Separator Pill */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-500 shadow-2xs">
              {group.dateLabel}
            </span>
          </div>

          {/* Messages */}
          {group.items.map((msg) => {
            const isMe = msg.sender === 'me' || msg.sender === 'client';
            const isSystem = msg.sender === 'system';
            const isSearchMatch = searchQuery && msg.text.toLowerCase().includes(searchQuery.toLowerCase());

            // Handle System Notification Messages (e.g. Escrow locked, order created)
            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  ref={el => { messageRefs.current[msg.id] = el; }}
                  className="flex items-center justify-center my-2 px-4"
                >
                  <div className="max-w-md px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/80 shadow-2xs text-center text-xs text-[#1A1633] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6E5BFF] shrink-0" />
                    <span className="font-semibold leading-relaxed">{msg.text}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            // Handle Interactive Order Confirmation Card
            if (msg.isOrderRequest && msg.orderRequestDetails) {
              return (
                <div
                  key={msg.id}
                  ref={el => { messageRefs.current[msg.id] = el; }}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-2 px-1 relative group w-full`}
                >
                  <OrderConfirmationCard
                    messageId={msg.id}
                    orderRequest={msg.orderRequestDetails}
                    isMe={isMe}
                    onConfirm={(id) => onConfirmOrderRequest && onConfirmOrderRequest(id)}
                    onCancel={(id) => onCancelOrderRequest && onCancelOrderRequest(id)}
                  />
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                ref={el => { messageRefs.current[msg.id] = el; }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} transition-colors rounded-2xl p-1 relative group`}
              >
                
                {/* Replying quote if present */}
                {msg.replyTo && (
                  <div
                    onClick={() => scrollToMessage(msg.replyTo!.id)}
                    className={`mb-1 px-3 py-1.5 rounded-xl border-l-3 border-[#3D2FD1] bg-white/80 text-[11px] text-slate-600 cursor-pointer hover:bg-white shadow-2xs max-w-sm truncate ${
                      isMe ? 'mr-2 text-right' : 'ml-2'
                    }`}
                  >
                    <span className="font-bold text-[#3D2FD1] mr-1">Replying to {msg.replyTo.senderName}:</span>
                    <span className="italic">{msg.replyTo.text}</span>
                  </div>
                )}

                {/* Main Message Bubble */}
                {(() => {
                  const isAI = !isMe && (msg.senderId === 'talentio-ai-bot' || msg.senderName === 'TALENTIO AI');

                  return (
                    <div
                      className={`relative max-w-[85%] sm:max-w-md md:max-w-lg p-3.5 sm:p-4 rounded-[22px] transition-all shadow-sm ${
                        isSearchMatch ? 'ring-2 ring-amber-400' : ''
                      } ${
                        isMe
                          ? 'bg-gradient-to-br from-[#3D2FD1] to-[#5443F0] text-white rounded-br-xs shadow-[#3D2FD1]/15'
                          : isAI
                            ? 'bg-white text-[#1A1633] rounded-bl-xs border border-[#6E5BFF]/30 shadow-md ring-1 ring-[#6E5BFF]/10'
                            : 'bg-[#F2F0FF] text-[#1A1633] rounded-bl-xs border border-slate-200/60'
                      }`}
                    >
                      {/* Sender Header */}
                      {!isMe && (
                        isAI ? (
                          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100">
                            <div className="p-0.5 rounded-md bg-gradient-to-tr from-cyan-400 to-[#6E5BFF] text-white">
                              <Sparkles className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-black text-[#5643FA]">TALENTIO AI</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-2xs tracking-wide">
                              Assistant
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold text-[#3D2FD1] mb-1">
                            {msg.senderName}
                          </div>
                        )
                      )}

                      {/* Milestone Contract Offer Card inside Chat */}
                      {msg.isOffer && msg.offerDetails ? (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between pb-2 border-b border-current/20">
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              isMe ? 'bg-white/20 text-white' : 'bg-[#3D2FD1] text-white'
                            }`}>
                              Official Milestone Contract Offer
                            </span>
                            <span className={`text-base font-black ${isMe ? 'text-white' : 'text-[#3D2FD1]'}`}>
                              ${msg.offerDetails.amount} USD
                            </span>
                          </div>

                          <div>
                            <h4 className={`text-xs sm:text-sm font-bold ${isMe ? 'text-white' : 'text-[#1A1633]'}`}>
                              {msg.offerDetails.title}
                            </h4>
                            <p className={`text-[11px] mt-1 ${isMe ? 'text-white/80' : 'text-slate-600'}`}>
                              Full escrow protection: Funds remain safely secured in Talentio Escrow Vault until deliverables are formally inspected and approved.
                            </p>
                          </div>

                          <div className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                            isMe ? 'bg-black/20 text-white' : 'bg-white text-slate-700 border border-slate-200'
                          }`}>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{msg.offerDetails.deliveryDays} Days Delivery</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Escrow Protected</span>
                            </div>
                          </div>

                          {/* Accept Offer Action */}
                          <div className="pt-2 flex items-center justify-end">
                            {msg.offerDetails.status === 'accepted' ? (
                              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Offer Accepted & Escrow Funded</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => onAcceptOffer(msg.id)}
                                className="px-4 py-2 rounded-xl bg-white text-[#3D2FD1] hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <span>Accept & Fund Escrow</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : msg.voiceNote ? (
                        /* Voice Note Player */
                        <VoiceNotePlayer voiceNote={msg.voiceNote} isMe={isMe} />
                      ) : (
                        /* Normal Formatted Text */
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-normal">
                          {msg.text}
                        </div>
                      )}

                      {/* Interactive AI Action Button if provided */}
                      {msg.action && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => onExecuteAction?.(msg.action!)}
                            className="w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#4837E0] hover:to-[#7E6DFF] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                  {/* Attachments if present */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.attachments.map(att => (
                        <div key={att.id}>
                          {att.type === 'image' && att.previewUrl ? (
                            <div 
                              onClick={() => setPreviewImage(att.previewUrl || null)}
                              className="relative rounded-xl overflow-hidden border border-white/20 shadow-md cursor-pointer group/img max-h-56"
                            >
                              <img
                                src={att.previewUrl}
                                alt={att.name}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                <Maximize2 className="w-4 h-4" />
                                <span>Preview</span>
                              </div>
                            </div>
                          ) : (
                            <div className={`p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs ${
                              isMe ? 'bg-black/20 text-white' : 'bg-white text-[#1A1633] border border-slate-200'
                            }`}>
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className={`w-4 h-4 shrink-0 ${isMe ? 'text-white' : 'text-[#3D2FD1]'}`} />
                                <div className="min-w-0">
                                  <p className="font-bold truncate text-xs">{att.name}</p>
                                  <p className="text-[10px] opacity-80">{att.size}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => alert(`Downloading ${att.name}`)}
                                className={`p-1.5 rounded-lg ${isMe ? 'hover:bg-white/20' : 'hover:bg-slate-100'}`}
                                title="Download attachment"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Meta: Timestamp, (Edited), Read/Sent checkmark */}
                  <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${
                    isMe ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {msg.isEdited && <span className="italic">(edited)</span>}
                    <span>{msg.timestamp}</span>

                    {/* Delivery / Read Status */}
                    {isMe && (
                      <span className="shrink-0">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-300" title="Read" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/80" title="Delivered" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/60" title="Sent" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reaction Pills Below Bubble */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="absolute -bottom-3 right-3 flex items-center gap-1">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => onReactMessage(msg.id, r.emoji)}
                          className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs shadow-sm flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          {r.count > 1 && <span className="text-[10px] font-bold text-slate-600">{r.count}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
                  );
                })()}

                {/* Message Hover Actions Bar */}
                <div className={`hidden group-hover:flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-md absolute -top-3.5 ${
                  isMe ? 'right-2' : 'left-2'
                } z-10 animate-in fade-in zoom-in-95 duration-100`}>
                  
                  {/* Quick Reaction Emojis */}
                  <div className="flex items-center gap-0.5 pr-1 border-r border-slate-100">
                    {quickReactions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => onReactMessage(msg.id, emoji)}
                        className="w-6 h-6 rounded hover:bg-slate-100 text-xs flex items-center justify-center transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Reply Button */}
                  <button
                    onClick={() => onReplyMessage(msg)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-[#3D2FD1]"
                    title="Reply"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Text */}
                  <button
                    onClick={() => handleCopyText(msg.text)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    title="Copy Text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Forward Message */}
                  <button
                    onClick={() => onForwardMessage(msg)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    title="Forward Message"
                  >
                    <Forward className="w-3.5 h-3.5" />
                  </button>

                  {/* Pin Message */}
                  <button
                    onClick={() => onTogglePinMessage(msg.id)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-[#6E5BFF]"
                    title={msg.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Message (if me) */}
                  {isMe && !msg.isOffer && (
                    <button
                      onClick={() => onEditMessage(msg)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete */}
                  {isMe && (
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      ))}

      {/* Typing Indicator Animation Bubble */}
      {isTyping && (
        <div className="flex items-center gap-2 animate-in fade-in duration-200">
          <img
            src={participantAvatar}
            alt={participantName}
            className="w-7 h-7 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div className="p-3 rounded-2xl bg-[#F2F0FF] border border-slate-200 text-[#3D2FD1] flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#3D2FD1] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#3D2FD1] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#3D2FD1] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
