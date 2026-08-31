import { Guide } from '../types';

export const GUIDES: Guide[] = [
  {
    id: 'fiverr-basics',
    slug: 'fiverr-basics',
    title: 'Fiverr Basics & Marketplace Ecosystem',
    shortTitle: 'Fiverr Basics',
    category: 'basics',
    categoryName: 'Fiverr Ecosystem',
    iconName: 'Compass',
    description: 'Understand the fundamental architecture of Fiverr: how buyer and seller accounts interact, the order escrow system, and marketplace ranking algorithms.',
    readTime: '6 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'How the two-sided Fiverr marketplace operates',
      'The difference between Buyer Mode and Seller Mode on a single account',
      'How order escrow protects both buyers and sellers',
      'The primary stages of a freelance transaction on Fiverr'
    ],
    prerequisites: ['Valid personal email address', 'Basic computer/internet literacy'],
    steps: [
      {
        id: 'fb-step-1',
        stepNumber: 1,
        title: 'Understand the Unified Account Model',
        actionSummary: 'Learn how one Fiverr account serves both buying and selling roles.',
        where: 'Fiverr Web Homepage / Mobile App Top Navigation',
        whatToSelect: 'Profile Avatar > Switch to Selling (or Switch to Buying)',
        whatToWrite: 'No input needed — toggle between modes via navigation.',
        why: 'Fiverr uses a single login for both purchasing services from other freelancers and selling your own professional services.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'You do NOT need to create two separate accounts for buying and selling.',
          'Creating multiple accounts for the same person is a violation of Fiverr Terms of Service.'
        ],
        warnings: [
          'Operating duplicate seller accounts can lead to permanent suspension of all related accounts.'
        ],
        uiIndicator: {
          elementName: 'Switch to Selling Button',
          buttonColor: 'Emerald Green',
          locationDesc: 'Top right corner of desktop navbar or user profile dropdown'
        }
      },
      {
        id: 'fb-step-2',
        stepNumber: 2,
        title: 'Learn the Order Escrow & Payment Flow',
        actionSummary: 'Understand how money moves securely through Fiverr escrow.',
        where: 'Fiverr Financial Operations Framework',
        whatToSelect: 'Review Order Status & Earnings Overview',
        why: 'When a buyer places an order, Fiverr charges the buyer immediately and holds 100% of the funds in escrow. You are guaranteed payment upon approved delivery.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Never start work until an order status officially changes to "In Progress".',
          'Fiverr charges a standard 20% platform fee on completed seller orders.'
        ],
        warnings: [
          'Never accept promises of payment outside of Fiverr escrow.'
        ]
      },
      {
        id: 'fb-step-3',
        stepNumber: 3,
        title: 'Explore the 4 Fiverr Seller Levels',
        actionSummary: 'Understand the progression: New Seller -> Level 1 -> Level 2 -> Top Rated.',
        where: 'Seller Dashboard > Analytics > Success Score / Level Status',
        whatToSelect: 'Seller Level Progress Widget',
        why: 'Higher seller levels grant perks like more active Gigs, faster funds clearing (7 days for Top Rated vs 14 days), priority customer support, and eligibility for Promoted Gigs.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'Fiverr evaluates seller performance continuously based on your Success Score, On-Time Delivery, and Client Satisfaction.',
          'Maintain a Success Score of at least 7 to remain eligible for level advancement.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Creating a second account to start a new niche service.',
        fix: 'Use multiple Gigs within different subcategories on your single verified account instead.',
        dangerLevel: 'critical'
      },
      {
        mistake: 'Starting work based on an inbox message before an official order is placed.',
        fix: 'Always wait until an official order with an active countdown timer is placed.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Download the Fiverr mobile app immediately to get real-time notifications for new messages and active orders.',
      'Always keep your profile active and set your online status to "Available" when you are working.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452317-How-Fiverr-works',
    faq: [
      {
        question: 'Is it free to create a Fiverr seller account and post Gigs?',
        answer: 'Yes, joining Fiverr and creating Gigs is 100% free. Fiverr only charges its 20% service commission when you successfully complete an order.'
      }
    ],
    relatedGuideIds: ['account-setup', 'freelancer-profile', 'seller-dashboard']
  },
  {
    id: 'account-setup',
    slug: 'account-setup',
    title: 'Account Registration, 2FA & Security Verification',
    shortTitle: 'Account & Login',
    category: 'account',
    categoryName: 'Account & Security',
    iconName: 'ShieldCheck',
    description: 'Step-by-step walkthrough to register your account, verify email & phone numbers, enable Two-Factor Authentication, and configure security preferences.',
    readTime: '8 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'How to register with a clean professional email address',
      'Setting up a secure alphanumeric password and phone verification',
      'Activating Two-Factor Authentication (2FA) via SMS or Authenticator App',
      'Configuring security questions to prevent account takeover'
    ],
    steps: [
      {
        id: 'acc-step-1',
        stepNumber: 1,
        title: 'Initiate Registration on Fiverr',
        actionSummary: 'Open Fiverr and start the sign-up workflow with a professional email.',
        where: 'fiverr.com homepage top right',
        whatToSelect: 'Click "Join" or "Sign In > Continue with Email"',
        whatToWrite: 'Your dedicated professional business email address.',
        why: 'Using a dedicated business email ensures all client notifications and financial alerts remain organized in one place.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Choose a permanent email address you will never lose access to.',
          'You can also register using Google or Apple authentication.'
        ],
        uiIndicator: {
          elementName: 'Join Button',
          buttonColor: 'Green pill',
          locationDesc: 'Upper right header navigation'
        }
      },
      {
        id: 'acc-step-2',
        stepNumber: 2,
        title: 'Choose a Professional Username',
        actionSummary: 'Pick a clean, memorable, and permanent username.',
        where: 'Account Registration Screen',
        whatToSelect: 'Username Input Field',
        whatToWrite: 'e.g. "alex_dev", "sarah_studio", "codecraft_labs", "designer_maya"',
        why: 'Your username forms your permanent Fiverr URL (fiverr.com/your_username). Usernames CANNOT be changed later once created.',
        device: 'all',
        deviceAvailability: 'available',
        warnings: [
          'Choose wisely: Fiverr does not allow username renaming without closing the entire account.'
        ],
        tips: [
          'Avoid numbers or arbitrary symbols like "user987654". Keep it concise and brand-focused.'
        ]
      },
      {
        id: 'acc-step-3',
        stepNumber: 3,
        title: 'Verify Your Email Address',
        actionSummary: 'Click the activation link in your inbox.',
        where: 'Your Email Inbox',
        whatToSelect: 'Open email from Fiverr > Click "Activate Your Account"',
        why: 'Unverified accounts cannot publish Gigs, send custom offers, or withdraw earnings.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Check Spam or Updates folders if the activation link does not arrive within 60 seconds.'
        ]
      },
      {
        id: 'acc-step-4',
        stepNumber: 4,
        title: 'Enable Two-Factor Authentication (2FA) & Phone Verification',
        actionSummary: 'Protect your account against phishing and unauthorized logins.',
        where: 'Profile Avatar > Settings > Security Tab',
        whatToSelect: 'Phone Verification > Verify Now & Toggle Two-Factor Authentication "ON"',
        whatToWrite: 'Your active mobile number and enter the 4-digit SMS OTP.',
        why: '2FA requires an OTP code whenever a login attempt is made from a new browser or IP address, blocking hackers from taking over your seller balance.',
        device: 'desktop_recommended',
        deviceAvailability: 'available',
        tips: [
          'Set a memorable Security Question (e.g. "What was your childhood nickname?") — you will need this when changing financial payout details.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using a temporary or disposable email address.',
        fix: 'Always use your primary personal or business email.',
        dangerLevel: 'critical'
      },
      {
        mistake: 'Skipping phone verification until trying to publish a Gig.',
        fix: 'Verify your phone number immediately after registration to prevent publishing blockers.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'Store your security question answer and login password in a secure password manager.',
      'Check "Connected Devices" in the Security tab regularly to log out any old sessions.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452677-Setting-up-your-account',
    faq: [
      {
        question: 'Can I change my Fiverr username after signing up?',
        answer: 'No, usernames are permanent. However, Fiverr now allows you to set a custom "Display Name" (e.g. "Alex M. - Full Stack Lead") which is what buyers will see across all your Gigs and messages.'
      }
    ],
    relatedGuideIds: ['fiverr-basics', 'freelancer-profile', 'security-center']
  },
  {
    id: 'freelancer-profile',
    slug: 'freelancer-profile',
    title: 'Freelancer Profile Architecture & Optimization',
    shortTitle: 'Freelancer Profile',
    category: 'profile',
    categoryName: 'Profile Architecture',
    iconName: 'User',
    description: 'Construct a trustworthy profile with high-converting headshots, a compelling storytelling bio, verified skill badges, language proficiencies, and education.',
    readTime: '9 min read',
    difficulty: 'beginner',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'Selecting and cropping a professional, high-contrast profile photo',
      'Crafting an authoritative Display Name and 1-line professional tagline',
      'Structuring a 3-paragraph high-converting "About Me" bio',
      'Adding verified skill tags, languages, and linked accounts'
    ],
    steps: [
      {
        id: 'prof-step-1',
        stepNumber: 1,
        title: 'Upload a Professional Profile Picture',
        actionSummary: 'Upload a clear, front-facing, well-lit photo of your real face.',
        where: 'Profile Page > Camera Icon over Avatar Placeholder',
        whatToSelect: 'Upload Photo (High resolution square, minimum 600x600px)',
        why: 'Fiverr marketplace studies show profiles with authentic, smiling, high-contrast face photos convert up to 35% higher than cartoon avatars or generic graphics.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Use a clean, uncluttered background with good natural lighting.',
          'If you are an agency, you may use a clean, sharp brand logo instead.'
        ],
        warnings: [
          'Do NOT use photos of celebrities, copyrighted stock models, or AI-generated deepfake faces.'
        ]
      },
      {
        id: 'prof-step-2',
        stepNumber: 2,
        title: 'Set Your Professional Tagline / Story Title',
        actionSummary: 'Summarize your core specialty in one concise, punchy sentence.',
        where: 'Profile Page > Pencil Icon below Display Name',
        whatToSelect: 'Edit Storyline / Tagline input',
        whatToWrite: 'e.g., "Full-Stack Web Architect & Modern UI/UX Specialist" or "Senior Logo Designer & Brand Strategist"',
        why: 'This line appears immediately below your name across the entire platform and sets client expectations.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Keep it under 70 characters and highlight the specific business outcome you deliver.'
        ]
      },
      {
        id: 'prof-step-3',
        stepNumber: 3,
        title: 'Write a 3-Paragraph High-Converting Bio ("About Me")',
        actionSummary: 'Follow the proven Hook -> Credibility -> Call-to-Action formula.',
        where: 'Profile Page > Description Section > Edit Description',
        whatToSelect: 'Description text area',
        whatToWrite: `Paragraph 1 (Hook & Core Value): "Hi! I am a full-stack web engineer with over 5 years of experience crafting modern, conversion-focused web applications."\n\nParagraph 2 (Skills & Workflow): "I specialize in React, Next.js, Node.js, and clean UI engineering. I follow clean code architecture, ensuring your application is blazing fast, SEO-friendly, and mobile responsive."\n\nParagraph 3 (Call to Action): "Whether you need a new landing page from scratch or dynamic feature development, feel free to send me a message to discuss your project!"`,
        why: 'Clients want to know who you are, what problems you solve, and why they should trust you over competitors.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'Use correct punctuation, paragraph breaks, and bullet-friendly formatting.'
        ]
      },
      {
        id: 'prof-step-4',
        stepNumber: 4,
        title: 'Add Skills, Languages, & Linked Accounts',
        actionSummary: 'Tag your exact proficiencies and connect verified accounts.',
        where: 'Profile Page > Skills & Languages Sections',
        whatToSelect: 'Add New Skill > Select Skill Name & Proficiency Level ("Expert")',
        whatToWrite: 'Add 10–15 relevant skills (e.g. "React", "TypeScript", "Tailwind CSS", "REST APIs", "Figma to Code").',
        why: 'Fiverr search indexing matches buyer search queries with your tagged profile skills.',
        device: 'desktop_recommended',
        deviceAvailability: 'available',
        tips: [
          'Always set English to "Fluent" or "Native/Bilingual" if you can communicate comfortably with international buyers.',
          'Link GitHub, Google, or Dribbble accounts to boost profile trust score.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving the bio empty or writing generic 1-liners like "I am a hard worker".',
        fix: 'Structure a detailed 3-paragraph bio highlighting tools, benefits, and client outcomes.',
        dangerLevel: 'high'
      },
      {
        mistake: 'Listing dozens of unrelated skills (e.g. Web Dev + Voiceover + Video Editing + Legal Writing).',
        fix: 'Specialize in 1 or 2 complementary domains to look like a true authority.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'Review top-rated sellers in your niche to see how they structure their taglines and skill tags.',
      'Take free Fiverr skill tests when available to display verified skill badges on your profile.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010560118-Managing-your-profile',
    faq: [
      {
        question: 'Can I change my profile picture and description later?',
        answer: 'Yes! You can edit your profile photo, tagline, description, skills, and languages at any time without disrupting your active Gigs.'
      }
    ],
    relatedGuideIds: ['account-setup', 'gig-creation', 'gig-seo']
  },
  {
    id: 'seller-dashboard',
    slug: 'seller-dashboard',
    title: 'Seller Dashboard & Performance Metrics Navigation',
    shortTitle: 'Dashboard & Levels',
    category: 'dashboard',
    categoryName: 'Dashboard & Metrics',
    iconName: 'LayoutDashboard',
    description: 'Master the seller dashboard metrics: Response Rate, Order Completion, On-Time Delivery, Success Score, and the seller level progression criteria.',
    readTime: '7 min read',
    difficulty: 'intermediate',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'Understanding the 4 critical performance indicators on your dashboard',
      'How the 1-hour Response Time metric is calculated and maintained',
      'The impact of order cancellations on your Order Completion Rate',
      'How the Success Score evaluates client satisfaction and repeat business'
    ],
    steps: [
      {
        id: 'dash-step-1',
        stepNumber: 1,
        title: 'Understand Response Rate & Response Time',
        actionSummary: 'Maintain a 100% response rate by replying to first-time buyer inquiries within 1 hour.',
        where: 'Seller Dashboard Top Metric Bar',
        whatToSelect: 'Response Rate Widget',
        why: 'Response rate tracks the percentage of new incoming buyer messages you reply to within 24 hours. Response time measures your average speed.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Only the FIRST message of a new conversation affects the Response Rate metric.',
          'Subsequent back-and-forth messages in an existing thread do not count against this specific metric, but fast communication is always best.'
        ],
        warnings: [
          'Letting a new inquiry sit unanswered for over 24 hours will drop your response rate and demote your search ranking.'
        ]
      },
      {
        id: 'dash-step-2',
        stepNumber: 2,
        title: 'Track Order Completion & On-Time Delivery',
        actionSummary: 'Ensure all accepted orders are delivered before the deadline without cancellations.',
        where: 'Dashboard > Active Orders & Analytics',
        whatToSelect: 'On-Time Delivery Rate Percentage',
        why: 'Delivering even 1 minute after the countdown timer reaches 00:00:00 marks the order "Late" and damages your On-Time Delivery score.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'If you need more time due to client delays or extra features, use the Resolution Center to mutually request a delivery extension BEFORE the timer expires.'
        ]
      },
      {
        id: 'dash-step-3',
        stepNumber: 3,
        title: 'Monitor Your Success Score & Seller Level Progression',
        actionSummary: 'Review your comprehensive seller score and progression towards Level 1, 2, and Top Rated.',
        where: 'Fiverr Top Bar > Analytics > Growth & Level Overview',
        whatToSelect: 'Success Score Breakdown',
        why: 'Fiverr uses a 1–10 Success Score that evaluates order quality, client communication, cancellation history, and conflict prevention.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'A Success Score of 7–10 is the green healthy zone.',
          'Scores below 5 can restrict your ability to create new Gigs or qualify for Promoted Gigs.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Letting an active order timer expire into "Late" status while still working on files.',
        fix: 'Submit a 24-hour extension request via the Resolution Center before the timer runs out.',
        dangerLevel: 'high'
      },
      {
        mistake: 'Cancelling orders through customer support instead of resolving requirements with the buyer.',
        fix: 'Mutual cancellations should be an absolute last resort to preserve your completion rate.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'Set up mobile push notifications and email alerts so you never miss an urgent client message.',
      'Check your dashboard analytics every Monday morning to review weekly impression shifts.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010560118-Understanding-your-metrics',
    faq: [
      {
        question: 'Does messaging spam accounts count towards my response rate?',
        answer: 'If you receive a spam/phishing message, click "Report / Mark as Spam" instead of replying. Reporting spam automatically preserves your response rate without penalizing you.'
      }
    ],
    relatedGuideIds: ['fiverr-basics', 'orders-workflow', 'analytics-demo']
  },
  {
    id: 'gig-overview',
    slug: 'gig-overview',
    title: 'Fiverr Gig Architecture & Anatomy',
    shortTitle: 'Gig Overview',
    category: 'gig',
    categoryName: 'Gig Architecture',
    iconName: 'Layers',
    description: 'An in-depth breakdown of what constitutes a high-performing Fiverr Gig: Title, Search Tags, 3-Tier Packages, Rich Descriptions, FAQs, Requirements, and Gallery media.',
    readTime: '8 min read',
    difficulty: 'beginner',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'The 6 structural tabs that form every Fiverr Gig',
      'What buyers see on the search results card vs the full Gig page',
      'The role of search tags, metadata, and category selection',
      'How to organize your service into logical deliverables'
    ],
    steps: [
      {
        id: 'go-step-1',
        stepNumber: 1,
        title: 'Understand the 6 Tabs of the Gig Creation Wizard',
        actionSummary: 'Familiarize yourself with the 6 mandatory stages of publishing a Gig.',
        where: 'My Business > Gigs > "Create a New Gig"',
        whatToSelect: 'The 6 Step Header Bar',
        why: 'Every Gig is composed of: 1. Overview, 2. Pricing & Scope, 3. Description & FAQ, 4. Requirements, 5. Gallery, 6. Publish.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'All 6 tabs must be completed sequentially on desktop before publishing.',
          'You can save your progress as a "Draft" at any step and resume later.'
        ]
      },
      {
        id: 'go-step-2',
        stepNumber: 2,
        title: 'Anatomy of the Search Result Card',
        actionSummary: 'Learn the 4 elements that drive buyer click-through rate (CTR) in search.',
        where: 'Fiverr Category & Search Results Grid',
        whatToSelect: 'Any sample Gig Card in search',
        why: 'In search results, buyers only see: 1. Cover Image Thumbnail, 2. Gig Title, 3. Seller Level & Star Rating, 4. "Starting at $X" price.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Your Gig cover image is 70% of the reason a buyer clicks your listing over competitors.',
          'Keep your cover image uncluttered, high contrast, and easy to read on mobile screens.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Putting too much tiny text on the Gig cover image.',
        fix: 'Use 3–5 bold keywords at large font size so it remains legible on mobile search feeds.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'Before creating your Gig, search your main keyword on Fiverr and study the top 10 ranked sellers in that niche.',
      'Note their package breakdowns, pricing anchors, and gallery visual styles.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010451397-Creating-a-Gig',
    faq: [
      {
        question: 'How many Gigs can a New Seller have active simultaneously?',
        answer: 'A New Seller can create up to 7 active Gigs. Level 1 sellers can have 10, Level 2 can have 20, and Top Rated sellers can have up to 30 active Gigs.'
      }
    ],
    relatedGuideIds: ['gig-creation', 'gig-seo', 'pricing-packages']
  },
  {
    id: 'gig-creation',
    slug: 'gig-creation',
    title: 'How to Create and Publish Your First Gig (6-Step Guide)',
    shortTitle: 'Gig Creation',
    category: 'gig-creation',
    categoryName: 'Gig Creation',
    iconName: 'PlusCircle',
    description: 'A complete step-by-step walkthrough covering every single input field across all 6 Gig creation tabs: Title, Packages, Description, Requirements, Media, and Tax Form Verification.',
    readTime: '12 min read',
    difficulty: 'beginner',
    primaryDevice: 'desktop_required',
    whatYouWillLearn: [
      'Tab 1 Overview: Writing a strong title, selecting category/subcategory, and picking 5 search tags',
      'Tab 2 Pricing: Creating Basic, Standard, and Premium packages with delivery days and revision limits',
      'Tab 3 Description & FAQ: Adding a formatted description and at least 3 high-value FAQs',
      'Tab 4 Requirements: Asking clear, mandatory client questions before work begins',
      'Tab 5 Gallery: Uploading 1280x769px images, video showcase, and PDF portfolio samples',
      'Tab 6 Publish: Completing W-9/W-8BEN tax verification and publishing live'
    ],
    steps: [
      {
        id: 'gc-step-1',
        stepNumber: 1,
        title: 'Tab 1: Gig Overview (Title, Category, Search Tags)',
        actionSummary: 'Define your core service with laser-targeted keywords.',
        where: 'Gig Creation Wizard > Tab 1: Overview',
        whatToSelect: 'Category dropdown, Subcategory dropdown, and 5 Search Tags',
        whatToWrite: 'Title: "I will design and code a responsive modern landing page in React"\nTags: "landing page", "react developer", "responsive design", "tailwind css", "frontend"',
        why: 'The Gig title and search tags form the primary ranking signals in the Fiverr search algorithm.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Your title automatically starts with "I will". Keep the rest under 60 characters for maximum SEO impact.',
          'Always use all 5 search tag slots.'
        ],
        warnings: [
          'Once published, your initial title becomes your permanent Gig URL slug. Make sure it contains your main keywords from day one.'
        ]
      },
      {
        id: 'gc-step-2',
        stepNumber: 2,
        title: 'Tab 2: Scope & Pricing (3-Tier Packages)',
        actionSummary: 'Set up Basic, Standard, and Premium packages with clear value progression.',
        where: 'Gig Creation Wizard > Tab 2: Pricing',
        whatToSelect: 'Toggle "3 Packages" switch to ON',
        whatToWrite: 'Basic ($40, 2 days, 2 revisions): 1 Section starter\nStandard ($110, 4 days, 4 revisions): 5-page full landing page\nPremium ($250, 7 days, unlimited revisions): Complete full-stack web application with API integration',
        why: '3-tier packages give buyers choices and anchor them towards the middle Standard package, which usually drives the highest sales volume.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Offer fast-delivery Gig Extras (e.g. "Deliver in 24 hours for +$30") to increase average order value.'
        ]
      },
      {
        id: 'gc-step-3',
        stepNumber: 3,
        title: 'Tab 3: Description & FAQ',
        actionSummary: 'Write a persuasive description and pre-answer client concerns.',
        where: 'Gig Creation Wizard > Tab 3: Description & FAQ',
        whatToSelect: 'Add Description & "Add FAQ" button',
        whatToWrite: 'Bullet points highlighting: 1. Core benefits, 2. What is included, 3. Why choose you, 4. Step-by-step workflow, 5. Call to action to message first.',
        why: 'Clear descriptions set boundaries, prevent disputes, and rank for long-tail search terms.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Add at least 3–5 FAQs answering common questions about revisions, source files, and requirements.'
        ]
      },
      {
        id: 'gc-step-4',
        stepNumber: 4,
        title: 'Tab 4: Buyer Requirements (Mandatory Questions)',
        actionSummary: 'Collect everything needed before the active order timer begins.',
        where: 'Gig Creation Wizard > Tab 4: Requirements',
        whatToSelect: '"Add a Question" > Check "Answer is Mandatory"',
        whatToWrite: 'Q1: "Please provide your project wireframes, brand colors, and logo."\nQ2: "What is your target audience and core business goal?"\nQ3: "Any reference website links you admire?"',
        why: 'The active countdown timer will NOT start until the buyer fills out and submits these mandatory requirements, protecting your on-time delivery rate.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Choose "Free Text" or "Attachment" response types depending on the asset.'
        ]
      },
      {
        id: 'gc-step-5',
        stepNumber: 5,
        title: 'Tab 5: Gallery & Media Uploads',
        actionSummary: 'Upload high-resolution 1280x769px images, portfolio video, and PDFs.',
        where: 'Gig Creation Wizard > Tab 5: Gallery',
        whatToSelect: 'Drag & Drop up to 3 Gig Images (JPEG/PNG) + optional Video + 2 PDFs',
        why: 'High-quality visuals directly determine whether a buyer clicks your Gig in search results.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Standard recommended resolution is 1280 x 769 pixels (72 DPI, minimum 712 x 430px).',
          'Add an introductory video (up to 75 seconds) to boost conversion rates by up to 200%.'
        ],
        warnings: [
          'Never use watermarked stock images or someone else\'s copyrighted portfolio.'
        ]
      },
      {
        id: 'gc-step-6',
        stepNumber: 6,
        title: 'Tab 6: Tax Form Verification & Publish',
        actionSummary: 'Confirm tax residency status and make your Gig live on Fiverr search.',
        where: 'Gig Creation Wizard > Tab 6: Publish',
        whatToSelect: 'Answer "Are you a US person?" (W-9 for US, W-8BEN confirmation for Non-US) > Click "Publish Gig"',
        why: 'Fiverr is required by US tax law to collect tax declarations from all sellers worldwide before allowing live sales.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'If your category requires a basic English test, complete the 40-question multiple-choice test before publishing.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving Requirements optional, causing buyers to place orders without providing assets while the countdown timer runs.',
        fix: 'Always check the "Mandatory" box on your primary requirement questions.',
        dangerLevel: 'critical'
      },
      {
        mistake: 'Using low-resolution, blurry cover images below 712x430px.',
        fix: 'Design crisp 1280x769px graphics with large readable typography.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Share your newly published Gig link on LinkedIn, Twitter, and professional forums to drive initial traffic.',
      'Check your Gig status in "My Business > Gigs" to ensure it says "Active" and has no pending verification flags.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010451397-Creating-a-Gig',
    faq: [
      {
        question: 'How long does it take for a newly published Gig to appear in Fiverr search results?',
        answer: 'Newly published Gigs usually enter the Fiverr search index within 1 to 24 hours. You can test visibility by searching your exact Gig title in an incognito window.'
      }
    ],
    relatedGuideIds: ['gig-overview', 'gig-seo', 'pricing-packages', 'device-guide']
  },
  {
    id: 'gig-seo',
    slug: 'gig-seo',
    title: 'Gig SEO & Algorithmic Search Visibility',
    shortTitle: 'Gig SEO',
    category: 'gig-seo',
    categoryName: 'Gig SEO & Ranking',
    iconName: 'TrendingUp',
    description: 'Learn how the Fiverr search engine ranks Gigs: keyword research, Title-Tag alignment, keyword density in descriptions, permanent URL slugs, and CTR optimization.',
    readTime: '10 min read',
    difficulty: 'intermediate',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'How the Fiverr search algorithm (Fiverr AI Search & Neo) evaluates Gigs',
      'The permanent URL slug trick for maximum keyword density',
      'Selecting high-intent, low-competition search tags',
      'Optimizing Gig click-through rates (CTR) and conversion rates (CR)'
    ],
    steps: [
      {
        id: 'gseo-step-1',
        stepNumber: 1,
        title: 'Conduct High-Intent Keyword Research',
        actionSummary: 'Use the Fiverr search auto-suggest bar to discover what buyers are typing.',
        where: 'Fiverr Homepage Search Bar',
        whatToSelect: 'Type your broad skill (e.g. "landing page") and note the auto-complete dropdown phrases.',
        whatToWrite: 'Find 3–5 specific sub-keywords (e.g. "saas landing page", "react landing page", "tailwind landing page").',
        why: 'Auto-suggest phrases represent the exact search queries buyers are entering daily.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Look for keywords with between 500 and 3,000 competing services — high enough for real demand, low enough to rank quickly.'
        ]
      },
      {
        id: 'gseo-step-2',
        stepNumber: 2,
        title: 'The Permanent URL Slug Strategy',
        actionSummary: 'Pack your initial draft title with your 4 main keywords before publishing.',
        where: 'Tab 1: Overview Title Input on first creation',
        whatToSelect: 'Title field during initial draft creation',
        whatToWrite: 'Draft Title: "I will design react landing page modern responsive tailwind website"',
        why: 'Fiverr generates your permanent URL slug (e.g. fiverr.com/user/design-react-landing-page-modern-responsive-tailwind-website) only once when the draft is first saved. Even if you shorten your visible title later, the keyword-rich URL slug remains permanently indexed by search engines.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'After saving the draft, you can refine your visible title into a polished, readable sentence.'
        ]
      },
      {
        id: 'gseo-step-3',
        stepNumber: 3,
        title: 'Optimize Tag & Description Keyword Density',
        actionSummary: 'Naturally repeat your 2 primary keywords 3–4 times throughout your description.',
        where: 'Tab 3: Description Section',
        whatToSelect: 'Description text editor',
        why: 'Fiverr search crawlers index the frequency and natural context of keywords in your description, bullet points, and FAQ questions.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        warnings: [
          'Avoid "keyword stuffing" (repeating the exact same keyword 15 times). Fiverr will trigger a warning: "Your description contains excessive use of the word..."'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Targeting ultra-broad 1-word keywords like "Logo" or "Website" with 100,000+ competitors.',
        fix: 'Target 3-word long-tail keywords like "Minimalist SaaS Logo" or "Next.js Web Application".',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Name your gallery image files with your keywords before uploading (e.g. "modern-react-landing-page-designer.png") for image search indexing.',
      'Maintain continuous activity — logging in daily sends a positive freshness signal to Fiverr ranking algorithms.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010451397-Creating-a-Gig',
    faq: [
      {
        question: 'Does changing my Gig description hurt my current search ranking?',
        answer: 'Editing your Gig temporarily re-indexes it in search for 24–48 hours. If your Gig is already ranking on Page 1, avoid making drastic changes unless performance has dropped.'
      }
    ],
    relatedGuideIds: ['gig-creation', 'pricing-packages', 'client-search']
  },
  {
    id: 'pricing-packages',
    slug: 'pricing-packages',
    title: 'Pricing Strategy & 3-Tier Packages Architecture',
    shortTitle: 'Pricing & Packages',
    category: 'pricing',
    categoryName: 'Pricing & Packages',
    iconName: 'DollarSign',
    description: 'Master value anchoring across Basic, Standard, and Premium packages. Learn how to configure Gig Extras, commercial licensing, fast delivery add-ons, and milestone billing for $100+ projects.',
    readTime: '8 min read',
    difficulty: 'intermediate',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'How to structure the Basic, Standard, and Premium 3-tier matrix',
      'The "Decoy / Anchor" psychological pricing model to drive Standard package sales',
      'Configuring Gig Extras for fast delivery, extra revisions, and source files',
      'Breaking large projects into phased milestone payments ($100+)'
    ],
    steps: [
      {
        id: 'pp-step-1',
        stepNumber: 1,
        title: 'Structure the 3-Tier Package Ladder',
        actionSummary: 'Define clear scope distinctions so buyers naturally gravitate toward the middle tier.',
        where: 'Gig Creation > Tab 2: Scope & Pricing Table',
        whatToSelect: 'Package Columns: Basic, Standard, Premium',
        whatToWrite: 'Basic ($35): Entry-level teaser scope (e.g. 1 section or bug fix)\nStandard ($95): Complete mainstream solution (e.g. 5-section full landing page)\nPremium ($220): VIP comprehensive package (full web app + deployment + 30-day support)',
        why: 'Setting a limited Basic package anchors the value, making the Standard package look like the best return on investment.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required',
        tips: [
          'Name your packages creatively (e.g. "Essential Kickstart", "Pro Business Growth", "Enterprise VIP Solution").'
        ]
      },
      {
        id: 'pp-step-2',
        stepNumber: 2,
        title: 'Configure High-Margin Gig Extras',
        actionSummary: 'Add optional add-on checkboxes that increase your average order value.',
        where: 'Scope & Pricing Tab > Add Gig Extras Section',
        whatToSelect: 'Checkboxes for "Extra Fast Delivery", "Additional Revisions", "Source Files", "Commercial Use License"',
        whatToWrite: 'Extra Fast: "Deliver 2 days faster for +$35"\nSource Code: "Full editable source files for +$25"',
        why: 'Over 30% of buyers select at least one Gig Extra during checkout, substantially increasing your revenue per client.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required'
      },
      {
        id: 'pp-step-3',
        stepNumber: 3,
        title: 'Use Milestone Payments for $100+ Custom Projects',
        actionSummary: 'Break large complex contracts into up to 6 funded milestone phases.',
        where: 'Inbox Chat > Create Custom Offer > Milestone Mode',
        whatToSelect: 'Select "Milestones" toggle during Custom Offer creation',
        whatToWrite: 'Milestone 1 ($80): UI Wireframes & Architecture\nMilestone 2 ($120): Frontend Development\nMilestone 3 ($100): API Integration & Final Deployment',
        why: 'Milestones lower client purchasing friction by allowing them to fund and approve work incrementally, while ensuring you get paid as each phase finishes.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'Minimum milestone amount on Fiverr is $50 per milestone phase.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Underpricing your service at $5 for an entire week of work.',
        fix: 'Price realistically reflecting your skill level, starting at $25–$50 for clean entry-level packages.',
        dangerLevel: 'medium'
      },
      {
        mistake: 'Offering "Unlimited Revisions" on your lowest-priced Basic package.',
        fix: 'Limit Basic to 1–2 revisions and reserve generous revisions for Premium packages.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Gradually increase your package prices by 15–20% every time you accumulate 5 new five-star reviews.',
      'Always clearly list what is NOT included in the Basic package to prevent scope misunderstandings.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010451397-Pricing-your-Gig',
    faq: [
      {
        question: 'Can I change my Gig prices after having active orders?',
        answer: 'Yes! Changing your Gig prices does not affect existing active orders. Only new incoming orders and future custom offers will use the updated pricing.'
      }
    ],
    relatedGuideIds: ['gig-creation', 'client-communication', 'orders-workflow']
  },
  {
    id: 'client-search',
    slug: 'client-search',
    title: 'Client Acquisition & Matching Briefs System',
    shortTitle: 'Client Search',
    category: 'clients',
    categoryName: 'Client Acquisition',
    iconName: 'UserCheck',
    description: 'Learn how buyers find you, how to configure notification filters for "Get Briefs" (the replacement for Buyer Requests), and external promotion channels to kickstart impressions.',
    readTime: '7 min read',
    difficulty: 'intermediate',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'How the Fiverr algorithmic matching engine connects buyers with relevant sellers',
      'Configuring the "Get Briefs" feature with minimum budget thresholds',
      'How to evaluate incoming briefs and submit compelling custom proposals',
      'Off-platform promotional strategies (LinkedIn, GitHub, Behance) to drive initial clicks'
    ],
    steps: [
      {
        id: 'cs-step-1',
        stepNumber: 1,
        title: 'Configure "Get Briefs" Seller Matching Preferences',
        actionSummary: 'Set your minimum budget threshold to receive AI-matched project leads.',
        where: 'Seller Dashboard > My Business > Gigs > "Get Briefs" Toggle',
        whatToSelect: 'Toggle "Get Briefs" to ON > Set Minimum Opportunity Rate (e.g. $50+)',
        why: 'Fiverr analyzes buyer project briefs and automatically pushes tailored opportunity notifications to matching sellers who have this feature enabled.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Set a realistic minimum rate (e.g. $30–$50 for beginners) so you receive a healthy stream of matching notifications.'
        ]
      },
      {
        id: 'cs-step-2',
        stepNumber: 2,
        title: 'Responding to a Matching Brief Notification',
        actionSummary: 'Submit a personalized proposal immediately when a matching brief arrives.',
        where: 'Notification Bell or Mobile Push Notification > "You have a new matching brief"',
        whatToSelect: 'Open Brief > Click "Create an Offer"',
        whatToWrite: 'Personalized 3-sentence proposal explaining how you solve their exact requirement, with timeline and price.',
        why: 'Buyers often review the first 5 proposals submitted; fast responses increase conversion chances dramatically.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Never copy-paste generic boilerplate text. Reference specific details from the buyer\'s brief.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving "Get Briefs" minimum budget set at $1,000 as a brand-new seller.',
        fix: 'Start with a lower threshold ($30–$50) to build initial momentum and review count.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'Embed your Fiverr Gig link in your personal portfolio website, GitHub repositories, and LinkedIn profile banner.',
      'External traffic clicks give a strong positive boost to your Gig ranking algorithm on Fiverr.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/4410860586001-Matching-Briefs',
    faq: [
      {
        question: 'What happened to the old "Buyer Requests" section on Fiverr?',
        answer: 'Fiverr replaced the legacy manual "Buyer Requests" page with the automated "Get Briefs" matching engine, which matches project briefs directly to sellers based on Gig keywords and ratings.'
      }
    ],
    relatedGuideIds: ['client-communication', 'gig-seo', 'seller-dashboard']
  },
  {
    id: 'client-communication',
    slug: 'client-communication',
    title: 'Client Communication, Inbox Etiquette & Custom Offers',
    shortTitle: 'Communication',
    category: 'communication',
    categoryName: 'Client Communication',
    iconName: 'MessageSquare',
    description: 'Master professional inbox interactions: sub-1-hour response times, qualifying client requirements, scope boundaries, generating Custom Offers in chat, and avoiding forbidden words.',
    readTime: '9 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'The 5-stage conversation flow from initial inquiry to booked order',
      'The essential client qualification questionnaire template',
      'How to create and send a Custom Offer directly inside chat',
      'Forbidden terms and keywords that trigger automated Fiverr policy warnings'
    ],
    steps: [
      {
        id: 'cc-step-1',
        stepNumber: 1,
        title: 'The 5-Stage Client Conversation Flow',
        actionSummary: 'Follow the proven sequence to convert chats into funded orders.',
        where: 'Fiverr Inbox Message Thread',
        whatToSelect: 'Active Client Conversation',
        whatToWrite: 'Stage 1: Warm greeting & appreciation -> Stage 2: Clarifying questions -> Stage 3: Scope & deliverable confirmation -> Stage 4: Timeline & price agreement -> Stage 5: Send Custom Offer button.',
        why: 'A structured conversation flow establishes trust, removes ambiguity, and prevents post-order disputes.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Use Quick Responses (templates saved in the lightning bolt icon in chat) to reply within seconds from mobile.'
        ]
      },
      {
        id: 'cc-step-2',
        stepNumber: 2,
        title: 'Qualify Project Scope with Clarifying Questions',
        actionSummary: 'Never send an offer until you know the exact deliverables.',
        where: 'Chat Message Input',
        whatToWrite: `"Hello [Name]! Thank you for reaching out. I would be happy to help you with this project.\n\nTo ensure we hit your exact goals:\n1. Do you have existing design files or wireframes ready?\n2. What is your preferred delivery deadline?\n3. Any specific third-party integrations needed?\n\nOnce confirmed, I will send over a custom proposal!"`,
        why: 'Vague requirements lead to misunderstandings, late deliveries, and negative reviews.',
        device: 'all',
        deviceAvailability: 'available'
      },
      {
        id: 'cc-step-3',
        stepNumber: 3,
        title: 'Create and Send a Custom Offer',
        actionSummary: 'Package the agreed scope into an official order proposal button in chat.',
        where: 'Bottom of Inbox Conversation > "Create an Offer" Button',
        whatToSelect: 'Select Relevant Gig > Choose Single Payment or Milestones > Set Price, Delivery Days, Revisions & Exact Description',
        whatToWrite: 'Detailed bullet list of exactly what is included in this custom order.',
        why: 'Custom Offers allow buyers to purchase with 1 click directly from the message thread.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Check the "Expiration" option (e.g. offer expires in 3 days) to create gentle urgency.'
        ]
      },
      {
        id: 'cc-step-4',
        stepNumber: 4,
        title: 'Avoid Forbidden Terms & Off-Platform Keywords',
        actionSummary: 'Strictly avoid sharing contact information or alternative payment methods.',
        where: 'Chat Messages & Attachment Names',
        why: 'Fiverr automated bots monitor all messages. Using forbidden words triggers immediate account flags or permanent bans.',
        device: 'all',
        deviceAvailability: 'available',
        warnings: [
          'NEVER use words like: "WhatsApp", "Phone number", "Skype", "Telegram", "Email", "PayPal outside", "Bank transfer direct", "Zoom call" (unless Fiverr approved).'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Agreeing to a client\'s vague message like "Build me an app" without qualifying the scope first.',
        fix: 'Always ask clarifying questions before sending a Custom Offer.',
        dangerLevel: 'high'
      },
      {
        mistake: 'Sharing your personal email or phone number because a client asked to "talk quickly".',
        fix: 'Politely inform the buyer that all communication must stay on Fiverr per platform Terms of Service.',
        dangerLevel: 'critical'
      }
    ],
    proTips: [
      'Install the Fiverr app on your smartphone to reply to messages while away from your desk.',
      'Save 3–5 Quick Response templates for your most common greetings and FAQ replies.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452777-Using-the-Inbox',
    faq: [
      {
        question: 'Are video calls allowed on Fiverr?',
        answer: 'Fiverr has an integrated official Zoom call feature available directly inside qualifying inbox conversations and active orders. You must use the built-in Fiverr Zoom tool and never share external meeting links.'
      }
    ],
    relatedGuideIds: ['client-search', 'orders-workflow', 'security-center']
  },
  {
    id: 'orders-workflow',
    slug: 'orders-workflow',
    title: 'Order Management, Timers & Active Workflow Execution',
    shortTitle: 'Orders Management',
    category: 'orders',
    categoryName: 'Order Execution',
    iconName: 'PackageCheck',
    description: 'Understand the complete order lifecycle: when the countdown timer triggers, verifying requirement submissions, milestone deadlines, requesting delivery extensions, and managing order activity logs.',
    readTime: '9 min read',
    difficulty: 'intermediate',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'The 5 official stages of an active Fiverr order',
      'How the countdown timer operates and what triggers "Incomplete" status',
      'Using the Resolution Center to request delivery date extensions legitimately',
      'Maintaining clear progress communication to prevent buyer anxiety'
    ],
    steps: [
      {
        id: 'ow-step-1',
        stepNumber: 1,
        title: 'Understand the Order Status Flow',
        actionSummary: 'Follow the status badge from "Incomplete" to "In Progress" to "Delivered".',
        where: 'Top Navigation > My Business > Orders Page',
        whatToSelect: 'Active Order Details Page',
        why: 'When a buyer purchases a Gig, the order starts as "Incomplete" until the buyer fills out your mandatory requirements. Once submitted, status becomes "In Progress" and the countdown timer begins ticking.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'If an order is "Incomplete (Waiting for Requirements)", the delivery countdown timer has NOT started yet, so you are not losing delivery time.'
        ]
      },
      {
        id: 'ow-step-2',
        stepNumber: 2,
        title: 'Verify Buyer Requirement Submission',
        actionSummary: 'Check that all necessary files, credentials, and answers are complete.',
        where: 'Active Order Page > Requirements Tab',
        whatToSelect: 'Review Submitted Answers',
        why: 'If a buyer submits incomplete requirements or an empty text like "will send later", immediately message them in the order chat asking for the assets.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'If the buyer delays sending critical assets, submit a delivery extension request via the Resolution Center before the timer runs low.'
        ]
      },
      {
        id: 'ow-step-3',
        stepNumber: 3,
        title: 'Request a Delivery Extension via Resolution Center',
        actionSummary: 'Add extra days to the countdown timer with mutual buyer agreement.',
        where: 'Active Order Page > Right Sidebar > "Resolution Center"',
        whatToSelect: 'Select "Extend the delivery date" > Choose Number of Days & Reason (e.g. "Buyer asked for extra features" or "Waiting on feedback")',
        why: 'Submitting an official extension pauses the countdown penalty as long as the buyer accepts the request.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'Always communicate with the buyer in chat FIRST and get their agreement before submitting the formal Resolution Center extension.'
        ],
        warnings: [
          'Never let the countdown timer reach 00:00:00 without submitting an extension or delivering the work.'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Waiting until 10 minutes before the deadline to ask for a 3-day extension.',
        fix: 'Submit extension requests at least 24 hours in advance so the buyer has time to click Accept.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Send a mid-project progress update halfway through the order timeline (e.g. "Work is 50% complete, on track for tomorrow\'s delivery!").',
      'Proactive updates eliminate buyer anxiety and prevent premature cancellation requests.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452897-Managing-your-orders',
    faq: [
      {
        question: 'What happens if a buyer does not submit the requirements for weeks?',
        answer: 'The order will stay in "Incomplete" status indefinitely without penalizing your delivery timer. You can message the buyer gently or contact Fiverr Customer Support to cancel if the buyer is unreachable.'
      }
    ],
    relatedGuideIds: ['delivery-guide', 'revisions-management', 'seller-dashboard']
  },
  {
    id: 'delivery-guide',
    slug: 'delivery-guide',
    title: 'Order Delivery Blueprint, Watermarks & Source Files',
    shortTitle: 'Delivery Guide',
    category: 'delivery',
    categoryName: 'Delivery Blueprint',
    iconName: 'Send',
    description: 'Learn the exact professional workflow to deliver finished work: using the official "Deliver Now" button, message copywriting templates, watermark protection, and zip archive standards.',
    readTime: '8 min read',
    difficulty: 'beginner',
    primaryDevice: 'desktop_recommended',
    whatYouWillLearn: [
      'How to properly deliver using the official "Deliver Work" modal',
      'A high-converting, professional delivery message template',
      'Protecting graphic and design files with Fiverr\'s automated watermarking tool',
      'Proper file naming and zip packaging standards for source code and assets'
    ],
    steps: [
      {
        id: 'del-step-1',
        stepNumber: 1,
        title: 'Click the Official "Deliver Now" Button',
        actionSummary: 'Never send final work as a casual chat attachment — always use the official delivery portal.',
        where: 'Active Order Page > Top Green Banner / Bottom Action Bar',
        whatToSelect: 'Click "Deliver Now" or "Deliver Work"',
        why: 'Only deliveries sent through the official "Deliver Now" button stop the active countdown timer and initiate the 3-day buyer review period.',
        device: 'desktop_recommended',
        deviceAvailability: 'available',
        warnings: [
          'Attaching files in regular order chat does NOT stop the delivery timer. You MUST use the official "Deliver Now" button.'
        ]
      },
      {
        id: 'del-step-2',
        stepNumber: 2,
        title: 'Upload Final Deliverables & Source Archives',
        actionSummary: 'Attach organized, clearly named files (up to 5GB per upload).',
        where: 'Delivery Modal > "Upload Work" Button',
        whatToSelect: 'Select final assets, PDFs, and .ZIP source code archives',
        why: 'Organized files with descriptive names (e.g. "Project_Final_Source_Code_v1.zip") build professionalism and prevent revision confusion.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'For graphic design Gigs, enable "Watermark on Delivery" in your Gig settings to protect preview images until the buyer completes the order.'
        ]
      },
      {
        id: 'del-step-3',
        stepNumber: 3,
        title: 'Write a Professional Delivery Message',
        actionSummary: 'Use a clear, encouraging template explaining how to view the files.',
        where: 'Delivery Modal > "Describe your delivery in detail" Textarea',
        whatToWrite: `Hi [Buyer Name]!

I am excited to deliver your completed [Service/Project Name] ahead of schedule!

What is included in this delivery:
• [Deliverable 1 with brief description]
• [Deliverable 2 with brief description]
• Full source code and documentation archive

Please download and review the attached assets. If you need any minor tweaks or adjustments, simply click "Request a Revision" and I will gladly take care of it for you.

If everything looks great, please feel free to complete the order. It has been an absolute pleasure working with you!

Best regards,
[Your Name]`,
        why: 'A polite, structured message guides the buyer smoothly and sets up positive review sentiment.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Never beg or pressure the buyer for a 5-star review in the delivery note (this violates Fiverr review manipulation policy).'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Sending an empty delivery message with just a file and no explanation.',
        fix: 'Always include a polite summary of deliverables and clear instructions.',
        dangerLevel: 'medium'
      },
      {
        mistake: 'Delivering an incomplete placeholder file just to stop the countdown timer.',
        fix: 'Never deliver blank files. Fiverr considers placeholder deliveries a severe TOS violation that can lead to order cancellation and account strikes.',
        dangerLevel: 'critical'
      }
    ],
    proTips: [
      'Include a quick "ReadMe.txt" or short setup video guide inside the zip file for complex software or website projects.',
      'Once delivered, the buyer has 3 days to review. If they do not respond within 3 days, Fiverr automatically marks the order complete and clears the funds.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452937-Delivering-an-order',
    faq: [
      {
        question: 'What happens after I click Deliver Work?',
        answer: 'The order status updates to "Delivered". The buyer has 3 days (72 hours) to either accept the delivery, request a revision, or let the order auto-complete.'
      }
    ],
    relatedGuideIds: ['orders-workflow', 'revisions-management', 'reviews-ratings']
  },
  {
    id: 'revisions-management',
    slug: 'revisions-management',
    title: 'Revision Handling & Scope Creep Management',
    shortTitle: 'Revision Handling',
    category: 'revisions',
    categoryName: 'Revisions & Disputes',
    iconName: 'RotateCcw',
    description: 'Master the art of handling revisions gracefully. Learn how to distinguish legitimate adjustments from scope creep, offer paid add-ons politely, and avoid dispute escalations.',
    readTime: '7 min read',
    difficulty: 'intermediate',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'What constitutes a valid revision vs an out-of-scope request',
      'The 3-step script for politely handling scope creep without conflict',
      'How to re-deliver updated assets through the official portal',
      'Preserving your 5-star review potential during revision rounds'
    ],
    steps: [
      {
        id: 'rev-step-1',
        stepNumber: 1,
        title: 'Evaluate the Revision Request Scope',
        actionSummary: 'Check if the buyer\'s request falls within the original project agreement.',
        where: 'Active Order Page > Revision Feedback Box',
        whatToSelect: 'Read Buyer\'s Modification Notes',
        why: 'Legitimate revisions are adjustments to work already agreed upon (e.g. "Please change the button color to deep blue" or "Fix this typo in section 3"). Completely new features (e.g. "Also add a blog page with CMS") are scope creep.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Stay calm and professional even if the buyer sounds frustrated. Most issues are simple miscommunications.'
        ]
      },
      {
        id: 'rev-step-2',
        stepNumber: 2,
        title: 'Execute Legitimate Revisions Promptly',
        actionSummary: 'Make the requested tweaks and re-deliver via "Deliver Modified Work".',
        where: 'Active Order Page > Click "Deliver Modified Work"',
        whatToSelect: 'Attach Updated Files & Summary Note',
        whatToWrite: 'Briefly summarize the exact changes made according to their notes.',
        why: 'Fast turnaround on revisions (under 24 hours) turns hesitant buyers into enthusiastic 5-star repeat clients.',
        device: 'all',
        deviceAvailability: 'available'
      },
      {
        id: 'rev-step-3',
        stepNumber: 3,
        title: 'Handle Out-of-Scope Requests Politely (The Win-Win Script)',
        actionSummary: 'Acknowledge the idea, explain the boundary, and provide an upgrade path.',
        where: 'Order Chat / Inbox Message',
        whatToWrite: `"Hi [Buyer Name], thank you for the feedback!

I have reviewed your request for [New Feature]. This is a fantastic idea, but since it was not part of our initial scope for the [Standard Package], I would be happy to accommodate it as an additional milestone or Gig Extra!

I can build [New Feature] for an additional +$45 with a 1-day extension. I have sent over a custom offer for your approval. Let me know if you would like me to proceed with this add-on!"`,
        why: 'This avoids arguing while establishing clear professional value for your extra time.',
        device: 'all',
        deviceAvailability: 'available'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Arguing defensively with a buyer in the order feedback section.',
        fix: 'Maintain a polite, objective, and solution-oriented tone at all times.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Clearly specify revision limits in your initial Gig packages (e.g. 2 revisions on Basic, 4 on Standard).',
      'Always keep backup copies of previous versions before applying destructive edits.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452937-Handling-revisions',
    faq: [
      {
        question: 'Does requesting a revision make an order late?',
        answer: 'No! When a buyer requests a revision, the order status changes to "Revision Requested". The initial deadline is paused, though you should aim to deliver revisions within 24–48 hours.'
      }
    ],
    relatedGuideIds: ['delivery-guide', 'reviews-ratings', 'client-communication']
  },
  {
    id: 'reviews-ratings',
    slug: 'reviews-ratings',
    title: 'Reviews, Ratings & Public/Private Feedback System',
    shortTitle: 'Reviews & Ratings',
    category: 'reviews',
    categoryName: 'Reviews & Reputation',
    iconName: 'Star',
    description: 'Understand the two-tier review system: Public 5-star ratings vs Private Buyer Feedback. Learn compliant review etiquette, how to respond to feedback, and maintaining a high Success Score.',
    readTime: '8 min read',
    difficulty: 'intermediate',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'The difference between Public Reviews and Private Client Feedback',
      'Strict Fiverr policies regarding review solicitation and feedback manipulation',
      'How to write professional public responses to all client reviews',
      'The impact of reviews on your algorithmic search positioning'
    ],
    steps: [
      {
        id: 'rr-step-1',
        stepNumber: 1,
        title: 'Understand Public vs Private Feedback',
        actionSummary: 'Learn the two layers of evaluation every buyer completes.',
        where: 'Completed Order Overview & Analytics',
        why: '1. Public Review: 1 to 5 stars across categories (Quality of Delivery, Communication, Value) and public testimonial visible on your Gig.\n2. Private Feedback: Fiverr sends a confidential survey asking "Would you work with this seller again?" which directly feeds your Success Score.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Excellent communication and politeness throughout the project ensure high private feedback scores.'
        ]
      },
      {
        id: 'rr-step-2',
        stepNumber: 2,
        title: 'Leave Mutual Feedback for the Buyer',
        actionSummary: 'Submit your honest rating of the client to reveal their review.',
        where: 'Completed Order Page > "Leave Feedback for Buyer"',
        whatToSelect: 'Star Rating (1–5) & Written Comment',
        whatToWrite: 'e.g. "Outstanding client! Clear communication, great project specifications, and seamless collaboration. Highly recommended to all freelancers!"',
        why: 'Fiverr uses a "blind review" system: neither party can see the other\'s review until both have submitted their feedback (or after 10 days).',
        device: 'all',
        deviceAvailability: 'available'
      },
      {
        id: 'rr-step-3',
        stepNumber: 3,
        title: 'Comply Strictly with Anti-Manipulation Rules',
        actionSummary: 'Never incentivize, demand, or explicitly ask for 5-star ratings.',
        where: 'All Chat, Delivery Notes, and Inbox Messages',
        why: 'Fiverr considers asking for "5 stars", "positive reviews", or offering discounts in exchange for feedback a severe violation resulting in account warnings.',
        device: 'all',
        deviceAvailability: 'available',
        warnings: [
          'NEVER say: "Please give me 5 stars" or "Leave a 5-star review and I will give you a free file". Instead say: "Your honest feedback on the order is greatly appreciated!"'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving an angry public response to an occasional critical review.',
        fix: 'Write a calm, professional response showing future clients that you handle feedback maturely.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Respond publicly to every review you receive — it shows prospective buyers that you are active and appreciative.',
      'Over-delivering small value (e.g. a free color variation or quick video walkthrough) naturally earns 5-star reviews without asking.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010560118-Reviews-and-ratings',
    faq: [
      {
        question: 'Can a buyer change their review after publishing it?',
        answer: 'Fiverr allows buyers to edit their review only under specific circumstances if they contact Fiverr Customer Support directly. Sellers cannot force or pressure buyers to alter reviews.'
      }
    ],
    relatedGuideIds: ['delivery-guide', 'seller-dashboard', 'policies-copyright']
  },
  {
    id: 'earnings-withdrawal',
    slug: 'earnings-withdrawal',
    title: 'Earnings, 14-Day Clearing Period & Withdrawal Methods',
    shortTitle: 'Earnings & Payouts',
    category: 'earnings',
    categoryName: 'Earnings & Finances',
    iconName: 'CreditCard',
    description: 'Understand the complete financial flow: Net Revenue (80%), Pending Clearance period (14 days / 7 days for Top Rated), Available for Withdrawal funds, and connecting Bank Transfer / Payoneer / PayPal.',
    readTime: '8 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'How the 14-day clearance timeline operates from order completion date',
      'The difference between "Net Income", "Pending Clearance", and "Available for Withdrawal"',
      'Connecting and verifying payout channels (Direct to Local Bank, Payoneer, PayPal)',
      'Downloading monthly earnings statements and invoices for local accounting'
    ],
    steps: [
      {
        id: 'ew-step-1',
        stepNumber: 1,
        title: 'Understand the 14-Day Clearance Period',
        actionSummary: 'Track when completed order revenue becomes available for withdrawal.',
        where: 'Top Navigation > My Business > Earnings Page',
        whatToSelect: 'Earnings Overview Graph & Pending Clearance Table',
        why: 'Once an order is completed, your 80% net revenue enters a standard 14-day security clearance period (reduced to 7 days for Top Rated Sellers) to prevent fraudulent chargebacks.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Check the "Clearing On [Date]" indicator next to each completed order in your transaction history.'
        ]
      },
      {
        id: 'ew-step-2',
        stepNumber: 2,
        title: 'Connect Your Payout Withdrawal Method',
        actionSummary: 'Set up Bank Transfer (Payoneer), Direct Deposit, or PayPal.',
        where: 'Earnings Page > Top Right > "Manage Payout Methods" / "Withdraw Balance"',
        whatToSelect: 'Select Preferred Method: Direct to Local Bank Account, Payoneer Account, or PayPal Account',
        whatToWrite: 'Your verified banking account details or linked payment email.',
        why: 'Once cleared, funds can be transferred directly to your local bank account in your domestic currency.',
        device: 'desktop_recommended',
        deviceAvailability: 'desktop_recommended',
        tips: [
          'Direct Bank Transfer via Payoneer typically offers the lowest fees and best currency exchange rates for international sellers.'
        ],
        warnings: [
          'Always verify official payout policies and fee structures directly on the official Fiverr Help Center, as third-party bank fees vary by country.'
        ]
      },
      {
        id: 'ew-step-3',
        stepNumber: 3,
        title: 'Initiate a Balance Withdrawal',
        actionSummary: 'Transfer your available cleared balance with 1 click.',
        where: 'Earnings Page > "Withdraw Balance" Button',
        whatToSelect: 'Choose Amount & Confirm 2FA OTP',
        why: 'Withdrawing moves funds out of Fiverr escrow into your personal bank account or digital wallet within 1–3 business days.',
        device: 'all',
        deviceAvailability: 'available'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Expecting funds to be instantly withdrawable immediately after an order completes.',
        fix: 'Remember the mandatory 14-day clearance window is standard for all marketplaces.',
        dangerLevel: 'low'
      }
    ],
    proTips: [
      'Export your yearly CSV transaction statements from the Earnings page for seamless tax reporting.',
      'Keep 2FA enabled on both your Fiverr account and your linked PayPal/Payoneer accounts.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010560118-Withdrawing-funds',
    faq: [
      {
        question: 'Is there a minimum withdrawal amount on Fiverr?',
        answer: 'Yes, minimum withdrawal amounts vary by payment method (typically $5 for PayPal and $20 for Direct Bank Transfer/Payoneer). Check the current official Fiverr Help Center for exact limits.'
      }
    ],
    relatedGuideIds: ['seller-dashboard', 'security-center', 'fiverr-basics']
  },
  {
    id: 'security-center',
    slug: 'security-center',
    title: 'Security Center: Phishing, QR Code Scams & Fraud Defense',
    shortTitle: 'Security Center',
    category: 'security',
    categoryName: 'Security & Safety',
    iconName: 'ShieldAlert',
    description: 'Learn to detect and neutralize the most dangerous seller scams: QR code verification traps, fake Fiverr support accounts, executable malware attachments (.exe), off-platform payment phishing, and account takeover attempts.',
    readTime: '10 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'Recognizing the 4 most common scam templates targeting new Fiverr sellers',
      'The "Fake QR Code Verification" scam and why Fiverr never uses it',
      'Identifying malicious attachment extensions (.exe, .scr, .zip with executables)',
      'Reporting suspicious messages and protecting your account credentials'
    ],
    steps: [
      {
        id: 'sec-step-1',
        stepNumber: 1,
        title: 'Neutralize the "QR Code / Bank Verification" Scam',
        actionSummary: 'Never scan QR codes or enter credit card numbers sent in chat.',
        where: 'Fiverr Inbox Messages',
        why: 'Scammers send fake images claiming: "You received an order! Scan this QR code to verify your bank card and receive $200". This is a phishing scam to steal your credit card number.',
        device: 'all',
        deviceAvailability: 'available',
        warnings: [
          'Fiverr NEVER requires sellers to scan a QR code or provide credit card numbers to receive order payments. All payments are handled automatically.'
        ],
        tips: [
          'Click the three dots (...) on the message and select "Report as Spam / Phishing" immediately.'
        ]
      },
      {
        id: 'sec-step-2',
        stepNumber: 2,
        title: 'Spot Fake "Fiverr Support" Impersonators',
        actionSummary: 'Recognize that official Fiverr staff will NEVER message you from regular buyer accounts.',
        where: 'Inbox Messages & Email Notifications',
        why: 'Scammers create usernames like "Fiverr_Security_Team" or "Customer_Support_Desk". Real Fiverr administrative notices appear in a dedicated system notification modal, never as a regular chat message with a "Report" button.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Official Fiverr emails ONLY come from "@fiverr.com" domains.'
        ]
      },
      {
        id: 'sec-step-3',
        stepNumber: 3,
        title: 'Block Malicious Executable Attachments',
        actionSummary: 'Never open .exe, .scr, .bat, or suspicious zipped scripts.',
        where: 'Inbox & Order Attachments',
        why: 'Scammers upload files disguised as "Project_Brief.pdf.exe" or "Design_Specs.zip" containing password-stealing malware designed to hijack your browser sessions.',
        device: 'all',
        deviceAvailability: 'available',
        tips: [
          'Only open standard safe document formats (.pdf, .docx, .png, .jpg, .svg, .fig, Figma/Canva/Google Drive links).'
        ]
      }
    ],
    commonMistakes: [
      {
        mistake: 'Entering your credit card or bank login on an external website linked from a chat message.',
        fix: 'Never leave the official fiverr.com domain. If you accidentally entered details, contact your bank and change your Fiverr password immediately.',
        dangerLevel: 'critical'
      }
    ],
    proTips: [
      'Enable Two-Factor Authentication (2FA) in Settings > Security right now if you haven\'t already.',
      'Remember the golden rule: If a message asks for your contact info, off-platform payment, or bank card verification, it is 100% a scam.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452677-Phishing-and-fraud-prevention',
    faq: [
      {
        question: 'What should I do if my account was compromised or clicked a malicious link?',
        answer: 'Immediately change your Fiverr password, enable 2FA, log out of all active sessions from the Security settings, scan your computer with an antivirus tool, and contact official Fiverr Customer Support.'
      }
    ],
    relatedGuideIds: ['account-setup', 'policies-copyright', 'client-communication']
  },
  {
    id: 'policies-copyright',
    slug: 'policies-copyright',
    title: 'Fiverr Policies, Copyright & Originality Compliance',
    shortTitle: 'Policies & Copyright',
    category: 'policies',
    categoryName: 'Policies & TOS',
    iconName: 'FileText',
    description: 'Protect your seller status: zero tolerance on plagiarism, licensing stock assets, prohibited services (academic cheating, fake reviews), and intellectual property ownership transfer upon delivery.',
    readTime: '8 min read',
    difficulty: 'intermediate',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'Zero tolerance rules on copying other freelancers\' Gig images or descriptions',
      'Proper commercial licensing for stock photos, fonts, and audio tracks',
      'Prohibited service categories (academic cheating, review trading, illegal data scraping)',
      'How intellectual property rights transfer to the buyer upon approved order completion'
    ],
    steps: [
      {
        id: 'pc-step-1',
        stepNumber: 1,
        title: 'Zero Tolerance on Content & Portfolio Plagiarism',
        actionSummary: 'Every single asset in your Gig must be 100% created by you or properly licensed.',
        where: 'Gig Images, Videos, PDF Portfolios, Descriptions',
        why: 'Fiverr uses automated perceptual hashing and DMCA detection. Stealing images from Google or copying another seller\'s description word-for-word results in instant Gig removal and permanent account bans.',
        device: 'all',
        deviceAvailability: 'available',
        warnings: [
          'Never screenshot someone else\'s Dribbble or Behance portfolio and claim it as your own.'
        ]
      },
      {
        id: 'pc-step-2',
        stepNumber: 2,
        title: 'Use Properly Licensed Stock Assets & Fonts',
        actionSummary: 'Ensure all stock photos, music, and font families have commercial rights.',
        where: 'Client Deliverables & Gig Cover Graphics',
        whatToSelect: 'Use reputable commercial repositories (Unsplash, Envato Elements, Google Fonts, Freepik Commercial License)',
        why: 'Delivering unlicensed copyrighted assets exposes your client to legal liabilities, leading to severe disputes and chargebacks.',
        device: 'all',
        deviceAvailability: 'available'
      },
      {
        id: 'pc-step-3',
        stepNumber: 3,
        title: 'Strictly Avoid Prohibited Service Categories',
        actionSummary: 'Do not offer services that violate international laws or academic integrity.',
        where: 'Gig Offerings & Custom Proposals',
        why: 'Fiverr strictly bans: 1. Academic homework/thesis writing, 2. Buying or selling fake reviews, 3. Hacking/unauthorized scraping, 4. Adult/NSFW content, 5. Forged documents.',
        device: 'all',
        deviceAvailability: 'available'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using copyrighted pop music in your 75-second Gig introduction video.',
        fix: 'Use royalty-free audio tracks with commercial usage permissions.',
        dangerLevel: 'high'
      }
    ],
    proTips: [
      'Keep your original raw project files (.PSD, .AI, .FIG, .TSX) saved locally as proof of original creation in case of any intellectual property dispute.',
      'Upon completed order delivery, full commercial rights to the specific customized deliverable transfer to the buyer under Fiverr standard terms.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452677-Community-standards',
    faq: [
      {
        question: 'Who owns the copyright of work created on Fiverr?',
        answer: 'Unless stated otherwise in your Gig description or custom offer, once an order is fully paid and completed, the buyer receives all intellectual property and commercial usage rights for the delivered work.'
      }
    ],
    relatedGuideIds: ['security-center', 'gig-creation', 'delivery-guide']
  },
  {
    id: 'device-guide',
    slug: 'device-guide',
    title: 'Complete Device Guide: Mobile vs Tablet vs Laptop/Desktop',
    shortTitle: 'Device Guide',
    category: 'devices',
    categoryName: 'Device Optimization',
    iconName: 'Smartphone',
    description: 'An authoritative comparison breakdown: which Fiverr actions can be performed on your smartphone, what works on tablets, and why Desktop is strictly required for Gig creation, large deliveries, and dispute resolution.',
    readTime: '7 min read',
    difficulty: 'beginner',
    primaryDevice: 'available',
    whatYouWillLearn: [
      'The exact strengths of the Fiverr iOS/Android Mobile App (fast messaging, order tracking)',
      'Tasks that are strictly Desktop Required (6-tab Gig creation, tax form compliance, 1280x769px media)',
      'How to set up a dual-device workflow for maximum efficiency',
      'The 4 universal device capability badges used throughout this platform'
    ],
    steps: [
      {
        id: 'dg-step-1',
        stepNumber: 1,
        title: 'Master the 4 Universal Device Badges',
        actionSummary: 'Learn what each badge means across our learning platform.',
        where: 'Top of every guide and step card',
        why: `🟢 Available Everywhere: Works smoothly on Mobile, Tablet, and Desktop.\n🟡 Limited on Mobile: Usable on mobile, but formatting or features are constrained.\n🔵 Desktop Recommended: Can be done on mobile in an emergency, but desktop is vastly superior.\n🔴 Desktop Required: Cannot be performed in the mobile app; strictly requires a laptop or desktop computer.`,
        device: 'all',
        deviceAvailability: 'available'
      },
      {
        id: 'dg-step-2',
        stepNumber: 2,
        title: 'The Mobile App Superpower: Sub-15-Minute Response Rates',
        actionSummary: 'Use your smartphone as your 24/7 client communication hub.',
        where: 'Fiverr Mobile App (iOS / Android)',
        whatToSelect: 'Push Notifications Enabled in phone settings',
        why: 'Clients often message 3 freelancers at once. Being the first to reply within 5 minutes on your phone converts inquiries into booked orders before competitors even open their laptops.',
        device: 'mobile',
        deviceAvailability: 'available',
        tips: [
          'Set custom notification sounds so you instantly recognize incoming Fiverr buyer messages.'
        ]
      },
      {
        id: 'dg-step-3',
        stepNumber: 3,
        title: 'The Desktop Workstation: Deep Work & Precision Publishing',
        actionSummary: 'Reserve your computer for Gig creation, coding/designing, and heavy deliveries.',
        where: 'Laptop / Desktop Web Browser (Chrome, Firefox, Safari)',
        why: 'Desktop provides pixel-perfect layout controls, multi-file zip packaging, source code archiving, and access to the complete Resolution Center.',
        device: 'desktop_required',
        deviceAvailability: 'desktop_required'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Trying to create and format a complex 3-package Gig on a smartphone screen.',
        fix: 'Always use a computer for the initial Gig creation wizard to avoid formatting errors.',
        dangerLevel: 'medium'
      }
    ],
    proTips: [
      'The ultimate freelancer setup: Use your phone for instant notifications and chat replies, and your laptop for production, file packaging, and delivery.',
      'Check the full Device Capability Matrix in our top navigation for a feature-by-feature breakdown.'
    ],
    fiverrHelpDocUrl: 'https://help.fiverr.com/hc/en-us/articles/360010452317-Fiverr-mobile-app',
    faq: [
      {
        question: 'Can I do 100% of my Fiverr freelancing using only a mobile phone?',
        answer: 'You can manage communications and monitor orders on a phone, but creating Gigs, building digital assets (coding, graphic design, video editing), and packaging high-resolution files requires a computer or laptop.'
      }
    ],
    relatedGuideIds: ['fiverr-basics', 'gig-creation', 'client-communication']
  }
];

