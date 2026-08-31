import { RoadmapPhase } from '../types';

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase_1',
    phaseNumber: 1,
    title: 'Account Foundation & 2FA Security',
    estimatedDuration: '1 - 2 Hours',
    description: 'Set up your single legal account, verify email and phone number, activate Two-Factor Authentication, and configure high-security recovery settings.',
    milestones: [
      'Create account with memorable professional username',
      'Complete SMS phone and email verification',
      'Activate Two-Factor Authentication (2FA)',
      'Set strong password & security questions'
    ],
    keyOutcome: 'A fully verified, secure seller account ready for profile customization.',
    relatedGuides: ['account-setup', 'security-center']
  },
  {
    id: 'phase_2',
    phaseNumber: 2,
    title: 'Profile Architecture & Storefront Branding',
    estimatedDuration: '2 - 4 Hours',
    description: 'Upload a warm, authentic portrait, write a compelling 3-part seller bio, add verified skills, and connect verified credentials.',
    milestones: [
      'High-resolution friendly headshot without distractions',
      'Punchy one-line tagline showcasing unique value',
      '3-paragraph bio covering background, workflow, and promise',
      'Add top 10 relevant skills with verified proficiency'
    ],
    keyOutcome: 'A trustworthy, high-authority seller profile that inspires instant buyer confidence.',
    relatedGuides: ['freelancer-profile', 'fiverr-basics']
  },
  {
    id: 'phase_3',
    phaseNumber: 3,
    title: 'Niche Research & 6-Step Gig Creation',
    estimatedDuration: '1 - 2 Days',
    description: 'Find low-competition subcategories, research 5 high-intent search tags, draft SEO titles, and publish your primary Gig.',
    milestones: [
      'Audit 10 top-selling competitor Gigs in your category',
      'Write title with exact keyword focus (40-60 chars)',
      'Select 5 specific, low-saturation search tags',
      'Complete the 6-step desktop publishing wizard'
    ],
    keyOutcome: 'Your first high-converting service listing published live in search rotations.',
    relatedGuides: ['gig-creation', 'gig-seo']
  },
  {
    id: 'phase_4',
    phaseNumber: 4,
    title: 'Strategic 3-Tier Pricing & Extras',
    estimatedDuration: '3 - 5 Hours',
    description: 'Build compelling Basic, Standard, and Premium packages with clear deliverables, smart turnaround times, and profitable Gig extras.',
    milestones: [
      'Basic introductory package for easy entry',
      'Standard value anchor package (priced at 2.5x Basic)',
      'Premium VIP package with source files & priority support',
      'Configure Extra Fast Delivery and Add-on options'
    ],
    keyOutcome: 'A balanced 3-tier pricing table that encourages buyers to choose higher-margin packages.',
    relatedGuides: ['pricing-packages', 'gig-creation']
  },
  {
    id: 'phase_5',
    phaseNumber: 5,
    title: 'Rapid Client Inquiry Response & Offers',
    estimatedDuration: 'Ongoing',
    description: 'Respond to buyer messages in under 1 hour using mobile push notifications, qualify vague briefs, and send custom scope offers.',
    milestones: [
      'Maintain 100% response rate on first messages',
      'Use quick response templates for common inquiries',
      'Clarify scope boundaries and file assets before ordering',
      'Generate clear custom offers with realistic deadlines'
    ],
    keyOutcome: 'Fast inquiry-to-order conversion while remaining 100% compliant with Fiverr TOS.',
    relatedGuides: ['client-communication', 'orders-workflow']
  },
  {
    id: 'phase_6',
    phaseNumber: 6,
    title: 'Flawless Production & Professional Delivery',
    estimatedDuration: 'Project Dependent',
    description: 'Execute deliverables with checklist precision, upload complete source assets, and write gratitude-driven delivery notes.',
    milestones: [
      'Follow buyer requirements document strictly',
      'Package final outputs (.zip, .pdf, source code) neatly',
      'Use "Deliver Now" button with personalized delivery note',
      'Invite questions before asking for revisions'
    ],
    keyOutcome: 'Delighted buyers who accept deliveries promptly without friction.',
    relatedGuides: ['delivery-guide', 'revisions-handling']
  },
  {
    id: 'phase_7',
    phaseNumber: 7,
    title: '5-Star Reviews & Post-Order Retention',
    estimatedDuration: 'Ongoing',
    description: 'Handle revisions calmly, protect your seller metrics, earn organic 5-star ratings, and nurture recurring buyer relationships.',
    milestones: [
      'Handle revision requests within 24 hours with a smile',
      'Comply strictly with Fiverr review solicitation policies',
      'Check in on past buyers with relevant service updates',
      'Maintain an Order Completion rate above 95%'
    ],
    keyOutcome: 'A growing wall of glowing public feedback that fuels automated search ranking.',
    relatedGuides: ['reviews-ratings', 'revisions-handling']
  },
  {
    id: 'phase_8',
    phaseNumber: 8,
    title: 'Earnings Clearance, Payouts & Leveling Up',
    estimatedDuration: 'Monthly Evaluation',
    description: 'Track 14-day clearance cycles, connect Payoneer/Bank payout methods, manage tax declarations, and climb to Level 1, 2, and Top Rated Seller.',
    milestones: [
      'Track cleared revenues in the Financials dashboard',
      'Set up Payoneer or Direct Bank transfer payout gateway',
      'Submit W-9 / W-8BEN tax residency forms',
      'Hit Level 1 ($400 earned) and Level 2 ($2,000 earned) targets'
    ],
    keyOutcome: 'A predictable, scalable freelance business generating steady international income.',
    relatedGuides: ['earnings-withdrawal', 'seller-dashboard', 'policies-guidelines']
  }
];
