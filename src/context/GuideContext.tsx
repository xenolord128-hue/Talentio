import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageMode, 
  Freelancer, 
  TalentioService, 
  ProjectJob, 
  EscrowContract, 
  ChatMessage, 
  Guide, 
  GuideCategory, 
  UserProfile, 
  UserRole, 
  ProviderType, 
  UserProposal, 
  AccountStatus, 
  GigStatus, 
  AdminAction, 
  AdminNotification,
  AppNotification 
} from '../types';
import { 
  TALENTIO_FREELANCERS, 
  TALENTIO_SERVICES, 
  TALENTIO_OPEN_PROJECTS, 
  INITIAL_ESCROW_CONTRACT, 
  INITIAL_CHAT_MESSAGES 
} from '../data/talentioData';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  loginWithFirebase, 
  registerWithFirebase, 
  loginWithGooglePopup, 
  loginWithGithubPopup, 
  logoutFirebase,
  syncUserProfileDocument,
  formatUserProfile
} from '../lib/firebaseAuth';
import {
  subscribeToUsers,
  updateUserRecord,
  subscribeToServices,
  createGigDocument,
  updateGigDocument,
  deleteGigDocument,
  subscribeToJobs,
  createJobDocument,
  subscribeToProposals,
  createProposalDocument,
  subscribeToOrders,
  createEscrowOrderDocument,
  updateEscrowOrderDocument,
  subscribeToChatMessages,
  sendChatMessageDocument,
  logAdminAction,
  subscribeToAdminLogs,
  createNoticeDocument,
  subscribeToNotices,
  markNoticeAsRead
} from '../lib/firestore';
import { PlatformNotice, NoticeCategory } from '../types';
import { realtimeService } from '../lib/realtimeService';

export type TalentioPage = 
  | 'explore' 
  | 'home'
  | 'marketplace'
  | 'services' 
  | 'catalog'
  | 'gig-details'
  | 'categories'
  | 'search'
  | 'login'
  | 'register'
  | 'profile'
  | 'freelancers' 
  | 'talent'
  | 'post-job' 
  | 'workstation' 
  | 'escrow'
  | 'orders'
  | 'chat' 
  | 'messages'
  | 'dashboard' 
  | 'favorites'
  | 'saved'
  | 'settings'
  | 'notifications'
  | 'notice'
  | 'notices'
  | 'help'
  | 'support'
  | 'earnings'
  | 'payouts'
  | 'playbook'
  | 'guides'
  | 'security'
  | 'roadmap'
  | 'leaderboard'
  | 'admin';

interface ToastState {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export const DEMO_CLIENT_USER: UserProfile = {
  id: 'user-client-1',
  name: 'Alexander Vance',
  handle: '@alexander_v',
  email: 'alexander@enterprise.com',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  authMethod: 'email',
  userType: 'client',
  accountStatus: 'approved',
  isApprovedSeller: false,
  role: 'user',
  companyName: 'Vance Fintech Solutions',
  industry: 'Fintech & SaaS',
  companySize: '11-50 employees',
  location: 'San Francisco, USA',
  countryFlag: '🇺🇸',
  countryCode: 'US',
  skills: ['Product Strategy', 'Fintech', 'Escrow Management'],
  verifiedBadge: true,
  escrowTier: 1,
  onboardingCompleted: true,
  onboardingStep: 6,
  profileCompletionScore: 100,
  preferredCategories: ['web-dev', 'ui-ux', 'ai-services'],
  typicalBudgetRange: '$2,500 - $10,000',
  balanceAvailable: 8450,
  balanceInEscrow: 3800
};

export const DEMO_FREELANCER_USER: UserProfile = {
  id: 'user-freelancer-1',
  name: 'Sofia Chen',
  handle: '@sofia_design',
  email: 'sofia.chen@talentio.pro',
  phone: '+880 1711 234567',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  authMethod: 'github',
  userType: 'freelancer',
  providerType: 'individual',
  accountStatus: 'approved',
  isApprovedSeller: true,
  role: 'user',
  title: 'Lead UI/UX & Design Systems Architect',
  category: 'ui-ux',
  subcategory: 'Design Systems & SaaS UI',
  skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'React', 'User Research'],
  experienceLevel: 'expert',
  hourlyRate: 85,
  startingPrice: 350,
  location: 'Toronto, Canada',
  countryFlag: '🇨🇦',
  countryCode: 'CA',
  bio: 'Product Designer with 7+ years scaling complex enterprise applications, design tokens, and high-converting checkout funnels.',
  languages: ['English (Fluent)', 'Mandarin (Native)'],
  availability: 'available',
  verifiedBadge: true,
  escrowTier: 2,
  onboardingCompleted: true,
  onboardingStep: 6,
  profileCompletionScore: 100,
  balanceAvailable: 4250,
  balanceInEscrow: 1500
};

export const DEMO_PENDING_SELLER_USER: UserProfile = {
  id: 'user-pending-1',
  name: 'Rahimul Karim',
  handle: '@rahimul_karim',
  email: 'rahimul@devcraft.bd',
  phone: '+880 1812 345678',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  authMethod: 'email',
  userType: 'freelancer',
  providerType: 'individual',
  accountStatus: 'pending',
  isApprovedSeller: false,
  role: 'user',
  title: 'Full Stack Node & Python Engineer',
  category: 'web-dev',
  skills: ['Node.js', 'Python', 'PostgreSQL', 'Express', 'Docker'],
  experienceLevel: 'intermediate',
  hourlyRate: 45,
  startingPrice: 200,
  location: 'Dhaka, Bangladesh',
  countryFlag: '🇧🇩',
  countryCode: 'BD',
  bio: 'Backend & API developer building scalable cloud microservices.',
  languages: ['Bengali (Native)', 'English (Professional)'],
  availability: 'available',
  verifiedBadge: false,
  escrowTier: 1,
  onboardingCompleted: true,
  onboardingStep: 6,
  profileCompletionScore: 100,
  balanceAvailable: 0,
  balanceInEscrow: 0
};