export const ALL_GUIDES = GUIDES;
export const GUIDE_SECTIONS = GUIDES;

export const GUIDE_CATEGORIES = [
  {
    id: 'cat-basics',
    slug: 'basics',
    name: 'Fiverr Basics',
    nameBn: 'ফাইভারে প্রাথমিক ধারণা',
    description: 'Ecosystem structure, account fundamentals, and order escrow model',
    descriptionBn: 'ফাইভারের মৌলিক নিয়মাবলি ও অ্যাকাউন্ট প্রস্তুতি',
    icon: 'Compass'
  },
  {
    id: 'cat-account',
    slug: 'account',
    name: 'Account & Profile Setup',
    nameBn: 'অ্যাকাউন্ট ও প্রোফাইল সেটআপ',
    description: 'Professional portrait, seller bio, skill badges, and 2FA security',
    descriptionBn: 'প্রোফাইল ব্র্যান্ডিং ও সর্বোচ্চ সিকিউরিটি',
    icon: 'UserCheck'
  },
  {
    id: 'cat-gig',
    slug: 'gig',
    name: 'Gig Operations & SEO',
    nameBn: 'গিগ তৈরি ও সার্চ অপ্টিমাইজেশন',
    description: 'Niche search tags, 3-tier pricing matrix, FAQs, and 1280x769 gallery banners',
    descriptionBn: 'হাই-কনভার্টিং গিগ তৈরি ও কিউয়ার্ড র‍্যাংকিং',
    icon: 'Layers'
  },
  {
    id: 'cat-communication',
    slug: 'communication',
    name: 'Buyer Chat & Custom Offers',
    nameBn: 'বায়ার চ্যাট ও কাস্টম অফার',
    description: 'Inbox psychology, 1-hour response rates, clarifying scope, and custom quotes',
    descriptionBn: 'ক্লায়েন্ট নেগোসিয়েশন ও চুক্তি চূড়ান্তকরণ',
    icon: 'MessageSquare'
  },
  {
    id: 'cat-orders',
    slug: 'orders',
    name: 'Order Delivery & Revisions',
    nameBn: 'অর্ডার এক্সিকিউশন ও ডেলিভারি',
    description: 'Active countdown timers, delivery zip packages, watermarks, and resolution center',
    descriptionBn: 'সঠিক সময়ে ডেলিভারি ও ক্লায়েন্ট রিভিশন হ্যান্ডলিং',
    icon: 'CheckCircle2'
  },
  {
    id: 'cat-finance',
    slug: 'finance',
    name: 'Earnings & Payouts',
    nameBn: 'আর্নিংস ও উইথড্রয়াল',
    description: '14-day clearance cycle, Payoneer/Bank wire setup, and W-8BEN tax forms',
    descriptionBn: 'টাকা ক্লিয়ারেন্স ও লোকাল ব্যাংকে স্থানান্তর',
    icon: 'DollarSign'
  },
  {
    id: 'cat-analytics',
    slug: 'analytics',
    name: 'Analytics & Fiverr Levels',
    nameBn: 'অ্যানালিটিক্স ও লেভেল সিস্টেম',
    description: 'Seller dashboard metrics, success score, monthly evaluations, and badge criteria',
    descriptionBn: 'সেলার পারফরম্যান্স ও লেভেল আপগ্রেড',
    icon: 'BarChart3'
  },
  {
    id: 'cat-devices',
    slug: 'devices',
    name: 'Mobile vs Desktop Workflows',
    nameBn: 'ডিভাইস ক্যাপাবিলিটি গাইড',
    description: 'Feature-by-feature matrix comparing mobile app vs desktop web capabilities',
    descriptionBn: 'কোন কাজ মোবাইলে করবেন আর কোনটি কম্পিউটারে',
    icon: 'Laptop'
  }
];

