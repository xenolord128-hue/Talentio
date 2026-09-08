/**
 * TALENTIO AI ASSISTANT — MASTER KNOWLEDGE BASE
 * Centralized, verified knowledge repository for Talentio Marketplace.
 * Strictly adheres to verified platform functionality and multi-role security constraints.
 */

export interface KnowledgeItem {
  id: string;
  topic: string;
  keywords: string[];
  audience: 'public' | 'client' | 'freelancer' | 'admin';
  answerEn: string;
  answerBn: string;
  suggestedAction?: {
    type: 'navigate' | 'modal';
    target: string;
    labelEn: string;
    labelBn: string;
  };
}

export const TALENTIO_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. Platform Overview
  {
    id: 'what-is-talentio',
    topic: 'What is Talentio',
    keywords: ['what is talentio', 'about talentio', 'overview', 'ট্যালেন্টিও কি', 'ট্যালেন্টিও সম্পর্কে', 'platform overview'],
    audience: 'public',
    answerEn: 'TALENTIO is an international freelance marketplace where clients can find, hire, and collaborate with vetted freelancers, and freelancers can offer milestone services, find jobs, submit proposals, complete projects, and build their professional reputation with 100% secure escrow protection.',
    answerBn: 'TALENTIO হলো একটি আধুনিক আন্তর্জাতিক ফ্রিল্যান্স মার্কেটপ্লেস যেখানে বায়ার বা ক্লায়েন্টরা দক্ষ ফ্রিল্যান্সারদের খুঁজে নিয়ে হায়ার করতে পারেন এবং ফ্রিল্যান্সাররা তাদের গিগ/সার্ভিস অফার করতে পারেন, জবে বিড করতে পারেন এবং ১০০% নিরাপদ এসক্রো পেমেন্টের মাধ্যমে প্রজেক্ট সম্পন্ন করে আয় করতে পারেন।',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Explore Marketplace',
      labelBn: 'মার্কেটপ্লেস ঘুরে দেখুন'
    }
  },
  {
    id: 'how-it-works',
    topic: 'How Talentio Works',
    keywords: ['how does it work', 'how talentio works', 'workflow', 'কিভাবে কাজ করে', 'কীভাবে কাজ করে', 'ওয়ার্কফ্লো'],
    audience: 'public',
    answerEn: 'Talentio works through 4 simple steps:\n1. Search & Discover: Browse curated service gigs or post a custom job RFP with your budget.\n2. Hire & Escrow: Select a freelancer and deposit funds safely into Talentio Escrow.\n3. Collaborate & Deliver: Work together via real-time chat, file sharing, and milestones.\n4. Review & Release: Approve the completed deliverable to release payment to the freelancer.',
    answerBn: 'Talentio মূলত ৪টি সহজ ধাপে কাজ করে:\n১. খুঁজুন বা প্রজেক্ট পোস্ট করুন: আপনার প্রয়োজন অনুযায়ী সার্ভিস গিগ ব্রাউজ করুন অথবা নিজস্ব বাজেট দিয়ে জব পোস্ট করুন।\n২. হায়ার ও এসক্রো ডিপোজিট: পছন্দের ফ্রিল্যান্সারকে নির্বাচন করুন এবং এসক্রো অ্যাকাউন্টে নিরাপদে ফান্ড ডিপোজিট করুন।\n৩. লাইভ চ্যাট ও কোলাবোরেশন: রিয়েল-টাইম চ্যাট ও ফাইল শেয়ারিংয়ের মাধ্যমে কাজ পরিচালনা করুন।\n৪. ফাইল চেক ও পেমেন্ট রিলিজ: সন্তোষজনক কাজ পাওয়ার পর ডেলিভারি অ্যাপ্রুভ করে ফ্রিল্যান্সারকে পেমেন্ট রিলিজ করে দিন।',
    suggestedAction: {
      type: 'navigate',
      target: 'services',
      labelEn: 'Browse Services',
      labelBn: 'সার্ভিস ব্রাউজ করুন'
    }
  },

  // 2. Client Support
  {
    id: 'client-find-freelancer',
    topic: 'How to Find a Freelancer',
    keywords: ['find freelancer', 'hire someone', 'hire talent', 'how to hire', 'হায়ার কীভাবে করব', 'ফ্রিল্যান্সার কিভাবে খুঁজব', 'লোক দরকার'],
    audience: 'client',
    answerEn: 'To find and hire a freelancer on Talentio:\n1. Open the Talent Directory or Services Catalog.\n2. Filter by category, skills, hourly rate, or top-rated badges.\n3. Review freelancer profiles, verified portfolios, ratings, and client feedback.\n4. Send a direct message or click "Order Service" to initiate a milestone contract.',
    answerBn: 'ট্যালেন্টিওতে ফ্রিল্যান্সার খুঁজে হায়ার করার নিয়ম:\n১. ট্যালেন্ট ডিরেক্টরি বা সার্ভিস ক্যাটালগ ওপেন করুন।\n২. আপনার প্রয়োজনীয় ক্যাটাগরি, স্কিল এবং বাজেট অনুযায়ী ফিল্টার করুন।\n৩. ফ্রিল্যান্সারের প্রোফাইল, ভেরিফাইড পোর্টফোলিও এবং পূর্ববর্তী বায়ার রিভিউ দেখুন।\n৪. সরাসরি মেসেজ দিন অথবা "Hire / Order Service" বাটনে চাপ দিয়ে নিরাপদ এসক্রো অর্ডার শুরু করুন।',
    suggestedAction: {
      type: 'navigate',
      target: 'freelancers',
      labelEn: 'View Top Talent',
      labelBn: 'টপ ট্যালেন্টদের দেখুন'
    }
  },
  {
    id: 'client-post-job',
    topic: 'How to Post a Job',
    keywords: ['post job', 'create job', 'post project', 'job rfp', 'জব পোস্ট করব কীভাবে', 'প্রজেক্ট পোস্ট', 'নতুন কাজ দেব'],
    audience: 'client',
    answerEn: 'To post a job on Talentio:\n1. Click "Post a Project" from the top navigation or Job Marketplace.\n2. Enter a clear project title and detailed requirements.\n3. Choose your category, delivery timeline, and milestone budget.\n4. Publish the job to start receiving proposals from verified freelancers.\n5. Compare bids, chat with applicants, and award the contract.',
    answerBn: 'নতুন প্রজেক্ট বা জব পোস্ট করার ধাপসমূহ:\n১. উপরের মেনু থেকে "Post a Project" বাটন অথবা জব মার্কেটপ্লেসে যান।\n২. কাজের স্পষ্ট শিরোনাম এবং বিস্তারিত রিকোয়ারমেন্ট লিখুন।\n৩. কাজের ক্যাটাগরি, ডেলিভারির সময় এবং মাইলস্টোন বাজেট নির্ধারণ করুন।\n৪. প্রজেক্টটি পাবলিশ করুন; মুহূর্তের মধ্যেই দক্ষ ফ্রিল্যান্সাররা প্রস্তাব পাঠানো শুরু করবে।\n৫. প্রস্তাবগুলো যাচাই করে সেরা ফ্রিল্যান্সারকে নির্বাচন করুন।',
    suggestedAction: {
      type: 'modal',
      target: 'post-job-modal',
      labelEn: 'Post a Project Now',
      labelBn: 'এখনই প্রজেক্ট পোস্ট করুন'
    }
  },
  {
    id: 'client-buy-gig',
    topic: 'How to Buy a Service Gig',
    keywords: ['buy gig', 'purchase service', 'order gig', 'গিগ কিনব কিভাবে', 'সার্ভিস কিনব', 'অর্ডার করব'],
    audience: 'client',
    answerEn: 'To purchase a service gig:\n1. Browse the Services page and click on your desired service gig.\n2. Choose a pricing tier (Starter, Professional, or Enterprise).\n3. Review deliverables, revision count, and estimated delivery days.\n4. Click "Continue to Escrow" to fund the order securely.\n5. Provide project requirements to the seller to begin work.',
    answerBn: 'সার্ভিস গিগ কেনার নিয়ম:\n১. সার্ভিস পেজে গিয়ে আপনার পছন্দের গিগে ক্লিক করুন।\n২. স্টার্টার, প্রফেশনাল বা এন্টারপ্রাইজ টিয়ার নির্বাচন করুন।\n৩. ডেলিভারির সময়, রিভিশন সংখ্যা এবং কাজের বিবরণ দেখে নিন।\n৪. "Continue to Escrow" বাটনে চাপ দিয়ে নিরাপদে ফান্ড জমা করুন।\n৫. সেলারকে প্রয়োজনীয় ফাইল ও ব্রিফিং প্রদান করুন যাতে তিনি কাজ শুরু করতে পারেন।',
    suggestedAction: {
      type: 'navigate',
      target: 'services',
      labelEn: 'Explore Gigs',
      labelBn: 'গিগগুলো দেখুন'
    }
  },

  // 3. Freelancer Support
  {
    id: 'freelancer-become',
    topic: 'How to Become a Freelancer',
    keywords: ['become freelancer', 'join as seller', 'start freelancing', 'ফ্রিল্যান্সার কিভাবে হব', 'ফ্রিল্যান্সিং শুরু করব কীভাবে', 'সেলার অ্যাকাউন্ট'],
    audience: 'freelancer',
    answerEn: 'To become a freelancer on Talentio:\n1. Create your account and set your role as "Freelancer / Seller".\n2. Complete your 6-step professional profile onboarding (bio, skills, hourly rate, and portfolio).\n3. Complete KYC verification.\n4. Once your seller profile is verified, you can publish gigs and submit bids on open jobs.',
    answerBn: 'ট্যালেন্টিওতে ফ্রিল্যান্সার হিসেবে কাজ শুরু করার নিয়ম:\n১. সাইন-আপ করার সময় "Freelancer / Seller" রোল নির্বাচন করুন।\n২. আপনার ৬-ধাপের প্রোফাইল অনবোর্ডিং (বায়ো, স্কিল, আওয়ারলি রেট ও পোর্টফোলিও) সম্পন্ন করুন।\n৩. আইডেন্টিটি বা এনআইডি ভেরিফিকেশন (KYC) জমা দিন।\n৪. প্রোফাইল অ্যাপ্রুভ হওয়ার সাথে সাথে আপনি নিজস্ব গিগ পাবলিশ করতে এবং জবে প্রপোজাল পাঠাতে পারবেন।',
    suggestedAction: {
      type: 'navigate',
      target: 'profile',
      labelEn: 'Complete Profile',
      labelBn: 'প্রোফাইল পূরণ করুন'
    }
  },
  {
    id: 'freelancer-create-gig',
    topic: 'How to Create a Gig',
    keywords: ['create gig', 'publish gig', 'new service', 'গিগ বানাব কীভাবে', 'সার্ভিস তৈরি করব কীভাবে', 'গিগ আপলোড'],
    audience: 'freelancer',
    answerEn: 'To create a service gig:\n1. Ensure your seller account is verified.\n2. Click "Create & Publish Gig" in the menu or dashboard.\n3. Add a clear title (e.g., "I will build a responsive React web app").\n4. Select relevant category and tags.\n5. Configure pricing tiers (Starter, Pro, Enterprise) and delivery timelines.\n6. Upload portfolio preview media and publish.',
    answerBn: 'নতুন গিগ তৈরি করার নিয়ম:\n১. নিশ্চিত করুন আপনার সেলার প্রোফাইলটি ভেরিফাইড।\n২. মেনু অথবা ড্যাশবোর্ড থেকে "Create & Publish Gig" বাটনে ক্লিক করুন।\n৩. একটি আকর্ষণীয় শিরোনাম লিখুন (যেমন: "I will design a modern UI/UX for your mobile app")।\n৪. কাজের ক্যাটাগরি ও স্কিল ট্যাগ সিলেক্ট করুন।\n৫. স্টার্টার, প্রো এবং এন্টারপ্রাইজ টিয়ারের দাম ও ডেলিভারি দিন নির্ধারণ করুন।\n৬. পোর্টফোলিও ছবি/মিডিয়া যুক্ত করে গিগটি পাবলিশ করুন।',
    suggestedAction: {
      type: 'modal',
      target: 'create-gig-modal',
      labelEn: 'Create a Gig Now',
      labelBn: 'এখনই গিগ তৈরি করুন'
    }
  },
  {
    id: 'freelancer-find-jobs',
    topic: 'How to Find Jobs & Submit Proposals',
    keywords: ['find jobs', 'submit proposal', 'bid on job', 'কাজ খুঁজব কীভাবে', 'প্রপোজাল পাঠাব কিভাবে', 'বিড করার নিয়ম'],
    audience: 'freelancer',
    answerEn: 'To find client projects and bid:\n1. Open the Job Marketplace.\n2. Filter open RFP projects matching your skillset.\n3. Review job scope, client budget, and milestone requirements.\n4. Click "Submit Proposal", write a personalized cover letter, specify your delivery days and bid price.\n5. Once the client awards you the contract, work begins safely in Escrow.',
    answerBn: 'ওপেন জবে বিড বা প্রপোজাল পাঠানোর নিয়ম:\n১. জব মার্কেটপ্লেস ওপেন করুন।\n২. আপনার স্কিল ও অভিজ্ঞতার সাথে মানানসই প্রজেক্টগুলো ফিল্টার করুন।\n৩. কাজের ডেসক্রিপশন, বায়ারের বাজেট ও ডেডলাইন পড়ুন।\n৪. "Submit Proposal" বাটনে চাপ দিন, কভার লেটার লিখুন এবং আপনার অফার প্রাইজ উল্লেখ করে বিড সাবমিট করুন।\n৫. ক্লায়েন্ট আপনার প্রস্তাব গ্রহণ করে এসক্রোতে ফান্ড ডিপোজিট করলে ওয়ার্কস্টেশনে কাজ শুরু করুন।',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Browse Job Marketplace',
      labelBn: 'জব মার্কেটপ্লেস দেখুন'
    }
  },

  // 4. Payments, Escrow & Security
  {
    id: 'escrow-system',
    topic: 'How Escrow Works',
    keywords: ['how escrow works', 'payment protection', 'is it safe', 'money safe', 'এসক্রো কি', 'টাকা নিরাপদ কিনা', 'পেমেন্ট সিকিউরিটি'],
    audience: 'public',
    answerEn: 'Talentio Escrow guarantees 100% financial protection for both parties:\n- For Clients: Your payment is held securely in escrow and is NOT released to the freelancer until you inspect and approve the milestone deliverable.\n- For Freelancers: You work with complete confidence knowing the client has already funded the milestone into Talentio Escrow before you begin.',
    answerBn: 'Talentio এসক্রো বায়ার ও ফ্রিল্যান্সার উভয়ের জন্যই ১০০% আর্থিক সুরক্ষা নিশ্চিত করে:\n- বায়ারদের জন্য: আপনার পেমেন্ট এসক্রো অ্যাকাউন্টে সুরক্ষিতভাবে আটকে থাকে এবং যতক্ষণ না আপনি কাজের ডেলিভারি দেখে অনুমোদন দেন, ততক্ষণ টাকা ফ্রিল্যান্সারকে দেওয়া হয় না।\n- ফ্রিল্যান্সারদের জন্য: আপনি শতভাগ নিশ্চিত থাকতে পারেন যে কাজ শুরু করার পূর্বেই বায়ার এসক্রোতে সম্পূর্ণ টাকা জমা রেখেছেন, ফলে কাজ শেষে পেমেন্ট না পাওয়ার কোনো ঝুঁকি নেই।',
    suggestedAction: {
      type: 'navigate',
      target: 'workstation',
      labelEn: 'Open Escrow Workstation',
      labelBn: 'এসক্রো ওয়ার্কস্টেশন দেখুন'
    }
  },
  {
    id: 'release-payment',
    topic: 'Releasing Milestone Payment',
    keywords: ['release payment', 'release escrow', 'approve milestone', 'পেমেন্ট রিলিজ করব কীভাবে', 'টাকা ছাড়ব কিভাবে'],
    audience: 'client',
    answerEn: 'To release payment for a completed milestone:\n1. Open your Escrow Workstation.\n2. Review the submitted deliverable files and links.\n3. If satisfied, click "Approve Deliverable & Release Escrow".\n4. The funds transfer instantly to the freelancer balance, and you can leave a public review.',
    answerBn: 'মাইলস্টোনের টাকা রিলিজ করার নিয়ম:\n১. আপনার এসক্রো ওয়ার্কস্টেশন ওপেন করুন।\n২. ফ্রিল্যান্সারের জমা দেওয়া ডেলিভারি ফাইল ও কোড যাচাই করুন।\n৩. সন্তুষ্ট হলে "Approve Deliverable & Release Escrow" বাটনে চাপ দিন।\n৪. ফান্ড স্বয়ংক্রিয়ভাবে ফ্রিল্যান্সারের অ্যাকাউন্টে ট্রান্সফার হয়ে যাবে এবং আপনি একটি স্টার রিভিউ দিতে পারবেন।',
    suggestedAction: {
      type: 'navigate',
      target: 'workstation',
      labelEn: 'Go to Workstation',
      labelBn: 'ওয়ার্কস্টেশনে যান'
    }
  },
  {
    id: 'disputes-refunds',
    topic: 'Disputes and Arbitration',
    keywords: ['dispute', 'refund', 'conflict', 'সমস্যা হলে কি হবে', 'টাকা ফেরত পাব কীভাবে', 'ডিসপিউট'],
    audience: 'public',
    answerEn: 'If a deliverable does not match agreed specifications, clients can request a revision. If the issue remains unresolved, either party can click "Request Dispute Arbitration". A Talentio dispute manager reviews the milestone agreement, chat logs, and deliverables to fairly arbitrate or refund the escrow funds.',
    answerBn: 'যদি ডেলিভারিকৃত কাজ চুক্তি অনুযায়ী না হয়, তবে বায়ার "Request Revision" দিয়ে সংশোধন চাইতে পারেন। সমাধান না হলে "Request Dispute Arbitration" বাটনে ক্লিক করলে ট্যালেন্টিওর অফিশিয়াল আরবিট্রেশন টিম উভয় পক্ষের চ্যাট হিস্ট্রি ও প্রজেক্ট ব্রিফ পর্যালোচনা করে নিরপেক্ষ সিদ্ধান্ত বা রিফান্ড প্রদান করে।',
    suggestedAction: {
      type: 'navigate',
      target: 'workstation',
      labelEn: 'View Workstation Dispute',
      labelBn: 'ওয়ার্কস্টেশন দেখুন'
    }
  },

  // 5. PWA & Mobile Widgets
  {
    id: 'android-widgets',
    topic: 'Android Home Screen Widgets & PWA',
    keywords: ['widgets', 'android widget', 'home screen widget', 'উইজেট', 'হোমস্ক্রিন উইজেট', 'মোবাইল উইজেট'],
    audience: 'public',
    answerEn: 'Talentio supports native-feel Android PWA Home Screen Widgets!\n1. Install the Talentio app via Chrome ("Add to Home screen" / "Install").\n2. Long-press the Talentio app icon on your phone\'s home screen.\n3. Tap "Widgets" to choose from Live Chat Previews, Escrow Milestones, or Platform Alerts.\n4. You can customize the widget theme (Signature Purple, AMOLED Black, Frosted Glass) inside the app menu -> "Android Home Widgets".',
    answerBn: 'ট্যালেন্টিওতে প্রিমিয়াম অ্যান্ড্রয়েড PWA হোমস্ক্রিন উইজেট সুবিধা রয়েছে!\n১. মোবাইলের ক্রোম ব্রাউজার থেকে "Add to Home screen" দিয়ে অ্যাপটি ইনস্টল করুন।\n২. আপনার মোবাইলের হোমস্ক্রিনে Talentio অ্যাপ আইকনটি চেপে ধরুন (লং-প্রেস করুন)।\n৩. "Widgets" অপশন সিলেক্ট করে চ্যাট প্রিভিউ, এসক্রো ট্র্যাকার বা নোটিশ উইজেট হোমস্ক্রিনে ড্র্যাগ করুন।\n৪. অ্যাপের মেনুতে থাকা "Android Home Widgets" অপশনে গিয়ে নিজের পছন্দমতো থিম ও কালার কাস্টমাইজ করতে পারবেন।',
    suggestedAction: {
      type: 'modal',
      target: 'widgets-modal',
      labelEn: 'Open Widget Customizer',
      labelBn: 'উইজেট কাস্টমাইজার ওপেন করুন'
    }
  }
];

