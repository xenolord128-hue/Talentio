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
  },

  // 6. Conversational, Greetings & Platform Identity
  {
    id: 'greeting',
    topic: 'Greetings & Welcome',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'হাই', 'হ্যালো', 'হেই', 'কেমন আছেন', 'কেমন আছো', 'সালাম', 'আসসালামু আলাইকুম', 'আদাব', 'kemon acho', 'kemon achen', 'halu'],
    audience: 'public',
    answerEn: 'Hello! I am **TALENTIO AI**, your dedicated 24/7 marketplace assistant. How can I help you today?\n\nHere are some things you can ask me:\n- 💼 How to post a project or hire top freelancers\n- 🛡️ How milestone escrow payments protect your money\n- 🚀 How to start freelancing and publish service gigs\n- 💳 Payment methods, withdrawals, and fee structure',
    answerBn: 'হ্যালো! আমি **TALENTIO AI**, আপনার সার্বক্ষণিক মার্কেটপ্লেস ও এসক্রো সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?\n\nআপনি আমাকে নিচের বিষয়গুলো সম্পর্কে জিজ্ঞাসা করতে পারেন:\n- 💼 কীভাবে প্রজেক্ট পোস্ট করবেন বা দক্ষ ফ্রিল্যান্সার হায়ার করবেন\n- 🛡️ এসক্রো পেমেন্ট সিস্টেম কীভাবে আপনার অর্থ সম্পূর্ণ সুরক্ষিত রাখে\n- 🚀 ফ্রিল্যান্সার হিসেবে অ্যাকাউন্ট খুলে কীভাবে গিগ পাবলিশ করবেন\n- 💳 পেমেন্ট মেথড, টাকা উত্তোলন (উইথড্র) ও প্ল্যাটফর্ম ফি সংক্রান্ত তথ্য',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Explore Marketplace',
      labelBn: 'মার্কেটপ্লেস দেখুন'
    }
  },
  {
    id: 'who-are-you',
    topic: 'Identity & Capabilities',
    keywords: ['who are you', 'what are you', 'your name', 'about you', 'what can you do', 'তুমি কে', 'তোমার নাম কি', 'তোমার পরিচয়', 'কি করতে পারো', 'tumi ke', 'ki korte paro'],
    audience: 'public',
    answerEn: 'I am **TALENTIO AI**, the official intelligent guide built directly into the Talentio platform.\n\nMy primary capabilities include:\n1. **Client Guidance:** Assisting you in posting project RFPs, discovering verified talent, and managing secure milestone payments.\n2. **Freelancer Coaching:** Helping you set up professional profiles, build winning service gigs, submit proposals, and deliver milestones.\n3. **Escrow Protection:** Explaining our 100% dispute-proof milestone escrow system and payout policies.\n4. **Instant Navigation:** Opening modals, guiding you to messages, workstation, or dashboard on command.',
    answerBn: 'আমি **TALENTIO AI**, ট্যালেন্টিও প্ল্যাটফর্মের অফিশিয়াল ইন্টেলিজেন্ট এআই সহকারী।\n\nআমার প্রধান কাজ ও সক্ষমতাসমূহ:\n১. **ক্লায়েন্ট সহায়তা:** নির্ভুলভাবে প্রজেক্ট পোস্ট করা, সেরা ফ্রিল্যান্সার খুঁজে বের করা এবং নিরাপদ মাইলস্টোন চুক্তি করা।\n২. **ফ্রিল্যান্সার গাইডেন্স:** আকর্ষণীয় গিগ তৈরি করা, নিখুঁত বিড বা প্রপোজাল লেখা এবং সফলভাবে কাজ জমা দেওয়া।\n৩. **এসক্রো নিরাপত্তা:** বায়ার ও সেলার উভয়ের ১০০% নিরাপদ লেনদেন ও উইথড্রয়াল নিয়মাবলী স্পষ্ট করা।\n৪. **প্ল্যাটফর্ম নেভিগেশন:** আপনার নির্দেশে তাৎক্ষণিকভাবে বিভিন্ন পেজ, চ্যাট ও সার্ভিস উইন্ডো খুলে দেওয়া।',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Explore Platform',
      labelBn: 'প্ল্যাটফর্ম ঘুরে দেখুন'
    }
  },
  {
    id: 'payments-and-withdrawals',
    topic: 'Payment Methods & Withdrawals',
    keywords: ['payment method', 'withdraw', 'payout', 'bkash', 'nagad', 'bank transfer', 'card', 'টাকা তুলব কিভাবে', 'উইথড্র', 'পেমেন্ট মেথড', 'বিকাশ', 'নগদ', 'টাকা কীভাবে পাব', 'টাকা তোলা'],
    audience: 'public',
    answerEn: 'Talentio supports seamless, secure global and local payment processing:\n- **For Deposits (Clients):** Visa, MasterCard, American Express, bKash, Nagad, and direct bank wire.\n- **For Withdrawals (Freelancers):** Once a milestone is approved by the client, funds appear in your available balance. You can withdraw directly to **bKash**, **Nagad**, or your local **Bank Account**.\n- Payouts are typically processed within 2 to 24 hours with strict end-to-end encryption.',
    answerBn: 'ট্যালেন্টিওতে পেমেন্ট ও টাকা উত্তোলনের বিশ্বস্ত ও সহজ ব্যবস্থা রয়েছে:\n- **ডিপোজিট (বায়ারদের জন্য):** ভিসা, মাস্টারকার্ড, বিকাশ (bKash), নগদ (Nagad) এবং সরাসরি ব্যাংক ট্রান্সফারের মাধ্যমে এসক্রোতে টাকা জমা দেওয়া যায়।\n- **উইথড্রয়াল (ফ্রিল্যান্সারদের জন্য):** বায়ার মাইলস্টোন অনুমোদন করার সাথে সাথে টাকা আপনার ব্যালেন্সে যুক্ত হয়। এরপর আপনি সরাসরি **বিকাশ**, **নগদ** অথবা আপনার **ব্যাংক অ্যাকাউন্টে** টাকা উত্তোলন করতে পারবেন।\n- সাধারণত ২ থেকে ২৪ ঘণ্টার মধ্যে পেমেন্ট সফলভাবে সম্পন্ন হয়।',
    suggestedAction: {
      type: 'navigate',
      target: 'dashboard',
      labelEn: 'Go to Payout Dashboard',
      labelBn: 'পে-আউট ড্যাশবোর্ডে যান'
    }
  },
  {
    id: 'fees-and-commission',
    topic: 'Fees and Commissions',
    keywords: ['fee', 'fees', 'commission', 'charges', 'cost', 'percentage', 'কমিশন কত', 'ফি কাটে কত', 'খরচ কত', 'সার্ভিস চার্জ'],
    audience: 'public',
    answerEn: 'Talentio maintains a transparent, competitive fee structure:\n- **Clients:** 0% posting fee. Free to browse and post unlimited job RFPs. Standard 3% processing fee on milestone checkout.\n- **Freelancers:** Standard 10% platform commission on completed escrow milestones (drops to 5% for Tier-3 Pro & Enterprise sellers).\n- No hidden subscription costs or forced monthly fees for standard usage.',
    answerBn: 'ট্যালেন্টিওতে স্বচ্ছ ও ন্যায্য ফি নীতিমালা রয়েছে:\n- **বায়ারদের জন্য:** সম্পূর্ণ বিনামূল্যে আনলিমিটেড জব ও প্রজেক্ট পোস্ট করা যায়। মাইলস্টোন চেকআউটের সময় স্ট্যান্ডার্ড ৩% প্রসেসিং ফি প্রযোজ্য।\n- **ফ্রিল্যান্সারদের জন্য:** সফলভাবে কাজ সম্পন্ন করার পর মাইলস্টোনের উপর স্ট্যান্ডার্ড ১০% প্ল্যাটফর্ম ফি প্রযোজ্য (যা প্রো ও এন্টারপ্রাইজ সেলারদের ক্ষেত্রে কমে ৫% এ নেমে আসে)।\n- সাধারণ কাজের জন্য কোনো বাধ্যতামূলক মাসিক সাবস্ক্রিপশন বা লুকানো ফি নেই।',
    suggestedAction: {
      type: 'navigate',
      target: 'dashboard',
      labelEn: 'View Earnings & Tiers',
      labelBn: 'আয় ও টিয়ার দেখুন'
    }
  },
  {
    id: 'kyc-verification',
    topic: 'KYC & Profile Verification',
    keywords: ['kyc', 'verification', 'verify profile', 'nid', 'blue tick', 'verified badge', 'ভেরিফিকেশন', 'আইডি ভেরিফাই', 'ব্লু ব্যাজ', 'ভেরিফাইড'],
    audience: 'public',
    answerEn: 'Getting verified on Talentio builds client trust and unlocks higher escrow tiers:\n1. Complete your 6-step profile onboarding.\n2. Submit a clear government-issued National ID (NID), Passport, or Driving License.\n3. Our security team reviews submissions within 24 hours.\n4. Verified profiles receive the official Blue Checkmark badge and increased visibility in search results.',
    answerBn: 'ট্যালেন্টিওতে প্রোফাইল ভেরিফিকেশন বায়ারের আস্থা বৃদ্ধি করে এবং কাজের সুযোগ বহুগুণ বাড়িয়ে দেয়:\n১. আপনার প্রোফাইলের ৬টি প্রাথমিক ধাপ পূরণ করুন।\n২. সরকারি জাতীয় পরিচয়পত্র (NID), পাসপোর্ট অথবা ড্রাইভিং লাইসেন্সের ছবি আপলোড করুন।\n৩. আমাদের সিকিউরিটি টিম ২৪ ঘণ্টার মধ্যে যাচাই করে অ্যাপ্রুভ করে থাকে।\n৪. ভেরিফিকেশন সফল হলে প্রোফাইলে ব্লু ভেরিফাইড ব্যাজ যুক্ত হয় এবং সার্চে অগ্রাধিকার পাওয়া যায়।',
    suggestedAction: {
      type: 'navigate',
      target: 'profile',
      labelEn: 'Open Profile Verification',
      labelBn: 'প্রোফাইল ভেরিফিকেশনে যান'
    }
  },
  {
    id: 'how-to-earn',
    topic: 'How to Earn Money as a Freelancer',
    keywords: ['earn money', 'make money', 'how to get jobs', 'income', 'টাকা আয় করব কিভাবে', 'কাজ পাওয়ার উপায়', 'কিভাবে কাজ পাব', 'বিড জেতার উপায়'],
    audience: 'freelancer',
    answerEn: 'Proven tips to win jobs and maximize earnings on Talentio:\n1. **High-Converting Portfolio:** Upload real case studies and screenshot proofs of your work.\n2. **Targeted Proposals:** Tailor your bid directly to the client\'s problem rather than copying generic templates.\n3. **Tiered Gigs:** Create Starter, Pro, and Enterprise packages to cater to different budget brackets.\n4. **Quick Response Time:** Maintain active status in Live Chat; responsive freelancers win 70% more contracts.\n5. **Escrow Delivery:** Always submit files through the Escrow Workstation for prompt milestone approvals.',
    answerBn: 'ট্যালেন্টিওতে কাজ পাওয়া এবং আয় বাড়ানোর কার্যকর টিপস:\n১. **আকর্ষণীয় পোর্টফোলিও:** আপনার পূর্ববর্তী সফল কাজের নমুনা ও স্ক্রিনশট পোর্টফোলিওতে যুক্ত করুন।\n২. **কাস্টম প্রপোজাল:** কপি-পেস্ট না করে বায়ারের নির্দিষ্ট সমস্যা ও সমাধানের কথা উল্লেখ করে প্রপোজাল লিখুন।\n৩. **টিয়ারড গিগ:** বিভিন্ন বাজেটের ক্লায়েন্টদের জন্য স্টার্টার, প্রো ও এন্টারপ্রাইজ প্যাকেজ তৈরি করুন।\n৪. **দ্রুত রিপ্লাই:** লাইভ চ্যাটে সক্রিয় থাকুন; দ্রুত রিপ্লাই দেওয়া ফ্রিল্যান্সাররা ৭০% বেশি কাজ পেয়ে থাকেন।\n৫. **ওয়ার্কস্টেশনে ডেলিভারি:** সবসময় এসক্রো ওয়ার্কস্টেশনের মাধ্যমে ফাইল জমা দিন যাতে বায়ার দ্রুত মাইলস্টোন রিলিজ করতে পারেন।',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Find Open Jobs',
      labelBn: 'ওপেন জব খুঁজুন'
    }
  },
  {
    id: 'gratitude-thanks',
    topic: 'Gratitude & Thanks',
    keywords: ['thank you', 'thanks', 'thx', 'ধন্যবাদ', 'অনেক ধন্যবাদ', 'থ্যাংকস', 'shukriya', 'ধন্যবাদ এআই'],
    audience: 'public',
    answerEn: 'You are very welcome! If you have any other questions about posting jobs, managing orders, or navigating the platform, I am always here to assist you.',
    answerBn: 'আপনাকে অনেক ধন্যবাদ! প্রজেক্ট পোস্ট, অর্ডার পরিচালনা বা ট্যালেন্টিওর যেকোনো বিষয়ে আপনার সাহায্য প্রয়োজন হলে আমি সবসময় আপনার পাশে আছি।',
    suggestedAction: {
      type: 'navigate',
      target: 'explore',
      labelEn: 'Explore Talentio',
      labelBn: 'ট্যালেন্টিও ঘুরে দেখুন'
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
  const queryTrimmed = userQuery.trim();
  const queryLower = queryTrimmed.toLowerCase();

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

  // 2. EXPLICIT NAVIGATION COMMANDS ONLY (e.g., "take me to chat", "open post job modal", "চ্যাটে চলো")
  // Notice we only trigger this when the user explicitly requests navigation or modal opening,
  // NOT for general questions like "How does escrow work?" or "How do I message someone?".
  const isExplicitNav = 
    queryLower.startsWith('take me to') ||
    queryLower.startsWith('go to') ||
    queryLower.startsWith('navigate to') ||
    queryLower.startsWith('open ') ||
    queryLower.startsWith('show me ') ||
    queryLower.includes('নিয়ে যাও') ||
    queryLower.includes('নিয়ে চলো') ||
    queryLower.includes('যেতে চাই') ||
    queryLower.includes('খুলুন') ||
    queryLower.includes('ওপেন করো') ||
    queryLower.includes('ওপেন করুন');

  if (isExplicitNav) {
    if (queryLower.includes('post job') || queryLower.includes('post a job') || queryLower.includes('জব পোস্ট') || queryLower.includes('প্রজেক্ট পোস্ট')) {
      return {
        reply: isBangla 
          ? 'আমি আপনাকে প্রজেক্ট পোস্ট করার মডালে নিয়ে যাচ্ছি। সেখানে প্রজেক্টের নাম, বিবরণ ও বাজেট উল্লেখ করে সহজে পাবলিশ করতে পারবেন।'
          : 'Opening the Job Creation modal where you can define your project scope, deliverables, and milestone budget.',
        action: { type: 'modal', target: 'post-job-modal', label: isBangla ? 'জব পোস্ট খুলুন' : 'Open Post Job' }
      };
    }

    if (queryLower.includes('create gig') || queryLower.includes('গিগ তৈরি') || queryLower.includes('গিগ বানাব')) {
      return {
        reply: isBangla 
          ? 'আমি গিগ ক্রিয়েশন ফর্মটি ওপেন করছি। আপনার সার্ভিসের আকর্ষণীয় টাইটেল, প্রাইসিং টিয়ার ও বিবরণ যুক্ত করুন।'
          : 'Opening the Gig Creation wizard where you can configure tiers, pricing, and portfolio showcases.',
        action: { type: 'modal', target: 'create-gig-modal', label: isBangla ? 'গিগ মডাল খুলুন' : 'Open Create Gig' }
      };
    }

    if (queryLower.includes('widget') || queryLower.includes('উইজেট')) {
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
          ? 'আপনাকে ট্যালেন্টিওর মেসেঞ্জার পেজে নিয়ে যাওয়া হচ্ছে।'
          : 'Navigating to the Talentio Live Messaging interface.',
        action: { type: 'navigate', target: 'chat', label: isBangla ? 'চ্যাটে যান' : 'Go to Chat' }
      };
    }

    if (queryLower.includes('workstation') || queryLower.includes('order') || queryLower.includes('ওয়ার্কস্টেশন') || queryLower.includes('অর্ডার')) {
      return {
        reply: isBangla
          ? 'আপনাকে এসক্রো ওয়ার্কস্টেশন পেজে নিয়ে যাচ্ছি।'
          : 'Navigating to your Escrow Workstation where you can monitor milestones.',
        action: { type: 'navigate', target: 'workstation', label: isBangla ? 'ওয়ার্কস্টেশনে যান' : 'Go to Workstation' }
      };
    }

    if (queryLower.includes('service') || queryLower.includes('gig') || queryLower.includes('সার্ভিস') || queryLower.includes('গিগ')) {
      return {
        reply: isBangla
          ? 'ট্যালেন্টিওর সব ক্যাটাগরির সার্ভিস ও গিগ ব্রাউজ করার পেজে নিয়ে যাওয়া হচ্ছে।'
          : 'Navigating to the Talentio Services and Gigs catalog.',
        action: { type: 'navigate', target: 'services', label: isBangla ? 'সার্ভিস পেজে যান' : 'Go to Services' }
      };
    }

    if (queryLower.includes('freelancer') || queryLower.includes('talent') || queryLower.includes('ট্যালেন্ট') || queryLower.includes('ফ্রিল্যান্সার')) {
      return {
        reply: isBangla
          ? 'টপ-রেটেড ভেরিফাইড ফ্রিল্যান্সারদের ডিরেক্টরিতে নিয়ে যাচ্ছি।'
          : 'Navigating to the Talentio Verified Freelancers Directory.',
        action: { type: 'navigate', target: 'freelancers', label: isBangla ? 'ফ্রিল্যান্সার দেখুন' : 'Browse Talent' }
      };
    }
  }

  // 3. ADVANCED NLP TOKEN & KEYWORD MATCHING AGAINST KNOWLEDGE BASE
  // Split query into word tokens (alphanumeric + Bengali characters)
  const tokens = queryLower.split(/[\s,?.!;:()_/\-+'"]+/).filter(t => t.length > 1);

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of TALENTIO_KNOWLEDGE_BASE) {
    let score = 0;

    // Check full string keyword containment (highest weight)
    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      if (queryLower.includes(kwLower)) {
        score += kwLower.length * 3; // Full phrase match bonus
      } else {
        // Check token overlaps
        const kwTokens = kwLower.split(/[\s,?.!;:()_/\-+'"]+/).filter(t => t.length > 1);
        let tokenMatches = 0;
        for (const kt of kwTokens) {
          if (tokens.some(qt => qt === kt || (kt.length > 3 && qt.includes(kt)) || (qt.length > 3 && kt.includes(qt)))) {
            tokenMatches++;
          }
        }
        if (tokenMatches > 0) {
          score += tokenMatches * 4;
        }
      }
    }

    // Role relevance bonus
    if (item.audience === userRole || item.audience === 'public') {
      score += 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Threshold: at least a strong match
  if (bestMatch && highestScore >= 6) {
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

  // 4. SMART CONTEXTUAL RESPONSES BY QUERY INTENT
  // Job Posting / RFP intent
  if (tokens.some(t => ['job', 'jobs', 'rfp', 'post', 'পোস্ট', 'প্রজেক্ট', 'কাজ'].includes(t)) && 
      tokens.some(t => ['post', 'create', 'give', 'দিব', 'পোস্ট', 'তৈরি', 'করব', 'কিভাবে'].includes(t))) {
    const item = TALENTIO_KNOWLEDGE_BASE.find(k => k.id === 'client-post-job')!;
    return {
      reply: isBangla ? item.answerBn : item.answerEn,
      action: item.suggestedAction ? {
        type: item.suggestedAction.type,
        target: item.suggestedAction.target,
        label: isBangla ? item.suggestedAction.labelBn : item.suggestedAction.labelEn
      } : undefined
    };
  }

  // Escrow / Payment intent
  if (tokens.some(t => ['escrow', 'payment', 'money', 'safe', 'security', 'এসক্রো', 'পেমেন্ট', 'টাকা', 'নিরাপদ', 'সুরক্ষা'].includes(t))) {
    const item = TALENTIO_KNOWLEDGE_BASE.find(k => k.id === 'escrow-system')!;
    return {
      reply: isBangla ? item.answerBn : item.answerEn,
      action: item.suggestedAction ? {
        type: item.suggestedAction.type,
        target: item.suggestedAction.target,
        label: isBangla ? item.suggestedAction.labelBn : item.suggestedAction.labelEn
      } : undefined
    };
  }

  // Freelancer / Hire intent
  if (tokens.some(t => ['hire', 'freelancer', 'talent', 'developer', 'designer', 'হায়ার', 'ফ্রিল্যান্সার', 'লোক', 'খুঁজছি'].includes(t))) {
    const item = TALENTIO_KNOWLEDGE_BASE.find(k => k.id === 'client-find-freelancer')!;
    return {
      reply: isBangla ? item.answerBn : item.answerEn,
      action: item.suggestedAction ? {
        type: item.suggestedAction.type,
        target: item.suggestedAction.target,
        label: isBangla ? item.suggestedAction.labelBn : item.suggestedAction.labelEn
      } : undefined
    };
  }

  // 5. ROLE & PAGE ADAPTIVE HELPFUL FALLBACK (Never canned repetition)
  if (isBangla) {
    return {
      reply: `আমি **TALENTIO AI**, আপনার মার্কেটপ্লেস ও এসক্রো সহকারী। আপনার প্রশ্নের সঠিক বিবরণটি নিশ্চিত করতে পারছি না, তবে আপনি নিচের যেকোনো বিষয়ে জানতে পারেন:\n\n- **জব পোস্ট ও হায়ার:** প্রজেক্ট তৈরি এবং শীর্ষ ফ্রিল্যান্সার খোঁজার নিয়ম।\n- **এসক্রো পেমেন্ট:** বায়ার ও ফ্রিল্যান্সারের ১০০% সুরক্ষিত লেনদেন।\n- **গিগ ও ফ্রিল্যান্সিং:** নিজস্ব সার্ভিস পাবলিশ এবং আয় বৃদ্ধির উপায়।\n- **পেমেন্ট মেথড:** বিকাশ, নগদ ও ব্যাংক উইথড্রয়াল পদ্ধতি।\n\nআপনি কীভাবে সাহায্য চান অনুগ্রহ করে আরেকটু বিস্তারিত লিখুন।`,
      action: { type: 'navigate', target: 'explore', label: 'মার্কেটপ্লেস ঘুরে দেখুন' }
    };
  } else {
    return {
      reply: `I am **TALENTIO AI**, your dedicated marketplace and escrow guide. I want to make sure I answer your query precisely. Here are popular topics I can assist you with:\n\n- **Posting Jobs & Hiring:** How to publish RFPs and connect with vetted talent.\n- **Escrow Security:** How milestone payments and funds are 100% safeguarded.\n- **Gig Publishing:** How to structure pricing tiers and win client contracts.\n- **Payouts & Withdrawals:** Withdrawing earnings directly to bKash, Nagad, or bank accounts.\n\nPlease clarify what you would like assistance with!`,
      action: { type: 'navigate', target: 'explore', label: 'Explore Marketplace' }
    };
  }
}

