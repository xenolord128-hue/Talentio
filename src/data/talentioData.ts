import { Freelancer, TalentioService, ProjectJob, EscrowContract, ChatMessage } from '../types';

export const TALENTIO_CATEGORIES = [
  { id: 'all', name: 'All Specialties', icon: 'Sparkles', count: 1840 },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: 'BrainCircuit', count: 420 },
  { id: 'web-dev', name: 'Full-Stack Web & SaaS', icon: 'Code2', count: 890 },
  { id: 'ui-ux', name: 'UI/UX & Product Design', icon: 'Palette', count: 640 },
  { id: 'cloud-devops', name: 'Cloud & DevOps', icon: 'Cloud', count: 310 },
  { id: 'mobile', name: 'iOS & Android Apps', icon: 'Smartphone', count: 480 },
  { id: 'growth-seo', name: 'Growth & SEO Strategy', icon: 'TrendingUp', count: 520 },
  { id: 'brand-3d', name: 'Brand Identity & 3D', icon: 'Layers', count: 390 }
];

export const TALENTIO_FREELANCERS: Freelancer[] = [
  {
    id: 'freelancer-1',
    name: 'Elena Rostova',
    handle: '@elena_design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    title: 'Senior Product Designer & Design Systems Lead',
    category: 'ui-ux',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    hourlyRate: 85,
    startingPrice: 350,
    rating: 4.98,
    reviewsCount: 142,
    jobSuccessScore: 100,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Ex-Spotify senior designer with 8+ years crafting high-converting SaaS platforms, mobile design systems, and Figma tokens. Delivered 140+ international client projects with 100% 5-star feedback.',
    bioBn: 'সাবেক স্পটিফাই সিনিয়র ডিজাইনার। ৮+ বছরের অভিজ্ঞতায় হাই-কনভার্টিং SaaS প্ল্যাটফর্ম ও ফিগমা ডিজাইন সিস্টেম তৈরিতে পারদর্শী।',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'SaaS Wireframing', 'Prototyping', 'User Research'],
    completedOrdersCount: 184,
    responseTime: '< 1 hour',
    languages: ['English (Native)', 'French (Fluent)'],
    portfolio: [
      { id: 'p1', title: 'Fintech Mobile Banking App (NeoPay)', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', tag: 'UI/UX Design' },
      { id: 'p2', title: 'AI Analytics SaaS Dashboard', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80', tag: 'Design System' },
      { id: 'p3', title: 'Healthcare Telemedicine Portal', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', tag: 'Web App' }
    ],
    featuredReview: {
      clientName: 'Julian Sterling (VP Product @ Curve)',
      clientCountry: 'United States 🇺🇸',
      rating: 5,
      text: 'Elena transformed our complex SaaS workflow into an intuitive, elegant experience. Our conversion rate increased by 38% within 2 weeks of launch.',
      date: '2 days ago'
    }
  },
  {
    id: 'freelancer-2',
    name: 'Marcus Chen',
    handle: '@marcus_ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    title: 'Principal AI Engineer & Full-Stack Architect',
    category: 'ai-ml',
    country: 'Canada',
    countryFlag: '🇨🇦',
    hourlyRate: 110,
    startingPrice: 500,
    rating: 5.0,
    reviewsCount: 98,
    jobSuccessScore: 99,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Specializing in LLM agent orchestration, RAG pipelines, LangChain, OpenAI/Gemini integration, and scalable Next.js / Python backend microservices.',
    bioBn: 'LLM এজেন্ট আর্কিটেকচার, RAG পাইপলাইন, LangChain ও স্কেলেবল ফুল-স্ট্যাক ব্যাকএন্ড ইঞ্জিনিয়ারিং বিশেষজ্ঞ।',
    skills: ['Python', 'LLMs & RAG', 'Next.js', 'FastAPI', 'Vector Databases', 'PostgreSQL', 'LangChain'],
    completedOrdersCount: 112,
    responseTime: '< 30 mins',
    languages: ['English (Fluent)', 'Mandarin (Native)'],
    portfolio: [
      { id: 'p4', title: 'Autonomous Legal Contract AI Assistant', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', tag: 'AI Agent' },
      { id: 'p5', title: 'Real-time Vector Search Engine', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80', tag: 'Machine Learning' }
    ],
    featuredReview: {
      clientName: 'Dr. Sarah Lin (CTO @ MedTech Labs)',
      clientCountry: 'Germany 🇩🇪',
      rating: 5,
      text: 'Marcus delivered a production-ready LLM workflow with 99.8% precision. Incredible depth of architectural knowledge and flawless communication.',
      date: '1 week ago'
    }
  },
  {
    id: 'freelancer-3',
    name: 'Amina Al-Mansoor',
    handle: '@amina_dev',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    title: 'Senior React & Node.js Cloud Developer',
    category: 'web-dev',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    hourlyRate: 75,
    startingPrice: 280,
    rating: 4.95,
    reviewsCount: 210,
    jobSuccessScore: 100,
    verifiedBadge: true,
    proBadge: false,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Full-Stack Developer building modern, ultra-fast web applications with React 19, TypeScript, Tailwind CSS, GraphQL, and serverless AWS/GCP architecture.',
    bioBn: 'রিয়্যাক্ট, টাইপস্ক্রিপ্ট ও ক্লাউড আর্কিটেকচারে পারদর্শী অভিজ্ঞ ফুল-স্ট্যাক ডেভেলপার।',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'AWS Lambda', 'Docker'],
    completedOrdersCount: 260,
    responseTime: '< 1 hour',
    languages: ['Arabic (Native)', 'English (Fluent)'],
    portfolio: [
      { id: 'p6', title: 'Global Logistics B2B Portal', image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&auto=format&fit=crop&q=80', tag: 'Web Platform' },
      { id: 'p7', title: 'E-commerce Headless Storefront', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80', tag: 'Full-Stack' }
    ],
    featuredReview: {
      clientName: 'Henrik Vestergaard (Founder @ Nordic Brands)',
      clientCountry: 'Denmark 🇩🇰',
      rating: 5,
      text: 'Amina is our go-to engineer. Fast turnaround, impeccable clean code, and zero bugs in production.',
      date: '3 days ago'
    }
  },
  {
    id: 'freelancer-4',
    name: 'Lucas Silva',
    handle: '@lucas_mobile',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    title: 'Cross-Platform Mobile Engineer (Flutter & React Native)',
    category: 'mobile',
    country: 'Brazil',
    countryFlag: '🇧🇷',
    hourlyRate: 65,
    startingPrice: 300,
    rating: 4.92,
    reviewsCount: 88,
    jobSuccessScore: 98,
    verifiedBadge: true,
    proBadge: false,
    topRatedBadge: true,
    availableNow: false,
    bio: '7+ years crafting native-feel iOS and Android applications with 60fps animations, offline-first sync, and secure biometric authentication.',
    bioBn: 'ফ্লাটার ও রিয়্যাক্ট নেটিভে তৈরি স্মুথ মোবাইল অ্যাপস এবং অফলাইন-ফার্স্ট আর্কিটেকচার বিশেষজ্ঞ।',
    skills: ['Flutter', 'React Native', 'iOS & Android', 'Firebase', 'State Management', 'Push Notifications'],
    completedOrdersCount: 94,
    responseTime: '< 2 hours',
    languages: ['Portuguese (Native)', 'English (Fluent)', 'Spanish (Conversational)'],
    portfolio: [
      { id: 'p8', title: 'Fitness Tracking & Wearable App', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80', tag: 'Mobile App' }
    ],
    featuredReview: {
      clientName: 'Jessica Taylor (Product Lead @ FitFlow)',
      clientCountry: 'United States 🇺🇸',
      rating: 5,
      text: 'Lucas delivered both iOS and Android builds on schedule. The animations and offline capabilities are world-class.',
      date: '2 weeks ago'
    }
  },
  {
    id: 'freelancer-5',
    name: 'David Vance',
    handle: '@david_cloud',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    title: 'DevOps & Cloud Infrastructure Architect (AWS/GCP/K8s)',
    category: 'cloud-devops',
    country: 'United States',
    countryFlag: '🇺🇸',
    hourlyRate: 120,
    startingPrice: 450,
    rating: 4.99,
    reviewsCount: 165,
    jobSuccessScore: 100,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Kubernetes certified architect. Specializing in CI/CD pipeline automation, Terraform IaC, multi-region high availability, and SOC2 cloud compliance.',
    bioBn: 'ক্লাউড ইনফ্রাস্ট্রাকচার, কিউবারনেটিস, সিআই/সিডি অটোমেশন ও সিকিউরিটি কমপ্লায়েন্স এক্সপার্ট।',
    skills: ['Kubernetes', 'Terraform', 'AWS Architecture', 'GCP', 'Docker', 'CI/CD Pipelines', 'Cloud Security'],
    completedOrdersCount: 190,
    responseTime: '< 15 mins',
    languages: ['English (Native)'],
    portfolio: [
      { id: 'p9', title: 'Enterprise Auto-scaling Infrastructure on AWS', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', tag: 'DevOps & Cloud' }
    ],
    featuredReview: {
      clientName: 'Michael Ross (CTO @ Nexus Health)',
      clientCountry: 'Canada 🇨🇦',
      rating: 5,
      text: 'David reduced our AWS cloud bill by 42% while tripling our peak request throughput with Terraform & EKS.',
      date: '5 days ago'
    }
  },
  {
    id: 'freelancer-6',
    name: 'Sophia Laurent',
    handle: '@sophia_growth',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    title: 'Technical SEO & B2B Organic Growth Strategist',
    category: 'growth-seo',
    country: 'France',
    countryFlag: '🇫🇷',
    hourlyRate: 90,
    startingPrice: 400,
    rating: 4.96,
    reviewsCount: 115,
    jobSuccessScore: 100,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Data-driven growth marketing and technical SEO. Scaled 30+ SaaS and marketplace companies from zero to 1M+ organic monthly traffic.',
    bioBn: 'ডাটা-ড্রাইভেন গ্রোথ ও টেকনিক্যাল এসইও এক্সপার্ট। ৩০টির বেশি প্ল্যাটফর্মের অর্গানিক ট্রাফিক মাল্টিপ্লাই করেছেন।',
    skills: ['Technical SEO', 'Content Strategy', 'Programmatic SEO', 'Google Analytics 4', 'Ahrefs', 'Conversion Rate Optimization'],
    completedOrdersCount: 130,
    responseTime: '< 45 mins',
    languages: ['French (Native)', 'English (Fluent)'],
    portfolio: [
      { id: 'p10', title: 'SaaS Organic Traffic 500% Scale Case Study', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80', tag: 'Growth Strategy' }
    ],
    featuredReview: {
      clientName: 'Oliver Smith (Head of Marketing @ Lumina)',
      clientCountry: 'United Kingdom 🇬🇧',
      rating: 5,
      text: 'Sophia is the real deal. Our organic inbound signups grew 4x in 4 months under her strategic technical roadmap.',
      date: '1 week ago'
    }
  },
  {
    id: 'freelancer-7',
    name: 'Tanvir Ahmed',
    handle: '@tanvir_dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    title: 'Senior Full-Stack Web Developer (React, Next.js & Node.js)',
    category: 'web-dev',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    hourlyRate: 45,
    startingPrice: 200,
    rating: 4.97,
    reviewsCount: 178,
    jobSuccessScore: 99,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Experienced freelance web developer in Bangladesh with 6+ years building performant Next.js, React, Node.js, and WordPress web applications. Completed 170+ projects for international and local clients with 100% on-time milestone delivery.',
    bioBn: 'বাংলাদেশের অভিজ্ঞ ফুল-স্ট্যাক ওয়েব ডেভেলপার। নেক্সট.জেএস, রিঅ্যাক্ট ও নোড.জেএস এ কাস্টম ওয়েব প্ল্যাটফর্ম তৈরিতে পারদর্শী।',
    skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'WordPress'],
    completedOrdersCount: 194,
    responseTime: '< 30 mins',
    languages: ['Bengali (Native)', 'English (Fluent)'],
    portfolio: [
      { id: 'p11', title: 'Multi-Vendor eCommerce Platform', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80', tag: 'Web Development' },
      { id: 'p12', title: 'Fintech Payment Gateway Integration', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', tag: 'Full-Stack' }
    ],
    featuredReview: {
      clientName: 'Daniel Vance (Founder @ TechVibe)',
      clientCountry: 'United States 🇺🇸',
      rating: 5,
      text: 'Tanvir is an exceptional freelance web developer. He built our full-stack web application ahead of schedule with clean, modular TypeScript code.',
      date: '3 days ago'
    }
  },
  {
    id: 'freelancer-8',
    name: 'Nusrat Jahan',
    handle: '@nusrat_design',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    title: 'Lead UI/UX & Graphic Designer (Branding & Figma Systems)',
    category: 'ui-ux',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    hourlyRate: 40,
    startingPrice: 180,
    rating: 4.96,
    reviewsCount: 152,
    jobSuccessScore: 98,
    verifiedBadge: true,
    proBadge: true,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Professional freelance graphic designer and UI/UX specialist in Bangladesh. Specializing in modern brand identity, logo design, mobile app interfaces, and high-converting Figma design systems.',
    bioBn: 'বাংলাদেশের সার্টিফায়েড UI/UX ও গ্রাফিক ডিজাইনার। আধুনিক লোগো, ব্র্যান্ড আইডেন্টিটি এবং ফিগমা প্রোটোটাইপ ডিজাইন বিশেষজ্ঞ।',
    skills: ['Figma', 'UI/UX Design', 'Logo Design', 'Graphic Design', 'Brand Identity', 'Mobile App UI'],
    completedOrdersCount: 165,
    responseTime: '< 1 hour',
    languages: ['Bengali (Native)', 'English (Fluent)'],
    portfolio: [
      { id: 'p13', title: 'E-commerce Brand Identity & Logo Kit', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80', tag: 'Graphic Design' },
      { id: 'p14', title: 'Healthcare Mobile App UI/UX Prototype', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80', tag: 'UI/UX Design' }
    ],
    featuredReview: {
      clientName: 'Claire Laurent (CMO @ Mode Paris)',
      clientCountry: 'France 🇫🇷',
      rating: 5,
      text: 'Nusrat is a talented freelance graphic designer. Her logo design and brand kit captured our vision perfectly. Highly recommended!',
      date: '4 days ago'
    }
  },
  {
    id: 'freelancer-9',
    name: 'Rakibul Hasan',
    handle: '@rakib_seo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    title: 'Senior SEO Expert & Digital Marketing Specialist',
    category: 'growth-seo',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    hourlyRate: 35,
    startingPrice: 150,
    rating: 4.95,
    reviewsCount: 134,
    jobSuccessScore: 99,
    verifiedBadge: true,
    proBadge: false,
    topRatedBadge: true,
    availableNow: true,
    bio: 'Dedicated freelance SEO expert and digital marketing consultant in Bangladesh. Proven track record in technical SEO audits, keyword research, on-page optimization, Google Ads, and local search rankings.',
    bioBn: 'বাংলাদেশের প্রফেশনাল এসইও ফ্রিল্যান্সার ও ডিজিটাল মার্কেটিং এক্সপার্ট। গুগল র‍্যাংকিং ও অর্গানিক গ্রোথ স্ট্র্যাটেজিস্ট।',
    skills: ['Technical SEO', 'On-Page SEO', 'Keyword Research', 'Google Ads', 'Local SEO', 'Digital Marketing'],
    completedOrdersCount: 148,
    responseTime: '< 45 mins',
    languages: ['Bengali (Native)', 'English (Fluent)'],
    portfolio: [
      { id: 'p15', title: 'Local Business 300% Organic Traffic Growth', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80', tag: 'SEO Strategy' }
    ],
    featuredReview: {
      clientName: 'Arthur Pendelton (Director @ Global Trade)',
      clientCountry: 'United Kingdom 🇬🇧',
      rating: 5,
      text: 'Rakibul fixed our technical SEO issues in days. Our organic keywords jumped to page 1 on Google within 6 weeks.',
      date: '1 week ago'
    }
  }
];

export const TALENTIO_SERVICES: TalentioService[] = [
  {
    id: 'service-1',
    title: 'I will design a modern high-converting SaaS product UI/UX in Figma',
    slug: 'saas-ui-ux-design-figma',
    freelancerId: 'freelancer-1',
    freelancerName: 'Elena Rostova',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'ui-ux',
    startingPrice: 350,
    rating: 4.98,
    reviewsCount: 142,
    deliveryDays: 3,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    tags: ['Figma', 'SaaS', 'UI/UX', 'Design System', 'Dashboard'],
    packages: {
      basic: {
        name: 'Starter Concept',
        price: 350,
        deliveryDays: 3,
        revisions: 2,
        description: 'Up to 3 responsive screens (Landing page or Dashboard view) with auto-layout Figma source files.',
        features: ['3 Screens UI/UX', 'Figma Source File', 'Mobile Responsive', 'Prototype Links', 'Commercial License']
      },
      standard: {
        name: 'Full Web App & SaaS',
        price: 850,
        deliveryDays: 6,
        revisions: 4,
        description: 'Complete 8-screen SaaS user flow, component system, dark & light mode tokens, and interactive click-through prototype.',
        features: ['8 Core Screens', 'Figma Design System Tokens', 'Dark/Light Variants', 'Clickable Prototype', 'User Flow Mapping', 'Developer Handoff Notes']
      },
      pro: {
        name: 'Enterprise Scale Suite',
        price: 1800,
        deliveryDays: 12,
        revisions: 'Unlimited',
        description: 'End-to-end 20+ screen system with full atomic component library, responsive breakpoints, user testing notes, and video walkthrough.',
        features: ['20+ Screens Complete App', 'Full Atomic Design System', 'Dedicated Slack Sync Channel', 'Interactive Micro-interactions', 'Priority 24/7 Support', 'Tailwind CSS Spec Guide']
      }
    }
  },
  {
    id: 'service-2',
    title: 'I will develop custom AI Agents, RAG pipeline, and LLM web applications',
    slug: 'custom-ai-agents-rag-pipeline',
    freelancerId: 'freelancer-2',
    freelancerName: 'Marcus Chen',
    freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'ai-ml',
    startingPrice: 500,
    rating: 5.0,
    reviewsCount: 98,
    deliveryDays: 4,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    tags: ['AI Agent', 'LangChain', 'Python', 'OpenAI', 'RAG Pipeline'],
    packages: {
      basic: {
        name: 'API & Prompt Orchestration',
        price: 500,
        deliveryDays: 4,
        revisions: 2,
        description: 'Connect Gemini/OpenAI models to your app with custom system prompting, tool calling, and JSON schema validation.',
        features: ['LLM API Integration', 'Prompt Architecture', 'Error & Rate-limit Handling', 'Unit Tests Included']
      },
      standard: {
        name: 'Custom RAG & Knowledge Base',
        price: 1200,
        deliveryDays: 7,
        revisions: 3,
        description: 'Full document ingestion pipeline with vector embeddings (Pinecone/pgvector), semantic search, and streaming chat UI.',
        features: ['Vector DB Setup', 'Document Chunker & Ingestion', 'Streaming UI Integration', 'FastAPI Backend', 'Dockerized Setup']
      },
      pro: {
        name: 'Autonomous Multi-Agent System',
        price: 2600,
        deliveryDays: 14,
        revisions: 5,
        description: 'Production-ready agentic system with LangGraph, external tool execution, human-in-the-loop fallback, and cloud deployment.',
        features: ['Multi-agent Workflows', 'LangGraph Architecture', 'Database & API Tool Tooling', 'CI/CD Cloud Deployment', 'Live Observability Dashboard']
      }
    }
  },
  {
    id: 'service-3',
    title: 'I will build a modern, high-performance React & Next.js web application',
    slug: 'react-nextjs-web-application',
    freelancerId: 'freelancer-3',
    freelancerName: 'Amina Al-Mansoor',
    freelancerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Top Rated',
    category: 'web-dev',
    startingPrice: 280,
    rating: 4.95,
    reviewsCount: 210,
    deliveryDays: 3,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Full-Stack'],
    packages: {
      basic: {
        name: 'Responsive Landing Page',
        price: 280,
        deliveryDays: 3,
        revisions: 2,
        description: 'Single-page ultra-fast landing page with Tailwind CSS, clean semantic HTML, and 95+ Google Lighthouse score.',
        features: ['Responsive UI', 'Clean TypeScript Code', 'Contact Form Integration', 'SEO Optimized']
      },
      standard: {
        name: 'Multi-Page Web App',
        price: 700,
        deliveryDays: 6,
        revisions: 4,
        description: 'Up to 5 dynamic pages with authentication, backend API integration, database connectivity, and animated transitions.',
        features: ['5 Connected Pages', 'Auth & Session Setup', 'Backend API Integration', 'State Management', 'Speed Optimization']
      },
      pro: {
        name: 'Full-Stack Custom SaaS',
        price: 1500,
        deliveryDays: 12,
        revisions: 'Unlimited',
        description: 'Complete scalable SaaS with Stripe billing subscription, multi-tenant dashboard, database schema, and automated tests.',
        features: ['Complete SaaS Architecture', 'Stripe Billing & Webhooks', 'PostgreSQL / Prisma Integration', 'Role-based Access Control', 'Admin Dashboard']
      }
    }
  },
  {
    id: 'service-4',
    title: 'I will engineer scalable Kubernetes & AWS DevOps infrastructure with Terraform',
    slug: 'kubernetes-aws-devops-terraform',
    freelancerId: 'freelancer-5',
    freelancerName: 'David Vance',
    freelancerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'cloud-devops',
    startingPrice: 450,
    rating: 4.99,
    reviewsCount: 165,
    deliveryDays: 3,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tags: ['AWS', 'Kubernetes', 'Terraform', 'DevOps', 'Docker'],
    packages: {
      basic: {
        name: 'Docker & CI/CD Pipeline',
        price: 450,
        deliveryDays: 3,
        revisions: 2,
        description: 'Containerize your app and set up automated GitHub Actions workflow for automated testing and staging deploys.',
        features: ['Optimized Dockerfile', 'GitHub Actions Pipeline', 'Staging Deploy Setup', 'Security Linting']
      },
      standard: {
        name: 'AWS Terraform Architecture',
        price: 1100,
        deliveryDays: 5,
        revisions: 3,
        description: 'Production-ready AWS VPC with ECS/EKS clusters, RDS multi-AZ databases, CloudFront CDN, and SSL setup via Terraform.',
        features: ['Infrastructure as Code (IaC)', 'EKS/ECS Cluster Config', 'Multi-AZ Database Failover', 'SSL & DNS Setup', 'Cost Optimization Audit']
      },
      pro: {
        name: 'Enterprise SOC2 Cloud Setup',
        price: 2400,
        deliveryDays: 10,
        revisions: 4,
        description: 'Complete SOC2-ready architecture with automated secret rotation, Datadog/Grafana monitoring, WAF DDoS defense, and disaster recovery.',
        features: ['SOC2 Compliance Baseline', 'Real-time Datadog/Grafana', 'Zero-trust IAM Policies', 'Automated Backups & DR Plan', '2 Weeks Post-launch Support']
      }
    }
  },
  {
    id: 'service-5',
    title: 'I will develop a responsive Next.js & React website for your business',
    slug: 'responsive-nextjs-react-website-development',
    freelancerId: 'freelancer-7',
    freelancerName: 'Tanvir Ahmed',
    freelancerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'web-dev',
    startingPrice: 200,
    rating: 4.97,
    reviewsCount: 178,
    deliveryDays: 4,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    tags: ['Web Developer', 'Next.js', 'React', 'Full-Stack', 'Website Development', 'TypeScript'],
    packages: {
      basic: {
        name: 'Single Landing Page',
        price: 200,
        deliveryDays: 4,
        revisions: 3,
        description: 'Responsive Next.js 15 landing page with Tailwind CSS, contact form, and SEO-ready meta tags.',
        features: ['Responsive UI', 'SEO Structured Tags', 'Speed Optimized', 'Contact Form Integration']
      },
      standard: {
        name: 'Full Business Website',
        price: 550,
        deliveryDays: 7,
        revisions: 5,
        description: 'Multi-page Next.js web application with CMS integration, blog, dark mode, and analytics setup.',
        features: ['5-8 Custom Pages', 'CMS Headless Integration', 'Google Analytics & Tag Manager', 'Mobile Responsive']
      },
      pro: {
        name: 'Custom Web Application / SaaS',
        price: 1200,
        deliveryDays: 14,
        revisions: 'Unlimited',
        description: 'Full-stack application with authentication, database models, payment gateway integration, and API routes.',
        features: ['PostgreSQL & Prisma', 'Authentication & Auth0/Clerk', 'Payment Gateway Integration', 'Production Deployment']
      }
    }
  },
  {
    id: 'service-6',
    title: 'I will design a modern brand identity, logo, and UI/UX design in Figma',
    slug: 'brand-identity-logo-design-figma',
    freelancerId: 'freelancer-8',
    freelancerName: 'Nusrat Jahan',
    freelancerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'ui-ux',
    startingPrice: 180,
    rating: 4.96,
    reviewsCount: 152,
    deliveryDays: 3,
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    tags: ['Graphic Designer', 'Logo Design', 'Branding', 'Figma', 'UI UX Design', 'Brand Identity'],
    packages: {
      basic: {
        name: 'Logo & Basic Brand Kit',
        price: 180,
        deliveryDays: 3,
        revisions: 3,
        description: '3 custom logo concepts with vector files (AI, SVG, PNG) and color palette guidelines.',
        features: ['3 Unique Logo Concepts', 'Vector Source Files', 'Color Palette & Typography', 'Social Media Icons']
      },
      standard: {
        name: 'Complete Brand Identity & Guidelines',
        price: 450,
        deliveryDays: 6,
        revisions: 5,
        description: 'Full corporate brand guide, stationery kit, social media banners, and presentation deck template.',
        features: ['Comprehensive Brand Book', 'Stationery Kit (Cards, Letterhead)', 'Social Media Kit', 'Figma Assets']
      },
      pro: {
        name: 'Brand Identity + 5-Screen UI Prototype',
        price: 950,
        deliveryDays: 10,
        revisions: 'Unlimited',
        description: 'Complete brand identity plus 5 high-converting responsive web or mobile UI screens in Figma.',
        features: ['Full Brand Identity System', '5 Figma UI Screens', 'Interactive Clickable Prototype', 'Component Library']
      }
    }
  },
  {
    id: 'service-7',
    title: 'I will execute technical SEO and on-page optimization for Google ranking',
    slug: 'technical-seo-on-page-google-ranking',
    freelancerId: 'freelancer-9',
    freelancerName: 'Rakibul Hasan',
    freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    freelancerBadge: 'Talentio Pro',
    category: 'growth-seo',
    startingPrice: 150,
    rating: 4.95,
    reviewsCount: 134,
    deliveryDays: 5,
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    tags: ['SEO Expert', 'Technical SEO', 'Keyword Research', 'On-Page SEO', 'Digital Marketing'],
    packages: {
      basic: {
        name: 'Technical SEO Audit & Roadmap',
        price: 150,
        deliveryDays: 5,
        revisions: 2,
        description: 'Comprehensive crawl analysis, indexing error diagnostics, Core Web Vitals report, and actionable fixes.',
        features: ['Full Technical Audit (PDF)', 'Schema Markup Audit', 'Crawlability & Indexing Report', '30-Min Action Call']
      },
      standard: {
        name: 'Full On-Page SEO & Keyword Strategy',
        price: 380,
        deliveryDays: 8,
        revisions: 4,
        description: 'In-depth keyword mapping, on-page title/meta optimization, internal linking blueprint, and schema markup.',
        features: ['Keyword Map (50+ Terms)', 'On-Page Meta Optimization', 'JSON-LD Schema Implementation', 'Competitor Gap Analysis']
      },
      pro: {
        name: 'Complete Monthly SEO Growth Package',
        price: 850,
        deliveryDays: 20,
        revisions: 'Unlimited',
        description: 'Full-spectrum SEO including technical implementation, 4 optimized content briefs, and local SEO citations.',
        features: ['Hands-on Technical Fixes', '4 SEO Content Briefs', 'Local SEO & Google Business', 'Monthly Performance Report']
      }
    }
  }
];

export const TALENTIO_OPEN_PROJECTS: ProjectJob[] = [
  {
    id: 'job-1',
    title: 'Senior Figma Product Designer for B2B Supply Chain Platform',
    clientName: 'Nexus Global Logistics',
    clientCompany: 'Nexus Corp',
    clientCountry: 'United Kingdom 🇬🇧',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    budget: 3500,
    budgetType: 'fixed',
    duration: '2-4 weeks',
    proposalsCount: 8,
    postedAgo: '3 hours ago',
    description: 'We need an experienced product designer to redesign our enterprise fleet tracking and dispatch web application. Deliverables include Figma component library, responsive dashboards, and interactive prototypes.',
    skills: ['Figma', 'UI/UX Design', 'Dashboard Design', 'Design Systems', 'B2B SaaS'],
    verifiedPayment: true,
    category: 'ui-ux'
  },
  {
    id: 'job-2',
    title: 'Build Autonomous AI Agent Workflow for Customer Success (LangGraph)',
    clientName: 'AeroTech Intelligence',
    clientCompany: 'AeroTech Inc',
    clientCountry: 'United States 🇺🇸',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    budget: 4800,
    budgetType: 'fixed',
    duration: '1-2 months',
    proposalsCount: 14,
    postedAgo: '5 hours ago',
    description: 'Seeking a seasoned AI Engineer to build a multi-agent system that analyzes incoming support tickets, drafts verified responses using our internal documentation vectors, and escalates edge cases.',
    skills: ['Python', 'LangGraph', 'RAG Pipelines', 'OpenAI / Gemini', 'FastAPI', 'PostgreSQL'],
    verifiedPayment: true,
    category: 'ai-ml'
  },
  {
    id: 'job-3',
    title: 'Full-Stack Next.js 15 & Tailwind Developer for Real-Time Marketplace',
    clientName: 'Veloce Digital Media',
    clientCompany: 'Veloce Media',
    clientCountry: 'Germany 🇩🇪',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    budget: 65,
    budgetType: 'hourly',
    duration: '3 months',
    proposalsCount: 19,
    postedAgo: '1 day ago',
    description: 'Looking for a dedicated full-stack engineer to lead frontend architecture and real-time WebSocket features for our digital asset marketplace. Must have deep experience with React 19, TypeScript, and Tailwind.',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'PostgreSQL'],
    verifiedPayment: true,
    category: 'web-dev'
  },
  {
    id: 'job-4',
    title: 'Hire Freelance Web Developer for Multi-Vendor eCommerce Store in Bangladesh',
    clientName: 'Bengal Artisan Marketplace',
    clientCompany: 'Bengal Exports Ltd.',
    clientCountry: 'Bangladesh 🇧🇩',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    budget: 1200,
    budgetType: 'fixed',
    duration: '3-4 weeks',
    proposalsCount: 11,
    postedAgo: '6 hours ago',
    description: 'Looking to hire a skilled freelance web developer in Bangladesh to build a custom eCommerce storefront with bKash, Nagad, and Stripe payment gateways. Must be responsive and fast.',
    skills: ['React', 'Next.js', 'Node.js', 'eCommerce', 'Payment Gateway Integration', 'Tailwind CSS'],
    verifiedPayment: true,
    category: 'web-dev'
  },
  {
    id: 'job-5',
    title: 'Freelance SEO Expert for Local Business & Organic Google Ranking',
    clientName: 'Apex Health Services',
    clientCompany: 'Apex Care',
    clientCountry: 'Bangladesh 🇧🇩',
    clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    budget: 650,
    budgetType: 'fixed',
    duration: '1-2 months',
    proposalsCount: 9,
    postedAgo: '12 hours ago',
    description: 'Seeking a verified freelance SEO expert in Bangladesh for technical on-page audits, local search visibility, and organic keyword ranking improvements for our expanding clinic network.',
    skills: ['SEO', 'Technical SEO', 'Local SEO', 'Keyword Research', 'Google Analytics', 'Digital Marketing'],
    verifiedPayment: true,
    category: 'growth-seo'
  }
];

export const INITIAL_ESCROW_CONTRACT: EscrowContract = {
  id: 'contract-89421',
  orderNumber: 'TL-894218',
  title: 'Modern Responsive SaaS Web Application in React & Tailwind',
  clientName: 'Alexander Vance (UK 🇬🇧)',
  clientCountry: 'United Kingdom',
  freelancerName: 'Elena Rostova',
  freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  totalAmount: 850,
  escrowFunded: true,
  status: 'in_progress',
  remainingSeconds: 2 * 86400 + 14 * 3600 + 22 * 60, // 2 days 14 hours
  deliverables: [
    { id: 'del-1', name: 'figma_design_system_tokens.fig', size: '14.2 MB', date: 'Yesterday' },
    { id: 'del-2', name: 'react_saas_production_build.zip', size: '28.6 MB', date: 'Just now' }
  ],
  milestones: [
    { id: 'm1', name: 'Milestone 1: Wireframes & Figma Design Tokens', amount: 350, status: 'completed', dueDate: 'Completed' },
    { id: 'm2', name: 'Milestone 2: Frontend Code & Responsive Components', amount: 300, status: 'in_progress', dueDate: '2 Days Remaining' },
    { id: 'm3', name: 'Milestone 3: Final Testing & Production Deployment', amount: 200, status: 'pending', dueDate: 'Pending M2' }
  ],
  deliveryMessage: 'Hi Alexander! Here is the latest production build bundle along with the full Figma token configuration. All components pass accessibility audits with zero console warnings.'
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'client',
    senderName: 'Alexander Vance',
    text: 'Hi Elena! I reviewed your portfolio and was thoroughly impressed with your design system work on NeoPay. We have an active project for a fintech SaaS analytics platform.',
    timestamp: '10:14 AM'
  },
  {
    id: 'msg-2',
    sender: 'freelancer',
    senderName: 'Elena Rostova',
    text: 'Hello Alexander! Thank you for reaching out. Fintech analytics is right in my core expertise. Could you share your target launch timeline and any initial user stories you have drafted?',
    timestamp: '10:18 AM'
  },
  {
    id: 'msg-3',
    sender: 'client',
    senderName: 'Alexander Vance',
    text: 'Our target is to launch the MVP in 3 weeks. We need 8 core dashboard screens with responsive layouts and dark mode support.',
    timestamp: '10:22 AM'
  },
  {
    id: 'msg-4',
    sender: 'freelancer',
    senderName: 'Elena Rostova',
    text: 'That timeline fits perfectly into my schedule. I can deliver the full 8-screen system in Figma with auto-layout and developer tokens for $850 with 6-day delivery and full escrow protection.',
    timestamp: '10:25 AM',
    isOffer: true,
    offerDetails: {
      title: 'Custom Milestone Offer: 8 Core SaaS Screens & Figma Design Tokens',
      amount: 850,
      deliveryDays: 6,
      status: 'pending'
    }
  }
];