// Contextual quick prompts for each page
export const PAGE_PROMPT_SUGGESTIONS: Record<string, Array<{ textEn: string; textBn: string }>> = {
  explore: [
    { textEn: 'How do I hire a freelancer?', textBn: 'ফ্রিল্যান্সার কীভাবে হায়ার করব?' },
    { textEn: 'How does Talentio Escrow work?', textBn: 'এসক্রো পেমেন্ট সুরক্ষা কীভাবে কাজ করে?' },
    { textEn: 'How can I post a project job?', textBn: 'আমি কীভাবে প্রজেক্ট পোস্ট করব?' },
    { textEn: 'How do I become a seller?', textBn: 'ফ্রিল্যান্সার হিসেবে কীভাবে জয়েন করব?' }
  ],
  services: [
    { textEn: 'How do I purchase a service gig?', textBn: 'গিগ কীভাবে অর্ডার করব?' },
    { textEn: 'How are delivery revisions handled?', textBn: 'রিভিশন ও ডেলিভারি কীভাবে হয়?' },
    { textEn: 'Take me to create a gig', textBn: 'আমাকে নতুন গিগ তৈরি করতে নিয়ে চলো' }
  ],
  freelancers: [
    { textEn: 'How are freelancers vetted on Talentio?', textBn: 'টপ রেটেড ফ্রিল্যান্সারদের যাচাই করা হয় কীভাবে?' },
    { textEn: 'How do I message a freelancer?', textBn: 'ফ্রিল্যান্সারকে সরাসরি মেসেজ দেব কীভাবে?' },
    { textEn: 'Where can I post my job requirements?', textBn: 'আমার রিকোয়ারমেন্ট কোথায় পোস্ট করব?' }
  ],
  workstation: [
    { textEn: 'How do I approve and release milestone escrow?', textBn: 'মাইলস্টোন পেমেন্ট রিলিজ করব কীভাবে?' },
    { textEn: 'What happens if I need a revision?', textBn: 'কাজে রিভিশন দরকার হলে কি করব?' },
    { textEn: 'How does dispute arbitration work?', textBn: 'ডিসপিউট বা রিফান্ড কীভাবে কাজ করে?' }
  ],
  chat: [
    { textEn: 'How do I create a custom contract offer in chat?', textBn: 'চ্যাটে কাস্টম অফার কীভাবে পাঠাব?' },
    { textEn: 'Is communication monitored for security?', textBn: 'মেসেজিং কি নিরাপদ?' },
    { textEn: 'Take me to active orders', textBn: 'আমাকে অ্যাক্টিভ অর্ডারে নিয়ে চলো' }
  ],
  dashboard: [
    { textEn: 'How do I withdraw my earnings?', textBn: 'উপার্জিত টাকা কীভাবে উত্তোলন করব?' },
    { textEn: 'How do I upgrade my escrow tier?', textBn: 'এসক্রো টিয়ার কীভাবে আপগ্রেড করব?' },
    { textEn: 'Show me my active contracts', textBn: 'আমার অ্যাক্টিভ কন্ট্রাক্টগুলো দেখাও' }
  ],
  notices: [
    { textEn: 'How do rich push notifications work?', textBn: 'ডিভাইস নোটিফিকেশন কীভাবে কাজ করে?' },
    { textEn: 'How do I setup Android home screen widgets?', textBn: 'হোমস্ক্রিন উইজেট কীভাবে বসাব?' }
  ],
  admin: [
    { textEn: 'Explain freelancer approval criteria', textBn: 'সেলার অ্যাপ্রুভালের নিয়মাবলী কি?' },
    { textEn: 'What does dispute arbitration entail?', textBn: 'ডিসপিউট ম্যানেজমেন্ট কীভাবে কাজ করে?' }
  ]
};

