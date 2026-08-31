import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Image as ImageIcon, 
  DollarSign, 
  FileText, 
  HelpCircle, 
  Eye, 
  Star, 
  Heart, 
  Share2,
  ShieldCheck,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const GigSimulatorPage: React.FC = () => {
  const { language, setActiveGuideId } = useGuide();
  const isBn = language === 'bn';

  const [currentStep, setCurrentStep] = useState(0);

  // Gig Form State
  const [gigData, setGigData] = useState({
    title: 'create modern responsive react website with tailwind css',
    category: 'Programming & Tech',
    subCategory: 'Web Development',
    tags: ['react js', 'tailwind css', 'website design', 'frontend', 'responsive'],
    basicPrice: 50,
    basicDays: 2,
    basicDesc: '1 Page responsive landing page + clean code',
    standardPrice: 150,
    standardDays: 4,
    standardDesc: 'Up to 5 Pages responsive website + modern UI + API integration',
    premiumPrice: 300,
    premiumDays: 7,
    premiumDesc: 'Full custom web app + database + auth + SEO optimization',
    description: 'Looking for a clean, lightning-fast modern website? I will build your custom website using React 19, Vite, and Tailwind CSS with 100% responsive layout across all mobile and desktop devices.',
    faqQuestion: 'Do you provide source code?',
    faqAnswer: 'Yes! Full clean documented source code is included with every delivery.',
    requirement: 'Please send your design Figma link, branding assets, and project brief.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
  });

  const steps = [
    { id: 'overview', title: isBn ? '১. ওভারভিউ (Overview)' : '1. Overview' },
    { id: 'pricing', title: isBn ? '২. প্রাইসিং (Pricing)' : '2. Pricing' },
    { id: 'description', title: isBn ? '৩. ডেসক্রিপশন (Description)' : '3. Description' },
    { id: 'requirements', title: isBn ? '৪. রিকোয়ারমেন্টস (Requirements)' : '4. Requirements' },
    { id: 'gallery', title: isBn ? '৫. গ্যালারি (Gallery)' : '5. Gallery' },
    { id: 'publish', title: isBn ? '৬. পাবলিশ (Publish)' : '6. Publish' }
  ];

  // Presets
  const loadPreset = (type: 'web' | 'logo' | 'seo') => {
    if (type === 'web') {
      setGigData({
        title: 'build responsive modern web application using react and tailwind',
        category: 'Programming & Tech',
        subCategory: 'Web Development',
        tags: ['react js', 'tailwind css', 'web developer', 'frontend', 'html css'],
        basicPrice: 60,
        basicDays: 2,
        basicDesc: 'Single responsive landing page + clean code',
        standardPrice: 160,
        standardDays: 4,
        standardDesc: 'Multi-page website + interactive components',
        premiumPrice: 350,
        premiumDays: 7,
        premiumDesc: 'Full-stack application + database + deployment',
        description: 'Get a clean, high-performance web application tailored to your business goals. Fast delivery with clean code.',
        faqQuestion: 'Is the website mobile responsive?',
        faqAnswer: 'Yes, 100% responsive across smartphones, tablets, and 4K displays.',
        requirement: 'Provide wireframes, Figma URLs, and logo files.',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
      });
    } else if (type === 'logo') {
      setGigData({
        title: 'design modern minimalist luxury business logo with brand kit',
        category: 'Graphics & Design',
        subCategory: 'Logo Design',
        tags: ['minimalist logo', 'luxury logo', 'branding kit', 'vector art', 'modern logo'],
        basicPrice: 35,
        basicDays: 1,
        basicDesc: '2 Logo concepts + high-res PNG & JPG',
        standardPrice: 85,
        standardDays: 2,
        standardDesc: '3 Concepts + vector AI/EPS source files + 3D mockup',
        premiumPrice: 180,
        premiumDays: 3,
        premiumDesc: '5 Premium concepts + full stationery kit + social media kit',
        description: 'Elevate your brand identity with timeless, minimalist vector logos designed from scratch.',
        faqQuestion: 'Do I get copyright ownership?',
        faqAnswer: 'Yes, full commercial rights are transferred upon order completion.',
        requirement: 'Company name, slogan, industry niche, and color preferences.',
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
      });
    } else {
      setGigData({
        title: 'provide complete technical on page and monthly seo service',
        category: 'Digital Marketing',
        subCategory: 'Search Engine Optimization (SEO)',
        tags: ['seo optimization', 'on page seo', 'keyword research', 'backlinks', 'google ranking'],
        basicPrice: 75,
        basicDays: 3,
        basicDesc: 'Audit + 5 Key Pages On-Page Optimization',
        standardPrice: 190,
        standardDays: 7,
        standardDesc: '15 Pages Optimization + Speed Fix + Meta tags',
        premiumPrice: 400,
        premiumDays: 14,
        premiumDesc: 'Complete Site Technical SEO + Competitor Analysis + Backlink Roadmap',
        description: 'Boost your Google rankings organically with White-Hat technical and on-page SEO strategies.',
        faqQuestion: 'Do you guarantee #1 ranking?',
        faqAnswer: 'No honest SEO guarantees #1 rank as Google algorithm changes, but we guarantee best practices.',
        requirement: 'Website URL and target geographic location.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'ইন্টারেক্টিভ গিগ ক্রিয়েশন সিমুলেটর' : 'Interactive Gig Creation Lab'}</span>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">{isBn ? 'টেমপ্লেট:' : 'Presets:'}</span>
            <button
              onClick={() => loadPreset('web')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Web Dev
            </button>
            <button
              onClick={() => loadPreset('logo')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Logo Design
            </button>
            <button
              onClick={() => loadPreset('seo')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              SEO
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'বাস্তব ফাইভার গিগ ক্রিয়েশন প্র্যাকটিস ল্যাব' : 'Simulate the Official 6-Step Gig Wizard'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'ফাইভারে গিগ পাবলিশ করার আগে এখানে হাতে-কলমে অনুশীলন করুন। টাইটেল, ৩-স্তরের প্রাইসিং এবং গ্যালারি সাজিয়ে দেখুন বায়ারের চোখে আপনার গিগ কার্ডটি কেমন দেখাবে।'
            : 'Test how your SEO titles, 3-tier packages, description FAQs, and thumbnail banners appear to prospective buyers before publishing live.'}
        </p>

        {/* Step Progress Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                currentStep === idx
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : currentStep > idx
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid: Left Form (Wizard) vs Right Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Step 0: Overview */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ১: টাইটেল, ক্যাটাগরি ও সার্চ ট্যাগ' : 'Step 1: Title, Category & Search Tags'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Overview Tab
                </span>
              </div>

              {/* Gig Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'গিগ টাইটেল (Gig Title):' : 'Gig Title (Starts with "I will"): '}
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-emerald-500">
                  <span className="text-xs sm:text-sm font-bold text-slate-400 mr-2 shrink-0">I will</span>
                  <input
                    type="text"
                    value={gigData.title}
                    onChange={e => setGigData({ ...gigData, title: e.target.value })}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    placeholder="create modern responsive website..."
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {isBn ? '💡 টিপ: সর্বোচ্চ ৬০-৭০ অক্ষরের মধ্যে স্পষ্ট কিউয়ার্ড রাখুন।' : '💡 Keep between 50-70 characters for best SEO ranking.'}
                </p>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                  <input
                    type="text"
                    value={gigData.category}
                    onChange={e => setGigData({ ...gigData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{isBn ? 'সাব-ক্যাটাগরি' : 'Sub-Category'}</label>
                  <input
                    type="text"
                    value={gigData.subCategory}
                    onChange={e => setGigData({ ...gigData, subCategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? '৫টি সার্চ ট্যাগ (Search Tags):' : 'Search Tags (Max 5):'}
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {gigData.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Pricing */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ২: ৩-স্তরের প্যাকেজ প্রাইসিং' : 'Step 2: 3-Tier Pricing Packages'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Pricing Matrix
                </span>
              </div>

              {/* Basic Package */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-emerald-600">BASIC PACKAGE</span>
                  <div className="flex items-center gap-2">
                    <span>${gigData.basicPrice}</span>
                    <span className="text-slate-400">({gigData.basicDays} Days Delivery)</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={gigData.basicDesc}
                  onChange={e => setGigData({ ...gigData, basicDesc: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <span>Price $:</span>
                    <input
                      type="number"
                      value={gigData.basicPrice}
                      onChange={e => setGigData({ ...gigData, basicPrice: Number(e.target.value) })}
                      className="w-16 p-1 rounded border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Standard Package */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-blue-600">STANDARD PACKAGE</span>
                  <div className="flex items-center gap-2">
                    <span>${gigData.standardPrice}</span>
                    <span className="text-slate-400">({gigData.standardDays} Days Delivery)</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={gigData.standardDesc}
                  onChange={e => setGigData({ ...gigData, standardDesc: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
                <div className="flex items-center gap-1 text-xs">
                  <span>Price $:</span>
                  <input
                    type="number"
                    value={gigData.standardPrice}
                    onChange={e => setGigData({ ...gigData, standardPrice: Number(e.target.value) })}
                    className="w-16 p-1 rounded border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Premium Package */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-purple-600">PREMIUM PACKAGE</span>
                  <div className="flex items-center gap-2">
                    <span>${gigData.premiumPrice}</span>
                    <span className="text-slate-400">({gigData.premiumDays} Days Delivery)</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={gigData.premiumDesc}
                  onChange={e => setGigData({ ...gigData, premiumDesc: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
                <div className="flex items-center gap-1 text-xs">
                  <span>Price $:</span>
                  <input
                    type="number"
                    value={gigData.premiumPrice}
                    onChange={e => setGigData({ ...gigData, premiumPrice: Number(e.target.value) })}
                    className="w-16 p-1 rounded border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description & FAQ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ৩: গিগ বিবরণ ও এফএকিউ' : 'Step 3: Description & FAQs'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Description Tab
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'গিগ ডেসক্রিপশন (About this Gig):' : 'Gig Description:'}
                </label>
                <textarea
                  rows={4}
                  value={gigData.description}
                  onChange={e => setGigData({ ...gigData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-500">{isBn ? 'প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ Item):' : 'FAQ Item:'}</span>
                <input
                  type="text"
                  value={gigData.faqQuestion}
                  onChange={e => setGigData({ ...gigData, faqQuestion: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                />
                <textarea
                  rows={2}
                  value={gigData.faqAnswer}
                  onChange={e => setGigData({ ...gigData, faqAnswer: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ৪: বায়ার রিকোয়ারমেন্টস' : 'Step 4: Buyer Requirements'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Requirements Tab
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'অর্ডার শুরু করার জন্য বায়ার থেকে কী কী তথ্য দরকার?' : 'Questions for Buyer upon ordering:'}
                </label>
                <textarea
                  rows={4}
                  value={gigData.requirement}
                  onChange={e => setGigData({ ...gigData, requirement: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400">
                  {isBn ? '💡 বায়ার এই উত্তরগুলো পূরণ না করা পর্যন্ত কাউন্টডাউন টাইমার শুরু হবে না।' : '💡 The order countdown timer remains paused until the client submits these answers.'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Gallery */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ৫: গিগ ইমেজ ও ব্যানার (1280x769px)' : 'Step 5: Gig Gallery Image'}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Gallery Tab
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'ইমেজ ইউআরএল বা ডেমো ফটো:' : 'Image URL Preview:'}
                </label>
                <input
                  type="text"
                  value={gigData.imageUrl}
                  onChange={e => setGigData({ ...gigData, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                <span className="font-bold block">💡 {isBn ? 'ফাইভার ইমেজ সাইজ স্ট্যান্ডার্ড:' : 'Official Image Guidelines:'}</span>
                <p>{isBn ? 'প্রস্তাবিত সাইজ: ১২৮০ x ৭৬৯ পিক্সেল (১৬:৯ রেশিও)। অবশ্যই পরিষ্কার ও আসল কাজের ছবি ব্যবহার করবেন।' : 'Recommended size: 1280x769px (16:9 ratio). Large clear readable typography.'}</p>
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'অভিনন্দন! গিগ রেডি হয়ে গেছে' : 'Gig Wizard Simulation Complete!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {isBn
                  ? 'আপনার সব তথ্য পূরণ হয়েছে। ফাইভারে সরাসরি পাবলিশ করার সময় W-9/W-8BEN ট্যাক্স ডিক্লারেশন কনফার্ম করে লাইভ করতে হয়।'
                  : 'Your simulated Gig is ready. On live Fiverr, you simply confirm your tax status and click "Publish Gig".'}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isBn ? 'আগের ট্যাব' : 'Previous'}</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              disabled={currentStep === steps.length - 1}
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? 'পরবর্তী ট্যাব' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Real-Time Live Fiverr Gig Card Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'বায়ারের চোখে লাইভ প্রিভিউ' : 'Live Buyer View Preview'}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
              Marketplace View
            </span>
          </div>

          {/* Gig Card Replica */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-all">
            {/* Image Thumbnail */}
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden group">
              <img
                src={gigData.imageUrl}
                alt="Gig Thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm text-white flex items-center justify-center hover:text-rose-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3">
              {/* Seller Mini Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                    ME
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">your_username</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Level 1 Seller</span>
              </div>

              {/* Title */}
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer">
                I will {gigData.title}
              </h4>

              {/* Rating & Orders */}
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>5.0</span>
                <span className="text-slate-400 font-normal">(24 reviews)</span>
              </div>

              {/* Price Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400">Starting at</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ${gigData.basicPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Explanation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">{isBn ? '💡 কার্ড ভিজ্যুয়াল টিপস:' : 'Card UX Insight:'}</span>
            <p>{isBn ? 'বায়াররা প্রথম পেজে সাধারণত টাইটেল, রেটিং ও স্টার্টিং প্রাইস দেখে ক্লিক করে।' : 'Buyers make click decisions in < 2 seconds based on thumbnail clarity, 5-star rating, and clean title.'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
