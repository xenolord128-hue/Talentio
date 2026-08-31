export interface GigBuilderPreset {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  defaultTitle: string;
  defaultTags: string[];
  basicPackage: {
    title: string;
    description: string;
    deliveryDays: number;
    revisions: number;
    price: number;
    includes: string[];
  };
  standardPackage: {
    title: string;
    description: string;
    deliveryDays: number;
    revisions: number;
    price: number;
    includes: string[];
  };
  premiumPackage: {
    title: string;
    description: string;
    deliveryDays: number;
    revisions: number;
    price: number;
    includes: string[];
  };
  defaultDescription: string;
  defaultFaqs: { question: string; answer: string }[];
  defaultRequirements: string[];
}

export const GIG_BUILDER_PRESETS: GigBuilderPreset[] = [
  {
    id: 'web-dev',
    name: 'Modern Web Development / Landing Page',
    category: 'Programming & Tech',
    subcategory: 'Website Development',
    defaultTitle: 'I will design and develop a responsive modern landing page',
    defaultTags: ['landing page', 'react developer', 'responsive design', 'frontend', 'tailwind css'],
    basicPackage: {
      title: 'Starter Single Section',
      description: '1 responsive hero/lead generation landing section with clean styling and contact form.',
      deliveryDays: 2,
      revisions: 2,
      price: 45,
      includes: ['1 Page / Section', 'Responsive Layout', 'Contact Form Integration', 'Source Code']
    },
    standardPackage: {
      title: 'Full Business Landing Page',
      description: 'Up to 5 complete sections (Hero, Features, Testimonials, FAQ, Contact) with smooth transitions.',
      deliveryDays: 4,
      revisions: 4,
      price: 120,
      includes: ['Up to 5 Sections', 'Responsive Design', 'Speed Optimization', 'SEO Meta Tags', 'Source Code']
    },
    premiumPackage: {
      title: 'Full Stack Dynamic Web App',
      description: 'Complete multi-section custom web application with interactive components and custom backend APIs.',
      deliveryDays: 7,
      revisions: 999, // unlimited
      price: 280,
      includes: ['Full Multi-page Application', 'Interactive Components', 'Custom API Integration', 'Deployment Setup', 'VIP 30-Day Support']
    },
    defaultDescription: `Are you looking for a clean, high-converting, and modern landing page that turns visitors into paying customers?

I specialize in building lightning-fast, pixel-perfect web interfaces using modern frameworks like React, TypeScript, and Tailwind CSS.

What you will get:
• 100% Mobile & Tablet responsive architecture
• High performance with clean, maintainable code
• Modern UI/UX design with smooth micro-interactions
• SEO friendly structure and fast loading times
• Free deployment to Vercel/Netlify or your custom hosting

Please message me before placing an order so we can review your project wireframes or requirements in detail!`,
    defaultFaqs: [
      { question: 'Do I need to provide the design or Figma file?', answer: 'If you already have a Figma or XD design, I can convert it into pixel-perfect code. If not, I can create a modern layout from scratch based on your brand requirements.' },
      { question: 'Will the website be mobile responsive?', answer: 'Yes! Every page is thoroughly tested across iPhone, Android phones, iPads, laptops, and ultra-wide desktop screens.' },
      { question: 'Can you assist with domain connection and deployment?', answer: 'Yes, deployment assistance is included in the Standard and Premium packages.' }
    ],
    defaultRequirements: [
      '1. Please share your project overview, brand colors, and logo if available.',
      '2. Do you have any reference websites whose style you like?',
      '3. Any specific third-party integrations needed (e.g. Stripe, Mailchimp, Calendly)?'
    ]
  },
  {
    id: 'graphic-design',
    name: 'Logo & Brand Identity Design',
    category: 'Graphics & Design',
    subcategory: 'Logo & Brand Identity',
    defaultTitle: 'I will create a modern minimalist luxury logo and brand guide',
    defaultTags: ['minimalist logo', 'brand identity', 'luxury logo', 'vector art', 'business branding'],
    basicPackage: {
      title: 'Essential Concept',
      description: '2 initial high-res logo concepts with transparent PNG and JPG formats.',
      deliveryDays: 2,
      revisions: 3,
      price: 35,
      includes: ['2 Initial Concepts', 'Transparent PNG', 'High-Res JPG (300 DPI)', '3 Revisions']
    },
    standardPackage: {
      title: 'Pro Business Branding',
      description: '3 premium concepts + Editable Vector Source Files (AI, EPS, SVG) + Social Media Kit.',
      deliveryDays: 3,
      revisions: 5,
      price: 85,
      includes: ['3 Unique Concepts', 'Vector Source Files (AI, SVG, PDF)', 'Social Media Kit', 'Commercial Use License']
    },
    premiumPackage: {
      title: 'Complete Brand Identity Suite',
      description: '4 VIP concepts + Vector Files + Stationery Designs (Business Card & Letterhead) + Full Brand Style Guide.',
      deliveryDays: 5,
      revisions: 999,
      price: 190,
      includes: ['4 Luxury Concepts', 'Full Vector Package (AI, EPS, SVG, PDF)', 'Stationery Suite', '30-Page Brand Guidelines', 'Full Copyright Transfer']
    },
    defaultDescription: `Give your business the distinct, memorable visual identity it deserves.

A great logo communicates credibility and trust within seconds. I craft bespoke, minimalist, and meaningful logo designs tailored to your industry niche.

Why choose this service:
• 100% original custom concepts tailored to your brand
• Clean vector lines that scale effortlessly from mobile favicons to giant billboards
• Complete vector package (AI, EPS, SVG, PDF, PNG)
• Fast, friendly, and professional communication

Let's build a brand you are proud to showcase!`,
    defaultFaqs: [
      { question: 'What is a Vector Source File and why is it important?', answer: 'Vector files (AI, EPS, SVG) allow you to scale your logo to any size without losing sharpness or becoming pixelated.' },
      { question: 'Do I own the commercial copyright of the final design?', answer: 'Yes! Upon order completion, full commercial usage rights belong to you.' }
    ],
    defaultRequirements: [
      '1. What is the exact business name and tagline/slogan?',
      '2. Brief description of your target audience and industry.',
      '3. Preferred color preferences or visual style references.'
    ]
  }
];