export const DEMO_AGENCY_USER: UserProfile = {
  id: 'user-agency-1',
  name: 'Nova Digital Studios',
  handle: '@nova_agency',
  email: 'hello@novastudios.agency',
  phone: '+44 20 7946 0912',
  avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&auto=format&fit=crop&q=80',
  authMethod: 'email',
  userType: 'agency',
  providerType: 'agency',
  accountStatus: 'approved',
  isApprovedSeller: true,
  role: 'user',
  title: 'Full-Stack SaaS & AI Agent Development Studio',
  companyName: 'Nova Digital Studios Ltd',
  industry: 'Web & AI Engineering',
  category: 'web-dev',
  subcategory: 'Full Stack & AI Agents',
  teamSize: '14 Specialists',
  skills: ['Next.js', 'React', 'Node.js', 'Python', 'AI Agents', 'AWS', 'Tailwind CSS'],
  experienceLevel: 'lead',
  hourlyRate: 140,
  startingPrice: 1200,
  location: 'London, UK',
  countryFlag: '🇬🇧',
  countryCode: 'GB',
  bio: 'Award-winning digital engineering studio delivering enterprise React/Next.js platforms and RAG AI integrations.',
  languages: ['English', 'German', 'Spanish'],
  availability: 'available',
  verifiedBadge: true,
  escrowTier: 3,
  onboardingCompleted: true,
  onboardingStep: 6,
  profileCompletionScore: 100,
  balanceAvailable: 16800,
  balanceInEscrow: 9500
};

export const DEMO_ADMIN_USER: UserProfile = {
  id: 'user-admin-1',
  name: 'Talentio Super Admin',
  handle: '@talentio_admin',
  email: 'admin@talentio.com',
  phone: '+1 (800) 555-0199',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  authMethod: 'email',
  userType: 'client',
  role: 'admin',
  accountStatus: 'approved',
  isApprovedSeller: true,
  skills: ['Platform Governance', 'Escrow Arbitration', 'Security Compliance'],
  verifiedBadge: true,
  escrowTier: 3,
  onboardingCompleted: true,
  onboardingStep: 6,
  profileCompletionScore: 100,
  location: 'London, UK',
  countryFlag: '🇬🇧',
  countryCode: 'GB',
  balanceAvailable: 50000,
  balanceInEscrow: 25000
};

interface GuideContextType {
  // Navigation & View
  activePage: TalentioPage;
  setActivePage: (page: TalentioPage) => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  currency: string;
  setCurrency: (c: string) => void;
  
  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Authentication & Guest Protection
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  authPromptReason: string | null;
  setAuthPromptReason: (reason: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  requireAuth: (actionReason?: string, onAuthorized?: () => void) => boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  registerAccount: (method: 'email' | 'phone' | 'github', identifier: string, name?: string, password?: string) => Promise<void>;
  registerFullAccount: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoAccount: (role: 'guest' | 'client' | 'freelancer' | 'agency' | 'admin') => void;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Admin Governance & User Management
  allUsers: UserProfile[];
  adminActions: AdminAction[];
  approveUserAccount: (userId: string) => Promise<void>;
  rejectUserAccount: (userId: string, reason: string) => Promise<void>;
  suspendUserAccount: (userId: string, reason?: string) => Promise<void>;
  banUserAccount: (userId: string, reason?: string) => Promise<void>;
  restoreUserAccount: (userId: string) => Promise<void>;
  approveServiceGig: (gigId: string) => Promise<void>;
  rejectServiceGig: (gigId: string, reason: string) => Promise<void>;
  toggleFeatureServiceGig: (gigId: string) => Promise<void>;
  removeServiceGig: (gigId: string) => Promise<void>;

  // Modals & Drawers
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  isHireModalOpen: boolean;
  setIsHireModalOpen: (open: boolean) => void;
  isServiceModalOpen: boolean;
  setIsServiceModalOpen: (open: boolean) => void;
  isProposalModalOpen: boolean;
  setIsProposalModalOpen: (open: boolean) => void;
  isCreateGigModalOpen: boolean;
  setIsCreateGigModalOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  closeAllModals: () => void;
  isAnyModalOpen: boolean;
  proposalJobTarget: ProjectJob | null;
  openProposalModal: (job: ProjectJob) => void;

  // Selected Entities
  selectedFreelancer: Freelancer | null;
  setSelectedFreelancer: (f: Freelancer | null) => void;
  selectedService: TalentioService | null;
  setSelectedService: (s: TalentioService | null) => void;

  // Marketplace Data
  freelancers: Freelancer[];
  services: TalentioService[];
  postedJobs: ProjectJob[];
  addPostedJob: (job: Omit<ProjectJob, 'id' | 'proposalsCount' | 'postedAgo'>) => Promise<void>;
  proposals: UserProposal[];
  submitProposal: (proposalData: Omit<UserProposal, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  createServiceGig: (newService: Omit<TalentioService, 'id' | 'rating' | 'reviewsCount'>) => Promise<void>;
  savedFreelancerIds: string[];
  toggleSaveFreelancer: (id: string) => void;
  savedGigIds: string[];
  toggleSaveGig: (id: string) => void;
  isGigSaved: (id: string) => boolean;
  openGigDetails: (service: TalentioService) => void;
  openCategoryMarketplace: (categoryId: string) => void;

  // Notifications Feed
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Real-time Notices Section (Menu -> Notice)
  notices: PlatformNotice[];
  unreadNoticesCount: number;
  addNotice: (notice: Omit<PlatformNotice, 'id' | 'createdAt' | 'timestamp' | 'read'>) => Promise<void>;
  markNoticeRead: (id: string) => Promise<void>;
  markAllNoticesRead: () => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  // Active Workstation & Escrow Contract
  contract: EscrowContract;
  startServiceOrderEscrow: (contractData: EscrowContract) => Promise<void>;
  submitDeliverable: (fileName: string, fileSize: string) => Promise<void>;
  releaseMilestoneEscrow: (milestoneId: string) => Promise<void>;
  requestContractRevision: () => Promise<void>;
  resetContract: () => void;

  // Real-time Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, isOffer?: boolean, offerAmount?: number) => Promise<void>;
  acceptOffer: (msgId: string) => void;

  // Toast Notifications
  toasts: ToastState[];
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Legacy Guides compatibility
  activeGuideId: string;
  setActiveGuideId: (id: string) => void;
  completedSteps: Record<string, boolean>;
  toggleStepCompleted: (stepId: string) => void;
  bookmarkedGuideIds: string[];
  toggleBookmarkGuide: (guideId: string) => void;
  activeDeviceFilter: 'all' | 'mobile' | 'desktop';
  setActiveDeviceFilter: (dev: 'all' | 'mobile' | 'desktop') => void;
  resetProgress: () => void;
  openGuide: (guideId: string) => void;
  toastMessage: (msg: string) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<TalentioPage>('explore');
  const [language, setLanguageState] = useState<LanguageMode>('en');
  const [currency, setCurrencyState] = useState<string>(() => {
    return localStorage.getItem('talentio_currency') || 'USD';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem('talentio_currency', c);
  };

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('talentio_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_CLIENT_USER;
      }
    }
    return DEMO_CLIENT_USER;
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Firestore Realtime Collections
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    DEMO_CLIENT_USER,
    DEMO_FREELANCER_USER,
    DEMO_PENDING_SELLER_USER,
    DEMO_AGENCY_USER,
    DEMO_ADMIN_USER
  ]);

