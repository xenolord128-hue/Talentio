export type LanguageMode = 'bn' | 'en';

export type DeviceType = 'all' | 'mobile' | 'tablet' | 'desktop';

export type DeviceAvailability =
  | 'available'           // 🟢 Available on All Devices
  | 'limited'             // 🟡 Limited on Mobile
  | 'desktop_recommended' // 🔵 Desktop Recommended
  | 'desktop_required';   // 🔴 Desktop Required

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// ==========================================
// TALENTIO MARKETPLACE TYPES
// ==========================================

export interface FreelancerPortfolioItem {
  id: string;
  title: string;
  image: string;
  tag: string;
}

export interface FreelancerReview {
  clientName: string;
  clientCountry: string;
  rating: number;
  text: string;
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  title: string;
  category: string;
  country: string;
  countryFlag: string;
  hourlyRate: number;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  jobSuccessScore: number; // 0 - 100%
  verifiedBadge: boolean;
  proBadge: boolean;
  topRatedBadge: boolean;
  availableNow: boolean;
  bio: string;
  bioBn?: string;
  skills: string[];
  completedOrdersCount: number;
  responseTime: string;
  languages: string[];
  portfolio: FreelancerPortfolioItem[];
  featuredReview?: FreelancerReview;
}

export interface ServicePackageTier {
  name: string;
  price: number;
  deliveryDays: number;
  revisions: number | string;
  description: string;
  features: string[];
}

export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'banned';

export interface GigMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface GigReview {
  id: string;
  gigId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientCountry?: string;
  clientRole?: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  mediaUrl?: string;
  orderId?: string;
}

export interface LeaderboardFreelancer {
  rank: number;
  freelancerId: string;
  name: string;
  handle: string;
  avatar: string;
  title: string;
  category: string;
  rating: number;
  totalReviews: number;
  completedOrdersCount: number;
  monthlyScore: number;
  monthlyRevenue?: number;
  verifiedBadge: boolean;
  country: string;
  countryFlag: string;
  badgeType: 'champion' | 'top_rated' | 'rising_star';
}

export type GigStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'removed';

export interface TalentioService {
  id: string;
  title: string;
  slug: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerBadge: 'Talentio Pro' | 'Top Rated' | 'Verified';
  freelancerVerified?: boolean;
  category: string;
  subcategory?: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  deliveryDays: number;
  coverImage: string;
  videoUrl?: string;
  media?: GigMediaItem[];
  description?: string;
  whatIOffer?: string[];
  deliverables?: string[];
  requirements?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  reviews?: GigReview[];
  completedOrdersCount?: number;
  tags: string[];
  status?: GigStatus;
  isFeatured?: boolean;
  rejectionReason?: string;
  submittedAt?: string;
  packages: {
    basic: ServicePackageTier;
    standard: ServicePackageTier;
    pro: ServicePackageTier;
  };
}

export interface ProjectJob {
  id: string;
  title: string;
  clientName: string;
  clientCompany?: string;
  clientCountry: string;
  clientAvatar: string;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  duration: string;
  proposalsCount: number;
  postedAgo: string;
  description: string;
  skills: string[];
  verifiedPayment: boolean;
  category: string;
}

export interface EscrowMilestone {
  id: string;
  name: string;
  amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  dueDate: string;
}

export interface EscrowContract {
  id: string;
  orderNumber: string;
  title: string;
  clientName: string;
  clientCountry: string;
  freelancerName: string;
  freelancerAvatar: string;
  totalAmount: number;
  escrowFunded: boolean;
  status: 'funded' | 'in_progress' | 'submitted' | 'revision' | 'completed' | 'released';
  remainingSeconds: number;
  deliverables: Array<{ id: string; name: string; size: string; date: string }>;
  milestones: EscrowMilestone[];
  deliveryMessage?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url?: string;
  size: string;
  type: 'image' | 'video' | 'document' | 'file';
  previewUrl?: string;
}

export interface VoiceNoteData {
  audioUrl?: string;
  durationSeconds: number;
  waveform: number[];
  mimeType?: string;
  fileSize?: number;
  createdAt?: string;
  expiresAt?: string; // 15-day auto-deletion / purge timestamp
  isExpired?: boolean;
}

export interface OrderRequestDetails {
  id: string;
  orderNumber: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  gigId?: string;
  title: string;
  amount: number;
  deliveryDays: number;
  requirements?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  contractId?: string;
}

export interface ChatMessage {
  id: string;
  messageId?: string;
  conversationId?: string;
  conversation_id?: string;
  sender: 'client' | 'freelancer' | 'system' | 'me' | 'other';
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  message?: string;
  originalText?: string;
  translatedText?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  translationStatus?: 'pending' | 'translated' | 'not_required' | 'failed' | 'original_same_language';
  timestamp: string;
  isoDate?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'seen';
  read_status?: 'sent' | 'delivered' | 'read' | 'seen';
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    userIds: string[];
  }>;
  attachments?: MessageAttachment[];
  voiceNote?: VoiceNoteData;
  isOffer?: boolean;
  offerDetails?: {
    id?: string;
    title: string;
    amount: number;
    deliveryDays: number;
    status: 'pending' | 'accepted' | 'declined';
  };
  isOrderRequest?: boolean;
  orderRequestDetails?: OrderRequestDetails;
  attachment?: {
    name: string;
    size: string;
  };
  action?: {
    type: 'navigate' | 'modal';
    target: string;
    label: string;
  };
}