export interface ChatScenario {
  id: string;
  title: string;
  clientName: string;
  clientAvatar: string;
  difficulty: string;
  initialMessage: string;
  scenarioContext: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    fiverrComplianceFeedback: string;
    impactExplanation: string;
  }[];
}

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'sc-1',
    title: 'Client Asks for WhatsApp / Off-Platform Contact',
    clientName: 'Alex Mercer (Tech Founder)',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Critical TOS Rule',
    initialMessage: 'Hey! I love your portfolio. I have a big ongoing project for you. Can you share your WhatsApp or phone number so we can talk quickly and avoid Fiverr fees?',
    scenarioContext: 'A prospective client is attempting to move communication and payment outside Fiverr. Fiverr algorithms scan for contact words automatically.',
    options: [
      {
        id: 'opt-1',
        text: 'Sure, my WhatsApp is +1 555-0192. Message me anytime so we can start.',
        isCorrect: false,
        fiverrComplianceFeedback: 'CRITICAL TOS VIOLATION: Sharing off-platform contact details will trigger automated account warnings or permanent account suspension.',
        impactExplanation: 'Never share phone numbers, emails, or chat handles. Fiverr strictly forbids off-platform communication and payments.'
      },
      {
        id: 'opt-2',
        text: 'Thank you for reaching out! To comply with Fiverr Terms of Service and keep our project protected by Fiverr order escrow, all communication and payments must stay on the Fiverr platform. Please share your project requirements here in chat, and I can create a tailored Custom Offer for you right away!',
        isCorrect: true,
        fiverrComplianceFeedback: 'PERFECT PROFESSIONAL RESPONSE: Compliant with Fiverr TOS, explains buyer protection, and smoothly guides the client toward a Custom Offer.',
        impactExplanation: 'This protects your account status, satisfies Fiverr Trust & Safety bots, and establishes your professional boundaries.'
      },
      {
        id: 'opt-3',
        text: 'I cannot share WhatsApp, but send me your email address instead and I will send an invoice.',
        isCorrect: false,
        fiverrComplianceFeedback: 'VIOLATION: Requesting or providing an email address for off-platform invoicing is equally prohibited under Fiverr policy.',
        impactExplanation: 'Fiverr monitors both seller and buyer chat messages for off-platform financial transactions.'
      }
    ]
  },
  {
    id: 'sc-2',
    title: 'Client with Vague Brief Wants Instant Discount',
    clientName: 'David K. (Startup Lead)',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Scope & Qualification',
    initialMessage: 'Can you build a full e-commerce website with payment and user login for $30 by tomorrow? If you do good, I will give you 10 more projects!',
    scenarioContext: 'Buyer promises future work in exchange for massive scope, high urgency, and extreme underpricing.',
    options: [
      {
        id: 'opt-1',
        text: 'Yes of course! I will do it for $30 by tomorrow. Please order right now.',
        isCorrect: false,
        fiverrComplianceFeedback: 'HIGH RISK: Agreeing to an impossible deadline and massive scope for $30 leads to late deliveries, cancellations, and negative reviews.',
        impactExplanation: 'Unrealistic commitments damage your On-Time Delivery rate and invite severe buyer disputes.'
      },
      {
        id: 'opt-2',
        text: 'Hello David! Thank you for considering my services. A full e-commerce platform with secure payment gateways and authentication requires comprehensive architecture to ensure safety and quality. My standard timeline for this scope is 5–7 days, starting at $220. Let\'s review your product catalog and feature list so I can break down the exact deliverables for you!',
        isCorrect: true,
        fiverrComplianceFeedback: 'EXCELLENT SCOPING & BOUNDARY SETTING: Professional tone, realistic timeframe, value-anchored pricing, and clear qualification.',
        impactExplanation: 'High-value clients respect freelancers who understand the true effort required and communicate transparently.'
      },
      {
        id: 'opt-3',
        text: 'No, that is way too cheap. Read my Gig pricing before messaging.',
        isCorrect: false,
        fiverrComplianceFeedback: 'POOR ETIQUETTE: Harsh or dismissive tone can lead to buyer reports and lost conversion opportunities.',
        impactExplanation: 'Always maintain a courteous and polite tone even when declining an unsuitable request.'
      }
    ]
  }
];