  const [adminActions, setAdminActions] = useState<AdminAction[]>([
    {
      id: 'act-1',
      adminId: 'user-admin-1',
      adminName: 'Talentio Super Admin',
      targetId: 'user-freelancer-1',
      targetName: 'Sofia Chen',
      targetType: 'user',
      action: 'approve',
      reason: 'Portfolio and identity credentials verified',
      timestamp: 'Today at 09:30 AM'
    },
    {
      id: 'act-2',
      adminId: 'user-admin-1',
      adminName: 'Talentio Super Admin',
      targetId: 'user-agency-1',
      targetName: 'Nova Digital Studios',
      targetType: 'user',
      action: 'approve',
      reason: 'Agency corporate verification completed',
      timestamp: 'Yesterday at 04:15 PM'
    }
  ]);

  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isCreateGigModalOpen, setIsCreateGigModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [proposalJobTarget, setProposalJobTarget] = useState<ProjectJob | null>(null);

  const isAnyModalOpen = isSearchModalOpen || 
    isPostJobModalOpen || 
    isHireModalOpen || 
    isServiceModalOpen || 
    isAuthModalOpen || 
    isOnboardingModalOpen || 
    isProposalModalOpen || 
    isCreateGigModalOpen || 
    isShortcutsModalOpen;

  const closeAllModals = () => {
    setIsSearchModalOpen(false);
    setIsPostJobModalOpen(false);
    setIsHireModalOpen(false);
    setIsServiceModalOpen(false);
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(false);
    setIsProposalModalOpen(false);
    setIsCreateGigModalOpen(false);
    setIsShortcutsModalOpen(false);
  };

  // Selected Entities
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(TALENTIO_FREELANCERS[0]);
  const [selectedService, setSelectedService] = useState<TalentioService | null>(TALENTIO_SERVICES[0]);

  // Data Collections
  const [freelancers] = useState<Freelancer[]>(TALENTIO_FREELANCERS);
  const [services, setServices] = useState<TalentioService[]>(TALENTIO_SERVICES);
  const [postedJobs, setPostedJobs] = useState<ProjectJob[]>(TALENTIO_OPEN_PROJECTS);
  const [proposals, setProposals] = useState<UserProposal[]>([
    {
      id: 'prop-demo-1',
      jobId: 'job-1',
      jobTitle: 'Senior AI Engineer for LLM Agent & Vector RAG Pipeline',
      freelancerId: 'user-freelancer-1',
      freelancerName: 'Sofia Chen',
      freelancerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bidAmount: 4800,
      duration: '14 days',
      coverLetter: 'I have deep expertise in building production RAG pipelines with Gemini and LangChain. I can deliver this with full test coverage and automated deployment.',
      status: 'pending',
      submittedAt: 'Yesterday'
    }
  ]);