export interface ConversationParticipant {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'freelancer' | 'client' | 'agency' | 'admin' | 'bot' | 'assistant';
  title?: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  preferredLanguage?: string;
  autoTranslateMessages?: boolean;
  verified: boolean;
  online: boolean;
  lastSeen: string;
  isTyping?: boolean;
  escrowTier?: number;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant;
  participantIds?: string[];
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
    sender_id?: string;
    receiver_id?: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    read_status?: 'sending' | 'sent' | 'delivered' | 'read';
    isVoice?: boolean;
    hasAttachment?: boolean;
    isOffer?: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  category: 'all' | 'direct' | 'contract' | 'team';
  contractId?: string;
  pinnedMessageId?: string;
  updatedAt?: string;
}

// ==========================================
// USER, AUTH & ONBOARDING TYPES
// ==========================================

export type AccountRole = 'CLIENT' | 'FREELANCER' | 'ADMIN';
export type UserRole = 'client' | 'freelancer' | 'agency' | 'team' | 'company' | 'admin';

export type ProviderType = 'individual' | 'agency' | 'team' | 'company' | 'studio';

export interface UserProposal {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  bidAmount: number;
  duration: string;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  userId?: string;
  name: string;
  displayName?: string;
  fullName?: string;
  handle: string;
  email?: string;
  phone?: string;
  avatar: string;
  coverImage?: string;
  authMethod: 'email' | 'github' | 'google' | 'phone' | 'demo';
  passwordStatus?: 'Encrypted (PBKDF2/Argon2)' | 'OAuth Managed' | 'Set & Verified';
  passwordHashPlaceholder?: string;
  lastLoginAt?: string;
  userType: UserRole | null;
  providerType?: ProviderType;
  role?: AccountRole | 'client' | 'freelancer' | 'admin' | 'user' | 'moderator';
  accountStatus: AccountStatus;
  subscriptionStatus?: 'active' | 'trial' | 'expired' | 'canceled';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionPlan?: string;
  platformFeePercent?: number;
  trialPeriodDays?: number;
  isApprovedSeller?: boolean;
  rejectionReason?: string;
  statusReason?: string;
  country?: string;
  countryCode?: string;
  preferredLanguage?: string;
  autoTranslateMessages?: boolean;
  preferredCurrency?: string;
  title?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  category?: string;
  subcategory?: string;
  skills: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'expert' | 'lead';
  hourlyRate?: number;
  startingPrice?: number;
  location?: string;
  countryFlag?: string;
  bio?: string;
  languages?: string[];
  portfolio?: FreelancerPortfolioItem[];
  availability?: 'available' | 'part_time' | 'busy';
  verifiedBadge: boolean;
  escrowTier: number;
  onboardingCompleted: boolean;
  onboardingStep: number;
  profileCompletionScore: number;
  teamSize?: string;
  preferredCategories?: string[];
  typicalBudgetRange?: string;
  balanceAvailable?: number;
  balanceInEscrow?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  targetId: string;
  targetName: string;
  targetType: 'user' | 'gig' | 'order' | 'system';
  action: 'approve' | 'reject' | 'suspend' | 'ban' | 'restore' | 'feature' | 'remove' | 'update';
  reason?: string;
  timestamp: string;
  details?: string;
}

export interface AdminNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'warning' | 'system' | 'order';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

// ==========================================
// GUIDE & EDUCATION TYPES
// ==========================================

export interface GuideStep {
  id: string;
  stepNumber?: number;
  title: string;
  titleBn?: string;
  actionSummary?: string;
  actionSummaryBn?: string;
  action?: string;
  actionBn?: string;
  where: string;
  whereBn?: string;
  whatToSelect?: string;
  whatToSelectBn?: string;
  whatToWrite?: string;
  whatToWriteBn?: string;
  why: string;
  whyBn?: string;
  device?: string;
  availability?: DeviceAvailability;
  deviceAvailability?: DeviceAvailability;
  difficulty?: DifficultyLevel;
  fieldValuesExample?: Array<{
    field: string;
    example: string;
    note?: string;
  }>;
  tips?: string[];
  tipsBn?: string[];
  warnings?: string[];
  warningsBn?: string[];
  uiIndicator?: {
    elementName: string;
    buttonColor?: string;
    locationDesc: string;
  };
}

export type StepItem = GuideStep;

export interface CommonMistakeItem {
  mistake: string;
  fix: string;
  dangerLevel?: string;
}

