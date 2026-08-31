export interface CategoryDetail {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  description: string;
  subcategories: string[];
  skills: string[];
}

export const PROFESSIONAL_CATEGORIES: CategoryDetail[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    nameBn: 'Frontend, Backend & Full Stack',
    iconName: 'Code2',
    description: 'Custom web apps, frontend, backend, APIs, and headless eCommerce platforms.',
    subcategories: ['Frontend Development', 'Backend Development', 'Full Stack Development', 'WordPress', 'Shopify', 'Webflow', 'Next.js & React', 'Laravel & PHP'],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Vue.js', 'Angular', 'Python', 'PHP', 'Laravel', 'WordPress', 'Shopify', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS']
  },
  {
    id: 'app-dev',
    name: 'App Development',
    nameBn: 'iOS & Android Native / Flutter',
    iconName: 'Smartphone',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    subcategories: ['iOS Native (Swift)', 'Android Native (Kotlin)', 'Flutter Cross-Platform', 'React Native', 'Mobile UI Integration', 'App Maintenance & Bugfix'],
    skills: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'iOS', 'Android', 'Firebase', 'State Management', 'REST APIs', 'App Store Deployment', 'SQLite']
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    nameBn: 'Interface, Figma & Product UX',
    iconName: 'Palette',
    description: 'User-centric interface design, wireframing, design systems, and rapid prototyping.',
    subcategories: ['Web & SaaS UI', 'Mobile App UX', 'Design Systems', 'Wireframing & Flow', 'User Research', 'Interactive Prototypes'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems', 'User Research', 'Wireframing', 'SaaS UX', 'Mobile App Design', 'Usability Testing']
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    nameBn: 'Branding, Logos & Visual Assets',
    iconName: 'Layout',
    description: 'Visual branding, vector illustrations, promotional assets, and packaging.',
    subcategories: ['Logo & Brand Identity', 'Social Media Graphics', 'Print & Packaging', 'Vector Illustration', 'Marketing Collateral'],
    skills: ['Adobe Illustrator', 'Photoshop', 'Brand Identity', 'Vector Art', 'Typography', 'Print Design', 'Banner Design', 'InDesign']
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    nameBn: 'YouTube, Commercial & Reels',
    iconName: 'Video',
    description: 'Commercial video cutting, YouTube edits, color grading, and sound syncing.',
    subcategories: ['YouTube Video Editing', 'Commercial Ads', 'Reels / Shorts / TikTok', 'Color Grading', 'Documentary & Cinematic'],
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'Color Grading', 'Sound Design', 'Storyboarding', 'Motion Graphics', 'Short-form Content']
  },
  {
    id: 'animation',
    name: 'Animation',
    nameBn: '2D/3D Motion & Explainer Videos',
    iconName: 'Sparkles',
    description: '2D character animations, 3D product renders, logo reveals, and motion graphics.',
    subcategories: ['2D Character Animation', '3D Motion Design', 'Explainer Videos', 'Logo Animation', 'Lottie / JSON Web Animations'],
    skills: ['After Effects', 'Blender', 'Cinema 4D', 'Lottie', 'Maya', 'Character Rigging', '3D Modeling', 'Motion Graphics']
  },
  {
    id: 'seo',
    name: 'SEO & Search Marketing',
    nameBn: 'Search Engine Optimization',
    iconName: 'Search',
    description: 'Technical audits, on-page optimization, backlink strategies, and organic rank boosting.',
    subcategories: ['On-Page SEO', 'Technical SEO & Core Web Vitals', 'Backlink Building & Outreach', 'Local SEO & Google Business', 'Keyword Strategy'],
    skills: ['Ahrefs', 'SEMrush', 'Google Search Console', 'Technical SEO', 'Keyword Research', 'Schema Markup', 'Link Building', 'PageSpeed']
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    nameBn: 'PPC, Social & Growth Strategy',
    iconName: 'Megaphone',
    description: 'Omnichannel campaigns, Google/Meta ads, conversion rate optimization, and growth hacking.',
    subcategories: ['Meta Ads (Facebook/IG)', 'Google Search & Display Ads', 'Email Marketing Automation', 'Conversion Rate Optimization (CRO)', 'Influencer Campaigns'],
    skills: ['Meta Ads Manager', 'Google Ads', 'Klaviyo', 'HubSpot', 'Google Analytics 4', 'PPC Strategy', 'Email Automation', 'Copywriting']
  },
  {
    id: 'content-writing',
    name: 'Content Writing',
    nameBn: 'Articles, Copy & Technical Docs',
    iconName: 'FileText',
    description: 'Engaging articles, technical blogs, conversion copywriting, and brand storytelling.',
    subcategories: ['SEO Blog Articles', 'Website Copywriting', 'Technical Documentation', 'eBooks & Whitepapers', 'Press Releases'],
    skills: ['SEO Copywriting', 'Long-form Writing', 'Editing & Proofreading', 'Research', 'Ghostwriting', 'CMS Publishing', 'Brand Voice']
  },
  {
    id: 'translation',
    name: 'Translation & Localization',
    nameBn: 'Multilingual Document Translation',
    iconName: 'Languages',
    description: 'Fluent translations, legal proofreading, software localization, and subtitle sync.',
    subcategories: ['Document Translation', 'App & Web Localization', 'Subtitling & Closed Captions', 'Proofreading & Editing', 'Transcription'],
    skills: ['English Translation', 'Spanish Localization', 'German', 'Arabic', 'French', 'Bengali', 'Hindi', 'CAT Tools', 'Subtitle Sync']
  },
  {
    id: 'virtual-assistant',
    name: 'Virtual Assistant',
    nameBn: 'Admin Support & Executive Assistant',
    iconName: 'Headphones',
    description: 'Executive support, data entry, CRM management, email triage, and client scheduling.',
    subcategories: ['Data Entry & Web Research', 'Email & Calendar Management', 'Customer Support (Live Chat/Ticket)', 'eCommerce Store Operations', 'Spreadsheet Automation'],
    skills: ['Excel / Google Sheets', 'Zendesk', 'Intercom', 'Asana / Trello', 'Data Entry', 'CRM Management', 'Lead Generation', 'Calendar Management']
  },
  {
    id: 'social-media',
    name: 'Social Media Management',
    nameBn: 'Organic Growth & Content Scheduling',
    iconName: 'Share2',
    description: 'Brand page growth, content calendars, community moderation, and audience engagement.',
    subcategories: ['Account Management & Growth', 'Content Creation & Scheduling', 'Community Moderation', 'TikTok & Instagram Strategy', 'LinkedIn B2B Growth'],
    skills: ['Canva', 'Buffer / Hootsuite', 'Instagram Growth', 'LinkedIn Marketing', 'TikTok Strategy', 'Community Engagement', 'Analytics Reporting']
  },
  {
    id: 'voice-over',
    name: 'Voice Over & Audio',
    nameBn: 'Voice Talent, Narration & Audio',
    iconName: 'Mic',
    description: 'Commercial voiceovers, audio mastering, podcast editing, and background score production.',
    subcategories: ['Commercial Voiceover', 'Podcast Audio Editing & Mixing', 'Audiobook Narration', 'Sound Effects & Foley', 'Jingles & Intro Music'],
    skills: ['Pro Tools', 'Audacity', 'Voice Acting', 'Audio Mastering', 'Noise Reduction', 'Podcast Production', 'Equalization']
  },
  {
    id: 'ai-prompt',
    name: 'AI & Prompt Engineering',
    nameBn: 'LLM Fine-tuning & Agent Workflows',
    iconName: 'Bot',
    description: 'Gemini / Claude prompts, automated AI agent workflows, custom GPTs, and model fine-tuning.',
    subcategories: ['Prompt Engineering & System Prompts', 'AI Agent & Automation Building', 'Custom Model Fine-tuning', 'AI Art Generation (Midjourney)', 'RAG & Vector Pipelines'],
    skills: ['Gemini API', 'LangChain', 'OpenAI', 'Midjourney', 'Prompt Optimization', 'Python', 'Vector DBs (Pinecone/Chroma)', 'Flowise']
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    nameBn: 'BI Dashboards, SQL & Data Science',
    iconName: 'BarChart2',
    description: 'BI dashboards, SQL queries, machine learning models, ETL pipelines, and forecasting.',
    subcategories: ['Power BI & Tableau Dashboards', 'SQL Query Optimization', 'Python Data Analysis & ML', 'Google Analytics 4 & BigQuery', 'Excel Financial Modeling'],
    skills: ['SQL', 'Power BI', 'Tableau', 'Python (Pandas/NumPy)', 'BigQuery', 'Excel VBA', 'Machine Learning', 'Data Visualization']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & QA',
    nameBn: 'Penetration Testing & QA Audit',
    iconName: 'ShieldAlert',
    description: 'Penetration testing, vulnerability assessments, automated QA suites, and code audits.',
    subcategories: ['Web Vulnerability Assessment', 'Penetration Testing', 'Automated QA Testing (Playwright/Cypress)', 'Smart Contract Audit', 'Security Hardening'],
    skills: ['OWASP Top 10', 'Burp Suite', 'Cypress', 'Playwright', 'Network Security', 'Code Audit', 'Penetration Testing', 'SSL / TLS Hardening']
  },
  {
    id: 'ecommerce',
    name: 'eCommerce Solutions',
    nameBn: 'Shopify, Amazon & Store Setup',
    iconName: 'ShoppingBag',
    description: 'Shopify theme customization, Amazon store management, WooCommerce setups, and payment gateways.',
    subcategories: ['Shopify Store Development', 'Amazon FBA Management', 'WooCommerce Setup', 'Payment Gateway Integration', 'Dropshipping Automation'],
    skills: ['Shopify Liquid', 'WooCommerce', 'Amazon Seller Central', 'Stripe / PayPal API', 'Product Research', 'Conversion Funnels', 'Inventory Sync']
  },
  {
    id: 'legal-consulting',
    name: 'Legal & Business Consulting',
    nameBn: 'Contracts, NDAs & Business Advisory',
    iconName: 'Scale',
    description: 'Commercial contracts, NDAs, terms of service, business plans, and compliance guidance.',
    subcategories: ['Contract Drafting & Review', 'Terms of Service & Privacy Policy', 'Business Plans & Pitch Decks', 'IP & Trademark Guidance', 'Financial Advisory'],
    skills: ['Contract Law', 'NDA Drafting', 'Business Planning', 'Compliance', 'Financial Projections', 'Pitch Decks', 'Risk Assessment']
  },
  {
    id: 'game-dev',
    name: 'Game Development',
    nameBn: 'Unity, Unreal Engine & 3D Assets',
    iconName: 'Gamepad2',
    description: 'Unity and Unreal Engine gameplay programming, 3D asset creation, and multiplayer networking.',
    subcategories: ['Unity 2D/3D Gameplay', 'Unreal Engine 5 C++ & Blueprints', 'Game Asset Modeling', 'Multiplayer Networking', 'Mobile Game Optimization'],
    skills: ['Unity (C#)', 'Unreal Engine (C++)', 'Blender', 'Game Physics', 'Photon / WebSockets', 'Shader Graph', 'Mobile Optimization', 'Level Design']
  }
];
