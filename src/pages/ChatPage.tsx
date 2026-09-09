import React, { useState, useEffect, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { useTalentioAI } from '../context/TalentioAIContext';
import { 
  Conversation, 
  ChatMessage, 
  MessageAttachment, 
  VoiceNoteData, 
  ConversationParticipant,
  OrderRequestDetails,
  EscrowContract
} from '../types';
import { 
  INITIAL_CONVERSATIONS, 
  INITIAL_CONVERSATION_MESSAGES,
  TALENTIO_AI_CONVERSATION,
  TALENTIO_AI_CONVERSATION_ID,
  TALENTIO_AI_PARTICIPANT
} from '../data/chatData';
import { queryLocalKnowledgeBase } from '../data/talentioKnowledgeBase';
import { 
  subscribeToChatMessages, 
  sendChatMessageDocument, 
  saveConversationDocument,
  markMessagesSeenInFirestore 
} from '../lib/firestore';
import { realtimeService } from '../lib/realtimeService';
import { ConversationList } from '../components/chat/ConversationList';
import { ActiveChatHeader } from '../components/chat/ActiveChatHeader';
import { MessageTimeline } from '../components/chat/MessageTimeline';
import { MessageComposer } from '../components/chat/MessageComposer';
import { NewChatModal } from '../components/chat/NewChatModal';
import { ForwardMessageModal } from '../components/chat/ForwardMessageModal';
import { ConfirmOrderModal } from '../components/chat/ConfirmOrderModal';
import { soundEffects } from '../utils/audioEffects';
import { 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Search, 
  X, 
  UserCheck, 
  Plus,
  LogIn,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Shield
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { startVoiceSession } = useTalentioAI();
  const { 
    user, 
    isAuthenticated, 
    requireAuth, 
    setIsAuthModalOpen, 
    setActivePage, 
    selectedFreelancer, 
    setSelectedFreelancer,
    showToast,
    freelancers,
    startServiceOrderEscrow,
    setIsPostJobModalOpen,
    setIsCreateGigModalOpen,
    setIsWidgetManagerOpen,
    setIsSearchModalOpen
  } = useGuide();

  // Conversations State (persisted to localStorage)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('talentio_chat_conversations');
      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);
        if (!parsed.some(c => c.id === TALENTIO_AI_CONVERSATION_ID || c.participant.role === 'bot')) {
          return [TALENTIO_AI_CONVERSATION, ...parsed];
        }
        return parsed;
      }
      return INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Messages Map State: { [conversationId]: ChatMessage[] }
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('talentio_chat_messages_map');
      if (saved) {
        const parsed: Record<string, ChatMessage[]> = JSON.parse(saved);
        if (!parsed[TALENTIO_AI_CONVERSATION_ID] || parsed[TALENTIO_AI_CONVERSATION_ID].length === 0) {
          parsed[TALENTIO_AI_CONVERSATION_ID] = INITIAL_CONVERSATION_MESSAGES[TALENTIO_AI_CONVERSATION_ID] || [
            {
              id: 'ai-msg-welcome',
              conversationId: TALENTIO_AI_CONVERSATION_ID,
              sender: 'other',
              senderId: 'talentio-ai-bot',
              senderName: 'TALENTIO AI',
              senderAvatar: TALENTIO_AI_PARTICIPANT.avatar,
              text: 'Hello! I am TALENTIO AI, your intelligent marketplace assistant. Ask me anything about posting jobs, hiring freelancers, gigs, or escrow protection in English or বাংলা!',
              timestamp: 'Just now',
              isoDate: new Date().toISOString(),
              status: 'read'
            }
          ];
        }
        return parsed;
      }
      return INITIAL_CONVERSATION_MESSAGES;
    } catch {
      return INITIAL_CONVERSATION_MESSAGES;
    }
  });

  // Active Selected Conversation ID — REQUIREMENT 2: No account automatically open on first load / entry!
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    if (selectedFreelancer) {
      const found = INITIAL_CONVERSATIONS.find(c => c.participant.id === selectedFreelancer.id);
      if (found) return found.id;
    }
    return null; // Empty on first open, user chooses from conversation list
  });

  // Modals & States
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isConfirmOrderModalOpen, setIsConfirmOrderModalOpen] = useState(false);
  const [forwardModalData, setForwardModalData] = useState<ChatMessage | null>(null);

  // In-chat search state
  const [isSearchInChatOpen, setIsSearchInChatOpen] = useState(false);
  const [searchInChatQuery, setSearchInChatQuery] = useState('');

  // Replying & Editing
  const [replyingMessage, setReplyingMessage] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('talentio_chat_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.error(e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('talentio_chat_messages_map', JSON.stringify(messagesMap));
    } catch (e) {
      console.error(e);
    }
  }, [messagesMap]);

  // Register current user in realtime service
  useEffect(() => {
    if (user?.id) {
      realtimeService.setUser(user.id);
    }
  }, [user?.id]);

  // Real-time Socket.IO event listeners for live account-to-account communication
  useEffect(() => {
    // 1. Live incoming chat message
    const unsubMsg = realtimeService.on('new_message', (msg: ChatMessage) => {
      const convId = msg.conversationId || msg.conversation_id;
      if (!convId) return;

      setMessagesMap(prev => {
        const existing = prev[convId] || [];
        if (existing.some(m => m.id === msg.id)) return prev;
        return {
          ...prev,
          [convId]: [...existing, msg]
        };
      });

      const isCurrentActive = activeConversationId === convId;

      setConversations(prev => {
        const match = prev.find(c => c.id === convId);
        if (match) {
          return prev.map(c => c.id === convId ? {
            ...c,
            lastMessage: {
              text: msg.text || msg.message || 'New message',
              timestamp: msg.timestamp || 'Just now',
              senderId: msg.senderId || msg.sender_id,
              sender_id: msg.senderId || msg.sender_id,
              receiver_id: msg.receiverId || msg.receiver_id,
              status: isCurrentActive ? 'read' : 'delivered',
              read_status: isCurrentActive ? 'read' : 'delivered',
              isVoice: !!msg.voiceNote,
              hasAttachment: !!(msg.attachments && msg.attachments.length > 0)
            },
            unreadCount: isCurrentActive ? 0 : (c.unreadCount + 1)
          } : c);
        } else {
          const newConv: Conversation = {
            id: convId,
            participant: {
              id: msg.senderId || 'user-sender',
              name: msg.senderName || 'Talentio User',
              handle: `@user_${(msg.senderId || 'user').slice(-4)}`,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              role: 'freelancer',
              verified: true,
              online: true,
              lastSeen: 'Online'
            },
            participantIds: [user?.id || 'me', msg.senderId || 'user-sender'],
            lastMessage: {
              text: msg.text || msg.message || 'New message',
              timestamp: msg.timestamp || 'Just now',
              senderId: msg.senderId,
              status: isCurrentActive ? 'read' : 'delivered',
              read_status: isCurrentActive ? 'read' : 'delivered'
            },
            unreadCount: isCurrentActive ? 0 : 1,
            isPinned: false,
            isMuted: false,
            category: 'direct'
          };
          return [newConv, ...prev];
        }
      });

      // Mark as seen immediately if active
      if (isCurrentActive && msg.senderId && msg.senderId !== user?.id) {
        realtimeService.markMessagesAsSeen(convId, msg.senderId, [msg.id]);
        markMessagesSeenInFirestore(convId, [msg.id]).catch(() => {});
      }

      soundEffects.playMessageReceived();
    });

    // 2. Typing status event
    const unsubTyping = realtimeService.on('typing', ({ conversationId, userId, isTyping }: any) => {
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId || c.participant.id === userId) {
          return {
            ...c,
            participant: {
              ...c.participant,
              isTyping
            }
          };
        }
        return c;
      }));
    });

    // 3. Messages seen receipts (blue double ticks)
    const unsubSeen = realtimeService.on('messages_seen', ({ conversationId, messageIds }: any) => {
      setMessagesMap(prev => {
        const msgs = prev[conversationId];
        if (!msgs) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m => messageIds.includes(m.id) ? { ...m, status: 'read', read_status: 'read', seen: true } : m)
        };
      });
    });

    // 4. Messages delivered receipts (grey double ticks)
    const unsubDelivered = realtimeService.on('messages_delivered', ({ conversationId, messageIds }: any) => {
      setMessagesMap(prev => {
        const msgs = prev[conversationId];
        if (!msgs) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m => messageIds.includes(m.id) && m.status !== 'read' ? { ...m, status: 'delivered', read_status: 'delivered' } : m)
        };
      });
    });

    // 5. Presence event
    const unsubPresence = realtimeService.on('presence', ({ userId, online, lastSeen }: any) => {
      setConversations(prev => prev.map(c => {
        if (c.participant.id === userId) {
          return {
            ...c,
            participant: {
              ...c.participant,
              online,
              lastSeen: online ? 'Online' : (lastSeen || 'Recently')
            }
          };
        }
        return c;
      }));
    });

    return () => {
      unsubMsg();
      unsubTyping();
      unsubSeen();
      unsubDelivered();
      unsubPresence();
    };
  }, [activeConversationId, user?.id]);

  // Real-time Firestore message listener for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = subscribeToChatMessages(activeConversationId, (firestoreMsgs) => {
      if (firestoreMsgs && firestoreMsgs.length > 0) {
        setMessagesMap(prev => {
          const currentLocal = prev[activeConversationId] || [];
          // Merge local and firestore without duplication
          const map = new Map<string, ChatMessage>();
          currentLocal.forEach(m => map.set(m.id, m));
          firestoreMsgs.forEach(m => map.set(m.id, m));
          return {
            ...prev,
            [activeConversationId]: Array.from(map.values())
          };
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [activeConversationId]);

  // Mark unread messages as read when opening conversation
  useEffect(() => {
    if (!activeConversationId || !activeConversation) return;

    const msgs = messagesMap[activeConversationId] || [];
    const currentUserId = user?.id || 'user-me';
    const unseenIds = msgs
      .filter(m => m.senderId && m.senderId !== currentUserId && m.status !== 'read')
      .map(m => m.id);

    if (unseenIds.length > 0) {
      realtimeService.markMessagesAsSeen(activeConversationId, activeConversation.participant.id, unseenIds);
      markMessagesSeenInFirestore(activeConversationId, unseenIds).catch(() => {});
      
      setMessagesMap(prev => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).map(m => 
          unseenIds.includes(m.id) ? { ...m, status: 'read', read_status: 'read', seen: true } : m
        )
      }));
    }
  }, [activeConversationId, messagesMap[activeConversationId || '']?.length]);

  // When selectedFreelancer updates from another page, create or jump to conversation
  useEffect(() => {
    if (selectedFreelancer) {
      const existing = conversations.find(c => c.participant.id === selectedFreelancer.id);
      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        const newConv: Conversation = {
          id: `conv-${selectedFreelancer.id}`,
          participant: {
            id: selectedFreelancer.id,
            name: selectedFreelancer.name,
            handle: selectedFreelancer.handle || `@${selectedFreelancer.name.toLowerCase().replace(/\s+/g, '')}`,
            avatar: selectedFreelancer.avatar,
            role: 'freelancer',
            verified: true,
            online: !!selectedFreelancer.availableNow,
            lastSeen: selectedFreelancer.availableNow ? 'Online' : 'Recently',
            countryFlag: selectedFreelancer.countryFlag
          },
          participantIds: [user?.id || 'user-me', selectedFreelancer.id],
          lastMessage: {
            senderId: 'user-me',
            sender_id: user?.id || 'user-me',
            receiver_id: selectedFreelancer.id,
            text: 'Conversation opened',
            timestamp: 'Just now',
            status: 'sent',
            read_status: 'sent'
          },
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          category: 'direct'
        };

        setConversations(prev => [newConv, ...prev]);
        setMessagesMap(prev => ({
          ...prev,
          [newConv.id]: []
        }));
        setActiveConversationId(newConv.id);
      }
    }
  }, [selectedFreelancer]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? (messagesMap[activeConversationId] || []) : [];

  // Handle select conversation
  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId);
    // Mark conversation as read
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
    setSearchInChatQuery('');
    setIsSearchInChatOpen(false);
    setReplyingMessage(null);
    setEditingMessage(null);
  };

  // Mark all as read
  const handleMarkAsRead = (convId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
  };

  // Toggle Pin conversation
  const handleTogglePin = (convId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, isPinned: !c.isPinned } : c
    ));
    showToast('Conversation pin updated', 'info');
  };

  // Toggle Mute conversation
  const handleToggleMute = (convId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, isMuted: !c.isMuted } : c
    ));
    showToast('Conversation mute status updated', 'info');
  };

  // Delete Conversation
  const handleDeleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    setMessagesMap(prev => {
      const next = { ...prev };
      delete next[convId];
      return next;
    });
    if (activeConversationId === convId) {
      setActiveConversationId(null);
    }
    showToast('Conversation deleted', 'info');
  };

  // Start new chat with contact
  const handleSelectNewContact = (freelancer: any) => {
    const existing = conversations.find(c => c.participant.id === freelancer.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv-${freelancer.id}`,
        participant: {
          id: freelancer.id,
          name: freelancer.name,
          handle: freelancer.handle || `@${freelancer.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: freelancer.avatar,
          role: 'freelancer',
          verified: true,
          online: !!freelancer.availableNow,
          lastSeen: freelancer.availableNow ? 'Online' : 'Recently',
          countryFlag: freelancer.countryFlag
        },
        participantIds: [user?.id || 'user-me', freelancer.id],
        lastMessage: {
          senderId: user?.id || 'user-me',
          sender_id: user?.id || 'user-me',
          receiver_id: freelancer.id,
          text: 'Conversation opened',
          timestamp: 'Just now',
          status: 'sent',
          read_status: 'sent'
        },
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        category: 'direct'
      };

      setConversations(prev => [newConv, ...prev]);
      setMessagesMap(prev => ({
        ...prev,
        [newConv.id]: []
      }));
      setActiveConversationId(newConv.id);
    }
  };

  // Handle executing smart actions suggested by TALENTIO AI in chat
  const handleExecuteAction = (action: { type: 'navigate' | 'modal'; target: string; label: string }) => {
    if (action.type === 'navigate') {
      setActivePage(action.target as any);
      showToast(`Navigating to ${action.label}`, 'info');
    } else if (action.type === 'modal') {
      if (action.target === 'post-job-modal' || action.target === 'post-job') {
        setIsPostJobModalOpen(true);
      } else if (action.target === 'create-gig-modal') {
        setIsCreateGigModalOpen(true);
      } else if (action.target === 'widget-manager') {
        setIsWidgetManagerOpen(true);
      } else if (action.target === 'search-modal') {
        setIsSearchModalOpen(true);
      }
      showToast(`Opening ${action.label}`, 'info');
    }
  };

  // Send Text Message
  const handleSendMessage = async (text: string, replyTo?: ChatMessage['replyTo']) => {
    if (!activeConversationId || !activeConversation) return;

    const currentUserId = user?.id || 'user-me';
    const receiverId = activeConversation.participant.id;
    const isoTimestamp = new Date().toISOString();
    const timeDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      receiverId: receiverId,
      receiver_id: receiverId,
      senderName: user ? user.name : 'You',
      text,
      message: text,
      timestamp: timeDisplay,
      isoDate: isoTimestamp,
      createdAt: isoTimestamp,
      created_at: isoTimestamp,
      status: 'sent',
      read_status: 'sent',
      replyTo
    };

    // Append to local state
    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    // Update conversation lastMessage
    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: {
              text,
              timestamp: newMessage.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              status: 'sent',
              read_status: 'sent'
            }
          }
        : c
    ));

    setReplyingMessage(null);
    soundEffects.playMessageSent();

    // SPECIAL HANDLING: TALENTIO AI Assistant (Meta AI style contact in messaging)
    const isBotConversation = activeConversationId === TALENTIO_AI_CONVERSATION_ID || 
                             activeConversation.participant.role === 'bot' || 
                             activeConversation.participant.id === 'talentio-ai-bot';

    if (isBotConversation) {
      // 1. Indicate bot is typing with animation
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId 
          ? { ...c, participant: { ...c.participant, isTyping: true } }
          : c
      ));

      // 2. Fetch answer from API / fallback
      (async () => {
        try {
          const userRole = user?.userType || 'client';
          const history = (messagesMap[activeConversationId] || []).slice(-6).map(m => ({
            role: m.sender === 'me' ? 'user' : 'assistant',
            content: m.text
          }));

          const res = await fetch('/api/talentio-ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              messages: history,
              userRole,
              currentPage: 'messages',
              language: /[\u0980-\u09FF]/.test(text) ? 'bn' : 'auto'
            })
          });

          let aiReply = '';
          let aiAction: { type: 'navigate' | 'modal'; target: string; label: string } | undefined = undefined;

          if (res.ok) {
            const data = await res.json();
            aiReply = data.reply || '';
            aiAction = data.action;
          } else {
            const fallback = queryLocalKnowledgeBase(text, userRole, 'messages', /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en');
            aiReply = fallback.reply;
            aiAction = fallback.action;
          }

          const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const botMsg: ChatMessage = {
            id: `ai-msg-${Date.now()}`,
            conversationId: activeConversationId,
            conversation_id: activeConversationId,
            sender: 'other',
            senderId: 'talentio-ai-bot',
            sender_id: 'talentio-ai-bot',
            receiverId: currentUserId,
            receiver_id: currentUserId,
            senderName: 'TALENTIO AI',
            senderAvatar: TALENTIO_AI_PARTICIPANT.avatar,
            text: aiReply,
            message: aiReply,
            timestamp: botTimestamp,
            isoDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
            status: 'delivered',
            read_status: 'delivered',
            action: aiAction
          };

          setMessagesMap(prev => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), botMsg]
          }));

          setConversations(prev => prev.map(c => 
            c.id === activeConversationId 
              ? {
                  ...c,
                  participant: { ...c.participant, isTyping: false },
                  lastMessage: {
                    text: aiReply,
                    timestamp: botTimestamp,
                    senderId: 'talentio-ai-bot',
                    sender_id: 'talentio-ai-bot',
                    receiver_id: currentUserId,
                    status: 'delivered',
                    read_status: 'delivered'
                  }
                }
              : c
          ));

          soundEffects.playMessageReceived();
        } catch (err) {
          const fallback = queryLocalKnowledgeBase(text, user?.userType || 'client', 'messages', /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en');
          const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const botMsg: ChatMessage = {
            id: `ai-msg-${Date.now()}`,
            conversationId: activeConversationId,
            conversation_id: activeConversationId,
            sender: 'other',
            senderId: 'talentio-ai-bot',
            sender_id: 'talentio-ai-bot',
            receiverId: currentUserId,
            receiver_id: currentUserId,
            senderName: 'TALENTIO AI',
            senderAvatar: TALENTIO_AI_PARTICIPANT.avatar,
            text: fallback.reply,
            message: fallback.reply,
            timestamp: botTimestamp,
            isoDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
            status: 'delivered',
            read_status: 'delivered',
            action: fallback.action
          };

          setMessagesMap(prev => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), botMsg]
          }));

          setConversations(prev => prev.map(c => 
            c.id === activeConversationId 
              ? {
                  ...c,
                  participant: { ...c.participant, isTyping: false },
                  lastMessage: {
                    text: fallback.reply,
                    timestamp: botTimestamp,
                    senderId: 'talentio-ai-bot',
                    sender_id: 'talentio-ai-bot',
                    receiver_id: currentUserId,
                    status: 'delivered',
                    read_status: 'delivered'
                  }
                }
              : c
          ));
          soundEffects.playMessageReceived();
        }
      })();

      return;
    }

    // Broadcast via live socket and persist to Firestore database for human recipient
    realtimeService.sendMessage(activeConversationId, newMessage);
    try {
      await sendChatMessageDocument(activeConversationId, newMessage);
    } catch (err) {
      console.warn('Firestore message sync fallback:', err);
    }
  };

  // Send Voice Note
  const handleSendVoiceNote = async (voiceNote: VoiceNoteData) => {
    if (!activeConversationId || !activeConversation) return;

    const currentUserId = user?.id || 'user-me';
    const receiverId = activeConversation.participant.id;
    const isoTimestamp = new Date().toISOString();
    const timeDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: ChatMessage = {
      id: `msg-voice-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      receiverId: receiverId,
      receiver_id: receiverId,
      senderName: user ? user.name : 'You',
      text: 'Voice note',
      message: 'Voice note',
      timestamp: timeDisplay,
      isoDate: isoTimestamp,
      createdAt: isoTimestamp,
      created_at: isoTimestamp,
      status: 'sent',
      read_status: 'sent',
      voiceNote
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: {
              text: 'Voice note',
              timestamp: newMessage.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              status: 'sent',
              read_status: 'sent',
              isVoice: true
            }
          }
        : c
    ));

    soundEffects.playMessageSent();
    realtimeService.sendMessage(activeConversationId, newMessage);

    try {
      await sendChatMessageDocument(activeConversationId, newMessage);
    } catch (err) {
      console.warn('Firestore voice sync fallback:', err);
    }
  };

  // Send Attachment
  const handleSendAttachment = async (attachment: MessageAttachment) => {
    if (!activeConversationId || !activeConversation) return;

    const currentUserId = user?.id || 'user-me';
    const receiverId = activeConversation.participant.id;
    const isoTimestamp = new Date().toISOString();
    const timeDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: ChatMessage = {
      id: `msg-att-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      receiverId: receiverId,
      receiver_id: receiverId,
      senderName: user ? user.name : 'You',
      text: attachment.name,
      message: attachment.name,
      timestamp: timeDisplay,
      isoDate: isoTimestamp,
      createdAt: isoTimestamp,
      created_at: isoTimestamp,
      status: 'sent',
      read_status: 'sent',
      attachments: [attachment]
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: {
              text: attachment.name,
              timestamp: newMessage.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              status: 'sent',
              read_status: 'sent',
              hasAttachment: true
            }
          }
        : c
    ));

    soundEffects.playMessageSent();
    realtimeService.sendMessage(activeConversationId, newMessage);

    try {
      await sendChatMessageDocument(activeConversationId, newMessage);
    } catch (err) {
      console.warn('Firestore attachment sync fallback:', err);
    }
  };

  // Send Custom Milestone Offer
  const handleSendMilestoneOffer = async (title: string, amount: number, deliveryDays: number) => {
    if (!activeConversationId || !activeConversation) return;

    const currentUserId = user?.id || 'user-me';
    const receiverId = activeConversation.participant.id;
    const isoTimestamp = new Date().toISOString();
    const timeDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const offerId = `offer-${Date.now()}`;

    const newMessage: ChatMessage = {
      id: `msg-offer-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      receiverId: receiverId,
      receiver_id: receiverId,
      senderName: user ? user.name : 'You',
      text: `Created milestone proposal: ${title}`,
      message: `Created milestone proposal: ${title}`,
      timestamp: timeDisplay,
      isoDate: isoTimestamp,
      createdAt: isoTimestamp,
      created_at: isoTimestamp,
      status: 'sent',
      read_status: 'sent',
      isOffer: true,
      offerDetails: {
        id: offerId,
        title,
        amount,
        deliveryDays,
        status: 'pending'
      }
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: {
              text: `Proposal: ${title}`,
              timestamp: newMessage.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              status: 'sent',
              read_status: 'sent',
              isOffer: true
            }
          }
        : c
    ));

    soundEffects.playMessageSent();
    showToast('Official Milestone Offer sent to partner', 'success');
    realtimeService.sendMessage(activeConversationId, newMessage);

    try {
      await sendChatMessageDocument(activeConversationId, newMessage);
    } catch (err) {
      console.warn('Firestore offer sync fallback:', err);
    }
  };

  // Accept Milestone Offer
  const handleAcceptOffer = (messageId: string) => {
    if (!activeConversationId) return;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => {
        if (m.id === messageId && m.offerDetails) {
          return {
            ...m,
            offerDetails: { ...m.offerDetails, status: 'accepted' }
          };
        }
        return m;
      })
    }));

    showToast('Milestone Offer Accepted! Escrow funds deposited in vault.', 'success');
  };

  // Send Order Confirmation Request (Freelancer to Client)
  const handleSendOrderRequest = async (details: {
    title: string;
    amount: number;
    deliveryDays: number;
    requirements: string;
  }) => {
    if (!activeConversationId || !activeConversation) return;

    const reqId = `req-${Date.now()}`;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentUserId = user?.id || 'user-me';
    const receiverId = activeConversation.participant.id;
    const isoTimestamp = new Date().toISOString();
    const timeDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const orderDetails: OrderRequestDetails = {
      id: reqId,
      orderNumber,
      freelancerId: currentUserId,
      freelancerName: user?.name || 'Freelancer',
      freelancerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      clientId: receiverId,
      clientName: activeConversation.participant.name,
      clientAvatar: activeConversation.participant.avatar,
      title: details.title,
      amount: details.amount,
      deliveryDays: details.deliveryDays,
      requirements: details.requirements,
      status: 'pending',
      createdAt: isoTimestamp
    };

    const newMessage: ChatMessage = {
      id: `msg-order-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      receiverId: receiverId,
      receiver_id: receiverId,
      senderName: user ? user.name : 'You',
      text: `📋 Sent an Order Confirmation Request (#${orderNumber}) for $${details.amount} USD`,
      message: `📋 Sent an Order Confirmation Request (#${orderNumber}) for $${details.amount} USD`,
      timestamp: timeDisplay,
      isoDate: isoTimestamp,
      createdAt: isoTimestamp,
      created_at: isoTimestamp,
      status: 'sent',
      read_status: 'sent',
      isOrderRequest: true,
      orderRequestDetails: orderDetails
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? {
            ...c,
            lastMessage: {
              text: `📋 Order Request: ${details.title}`,
              timestamp: newMessage.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              status: 'sent',
              read_status: 'sent',
              isOffer: true
            }
          }
        : c
    ));

    soundEffects.playMessageSent();
    showToast(`Order Confirmation Request #${orderNumber} sent to ${activeConversation.participant.name}!`, 'success');

    try {
      await sendChatMessageDocument(activeConversationId, newMessage);
    } catch (err) {
      console.warn('Firestore order sync fallback:', err);
    }
  };

  // Client Confirms Order Request
  const handleConfirmOrderRequest = async (messageId: string) => {
    if (!activeConversationId || !activeConversation) return;

    let targetReq: OrderRequestDetails | undefined;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => {
        if (m.id === messageId && m.orderRequestDetails) {
          targetReq = m.orderRequestDetails;
          return {
            ...m,
            orderRequestDetails: {
              ...m.orderRequestDetails,
              status: 'confirmed',
              confirmedAt: new Date().toISOString()
            }
          };
        }
        return m;
      })
    }));

    if (!targetReq) return;

    const contractOrderNumber = targetReq.orderNumber;
    const totalAmount = targetReq.amount;

    // Create Real Escrow Contract & Workspace
    const newContract: EscrowContract = {
      id: contractOrderNumber,
      orderNumber: contractOrderNumber,
      title: targetReq.title,
      clientName: targetReq.clientName || 'Client',
      clientCountry: activeConversation.participant.countryFlag ? 'Verified' : 'Global',
      freelancerName: targetReq.freelancerName || 'Freelancer',
      freelancerAvatar: targetReq.freelancerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalAmount: totalAmount,
      escrowFunded: true,
      status: 'funded',
      remainingSeconds: targetReq.deliveryDays * 86400,
      deliverables: [],
      milestones: [
        {
          id: `m-1`,
          name: 'Milestone 1: Project Setup & Specs Approval',
          amount: Math.round(totalAmount * 0.3),
          status: 'in_progress',
          dueDate: `In 2 days`
        },
        {
          id: `m-2`,
          name: 'Milestone 2: Core Deliverable Development',
          amount: Math.round(totalAmount * 0.5),
          status: 'pending',
          dueDate: `In ${Math.max(3, targetReq.deliveryDays - 1)} days`
        },
        {
          id: `m-3`,
          name: 'Milestone 3: Final Inspection & Handover',
          amount: Math.round(totalAmount * 0.2),
          status: 'pending',
          dueDate: `In ${targetReq.deliveryDays} days`
        }
      ]
    };

    // Update active contract in context & storage
    await startServiceOrderEscrow(newContract);

    // Append System Message to Chat
    const systemMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'system',
      senderId: 'system',
      sender_id: 'system',
      senderName: 'Talentio Escrow System',
      text: `🎉 Order #${contractOrderNumber} confirmed! $${totalAmount} USD has been safely locked in Talentio 3-Tier Multi-Sig Escrow Vault. Workspace is ready.`,
      message: `🎉 Order #${contractOrderNumber} confirmed! $${totalAmount} USD has been safely locked in Talentio 3-Tier Multi-Sig Escrow Vault. Workspace is ready.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isoDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: 'read',
      read_status: 'read'
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), systemMsg]
    }));

    soundEffects.playMessageReceived();
    showToast(`Order #${contractOrderNumber} successfully activated! Escrow funds locked.`, 'success');
  };

  // Cancel Order Request
  const handleCancelOrderRequest = (messageId: string) => {
    if (!activeConversationId) return;

    let orderNum = '';
    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => {
        if (m.id === messageId && m.orderRequestDetails) {
          orderNum = m.orderRequestDetails.orderNumber;
          return {
            ...m,
            orderRequestDetails: {
              ...m.orderRequestDetails,
              status: 'cancelled',
              cancelledAt: new Date().toISOString()
            }
          };
        }
        return m;
      })
    }));

    const systemMsg: ChatMessage = {
      id: `sys-cancel-${Date.now()}`,
      conversationId: activeConversationId,
      conversation_id: activeConversationId,
      sender: 'system',
      senderId: 'system',
      sender_id: 'system',
      senderName: 'Talentio Escrow System',
      text: `ℹ️ Order confirmation request #${orderNum || 'ORD'} was cancelled. No escrow funds were charged.`,
      message: `ℹ️ Order confirmation request #${orderNum || 'ORD'} was cancelled. No escrow funds were charged.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isoDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: 'read',
      read_status: 'read'
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), systemMsg]
    }));

    showToast('Order request cancelled', 'info');
  };

  // React to message
  const handleReactMessage = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => {
        if (m.id !== messageId) return m;

        const existingReactions = m.reactions || [];
        const existingIdx = existingReactions.findIndex(r => r.emoji === emoji);

        if (existingIdx > -1) {
          const r = existingReactions[existingIdx];
          const hasReacted = r.userIds.includes('user-me');
          if (hasReacted) {
            const newUserIds = r.userIds.filter(id => id !== 'user-me');
            if (newUserIds.length === 0) {
              return {
                ...m,
                reactions: existingReactions.filter(x => x.emoji !== emoji)
              };
            }
            return {
              ...m,
              reactions: existingReactions.map((x, idx) => 
                idx === existingIdx ? { ...x, count: x.count - 1, userIds: newUserIds } : x
              )
            };
          } else {
            return {
              ...m,
              reactions: existingReactions.map((x, idx) => 
                idx === existingIdx ? { ...x, count: x.count + 1, userIds: [...x.userIds, 'user-me'] } : x
              )
            };
          }
        } else {
          return {
            ...m,
            reactions: [...existingReactions, { emoji, count: 1, userIds: ['user-me'] }]
          };
        }
      })
    }));
  };

  // Toggle Pin message
  const handleTogglePinMessage = (messageId: string) => {
    if (!activeConversationId) return;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => 
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      )
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConversationId
        ? { ...c, pinnedMessageId: c.pinnedMessageId === messageId ? undefined : messageId }
        : c
    ));

    showToast('Pinned message status updated', 'info');
  };

  // Edit Message
  const handleSaveEdit = (newText: string) => {
    if (!activeConversationId || !editingMessage) return;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => 
        m.id === editingMessage.id ? { ...m, text: newText, message: newText, isEdited: true } : m
      )
    }));
    setEditingMessage(null);
    showToast('Message edited', 'info');
  };

  // Delete Message
  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversationId) return;

    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map(m => 
        m.id === messageId ? { ...m, isDeleted: true, text: 'This message was deleted', message: 'This message was deleted' } : m
      )
    }));

    showToast('Message deleted', 'info');
  };

  // Forward Message
  const handleForward = (targetConvId: string, message: ChatMessage) => {
    const currentUserId = user?.id || 'user-me';
    const forwardedMsg: ChatMessage = {
      id: `msg-fwd-${Date.now()}`,
      conversationId: targetConvId,
      conversation_id: targetConvId,
      sender: 'me',
      senderId: currentUserId,
      sender_id: currentUserId,
      senderName: user ? user.name : 'You',
      text: message.text,
      message: message.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isoDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      status: 'sent',
      read_status: 'sent',
      attachments: message.attachments,
      voiceNote: message.voiceNote,
      isOffer: message.isOffer,
      offerDetails: message.offerDetails
    };

    setMessagesMap(prev => ({
      ...prev,
      [targetConvId]: [...(prev[targetConvId] || []), forwardedMsg]
    }));

    setConversations(prev => prev.map(c => 
      c.id === targetConvId
        ? {
            ...c,
            lastMessage: {
              text: message.text,
              timestamp: forwardedMsg.timestamp,
              senderId: currentUserId,
              sender_id: currentUserId,
              status: 'sent',
              read_status: 'sent',
              isVoice: !!message.voiceNote,
              hasAttachment: !!(message.attachments && message.attachments.length > 0),
              isOffer: !!message.isOffer
            },
            unreadCount: activeConversationId === targetConvId ? 0 : (c.unreadCount + 1)
          }
        : c
    ));

    showToast('Message forwarded successfully', 'success');
  };

  // Clear active chat
  const handleClearChat = () => {
    if (!activeConversationId) return;
    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: []
    }));
    showToast('Chat history cleared', 'info');
  };

  // View Freelancer Profile
  const handleViewProfile = () => {
    if (activeConversation) {
      const match = freelancers.find(f => f.id === activeConversation.participant.id);
      if (match) {
        setSelectedFreelancer(match);
      }
      setActivePage('freelancers');
    }
  };

  // View Escrow Contract
  const handleViewContract = () => {
    setActivePage('workstation');
  };

  // Handle Typing indicator event emission
  const handleTyping = (isTyping: boolean) => {
    if (activeConversationId && activeConversation) {
      realtimeService.sendTyping(activeConversationId, activeConversation.participant.id, isTyping);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex bg-white overflow-hidden select-none">
      
      {/* LEFT PANEL: WhatsApp Web Style Conversation List */}
      {/* On desktop: always visible (w-80 or w-96). On mobile: visible when no conversation is selected */}
      <div className={`h-full ${
        activeConversationId ? 'hidden md:flex md:w-80 lg:w-96 xl:w-[380px] shrink-0' : 'w-full flex-1'
      } border-r border-slate-200 bg-white flex flex-col`}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          onTogglePin={handleTogglePin}
          onToggleMute={handleToggleMute}
          onDeleteConversation={handleDeleteConversation}
          onMarkAsRead={handleMarkAsRead}
          onBackToMarketplace={() => setActivePage('home')}
        />
      </div>

      {/* RIGHT PANEL: Edge-to-Edge Dedicated Messaging Workspace */}
      {/* On desktop: always visible. On mobile: visible only when activeConversationId is selected */}
      <div className={`flex-1 h-full flex flex-col bg-white min-w-0 overflow-hidden relative ${
        !activeConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        {activeConversation ? (
          <div className="flex flex-col h-full w-full overflow-hidden">
            
            {/* 1. STICKY TOP CHAT HEADER: Fixed at top of conversation */}
            <div className="sticky top-0 z-20 shrink-0 w-full">
              <ActiveChatHeader
                participant={activeConversation.participant}
                contractId={activeConversation.contractId}
                isPinned={activeConversation.isPinned}
                isMuted={activeConversation.isMuted}
                isFreelancerView={true}
                onBack={() => setActiveConversationId(null)}
                onToggleSearch={() => setIsSearchInChatOpen(!isSearchInChatOpen)}
                onTogglePin={() => handleTogglePin(activeConversation.id)}
                onToggleMute={() => handleToggleMute(activeConversation.id)}
                onClearChat={handleClearChat}
                onViewProfile={handleViewProfile}
                onViewContract={handleViewContract}
                onOpenConfirmOrderModal={() => setIsConfirmOrderModalOpen(true)}
                onVoiceStart={() => startVoiceSession()}
              />
            </div>

            {/* In-chat Search Bar Strip */}
            {isSearchInChatOpen && (
              <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150 shrink-0 z-10">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInChatQuery}
                  onChange={(e) => setSearchInChatQuery(e.target.value)}
                  placeholder="Search messages in this conversation..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1633] placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF]"
                  autoFocus
                />
                <button
                  onClick={() => { setIsSearchInChatOpen(false); setSearchInChatQuery(''); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 2. SCROLLABLE MESSAGE TIMELINE: Only message bubbles scroll within this container */}
            <div className="flex-1 min-h-0 overflow-y-auto w-full">
              <MessageTimeline
                messages={activeMessages}
                searchQuery={searchInChatQuery}
                isTyping={!!activeConversation.participant.isTyping}
                participantName={activeConversation.participant.name}
                participantAvatar={activeConversation.participant.avatar}
                pinnedMessageId={activeConversation.pinnedMessageId}
                onAcceptOffer={handleAcceptOffer}
                onConfirmOrderRequest={handleConfirmOrderRequest}
                onCancelOrderRequest={handleCancelOrderRequest}
                onReplyMessage={(msg) => setReplyingMessage(msg)}
                onEditMessage={(msg) => setEditingMessage(msg)}
                onDeleteMessage={handleDeleteMessage}
                onTogglePinMessage={handleTogglePinMessage}
                onReactMessage={handleReactMessage}
                onForwardMessage={(msg) => setForwardModalData(msg)}
                onExecuteAction={handleExecuteAction}
              />
            </div>

            {/* 3. STICKY BOTTOM MESSAGE COMPOSER: Fixed at bottom of chat screen */}
            <div className="sticky bottom-0 z-20 shrink-0 w-full">
              <MessageComposer
                onSendMessage={handleSendMessage}
                onSendVoiceNote={handleSendVoiceNote}
                onSendAttachment={handleSendAttachment}
                onSendMilestoneOffer={handleSendMilestoneOffer}
                onOpenConfirmOrderModal={() => setIsConfirmOrderModalOpen(true)}
                isFreelancerView={true}
                replyingTo={replyingMessage}
                onCancelReply={() => setReplyingMessage(null)}
                editingMessage={editingMessage}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingMessage(null)}
                onTyping={handleTyping}
              />
            </div>

          </div>
        ) : (
          /* Empty State for Desktop when no conversation is selected (Requirement 2 & 8) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/70 select-none">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#1A1633] to-[#3D2FD1] text-white flex items-center justify-center mb-6 shadow-xl shadow-[#3D2FD1]/20 ring-4 ring-[#6E5BFF]/20">
              <MessageSquare className="w-12 h-12 text-[#A38BFF]" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold mb-3 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>End-to-End Escrow Protection</span>
            </div>

            <h3 className="text-xl font-black text-[#1A1633] font-display mb-2">
              Talentio Direct Messaging Suite
            </h3>
            
            <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
              Select an account from the left list to open the conversation, review milestones, and exchange project deliverables.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNewChatModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Conversation</span>
              </button>

              <button
                onClick={() => setActivePage('home')}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Back to Marketplace</span>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="mt-12 flex items-center gap-6 text-[11px] text-slate-400 font-medium border-t border-slate-200/80 pt-6">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#6E5BFF]" />
                <span>Direct user-to-user encryption</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Meta AI style co-pilot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#3D2FD1]" />
                <span>Multi-sig escrow secured</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Confirm Order Modal (Freelancer action) */}
      {activeConversation && (
        <ConfirmOrderModal
          isOpen={isConfirmOrderModalOpen}
          clientName={activeConversation.participant.name}
          clientAvatar={activeConversation.participant.avatar}
          onClose={() => setIsConfirmOrderModalOpen(false)}
          onSendOrderRequest={handleSendOrderRequest}
        />
      )}

      {/* New Conversation Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectContact={handleSelectNewContact}
      />

      {/* Forward Message Modal */}
      <ForwardMessageModal
        isOpen={!!forwardModalData}
        messageToForward={forwardModalData}
        conversations={conversations}
        onClose={() => setForwardModalData(null)}
        onForward={handleForward}
      />

    </div>
  );
};
