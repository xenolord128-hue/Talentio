import { Conversation, ChatMessage } from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-elena',
    participant: {
      id: 'freelancer-1',
      name: 'Elena Rostova',
      handle: '@elena_design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'Senior Product Designer & Systems Lead',
      countryFlag: '🇬🇧',
      verified: true,
      online: true,
      lastSeen: 'Online',
      isTyping: false,
      escrowTier: 3
    },
    lastMessage: {
      text: 'I uploaded the revised Figma tokens and wireframe pack for Milestone 1. Let me know what you think!',
      timestamp: '11:42 AM',
      senderId: 'freelancer-1',
      status: 'read',
      hasAttachment: true
    },
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    category: 'contract',
    contractId: 'ESC-8921-UX',
    pinnedMessageId: 'elena-msg-3'
  },
  {
    id: 'conv-marcus',
    participant: {
      id: 'freelancer-2',
      name: 'Marcus Chen',
      handle: '@marcus_ai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'Principal AI Engineer & Full-Stack Architect',
      countryFlag: '🇨🇦',
      verified: true,
      online: true,
      lastSeen: 'Active 5m ago',
      isTyping: false,
      escrowTier: 3
    },
    lastMessage: {
      text: 'Voice note (0:18)',
      timestamp: '10:15 AM',
      senderId: 'freelancer-2',
      status: 'read',
      isVoice: true
    },
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    category: 'direct'
  },
  {
    id: 'conv-julian',
    participant: {
      id: 'client-1',
      name: 'Julian Sterling',
      handle: '@julian_curve',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      role: 'client',
      title: 'VP of Product @ Curve Fintech',
      countryFlag: '🇺🇸',
      verified: true,
      online: false,
      lastSeen: 'Last seen today at 9:30 AM',
      isTyping: false,
      escrowTier: 3
    },
    lastMessage: {
      text: 'Custom Milestone Offer: NeoPay Mobile Banking UI Architecture ($850)',
      timestamp: 'Yesterday',
      senderId: 'client-1',
      status: 'delivered',
      isOffer: true
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    category: 'contract',
    contractId: 'ESC-4402-NEO'
  },
  {
    id: 'conv-amina',
    participant: {
      id: 'freelancer-3',
      name: 'Amina Al-Mansoor',
      handle: '@amina_dev',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'Senior React & Node.js Cloud Developer',
      countryFlag: '🇦🇪',
      verified: true,
      online: true,
      lastSeen: 'Online',
      isTyping: false,
      escrowTier: 2
    },
    lastMessage: {
      text: 'The Redis caching layer cut API response time down from 450ms to 32ms.',
      timestamp: 'Yesterday',
      senderId: 'freelancer-3',
      status: 'read'
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    category: 'direct'
  },
  {
    id: 'conv-sarah',
    participant: {
      id: 'client-2',
      name: 'Dr. Sarah Lin',
      handle: '@sarah_medtech',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      role: 'client',
      title: 'CTO @ MedTech Health Labs',
      countryFlag: '🇩🇪',
      verified: true,
      online: false,
      lastSeen: 'Last seen yesterday',
      isTyping: false,
      escrowTier: 3
    },
    lastMessage: {
      text: 'Could you review the HIPAA compliance specification before we start Sprint 2?',
      timestamp: 'Aug 25',
      senderId: 'client-2',
      status: 'read',
      hasAttachment: true
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    category: 'team'
  },
  {
    id: 'conv-nova',
    participant: {
      id: 'agency-1',
      name: 'Nova Digital Studios',
      handle: '@novastudios',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      role: 'agency',
      title: 'Full-Service Digital Product Agency (Tier 3)',
      countryFlag: '🇸🇬',
      verified: true,
      online: true,
      lastSeen: 'Online',
      isTyping: false,
      escrowTier: 3
    },
    lastMessage: {
      text: 'Our team is ready to kick off the 3D WebGL hero scene as soon as escrow is confirmed.',
      timestamp: 'Aug 24',
      senderId: 'agency-1',
      status: 'read'
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    category: 'contract'
  }
];

export const INITIAL_CONVERSATION_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-elena': [
    {
      id: 'elena-msg-1',
      conversationId: 'conv-elena',
      sender: 'other',
      senderId: 'freelancer-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'Hello! I reviewed your project brief for the SaaS Design System and responsive dashboard redesign. The scope and timeline align wonderfully with my expertise.',
      timestamp: '10:30 AM',
      isoDate: '2026-08-27T10:30:00.000Z',
      status: 'read'
    },
    {
      id: 'elena-msg-2',
      conversationId: 'conv-elena',
      sender: 'me',
      senderId: 'user-me',
      senderName: 'You',
      text: 'Hi Elena! Glad to connect. We need a modern, high-contrast dark and light mode UI kit with tokenized typography, plus 6 core dashboard views.',
      timestamp: '10:34 AM',
      isoDate: '2026-08-27T10:34:00.000Z',
      status: 'read'
    },
    {
      id: 'elena-msg-3',
      conversationId: 'conv-elena',
      sender: 'other',
      senderId: 'freelancer-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'I can deliver this in 2 structured milestones under Talentio Escrow protection. Milestone 1 will include Component Architecture & Tokens; Milestone 2 will cover the 6 high-fidelity screens with interactive prototypes.',
      timestamp: '10:38 AM',
      isoDate: '2026-08-27T10:38:00.000Z',
      status: 'read',
      isPinned: true,
      reactions: [
        { emoji: '🔥', count: 1, userIds: ['user-me'] },
        { emoji: '👍', count: 1, userIds: ['freelancer-1'] }
      ]
    },
    {
      id: 'elena-msg-4',
      conversationId: 'conv-elena',
      sender: 'other',
      senderId: 'freelancer-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'Official Milestone 1 Contract: SaaS Design System Architecture & Interactive Prototype ($850 USD)',
      timestamp: '10:40 AM',
      isoDate: '2026-08-27T10:40:00.000Z',
      status: 'read',
      isOffer: true,
      offerDetails: {
        id: 'offer-elena-101',
        title: 'SaaS Design System Architecture & Interactive Prototype',
        amount: 850,
        deliveryDays: 5,
        status: 'accepted'
      }
    },
    {
      id: 'elena-msg-5',
      conversationId: 'conv-elena',
      sender: 'me',
      senderId: 'user-me',
      senderName: 'You',
      text: 'Offer accepted and $850.00 USD securely deposited into Talentio Escrow Vault. Looking forward to the draft tokens!',
      timestamp: '10:45 AM',
      isoDate: '2026-08-27T10:45:00.000Z',
      status: 'read',
      replyTo: {
        id: 'elena-msg-4',
        senderName: 'Elena Rostova',
        text: 'Official Milestone 1 Contract: SaaS Design System Architecture & Interactive Prototype ($850 USD)'
      },
      reactions: [
        { emoji: '🚀', count: 2, userIds: ['user-me', 'freelancer-1'] }
      ]
    },
    {
      id: 'elena-msg-6',
      conversationId: 'conv-elena',
      sender: 'other',
      senderId: 'freelancer-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text: 'I uploaded the revised Figma tokens and wireframe pack for Milestone 1. Let me know what you think!',
      timestamp: '11:42 AM',
      isoDate: '2026-08-27T11:42:00.000Z',
      status: 'read',
      attachments: [
        {
          id: 'att-1',
          name: 'Talentio_Design_Tokens_v2.fig',
          size: '14.2 MB',
          type: 'document'
        },
        {
          id: 'att-2',
          name: 'Dashboard_Wireframes_Preview.png',
          size: '3.8 MB',
          type: 'image',
          previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
        }
      ]
    }
  ],

  'conv-marcus': [
    {
      id: 'marcus-msg-1',
      conversationId: 'conv-marcus',
      sender: 'me',
      senderId: 'user-me',
      senderName: 'You',
      text: 'Marcus, could we benchmark latency for our RAG vector pipeline using Gemini embeddings vs local embeddings?',
      timestamp: '10:05 AM',
      isoDate: '2026-08-27T10:05:00.000Z',
      status: 'read'
    },
    {
      id: 'marcus-msg-2',
      conversationId: 'conv-marcus',
      sender: 'other',
      senderId: 'freelancer-2',
      senderName: 'Marcus Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      text: 'Here is a quick voice summary explaining the throughput tradeoff between hybrid search and semantic reranking.',
      timestamp: '10:15 AM',
      isoDate: '2026-08-27T10:15:00.000Z',
      status: 'read',
      voiceNote: {
        durationSeconds: 18,
        waveform: [25, 40, 65, 80, 50, 70, 95, 45, 30, 85, 90, 75, 60, 40, 30, 70, 85, 40]
      }
    }
  ],

  'conv-julian': [
    {
      id: 'julian-msg-1',
      conversationId: 'conv-julian',
      sender: 'other',
      senderId: 'client-1',
      senderName: 'Julian Sterling',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      text: 'We were blown away by your recent fintech case study on Curve. We’d like to contract you for our NeoPay mobile banking app revamp.',
      timestamp: 'Yesterday',
      isoDate: '2026-08-26T15:20:00.000Z',
      status: 'read'
    },
    {
      id: 'julian-msg-2',
      conversationId: 'conv-julian',
      sender: 'other',
      senderId: 'client-1',
      senderName: 'Julian Sterling',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      text: 'Milestone 1 Custom Offer: NeoPay Mobile Banking UI Architecture & Prototype ($850 USD)',
      timestamp: 'Yesterday',
      isoDate: '2026-08-26T15:25:00.000Z',
      status: 'delivered',
      isOffer: true,
      offerDetails: {
        id: 'offer-julian-202',
        title: 'NeoPay Mobile Banking UI Architecture & Prototype',
        amount: 850,
        deliveryDays: 7,
        status: 'pending'
      }
    }
  ],

  'conv-amina': [
    {
      id: 'amina-msg-1',
      conversationId: 'conv-amina',
      sender: 'other',
      senderId: 'freelancer-3',
      senderName: 'Amina Al-Mansoor',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      text: 'The Redis caching layer cut API response time down from 450ms to 32ms.',
      timestamp: 'Yesterday',
      isoDate: '2026-08-26T11:10:00.000Z',
      status: 'read'
    }
  ],

  'conv-sarah': [
    {
      id: 'sarah-msg-1',
      conversationId: 'conv-sarah',
      sender: 'other',
      senderId: 'client-2',
      senderName: 'Dr. Sarah Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      text: 'Could you review the HIPAA compliance specification before we start Sprint 2?',
      timestamp: 'Aug 25',
      isoDate: '2026-08-25T09:12:00.000Z',
      status: 'read',
      attachments: [
        {
          id: 'att-sarah-1',
          name: 'HIPAA_Compliance_Spec_2026.pdf',
          size: '2.4 MB',
          type: 'document'
        }
      ]
    }
  ],

  'conv-nova': [
    {
      id: 'nova-msg-1',
      conversationId: 'conv-nova',
      sender: 'other',
      senderId: 'agency-1',
      senderName: 'Nova Digital Studios',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      text: 'Our team is ready to kick off the 3D WebGL hero scene as soon as escrow is confirmed.',
      timestamp: 'Aug 24',
      isoDate: '2026-08-24T14:30:00.000Z',
      status: 'read'
    }
  ]
};