// Security Canned Responses (Absolute Mandates)
export const SECURITY_RESPONSES = {
  ADMIN_ACCESS_REQUEST: {
    en: 'For security reasons, I can\'t provide private admin access routes or authentication details. Authorized administrators should use the official secure access method provided by the platform owner.',
    bn: 'নিরাপত্তাজনিত কারণে আমি অ্যাডমিন অ্যাক্সেস রুট বা গোপন ক্রেডেনশিয়াল প্রদান করতে পারি না। অনুমোদিত অ্যাডমিনিস্ট্রেটরদের প্ল্যাটফর্মের অফিশিয়াল সুরক্ষিত পদ্ধতি ব্যবহার করতে হবে।'
  },
  SYSTEM_PROMPT_REQUEST: {
    en: 'I can\'t provide internal system instructions, but I can explain what I can help you with on TALENTIO.',
    bn: 'আমি অভ্যন্তরীণ সিস্টেম নির্দেশাবলী প্রকাশ করতে পারি না, তবে TALENTIO প্ল্যাটফর্ম সম্পর্কিত যেকোনো প্রশ্নে আমি আপনাকে সাহায্য করতে প্রস্তুত।'
  },
  PRIVATE_USER_DATA_REQUEST: {
    en: 'I can\'t provide another user\'s private contact information. You can contact the freelancer through TALENTIO\'s available communication features.',
    bn: 'আমি অন্য কোনো ইউজারের ব্যক্তিগত ফোন নম্বর বা ইমেইল প্রদান করতে পারি না। আপনি ট্যালেন্টিওর অফিশিয়াল লাইভ চ্যাট ফিচারের মাধ্যমে ফ্রিল্যান্সার বা বায়ারের সাথে নিরাপদ যোগাযোগ করতে পারেন।'
  },
  UNKNOWN_QUERY: {
    en: 'I don\'t have enough verified information to answer that accurately. You can consult the Talentio Help Center or contact official platform support.',
    bn: 'সঠিক উত্তর দেওয়ার মতো পর্যাপ্ত ভেরিফাইড তথ্য আমার কাছে নেই। আপনি ট্যালেন্টিও হেল্প সেন্টার ভিজিট করতে পারেন অথবা অফিশিয়াল সাপোর্টে যোগাযোগ করতে পারেন।'
  }
};

