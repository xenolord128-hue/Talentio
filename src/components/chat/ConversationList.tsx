import React, { useState, useEffect } from 'react';
import { Conversation } from '../../types';
import { searchUsersByUsername, PublicUserSearchResult } from '../../lib/firestore';
import { 
  Search, 
  Plus, 
  Pin, 
  BellOff, 
  Check, 
  CheckCheck, 
  CheckCircle2, 
  Mic, 
  Paperclip, 
  Briefcase, 
  ShieldCheck, 
  Filter,
  MoreVertical,
  Volume2,
  Trash2,
  Lock,
  ArrowLeft,
  Sparkles,
  UserSearch,
  UserCheck,
  MessageSquare,
  Loader2,
  AtSign,
  UserX
} from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onOpenNewChat: () => void;
  onTogglePin: (id: string) => void;
  onToggleMute: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onBackToMarketplace?: () => void;
  onStartChatWithUser?: (user: PublicUserSearchResult) => void;
  currentUserId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onOpenNewChat,
  onTogglePin,
  onToggleMute,
  onDeleteConversation,
  onMarkAsRead,
  onBackToMarketplace,
  onStartChatWithUser,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'chats' | 'username'>('chats');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'contract' | 'direct'>('all');
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);

  // Live Firestore username search state
  const [searchResults, setSearchResults] = useState<PublicUserSearchResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Trigger live search when in username search mode or when user types @
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearchingUsers(false);
      setHasSearched(false);
      return;
    }

    // If query starts with @, auto-switch to username mode
    if (trimmed.startsWith('@') && searchMode !== 'username') {
      setSearchMode('username');
    }

    if (searchMode === 'username' || trimmed.startsWith('@')) {
      setIsSearchingUsers(true);
      const timer = setTimeout(async () => {
        try {
          const users = await searchUsersByUsername(trimmed, currentUserId);
          setSearchResults(users);
        } catch (e) {
          console.warn('Search error:', e);
          setSearchResults([]);
        } finally {
          setIsSearchingUsers(false);
          setHasSearched(true);
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearchingUsers(false);
      setHasSearched(false);
    }
  }, [searchQuery, searchMode, currentUserId]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    // Search query check
    const matchesSearch = 
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return conv.unreadCount > 0;
    if (activeFilter === 'contract') return conv.category === 'contract' || !!conv.contractId;
    if (activeFilter === 'direct') return conv.category === 'direct';
    return true;
  });

  // Sort: Pinned first, then by last message timestamp (or preserve order)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200/80 select-none">
      
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 bg-[#1A1633] text-white border-b border-[#3D2FD1]/30 shrink-0">
        
        {/* Marketplace Exit / Return Link */}
        {onBackToMarketplace && (
          <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
            <button
              onClick={onBackToMarketplace}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group font-medium"
              title="Return to Marketplace Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#A38BFF] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Marketplace</span>
            </button>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Sync</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight text-white font-display">
              Messages
            </h2>
            {totalUnreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#3D2FD1] text-[10px] font-bold text-[#F2F0FF] shadow-sm">
                {totalUnreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenNewChat}
              className="p-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white transition-all cursor-pointer shadow-sm flex items-center gap-1 text-xs font-bold"
              title="Start New Conversation"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Search Mode Toggles & Search Bar */}
        <div className="space-y-2">
          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-[11px]">
            <button
              onClick={() => {
                setSearchMode('chats');
                setSearchResults([]);
              }}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                searchMode === 'chats'
                  ? 'bg-[#3D2FD1] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>All Chats</span>
            </button>
            <button
              onClick={() => {
                setSearchMode('username');
                if (!searchQuery.startsWith('@') && searchQuery.length > 0) {
                  setSearchQuery('@' + searchQuery.replace(/^@/, ''));
                }
              }}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                searchMode === 'username'
                  ? 'bg-[#3D2FD1] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <AtSign className="w-3.5 h-3.5 text-[#A38BFF]" />
              <span>Find People</span>
            </button>
          </div>

          {/* Search Input Field */}
          <div className="relative">
            {searchMode === 'username' ? (
              <AtSign className="w-4 h-4 text-[#A38BFF] absolute left-3 top-1/2 -translate-y-1/2" />
            ) : (
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchMode === 'username' ? "Search people by username (e.g. @mahafuzur)..." : "Search chats or type @ for username..."}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF] focus:bg-white/15 transition-all"
            />
            {isSearchingUsers ? (
              <Loader2 className="w-3.5 h-3.5 text-[#A38BFF] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Filter Tabs (when in chats mode) */}
      {searchMode === 'chats' && (
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#3D2FD1] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            All Chats
          </button>

          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeFilter === 'unread'
                ? 'bg-[#3D2FD1] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>Unread</span>
            {totalUnreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-mono">
                {totalUnreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('contract')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeFilter === 'contract'
                ? 'bg-[#3D2FD1] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contracts</span>
          </button>

          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'direct'
                ? 'bg-[#3D2FD1] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Direct
          </button>
        </div>
      )}

      {/* PEOPLE BY USERNAME SEARCH RESULTS VIEW */}
      {searchMode === 'username' ? (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar p-3 space-y-2">
          {isSearchingUsers ? (
            <div className="py-12 text-center text-slate-500">
              <Loader2 className="w-6 h-6 text-[#3D2FD1] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-[#1A1633]">Searching Talentio users...</p>
              <p className="text-[11px] text-slate-400">Looking up @{searchQuery.replace(/^@/, '')}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 px-1 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Users ({searchResults.length})</span>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">Verified Search</span>
              </div>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-[#F2F0FF] border border-slate-200/80 hover:border-[#3D2FD1]/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      {user.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#1A1633] truncate">
                          {user.name}
                        </span>
                        {user.countryFlag && <span className="text-xs">{user.countryFlag}</span>}
                        {user.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />}
                      </div>
                      <div className="text-[11px] font-bold text-[#3D2FD1] font-mono truncate">
                        {user.handle}
                      </div>
                      {user.title && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {user.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onStartChatWithUser) {
                        onStartChatWithUser(user);
                      }
                      setSearchQuery('');
                      setSearchMode('chats');
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </div>
              ))}
            </div>
          ) : hasSearched && searchQuery.trim() ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <UserX className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-black text-[#1A1633] mb-1">User not found</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-4">
                No Talentio user found with username <span className="font-mono font-bold text-[#1A1633]">"{searchQuery.startsWith('@') ? searchQuery : `@${searchQuery}`}"</span>. Please verify the spelling.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="py-12 px-4 text-center text-slate-400">
              <UserSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 mb-1">Search Talentio by @username</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Enter any user's exact or partial username (e.g. <span className="font-mono text-[#3D2FD1]">@mahafuzur</span>) to immediately open a private 1-to-1 chat.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Conversation Item List (Standard Chats Mode) */
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {sortedConversations.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <p className="text-xs text-slate-500 font-medium">No conversations found</p>
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchMode('username');
                    setSearchQuery(searchQuery.startsWith('@') ? searchQuery : `@${searchQuery}`);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#3D2FD1] text-white text-xs font-bold shadow-sm hover:bg-[#6E5BFF] transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <UserSearch className="w-3.5 h-3.5" />
                  <span>Search people for "{searchQuery}"</span>
                </button>
              ) : (
                <button
                  onClick={onOpenNewChat}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#3D2FD1] text-white text-xs font-bold shadow-sm hover:bg-[#6E5BFF] transition-all cursor-pointer"
                >
                  Start a Conversation
                </button>
              )}
            </div>
          ) : (
          sortedConversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const isMeLast = conv.lastMessage.senderId === 'user-me' || conv.lastMessage.senderId === 'client';
            const isAI = conv.id === 'conv-talentio-ai' || conv.participant.role === 'bot' || conv.participant.role === 'assistant';

            return (
              <div
                key={conv.id}
                className="relative group"
              >
                <div
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-3 sm:p-3.5 flex items-center gap-3 text-left transition-all cursor-pointer border-l-4 ${
                    isActive
                      ? isAI 
                        ? 'bg-[#F4F1FF] border-[#6E5BFF] shadow-sm'
                        : 'bg-[#F2F0FF] border-[#3D2FD1] shadow-sm'
                      : isAI
                        ? 'border-transparent bg-slate-50/40 hover:bg-[#F8F7FF]'
                        : 'border-transparent hover:bg-slate-50/90'
                  }`}
                >
                  
                  {/* Avatar & Online Dot */}
                  <div className="relative shrink-0">
                    {isAI ? (
                      <div className="p-[2px] rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-sm animate-pulse">
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-[14px] object-cover bg-[#1A1633]"
                        />
                      </div>
                    ) : (
                      <img
                        src={conv.participant.avatar}
                        alt={conv.participant.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                    )}

                    {isAI ? (
                      <span 
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ring-2 ring-white shadow-xs" 
                        title="TALENTIO AI — Always Active"
                      />
                    ) : conv.participant.online ? (
                      <span 
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" 
                        title="Online now"
                      />
                    ) : (
                      <span 
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-slate-300 ring-2 ring-white" 
                        title="Offline"
                      />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    
                    {/* Top Row: Name, Badges, Time */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <span className={`text-xs sm:text-sm font-extrabold truncate ${
                          isActive 
                            ? isAI ? 'text-[#5643FA]' : 'text-[#3D2FD1]'
                            : 'text-[#1A1633]'
                        }`}>
                          {conv.participant.name}
                        </span>

                        {isAI && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black tracking-wider uppercase rounded bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xs flex items-center gap-0.5 shrink-0">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            AI
                          </span>
                        )}

                        {conv.participant.countryFlag && !isAI && (
                          <span className="text-xs shrink-0">{conv.participant.countryFlag}</span>
                        )}
                        {conv.participant.verified && !isAI && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF] shrink-0" />
                        )}
                      </div>

                      <span className={`text-[10px] font-medium shrink-0 ${
                        conv.unreadCount > 0 ? 'text-[#3D2FD1] font-bold' : isAI ? 'text-[#6E5BFF] font-semibold' : 'text-slate-400'
                      }`}>
                        {conv.lastMessage.timestamp}
                      </span>
                    </div>

                    {/* Bottom Row: Message Preview, Icons, Unread Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                        
                        {/* Sent checkmark status if I sent the last message */}
                        {isMeLast && (
                          <span className="shrink-0 text-slate-400">
                            {conv.lastMessage.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-[#6E5BFF]" />
                            ) : conv.lastMessage.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </span>
                        )}

                        {/* Special Icon Indicators */}
                        {conv.lastMessage.isVoice && (
                          <Mic className="w-3 h-3 text-[#6E5BFF] shrink-0" />
                        )}
                        {conv.lastMessage.hasAttachment && (
                          <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                        )}
                        {conv.lastMessage.isOffer && (
                          <Briefcase className="w-3 h-3 text-emerald-600 shrink-0" />
                        )}

                        {/* Typing Animation or Snippet */}
                        {conv.participant.isTyping ? (
                          <span className="text-[#3D2FD1] font-bold italic animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3D2FD1] animate-ping" />
                            {isAI ? 'TALENTIO AI is thinking...' : 'typing...'}
                          </span>
                        ) : (
                          <span className={`truncate text-[11px] sm:text-xs ${
                            conv.unreadCount > 0 
                              ? 'text-[#1A1633] font-bold' 
                              : isAI 
                                ? 'text-indigo-900/80 font-medium' 
                                : 'text-slate-600'
                          }`}>
                            {conv.lastMessage.text}
                          </span>
                        )}
                      </div>

                      {/* Badges / Pin / Unread count */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {conv.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-[#6E5BFF] rotate-45" />
                        )}
                        {conv.isMuted && (
                          <BellOff className="w-3.5 h-3.5 text-slate-300" />
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#3D2FD1] text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-sm">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Quick Hover Option Trigger */}
                <div className="absolute right-2 top-2 hidden group-hover:block z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenuId(contextMenuId === conv.id ? null : conv.id);
                    }}
                    className="p-1 rounded-lg bg-white shadow-md border border-slate-200 text-slate-600 hover:text-slate-900"
                    title="Conversation Options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {contextMenuId === conv.id && (
                    <div 
                      className="absolute right-0 mt-1 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs animate-in fade-in duration-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => { onTogglePin(conv.id); setContextMenuId(null); }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                      >
                        <Pin className="w-3.5 h-3.5 text-[#6E5BFF]" />
                        <span>{conv.isPinned ? 'Unpin Chat' : 'Pin to Top'}</span>
                      </button>
                      <button
                        onClick={() => { onToggleMute(conv.id); setContextMenuId(null); }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                      >
                        <BellOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>{conv.isMuted ? 'Unmute' : 'Mute Notifications'}</span>
                      </button>
                      <button
                        onClick={() => { onMarkAsRead(conv.id); setContextMenuId(null); }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark as Read</span>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => { onDeleteConversation(conv.id); setContextMenuId(null); }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
      )}

      {/* Footer Security Pill */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 shrink-0">
        <Lock className="w-3 h-3 text-[#3D2FD1]" />
        <span>End-to-End Escrow Protection</span>
      </div>

    </div>
  );
};