export interface SecurityScenario {
  id: string;
  title: string;
  senderName: string;
  senderBadge?: string;
  messageBody: string;
  attachedFileOrQr?: string;
  isScam: boolean;
  threatType: string;
  warningSigns: string[];
  correctAction: string;
  officialExplanation: string;
}

export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'sec-1',
    title: 'Fake "Order Verification" QR Code Scam',
    senderName: 'Fiverr_System_Verification',
    senderBadge: 'Unverified Buyer Account',
    messageBody: 'Your order is pending confirmation! To receive $150 from client, you must scan this QR code within 15 minutes to verify your bank card, otherwise your account will be blocked.',
    attachedFileOrQr: 'QR_Code_Verification.png',
    isScam: true,
    threatType: 'Phishing / Credit Card Theft',
    warningSigns: [
      'Sender claims to be Fiverr Staff from a regular buyer inbox account',
      'Artificial urgency ("within 15 minutes or account blocked")',
      'Requests QR code scan or credit card details to "receive funds"',
      'Official Fiverr never requests banking cards in chat messages'
    ],
    correctAction: 'Click the 3 dots (...) next to the message, select "Report as Spam / Phishing", and block the sender. Never scan QR codes from chat.',
    officialExplanation: 'Fiverr manages all order payments internally. You never need to verify your credit card or scan a code to receive money from an order.'
  },
  {
    id: 'sec-2',
    title: 'Legitimate Client Requirement Brief',
    senderName: 'Elena Rostova (Verified Business)',
    senderBadge: 'Fiverr Pro Buyer',
    messageBody: 'Hello! We reviewed your landing page Gig. We need a 3-page SaaS layout. Attached is our brand style guide PDF and Figma wireframe link. Could you review and let us know your availability for a 5-day delivery?',
    attachedFileOrQr: 'Brand_Guide_2026.pdf',
    isScam: false,
    threatType: 'None (Legitimate Inquiry)',
    warningSigns: [
      'No requests for external contact or off-platform payment',
      'Specific, realistic project scope with legitimate reference files (PDF/Figma)',
      'Respects standard Fiverr ordering workflow'
    ],
    correctAction: 'Review the attached PDF requirements and Figma wireframe, then reply with a clear breakdown and send a Custom Offer.',
    officialExplanation: 'Safe and standard client interaction following all Fiverr marketplace rules.'
  },
  {
    id: 'sec-3',
    title: 'Malicious ".exe / .scr" Archive Attachment',
    senderName: 'Client_Project_Lead',
    senderBadge: 'New Account',
    messageBody: 'Hi, please look at our project requirements in this archive: "Project_Requirements_Full.exe.zip". Run the viewer inside to see the specs.',
    attachedFileOrQr: 'Project_Requirements_Full.exe.zip',
    isScam: true,
    threatType: 'Malware / Session Token Stealer',
    warningSigns: [
      'File contains executable extension (.exe, .scr, .bat, .js)',
      'Generic message with no specific project details',
      'Attempts to trick seller into running software locally'
    ],
    correctAction: 'Do not download or execute the file. Immediately report the user to Fiverr Trust & Safety and mark the conversation as spam.',
    officialExplanation: 'Legitimate clients share standard formats (.pdf, .docx, .png, .jpg, Figma/Canva links). Executables are malware designed to hijack your browser cookies and seller account.'
  }
];