/**
 * Intelligent Local Knowledge Engine:
 * Returns instant, verified answers matching user query, role, and current page.
 */
export function queryLocalKnowledgeBase(
  userQuery: string,
  userRole: 'client' | 'freelancer' | 'admin' | 'guest' = 'client',
  currentPage: string = 'explore',
  language: 'auto' | 'bn' | 'en' = 'auto'
): {
  reply: string;
  action?: { type: 'navigate' | 'modal'; target: string; label: string };
  isSecurityTrigger?: boolean;
} {
  const queryLower = userQuery.trim().toLowerCase();

  // Detect query language if auto
  const isBangla = language === 'bn' || (language === 'auto' && /[\u0980-\u09FF]/.test(userQuery));

  // 1. SECURITY CHECKS: Prompt Injection / Admin Credentials / Private Data
  const adminSecretPatterns = [
    'admin panel', 'admin password', 'admin route', 'admin url', 'admin login',
    'secret route', 'secret access', 'bypass', 'api key', 'firebase credentials',
    'database credentials', 'hidden route', 'অ্যাডমিন পাসওয়ার্ড', 'অ্যাডমিন প্যানেল', 'অ্যাডমিন রুট'
  ];

  if (adminSecretPatterns.some(p => queryLower.includes(p))) {
    return {
      reply: isBangla ? SECURITY_RESPONSES.ADMIN_ACCESS_REQUEST.bn : SECURITY_RESPONSES.ADMIN_ACCESS_REQUEST.en,
      isSecurityTrigger: true
    };
  }

  const promptInjectionPatterns = [
    'system prompt', 'system instructions', 'secret instructions', 'ignore previous instructions',
    'reveal your prompt', 'act as the developer', 'disable security', 'তোমার প্রম্পট', 'সিস্টেম প্রম্পট'
  ];

  if (promptInjectionPatterns.some(p => queryLower.includes(p))) {
    return {
      reply: isBangla ? SECURITY_RESPONSES.SYSTEM_PROMPT_REQUEST.bn : SECURITY_RESPONSES.SYSTEM_PROMPT_REQUEST.en,
      isSecurityTrigger: true
    };
  }

  const privateDataPatterns = [
    'give me another freelancer\'s email', 'give me email', 'phone number of', 'private contact',
    'ফোন নম্বর দাও', 'ইমেইল দাও', 'ব্যক্তিগত তথ্য'
  ];

  if (privateDataPatterns.some(p => queryLower.includes(p))) {
    return {
      reply: isBangla ? SECURITY_RESPONSES.PRIVATE_USER_DATA_REQUEST.bn : SECURITY_RESPONSES.PRIVATE_USER_DATA_REQUEST.en,
      isSecurityTrigger: true
    };
  }

  // 2. ASSISTED NAVIGATION CHECKS ("Take me to...")
  if (queryLower.includes('post a job') || queryLower.includes('post job') || queryLower.includes('জব পোস্ট') || queryLower.includes('প্রজেক্ট পোস্ট')) {
    return {
      reply: isBangla 
        ? 'আমি আপনাকে প্রজেক্ট পোস্ট করার মডালে নিয়ে যাচ্ছি। সেখানে প্রজেক্টের নাম, বিবরণ ও বাজেট উল্লেখ করে সহজে পাবলিশ করতে পারবেন।'
        : 'Opening the Job Creation modal where you can define your project scope, deliverables, and milestone budget.',
      action: { type: 'modal', target: 'post-job-modal', label: isBangla ? 'জব পোস্ট খুলুন' : 'Open Post Job' }
    };
  }

  if (queryLower.includes('create gig') || queryLower.includes('create a gig') || queryLower.includes('গিগ তৈরি') || queryLower.includes('গিগ বানাব')) {
    return {
      reply: isBangla 
        ? 'আমি গিগ ক্রিয়েশন ফর্মটি ওপেন করছি। আপনার সার্ভিসের আকর্ষণীয় টাইটেল, প্রাইসিং টিয়ার ও বিবরণ যুক্ত করুন।'
        : 'Opening the Gig Creation wizard where you can configure tiers, pricing, and portfolio showcases.',
      action: { type: 'modal', target: 'create-gig-modal', label: isBangla ? 'গিগ মডাল খুলুন' : 'Open Create Gig' }
    };
  }

  if (queryLower.includes('widget') || queryLower.includes('উইজেট') || queryLower.includes('home screen')) {
    return {
      reply: isBangla
        ? 'অ্যান্ড্রয়েড লাইভ হোমস্ক্রিন উইজেট কাস্টমাইজার ওপেন করা হচ্ছে। এখান থেকে আপনি চ্যাট প্রিভিউ, এসক্রো ট্র্যাকার এবং পছন্দমতো কালার থিম নির্বাচন করতে পারবেন।'
        : 'Opening the Android Live Home Screen Widget Suite and Customizer where you can configure your chat preview or milestone tracker.',
      action: { type: 'modal', target: 'widgets-modal', label: isBangla ? 'উইজেট কাস্টমাইজার' : 'Open Widgets' }
    };
  }

  if (queryLower.includes('chat') || queryLower.includes('message') || queryLower.includes('চ্যাট') || queryLower.includes('মেসেজ')) {
    return {
      reply: isBangla 
        ? 'আপনাকে ট্যালেন্টিওর রিয়েল-টাইম মেসেঞ্জার ও চ্যাট পেজে নিয়ে যাওয়া হচ্ছে।'
        : 'Navigating to the Talentio Live Messaging & Negotiation interface.',
      action: { type: 'navigate', target: 'chat', label: isBangla ? 'চ্যাটে যান' : 'Go to Chat' }
    };
  }

  if (queryLower.includes('workstation') || queryLower.includes('order') || queryLower.includes('escrow') || queryLower.includes('ওয়ার্কস্টেশন') || queryLower.includes('অর্ডার')) {
    return {
      reply: isBangla
        ? 'আপনাকে এসক্রো ওয়ার্কস্টেশন পেজে নিয়ে যাচ্ছি, যেখানে আপনি আপনার একটিভ অর্ডার, ফাইল ডেলিভারি ও মাইলস্টোন প্রগ্রেস দেখতে পারবেন।'
        : 'Navigating to your Escrow Workstation where you can monitor milestones, deliverables, and release protected funds.',
      action: { type: 'navigate', target: 'workstation', label: isBangla ? 'ওয়ার্কস্টেশনে যান' : 'Go to Workstation' }
    };
  }

  if (queryLower.includes('services') || queryLower.includes('gigs') || queryLower.includes('সার্ভিস') || queryLower.includes('গিগ')) {
    return {
      reply: isBangla
        ? 'ট্যালেন্টিওর সব ক্যাটাগরির সার্ভিস ও গিগ এক্সপ্লোর করার পেজে নিয়ে যাওয়া হচ্ছে।'
        : 'Navigating to the Talentio Services and Gigs catalog.',
      action: { type: 'navigate', target: 'services', label: isBangla ? 'সার্ভিস পেজে যান' : 'Go to Services' }
    };
  }

  if (queryLower.includes('freelancer') || queryLower.includes('talent') || queryLower.includes('ট্যালেন্ট') || queryLower.includes('ফ্রিল্যান্সার')) {
    return {
      reply: isBangla
        ? 'টপ-রেটেড ভেরিফাইড ফ্রিল্যান্সারদের ব্রাউজ করার ডিরেক্টরিতে নিয়ে যাচ্ছি।'
        : 'Navigating to the Talentio Verified Freelancers Directory.',
      action: { type: 'navigate', target: 'freelancers', label: isBangla ? 'ফ্রিল্যান্সার দেখুন' : 'Browse Talent' }
    };
  }

  // 3. MATCH AGAINST CENTRAL KNOWLEDGE BASE
  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of TALENTIO_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (queryLower.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 3) {
    const replyText = isBangla ? bestMatch.answerBn : bestMatch.answerEn;
    return {
      reply: replyText,
      action: bestMatch.suggestedAction ? {
        type: bestMatch.suggestedAction.type,
        target: bestMatch.suggestedAction.target,
        label: isBangla ? bestMatch.suggestedAction.labelBn : bestMatch.suggestedAction.labelEn
      } : undefined
    };
  }

  // 4. ROLE & PAGE ADAPTIVE FALLBACK
  if (isBangla) {
    return {
      reply: `আমি ট্যালেন্টিও এআই (TALENTIO AI)। আপনি বর্তমানে '${currentPage}' পেজে আছেন। আপনি কি ফ্রিল্যান্সার হায়ার করা, কাজ খোঁজা, নতুন গিগ তৈরি, জব পোস্ট বা এসক্রো পেমেন্ট সংক্রান্ত কোনো তথ্য জানতে চান?`,
      action: { type: 'navigate', target: 'explore', label: 'মার্কেটপ্লেস দেখুন' }
    };
  } else {
    return {
      reply: `I am TALENTIO AI, your intelligent marketplace assistant. You are currently on the '${currentPage}' page. Would you like assistance with hiring freelancers, posting a job RFP, creating service gigs, or managing milestone escrow?`,
      action: { type: 'navigate', target: 'explore', label: 'Explore Marketplace' }
    };
  }
}