export interface Guide {
  id: string;
  slug?: string;
  title: string;
  titleBn?: string;
  shortTitle?: string;
  category: string;
  categoryName?: string;
  iconName?: string;
  description: string;
  descriptionBn?: string;
  difficulty: DifficultyLevel;
  devices?: DeviceAvailability;
  primaryDevice?: DeviceAvailability;
  estimatedMinutes?: number;
  readTime?: string;
  whatYouWillLearn?: string[];
  whatYouWillLearnBn?: string[];
  prerequisites?: string[];
  steps: GuideStep[];
  proTips?: string[];
  proTipsBn?: string[];
  commonMistakes?: Array<CommonMistakeItem> | string[];
  commonMistakesBn?: string[];
  officialDocUrl?: string;
  fiverrHelpDocUrl?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedGuideIds?: string[];
}

export type GuideSection = Guide;

export interface GuideCategory {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
  descriptionBn?: string;
  icon?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  guideId?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  titleBn?: string;
  tagline?: string;
  taglineBn?: string;
  description: string;
  descriptionBn?: string;
  estimatedTime?: string;
  estimatedDuration?: string;
  icon?: string;
  milestones: Array<RoadmapMilestone | string>;
  keyOutcome?: string;
  keyTakeaway?: string;
  keyTakeawayBn?: string;
  relatedGuides?: string[];
}

export interface DeviceMatrixItem {
  id: string;
  featureName?: string;
  featureNameBn?: string;
  category: string;
  operation?: string;
  status?: DeviceAvailability | string;
  advice?: string;
  mobileApp: {
    status: DeviceAvailability;
    note: string;
    noteBn?: string;
  } | string;
  mobileWeb?: {
    status: DeviceAvailability;
    note: string;
    noteBn?: string;
  } | string;
  tablet?: string;
  desktop?: string;
  desktopWeb?: {
    status: DeviceAvailability;
    note: string;
    noteBn?: string;
  } | string;
  recommendedDevice: 'mobile' | 'desktop' | 'both' | string;
  relatedGuideId?: string;
}

export interface SecurityThreat {
  id: string;
  title: string;
  titleBn?: string;
  category: 'phishing' | 'client_scam' | 'malware' | 'account_hijack' | string;
  severity: 'critical' | 'high' | 'medium' | string;
  threatDescription: string;
  threatDescriptionBn?: string;
  realExample: string;
  realExampleBn?: string;
  warningSigns: string[];
  warningSignsBn?: string[];
  correctAction: string[];
  correctActionBn?: string[];
  officialRule?: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  questionBn?: string;
  answer: string;
  answerBn?: string;
  tags?: string[];
  relatedGuideId?: string;
}

export type NoticeCategory = 'approval' | 'rank' | 'system' | 'gig' | 'order' | 'announcement';

export interface PlatformNotice {
  id: string;
  targetUserId?: string; // specific user ID or 'all'
  title: string;
  description: string;
  category: NoticeCategory;
  priority?: 'high' | 'normal' | 'low';
  iconType?: 'check' | 'award' | 'bell' | 'shield' | 'sparkles' | 'alert';
  createdAt: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  meta?: {
    rankNumber?: number;
    accountStatus?: string;
    gigId?: string;
    orderId?: string;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'escrow' | 'order' | 'message' | 'system' | 'proposal';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface GlossaryTerm {
  term: string;
  termBn?: string;
  definition: string;
  definitionBn?: string;
  context: string;
  importance: 'essential' | 'intermediate' | 'advanced' | string;
}

// ==========================================
// AD MANAGEMENT & MONETIZATION TYPES
// ==========================================

export type AdPlacementLocation = 
  | 'top_banner'           // Top Banner (e.g., below navbar)
  | 'below_hero'           // Below Hero Section
  | 'between_content'      // Between Content Sections
  | 'feed_marketplace'     // Feed / Marketplace Listings
  | 'sidebar'              // Desktop Sidebar
  | 'before_footer'        // Before Global Footer
  | 'footer'               // Inside / Right after Footer
  | 'mobile_banner'        // Mobile Specific Sticky/Inline Banner
  | 'custom';              // Custom / Background Script Placement

export type AdDeviceTarget = 'all' | 'desktop' | 'tablet' | 'mobile';

export type AdFormat = 
  | 'banner_468x60' 
  | 'banner_728x90' 
  | 'sidebar_160x300' 
  | 'mobile_320x50' 
  | 'container' 
  | 'script' 
  | 'custom';

export type AdSpacing = 'none' | 'compact' | 'standard' | 'relaxed';

export interface Advertisement {
  id: string;
  name: string;
  network: string; // e.g., 'Adsterra', 'Google AdSense', 'Custom'
  code: string;    // Raw HTML/JavaScript snippet entered by admin
  format: AdFormat;
  width?: number;
  height?: number;
  placement: AdPlacementLocation;
  devices: AdDeviceTarget;
  enabled: boolean;
  priority: number; // 1 = Highest priority
  spacing: AdSpacing;
  targetPages: string[]; // e.g., ['home', 'services', 'freelancers', 'search', 'gig-details']
  allowOnPrivatePages?: boolean; // strictly false by default
  createdAt: string;
  updatedAt: string;
}

export interface AdSettings {
  globalAdsEnabled: boolean;
  updatedAt: string;
  updatedBy?: string;
}