  const [savedFreelancerIds, setSavedFreelancerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talentio_saved_freelancers');
    return saved ? JSON.parse(saved) : ['freelancer-1', 'freelancer-2'];
  });

  const [savedGigIds, setSavedGigIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talentio_saved_gigs');
    return saved ? JSON.parse(saved) : ['service-1', 'service-2'];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Escrow Milestone Funded',
      description: 'Milestone 1 ($850) for SaaS UI/UX has been funded into escrow protection.',
      type: 'escrow',
      timestamp: '10 mins ago',
      read: false,
      actionUrl: 'orders'
    },
    {
      id: 'notif-2',
      title: 'New Message from Elena Rostova',
      description: 'Elena sent updated Figma design system tokens for your review.',
      type: 'message',
      timestamp: '1 hour ago',
      read: false,
      actionUrl: 'chat'
    },
    {
      id: 'notif-3',
      title: 'Account Verified',
      description: 'Your identity and escrow credentials have been verified by Talentio platform admin.',
      type: 'system',
      timestamp: 'Yesterday',
      read: true,
      actionUrl: 'profile'
    }
  ]);

  // Dedicated Platform Notices (Menu -> Notice)
  const [notices, setNotices] = useState<PlatformNotice[]>([
    {
      id: 'notice-welcome',
      title: 'Welcome to Talentio Escrow Marketplace',
      description: 'Explore vetted talent, order milestone gigs, and manage transactions with 100% escrow buyer protection and live multi-currency conversions.',
      category: 'system',
      priority: 'high',
      iconType: 'sparkles',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      timestamp: '2 hours ago',
      read: false,
      actionUrl: 'explore'
    },
    {
      id: 'notice-approval-status',
      title: 'Seller Account Verification Status',
      description: 'Your freelancer profile and KYC documents are under review by our compliance team. Service gig creation is unlocked immediately upon approval.',
      category: 'approval',
      priority: 'high',
      iconType: 'shield',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      timestamp: '6 hours ago',
      read: false,
      actionUrl: 'dashboard',
      meta: {
        accountStatus: 'approved'
      }
    },
    {
      id: 'notice-rank-update',
      title: 'Marketplace Rank: #12 in Top Rated Specialists',
      description: 'You have advanced 3 positions on the global talent leaderboard based on verified 5.0-star customer ratings and milestone escrow completions.',
      category: 'rank',
      priority: 'normal',
      iconType: 'award',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      timestamp: '1 day ago',
      read: false,
      actionUrl: 'leaderboard',
      meta: {
        rankNumber: 12
      }
    },
    {
      id: 'notice-escrow-announcement',
      title: 'Multi-Currency Engine & Escrow 2.0 Live',
      description: 'Instant currency conversion with 150+ live global currencies and zero-fee milestone funding is now active on all project contracts.',
      category: 'announcement',
      priority: 'normal',
      iconType: 'bell',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      timestamp: '2 days ago',
      read: true,
      actionUrl: 'workstation'
    }
  ]);

  const unreadNoticesCount = notices.filter(n => !n.read && (!n.targetUserId || n.targetUserId === 'all' || n.targetUserId === user?.id)).length;

  // Contract & Workstation
  const [contract, setContract] = useState<EscrowContract>(() => {
    const saved = localStorage.getItem('talentio_contract');
    return saved ? JSON.parse(saved) : INITIAL_ESCROW_CONTRACT;
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('talentio_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Legacy Guide State
  const [activeGuideId, setActiveGuideId] = useState<string>('fiverr-basics');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('talentio_steps');
    return saved ? JSON.parse(saved) : {};
  });
  const [bookmarkedGuideIds, setBookmarkedGuideIds] = useState<string[]>([]);
  const [activeDeviceFilter, setActiveDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const syncedProfile = await syncUserProfileDocument(fUser);
          setUser(syncedProfile);
          localStorage.setItem('talentio_user_profile', JSON.stringify(syncedProfile));
        } catch (err) {
          console.warn('Firebase user sync note:', err);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Realtime Subscriptions
  useEffect(() => {
    // Automated 15-day voice message cleanup routine
    try {
      const messagesMapRaw = localStorage.getItem('talentio_chat_messages_map');
      if (messagesMapRaw) {
        const parsedMap = JSON.parse(messagesMapRaw);
        let hasChanges = false;
        const now = Date.now();
        const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

        Object.keys(parsedMap).forEach((convId) => {
          parsedMap[convId] = parsedMap[convId].map((msg: any) => {
            if (msg.voiceNote) {
              const expiresTime = msg.voiceNote.expiresAt ? new Date(msg.voiceNote.expiresAt).getTime() : 0;
              const createdTime = msg.voiceNote.createdAt ? new Date(msg.voiceNote.createdAt).getTime() : (msg.isoDate ? new Date(msg.isoDate).getTime() : 0);
              
              const isExpired = (expiresTime > 0 && expiresTime <= now) || (createdTime > 0 && createdTime + fifteenDaysMs <= now);
              if (isExpired && !msg.voiceNote.isExpired) {
                hasChanges = true;
                return {
                  ...msg,
                  voiceNote: {
                    ...msg.voiceNote,
                    isExpired: true,
                    audioUrl: undefined // Purge binary/blob reference to release storage
                  }
                };
              }
            }
            return msg;
          });
        });

        if (hasChanges) {
          localStorage.setItem('talentio_chat_messages_map', JSON.stringify(parsedMap));
        }
      }
    } catch (cleanErr) {
      console.warn('Voice message 15-day purge routine notice:', cleanErr);
    }
    const unsubUsers = subscribeToUsers((firestoreUsers) => {
      if (firestoreUsers && firestoreUsers.length > 0) {
        setAllUsers(firestoreUsers);
      }
    });

    const unsubGigs = subscribeToServices((firestoreGigs) => {
      if (firestoreGigs && firestoreGigs.length > 0) {
        setServices(firestoreGigs);
      }
    });

    const unsubJobs = subscribeToJobs((firestoreJobs) => {
      if (firestoreJobs && firestoreJobs.length > 0) {
        setPostedJobs(firestoreJobs);
      }
    });

    const unsubProposals = subscribeToProposals((firestoreProposals) => {
      if (firestoreProposals && firestoreProposals.length > 0) {
        setProposals(firestoreProposals);
      }
    });

    const unsubOrders = subscribeToOrders((firestoreOrders) => {
      if (firestoreOrders && firestoreOrders.length > 0) {
        setContract(firestoreOrders[0]);
      }
    });

    const unsubAdminLogs = subscribeToAdminLogs((logs) => {
      if (logs && logs.length > 0) {
        setAdminActions(logs);
      }
    });

    const unsubNotices = subscribeToNotices((firestoreNotices) => {
      if (firestoreNotices && firestoreNotices.length > 0) {
        setNotices(firestoreNotices);
      }
    });

    return () => {
      unsubUsers();
      unsubGigs();
      unsubJobs();
      unsubProposals();
      unsubOrders();
      unsubAdminLogs();
      unsubNotices();
    };
  }, []);

  // Local storage persistence for fallback UI prefs
  useEffect(() => {
    if (user) {
      localStorage.setItem('talentio_user_profile', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('talentio_saved_freelancers', JSON.stringify(savedFreelancerIds));
  }, [savedFreelancerIds]);

  useEffect(() => {
    localStorage.setItem('talentio_contract', JSON.stringify(contract));
  }, [contract]);

  useEffect(() => {
    localStorage.setItem('talentio_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('talentio_steps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const setActivePage = (page: TalentioPage) => {
    const protectedPages = ['workstation', 'escrow', 'orders', 'chat', 'messages', 'dashboard', 'earnings', 'payouts', 'post-job'];
    if (protectedPages.includes(page) && !user) {
      setAuthPromptReason('Please sign in to your Talentio account to view this page.');
      setIsAuthModalOpen(true);
      return;
    }
    if (protectedPages.includes(page) && user && !user.onboardingCompleted) {
      setIsOnboardingModalOpen(true);
      return;
    }
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Protection Interceptor
  const requireAuth = (actionReason?: string, onAuthorized?: () => void): boolean => {
    if (!user) {
      setAuthPromptReason(actionReason || 'Please sign in to your Talentio account to continue.');
      setIsAuthModalOpen(true);
      return false;
    }
    if (!user.onboardingCompleted) {
      showToast('Please complete your profile onboarding first.', 'warning');
      setIsOnboardingModalOpen(true);
      return false;
    }
    onAuthorized?.();
    return true;
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    if (!email || !pass) {
      showToast('Please enter both Email and Password.', 'warning');
      return false;
    }
    try {
      const loggedUser = await loginWithFirebase(email, pass);
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return true;
    } catch (err: any) {
      console.error('Firebase login error:', err);
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return false;
    }
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    if (!phone || otp.length < 4) {
      showToast('Please enter phone number and valid OTP.', 'warning');
      return false;
    }
    const newUser: UserProfile = {
      id: `user-phone-${Date.now()}`,
      name: 'Talentio Member',
      handle: `@user_${phone.slice(-4)}`,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      authMethod: 'phone',
      userType: null,
      skills: [],
      verifiedBadge: true,
      escrowTier: 1,
      accountStatus: 'pending',
      onboardingCompleted: false,
      onboardingStep: 1,
      profileCompletionScore: 20
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
    showToast(`Phone verification completed! Complete profile setup.`, 'success');
    return true;
  };

  const loginWithGoogle = async () => {
    try {
      const profile = await loginWithGooglePopup();
      setUser(profile);
      setIsAuthModalOpen(false);
      showToast(`Google authentication successful! Welcome ${profile.name}.`, 'success');
    } catch (err: any) {
      console.warn('Google popup error:', err);
      showToast(err.message || 'Google sign in failed.', 'error');
    }
  };

  const loginWithGithub = async () => {
    try {
      const profile = await loginWithGithubPopup();
      setUser(profile);
      setIsAuthModalOpen(false);
      showToast(`GitHub OAuth successful! Welcome ${profile.name}.`, 'success');
    } catch (err: any) {
      console.warn('GitHub popup error:', err);
      showToast(err.message || 'GitHub sign in failed.', 'error');
    }
  };

  const registerAccount = async (method: 'email' | 'phone' | 'github', identifier: string, name?: string, password?: string) => {
    if (method === 'email' && password) {
      try {
        const newUser = await registerWithFirebase(identifier, password, {
          name: name || 'Talentio Member',
          authMethod: 'email',
          userType: 'freelancer',
          accountStatus: 'pending',
          isApprovedSeller: false
        });
        setUser(newUser);
        setIsAuthModalOpen(false);
        setIsOnboardingModalOpen(true);
        showToast('Firebase account created! Please complete onboarding.', 'success');
        return;
      } catch (err: any) {
        console.error('Firebase register error:', err);
        showToast(err.message || 'Registration failed.', 'error');
        return;
      }
    }

    const localUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || 'New Member',
      handle: `@${(name || 'member').toLowerCase().replace(/\s+/g, '_')}`,
      email: method === 'email' ? identifier : undefined,
      phone: method === 'phone' ? identifier : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authMethod: method,
      userType: null,
      role: 'user',
      accountStatus: 'pending',
      isApprovedSeller: false,
      skills: [],
      verifiedBadge: false,
      escrowTier: 1,
      onboardingCompleted: false,
      onboardingStep: 1,
      profileCompletionScore: 15
    };
    setUser(localUser);
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
    showToast('Account created! Let’s complete your setup.', 'success');
  };

  const registerFullAccount = async (data: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: user?.id || `user-${Date.now()}`,
      name: data.name || 'New Member',
      handle: `@${(data.name || 'member').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authMethod: data.authMethod || 'email',
      userType: data.userType || 'client',
      role: 'user',
      accountStatus: data.userType === 'client' ? 'approved' : 'pending',
      isApprovedSeller: false,
      countryFlag: data.countryFlag || '🌐',
      countryCode: data.countryCode || 'US',
      location: data.location || 'International',
      skills: data.skills || [],
      verifiedBadge: false,
      escrowTier: 1,
      onboardingCompleted: true,
      onboardingStep: 6,
      profileCompletionScore: 100,
      balanceAvailable: data.userType === 'client' ? 2500 : 0,
      balanceInEscrow: 0,
      ...data
    };
    
    if (firebaseUser) {
      await updateUserRecord(firebaseUser.uid, newUser);
    }
    setUser(newUser);
    showToast(`Welcome to Talentio, ${newUser.name}! Your account is active.`, 'success');
    setActivePageState('explore');
  };

  const logout = async () => {
    await logoutFirebase();
    setUser(null);
    localStorage.removeItem('talentio_user_profile');
    showToast('Logged out of Talentio.', 'info');
    setActivePageState('explore');
  };

  const switchDemoAccount = (role: 'guest' | 'client' | 'freelancer' | 'agency' | 'admin') => {
    if (role === 'guest') {
      setUser(null);
      showToast('Switched to Guest Browsing Mode.', 'info');
    } else if (role === 'client') {
      setUser(DEMO_CLIENT_USER);
      showToast('Switched to Alexander Vance (Verified Client Account).', 'success');
    } else if (role === 'freelancer') {
      setUser(DEMO_FREELANCER_USER);
      showToast('Switched to Sofia Chen (Senior UI/UX Freelancer Account).', 'success');
    } else if (role === 'agency') {
      setUser(DEMO_AGENCY_USER);
      showToast('Switched to Nova Digital Studios (Agency Account).', 'success');
    } else if (role === 'admin') {
      setUser(DEMO_ADMIN_USER);
      showToast('Switched to Talentio Super Admin (Full Governance Privileges).', 'success');
    }
    setIsAuthModalOpen(false);
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    const isSeller = (data.userType || user?.userType) !== 'client';
    const updated: UserProfile = {
      ...(user || DEMO_CLIENT_USER),
      ...data,
      role: user?.role || 'user',
      accountStatus: isSeller ? 'pending' : 'approved',
      isApprovedSeller: isSeller ? false : true,
      onboardingCompleted: true,
      onboardingStep: 6,
      profileCompletionScore: 100,
      balanceAvailable: user?.balanceAvailable ?? (data.userType === 'client' ? 5000 : 0),
      balanceInEscrow: user?.balanceInEscrow ?? 0
    };

    if (firebaseUser) {
      await updateUserRecord(firebaseUser.uid, updated);
    }
    setUser(updated);
    setIsOnboardingModalOpen(false);
    showToast('Profile setup complete! Welcome to the Talentio platform.', 'success');
    setActivePageState('explore');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    if (firebaseUser) {
      await updateUserRecord(firebaseUser.uid, updated);
    }
    setUser(updated);
    showToast('Profile updated successfully!', 'success');
  };

  // Admin Governance Methods
  const approveUserAccount = async (userId: string) => {
    await updateUserRecord(userId, { accountStatus: 'approved', isApprovedSeller: true, verifiedBadge: true });
    
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: 'approved', isApprovedSeller: true, verifiedBadge: true } : null);
    }
    const target = allUsers.find(u => u.id === userId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: userId,
      targetName: target?.name || 'User',
      targetType: 'user',
      action: 'approve',
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);

    // Broadcast dynamic Notice for the user
    await addNotice({
      targetUserId: userId,
      title: '🎉 Freelancer Account Approved',
      description: `Congratulations! Your freelancer seller profile has been verified and approved by the Talentio Admin. You can now publish service gigs.`,
      category: 'approval',
      priority: 'high',
      iconType: 'check',
      actionUrl: 'services',
      meta: {
        accountStatus: 'approved'
      }
    });

    showToast(`User account approved & verified successfully.`, 'success');
  };

  const rejectUserAccount = async (userId: string, reason: string) => {
    await updateUserRecord(userId, { accountStatus: 'rejected', isApprovedSeller: false, rejectionReason: reason });
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: 'rejected', isApprovedSeller: false, rejectionReason: reason } : null);
    }
    const target = allUsers.find(u => u.id === userId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: userId,
      targetName: target?.name || 'User',
      targetType: 'user',
      action: 'reject',
      reason,
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);
    showToast(`User application rejected.`, 'info');
  };

  const suspendUserAccount = async (userId: string, reason?: string) => {
    await updateUserRecord(userId, { accountStatus: 'suspended', isApprovedSeller: false });
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: 'suspended', isApprovedSeller: false } : null);
    }
    const target = allUsers.find(u => u.id === userId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: userId,
      targetName: target?.name || 'User',
      targetType: 'user',
      action: 'suspend',
      reason,
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);
    showToast(`User account suspended.`, 'warning');
  };

  const banUserAccount = async (userId: string, reason?: string) => {
    await updateUserRecord(userId, { accountStatus: 'banned', isApprovedSeller: false });
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: 'banned', isApprovedSeller: false } : null);
    }
    const target = allUsers.find(u => u.id === userId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: userId,
      targetName: target?.name || 'User',
      targetType: 'user',
      action: 'ban',
      reason,
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);
    showToast(`User permanently banned from Talentio.`, 'warning');
  };

  const restoreUserAccount = async (userId: string) => {
    await updateUserRecord(userId, { accountStatus: 'approved', isApprovedSeller: true });
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, accountStatus: 'approved', isApprovedSeller: true } : null);
    }
    showToast(`User account restored to active status.`, 'success');
  };

  const approveServiceGig = async (gigId: string) => {
    await updateGigDocument(gigId, { status: 'approved' });
    const gig = services.find(s => s.id === gigId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: gigId,
      targetName: gig?.title || 'Service Gig',
      targetType: 'gig',
      action: 'approve',
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);
    showToast(`Service Gig approved and catalog visibility enabled.`, 'success');
  };

  const rejectServiceGig = async (gigId: string, reason: string) => {
    await updateGigDocument(gigId, { status: 'rejected', rejectionReason: reason });
    const gig = services.find(s => s.id === gigId);
    const newLog: AdminAction = {
      id: `act-${Date.now()}`,
      adminId: user?.id || 'admin',
      adminName: user?.name || 'Administrator',
      targetId: gigId,
      targetName: gig?.title || 'Service Gig',
      targetType: 'gig',
      action: 'reject',
      reason,
      timestamp: 'Just now'
    };
    await logAdminAction(newLog);
    showToast(`Service Gig rejected.`, 'info');
  };

  const toggleFeatureServiceGig = async (gigId: string) => {
    const gig = services.find(s => s.id === gigId);
    if (!gig) return;
    const isFeatured = !gig.isFeatured;
    await updateGigDocument(gigId, { isFeatured });
    showToast(`Gig feature status updated.`, 'success');
  };

  const removeServiceGig = async (gigId: string) => {
    await deleteGigDocument(gigId);
    showToast(`Service gig removed from catalog.`, 'info');
  };

  const toggleSaveFreelancer = (id: string) => {
    if (!requireAuth('Please sign in to save freelancers.')) return;

    setSavedFreelancerIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('talentio_saved_freelancers', JSON.stringify(next));
      if (exists) {
        showToast('Removed from saved talent collection', 'info');
      } else {
        showToast('Saved talent to your shortlist!', 'success');
      }
      return next;
    });
  };

  const toggleSaveGig = (id: string) => {
    if (!requireAuth('Please sign in to bookmark gigs.')) return;

    setSavedGigIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('talentio_saved_gigs', JSON.stringify(next));
      if (exists) {
        showToast('Removed gig from favorites', 'info');
      } else {
        showToast('Added gig to your favorites!', 'success');
      }
      return next;
    });
  };

  const isGigSaved = (id: string) => savedGigIds.includes(id);

  const openGigDetails = (service: TalentioService) => {
    setSelectedService(service);
    setActivePageState('gig-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategoryMarketplace = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActivePageState('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const addNotice = async (noticeData: Omit<PlatformNotice, 'id' | 'createdAt' | 'timestamp' | 'read'>) => {
    const newNotice: PlatformNotice = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      read: false
    };
    await createNoticeDocument(newNotice);
    setNotices(prev => [newNotice, ...prev]);
    showToast('Notice broadcasted successfully', 'success');
  };

  const markNoticeRead = async (id: string) => {
    await markNoticeAsRead(id);
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNoticesRead = async () => {
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notices marked as read', 'info');
  };

  const deleteNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    showToast('Notice removed', 'info');
  };

  const addPostedJob = async (jobData: Omit<ProjectJob, 'id' | 'proposalsCount' | 'postedAgo'>) => {
    if (!requireAuth('Please sign in to post a project.')) return;

    const newJob: ProjectJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      proposalsCount: 0,
      postedAgo: 'Just now'
    };
    await createJobDocument(newJob);
    setPostedJobs(prev => [newJob, ...prev]);
    setIsPostJobModalOpen(false);
    showToast('Project job posted successfully to Firestore! Talent matching active.', 'success');
  };

  const openProposalModal = (job: ProjectJob) => {
    if (!requireAuth('Please sign in to submit proposals.')) return;
    
    if (user?.accountStatus && user.accountStatus !== 'approved') {
      showToast('Your seller profile is pending approval. You will be able to submit bids once approved.', 'warning');
      return;
    }
    
    setProposalJobTarget(job);
    setIsProposalModalOpen(true);
  };

  const submitProposal = async (proposalData: Omit<UserProposal, 'id' | 'status' | 'submittedAt'>) => {
    if (!requireAuth('Please sign in to submit a proposal.')) return;

    if (user?.accountStatus && user.accountStatus !== 'approved') {
      showToast('Your seller profile is pending approval. You cannot submit proposals yet.', 'warning');
      return;
    }

    const newProposal: UserProposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      status: 'pending',
      submittedAt: 'Just now'
    };
    await createProposalDocument(newProposal);
    setProposals(prev => [newProposal, ...prev]);
    setIsProposalModalOpen(false);

    showToast('Your proposal was submitted to the client under Escrow terms!', 'success');
  };

  const createServiceGig = async (newService: Omit<TalentioService, 'id' | 'rating' | 'reviewsCount'>) => {
    if (!requireAuth('Please sign in to publish a service package.')) return;

    if (user?.accountStatus && user.accountStatus !== 'approved') {
      showToast('Your seller account is currently under review. You cannot publish gigs until your account has been approved.', 'warning');
      return;
    }

    const gig: TalentioService = {
      ...newService,
      id: `service-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      status: 'approved'
    };
    await createGigDocument(gig);
    setServices(prev => [gig, ...prev]);
    setIsCreateGigModalOpen(false);
    showToast('New Milestone Service Package saved to Firestore & published!', 'success');
  };

  const startServiceOrderEscrow = async (contractData: EscrowContract) => {
    setContract(contractData);
    localStorage.setItem('talentio_contract', JSON.stringify(contractData));
    await updateEscrowOrderDocument(contractData.id, contractData);

    // Dynamic Notice for the client
    await addNotice({
      targetUserId: user?.id,
      title: `🛡️ Escrow Funded: ${contractData.title}`,
      description: `Funds of $${contractData.totalAmount} are secured in multi-sig escrow for ${contractData.freelancerName}. Your funds will only be released upon milestone approval.`,
      category: 'order',
      priority: 'high',
      iconType: 'shield',
      actionUrl: 'workstation',
      meta: {
        orderId: contractData.orderNumber
      }
    });

    setActivePage('workstation');
    showToast(`Escrow Order ${contractData.orderNumber} successfully locked and funded!`, 'success');
  };

  const submitDeliverable = async (fileName: string, fileSize: string) => {
    if (!requireAuth('Please sign in to submit files.')) return;

    const updatedContract: EscrowContract = {
      ...contract,
      status: 'submitted',
      deliverables: [
        ...contract.deliverables,
        {
          id: `del-${Date.now()}`,
          name: fileName,
          size: fileSize,
          date: 'Just now'
        }
      ]
    };
    setContract(updatedContract);
    await updateEscrowOrderDocument(contract.id, updatedContract);
    showToast('Deliverable package submitted to client for review!', 'success');
  };

  const releaseMilestoneEscrow = async (milestoneId: string) => {
    if (!requireAuth('Please sign in to release escrow.')) return;

    const updatedMilestones = contract.milestones.map(m => 
      m.id === milestoneId ? { ...m, status: 'completed' as const } : m
    );
    const allCompleted = updatedMilestones.every(m => m.status === 'completed');

    const updatedContract: EscrowContract = {
      ...contract,
      milestones: updatedMilestones,
      status: allCompleted ? 'completed' : contract.status
    };
    setContract(updatedContract);
    await updateEscrowOrderDocument(contract.id, updatedContract);
    showToast('Milestone approved & Escrow funds released to Talent!', 'success');
  };

  const requestContractRevision = async () => {
    if (!requireAuth()) return;
    const updatedContract: EscrowContract = { ...contract, status: 'revision' };
    setContract(updatedContract);
    await updateEscrowOrderDocument(contract.id, updatedContract);
    showToast('Revision request sent with feedback notes.', 'info');
  };

  const resetContract = () => {
    setContract(INITIAL_ESCROW_CONTRACT);
    showToast('Escrow contract simulator reset.', 'info');
  };

  const sendChatMessage = async (text: string, isOffer: boolean = false, offerAmount: number = 500) => {
    if (!requireAuth('Please sign in to send messages.')) return;
    if (!text.trim()) return;

    const currentUserId = user?.id || 'user-me';
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.userType === 'freelancer' ? 'freelancer' : 'client',
      senderId: currentUserId,
      sender_id: currentUserId,
      senderName: user ? `${user.name}` : 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      status: 'sent',
      read_status: 'sent',
      isOffer,
      offerDetails: isOffer ? {
        title: 'Custom Milestone Contract Offer',
        amount: offerAmount,
        deliveryDays: 5,
        status: 'pending'
      } : undefined
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  const acceptOffer = (msgId: string) => {
    if (!requireAuth('Please sign in to accept offer.')) return;

    setChatMessages(prev => prev.map(m => {
      if (m.id === msgId && m.offerDetails) {
        return {
          ...m,
          offerDetails: { ...m.offerDetails, status: 'accepted' }
        };
      }
      return m;
    }));
    showToast('Offer accepted! Escrow contract initialized.', 'success');
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const toggleBookmarkGuide = (guideId: string) => {
    setBookmarkedGuideIds(prev => 
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  const resetProgress = () => {
    setCompletedSteps({});
    showToast('Roadmap progress reset.', 'info');
  };

  return (
    <GuideContext.Provider
      value={{
        activePage,
        setActivePage,
        language,
        setLanguage: setLanguageState,
        currency,
        setCurrency,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isSearchModalOpen,
        setIsSearchModalOpen,
        user,
        firebaseUser,
        authLoading,
        isAuthenticated: !!user,
        authPromptReason,
        setAuthPromptReason,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        requireAuth,
        loginWithEmail,
        loginWithPhone,
        loginWithGoogle,
        loginWithGithub,
        registerAccount,
        registerFullAccount,
        logout,
        switchDemoAccount,
        completeOnboarding,
        updateUserProfile,
        allUsers,
        adminActions,
        approveUserAccount,
        rejectUserAccount,
        suspendUserAccount,
        banUserAccount,
        restoreUserAccount,
        approveServiceGig,
        rejectServiceGig,
        toggleFeatureServiceGig,
        removeServiceGig,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        isHireModalOpen,
        setIsHireModalOpen,
        isServiceModalOpen,
        setIsServiceModalOpen,
        isProposalModalOpen,
        setIsProposalModalOpen,
        isCreateGigModalOpen,
        setIsCreateGigModalOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        closeAllModals,
        isAnyModalOpen,
        proposalJobTarget,
        openProposalModal,
        selectedFreelancer,
        setSelectedFreelancer,
        selectedService,
        setSelectedService,
        freelancers,
        services,
        postedJobs,
        addPostedJob,
        proposals,
        submitProposal,
        createServiceGig,
        savedFreelancerIds,
        toggleSaveFreelancer,
        savedGigIds,
        toggleSaveGig,
        isGigSaved,
        openGigDetails,
        openCategoryMarketplace,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        notices,
        unreadNoticesCount,
        addNotice,
        markNoticeRead,
        markAllNoticesRead,
        deleteNotice,
        contract,
        startServiceOrderEscrow,
        submitDeliverable,
        releaseMilestoneEscrow,
        requestContractRevision,
        resetContract,
        chatMessages,
        sendChatMessage,
        acceptOffer,
        toasts,
        showToast,
        removeToast,
        activeGuideId,
        setActiveGuideId,
        completedSteps,
        toggleStepCompleted,
        bookmarkedGuideIds,
        toggleBookmarkGuide,
        activeDeviceFilter,
        setActiveDeviceFilter,
        resetProgress,
        openGuide: (guideId: string) => {
          setActiveGuideId(guideId);
          setActivePage('playbook');
        },
        toastMessage: (msg: string) => showToast(msg)
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};
