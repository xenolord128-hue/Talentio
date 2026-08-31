import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Ecosystem & Basics',
    question: 'What is Fiverr and how does it differ from Upwork or Freelancer?',
    answer: 'Fiverr is a service-catalog marketplace where sellers create pre-packaged service listings called "Gigs". Instead of constantly bidding on job posts with costly connects, buyers browse your service catalog and place direct orders or contact you with specifications.',
    tags: ['basics', 'gig', 'upwork', 'marketplace'],
    relatedGuideId: 'fiverr-basics'
  },
  {
    id: 'faq_2',
    category: 'Account & Verification',
    question: 'Can I create two Fiverr accounts on the same computer or IP address?',
    answer: 'No. Fiverr strictly prohibits a single person from operating multiple seller accounts. Creating duplicate accounts will result in permanent suspension of all associated profiles without warning.',
    tags: ['account', 'multiple-accounts', 'ban', 'ip'],
    relatedGuideId: 'account-setup'
  },
  {
    id: 'faq_3',
    category: 'Device Management',
    question: 'Can I create and publish a new Gig using only the Fiverr Mobile App?',
    answer: 'No. The mobile app does not support the 6-step Gig creation wizard (package tables, tag selectors, and gallery uploaders). You must use a desktop or laptop browser for publishing, though you can chat and manage active orders from your smartphone.',
    tags: ['mobile', 'app', 'desktop', 'devices'],
    relatedGuideId: 'device-guide'
  },
  {
    id: 'faq_4',
    category: 'SEO & Ranking',
    question: 'Why is my new Gig not showing up on page 1 of search results?',
    answer: 'New Gigs undergo an algorithm rotation. To rank higher, optimize your 5 tags, maintain an inquiry response time under 1 hour, design high-CTR cover images (1280x769px), and deliver orders with 5-star feedback and zero late cancellations.',
    tags: ['ranking', 'seo', 'algorithm', 'impressions'],
    relatedGuideId: 'gig-seo'
  },
  {
    id: 'faq_5',
    category: 'Communication & Policies',
    question: 'What should I do if a buyer asks for my WhatsApp, Telegram, or Email?',
    answer: 'Politely refuse and state that all communication, project files, and payments must strictly remain inside Fiverr pursuant to Terms of Service. Sharing contact info can trigger automated bot warnings and account flagging.',
    tags: ['whatsapp', 'telegram', 'tos', 'communication'],
    relatedGuideId: 'client-communication'
  },
  {
    id: 'faq_6',
    category: 'Financials & Payouts',
    question: 'How long does it take for order earnings to clear and become withdrawable?',
    answer: 'Standard seller earnings enter a 14-day clearance period upon order completion. Once cleared, the balance automatically transitions to "Available for Withdrawal" and can be transferred via Payoneer, Bank Deposit, or PayPal.',
    tags: ['earnings', 'withdrawal', 'clearance', 'payoneer', 'bank'],
    relatedGuideId: 'earnings-withdrawal'
  },
  {
    id: 'faq_7',
    category: 'Orders & Revisions',
    question: 'What should I do if the delivery countdown is running low and the buyer requested revisions?',
    answer: 'Submit an official Mutual Deadline Extension request through the "Resolution Center" inside the order page BEFORE the timer hits 00:00:00. This prevents a "Late Delivery" penalty on your seller evaluation metrics.',
    tags: ['timer', 'deadline', 'resolution-center', 'revisions'],
    relatedGuideId: 'revisions-handling'
  },
  {
    id: 'faq_8',
    category: 'Security & Phishing',
    question: 'A buyer sent a message with a QR code asking to scan for payment verification. Is this real?',
    answer: 'NO! This is a dangerous phishing scam. Buyers NEVER need you to scan a QR code or verify your credit card to receive an order. Fiverr processes all payments directly. Report the message immediately and mark it as spam.',
    tags: ['scam', 'qr-code', 'phishing', 'security'],
    relatedGuideId: 'security-center'
  },
  {
    id: 'faq_9',
    category: 'Reviews & Feedback',
    question: 'Can I ask a happy buyer to leave a 5-star review?',
    answer: 'No. You may say "If you enjoyed my work, your feedback would be greatly appreciated," but specifically asking for a "5-star rating" or offering discounts in exchange for positive feedback is a strict violation of Fiverr Feedback Manipulation Policy.',
    tags: ['reviews', 'ratings', 'feedback-policy'],
    relatedGuideId: 'reviews-ratings'
  },
  {
    id: 'faq_10',
    category: 'Seller Levels',
    question: 'What are the requirements to reach Level 1 and Level 2 seller status?',
    answer: 'Sellers are evaluated based on the Success Score matrix, maintaining >= 90% Response Rate, >= 90% Order Completion, earning $400+ (Level 1) or $2,000+ (Level 2), and maintaining active account age without TOS violations.',
    tags: ['level-1', 'level-2', 'success-score', 'seller-levels'],
    relatedGuideId: 'seller-dashboard'
  }
];
