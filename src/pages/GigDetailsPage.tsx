import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { formatPrice } from '../utils/currency';
import { ServiceCard } from '../components/ServiceCard';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  MessageSquare, 
  Lock, 
  Heart,
  Share2,
  Sparkles,
  Layers,
  Award,
  Globe,
  Calendar,
  AlertCircle,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Video,
  Image as ImageIcon,
  ThumbsUp,
  BadgeCheck
} from 'lucide-react';

export const GigDetailsPage: React.FC = () => {
  const { 
    selectedService, 
    services, 
    currency, 
    setActivePage, 
    requireAuth, 
    showToast,
    isGigSaved,
    toggleSaveGig,
    openGigDetails,
    setSelectedFreelancer,
    freelancers
  } = useGuide();

  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'pro'>('standard');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Fallback if no service selected
  const gig = selectedService || services[0];
  const pkg = gig.packages[selectedTier];
  const isSaved = isGigSaved(gig.id);

  // Media gallery items
  const mediaList = [
    { type: 'image', url: gig.coverImage, label: 'Main Showcase' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', label: 'Architecture & Dashboard' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80', label: 'Responsive Design' },
  ];

  const relatedGigs = services.filter(s => s.id !== gig.id && (s.category === gig.category || true)).slice(0, 2);

  const handleOrder = () => {
    if (!requireAuth('Please sign in to proceed with milestone escrow checkout.')) return;
    showToast(`Escrow milestone checkout initiated for "${pkg.name}" (${formatPrice(pkg.price, currency)})!`, 'success');
    setActivePage('orders');
  };

  const handleContact = () => {
    if (!requireAuth('Please sign in to message the freelancer.')) return;
    setActivePage('chat');
  };

  const handleViewFreelancerProfile = () => {
    const found = freelancers.find(f => f.id === gig.freelancerId);
    if (found) {
      setSelectedFreelancer(found);
    }
  };

  // Mock FAQs
  const faqs = [
    {
      q: 'Do you provide full commercial rights and source code?',
      a: 'Yes, 100% of intellectual property and source code ownership is transferred directly to you upon milestone approval and release.'
    },
    {
      q: 'How does the milestone escrow protection work?',
      a: 'Your payment is deposited safely into an escrow vault. The funds are only transferred to the freelancer once you review and approve each delivery milestone.'
    },
    {
      q: 'Can I request custom milestones or additional revisions?',
      a: 'Absolutely. You can request custom milestone offers directly inside the live chat before or during the project.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={() => setActivePage('marketplace')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#3D2FD1] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveGig(gig.id)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSaved 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Gig link copied to clipboard!', 'info');
              }}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT MAIN CONTENT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Header & Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-full font-extrabold uppercase tracking-wider bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/20">
                  {gig.category.replace('-', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Escrow Protected</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1633] tracking-tight leading-snug font-display">
                {gig.title}
              </h1>

              {/* Freelancer Mini Strip */}
              <div className="flex items-center gap-4 flex-wrap pt-2">
                <div 
                  onClick={handleViewFreelancerProfile}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={gig.freelancerAvatar}
                    alt={gig.freelancerName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3D2FD1]/30 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">
                      <span>{gig.freelancerName}</span>
                      <VerifiedBadge size="sm" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">{gig.freelancerBadge}</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1633]">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{gig.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-400 font-normal">({gig.reviewsCount} reviews)</span>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-[#3D2FD1]" />
                  <span>Avg. response: &lt; 1 hour</span>
                </div>
              </div>
            </div>

            {/* 2. Interactive Media Gallery / Hero Showcase */}
            <div className="space-y-3">
              <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200 shadow-md relative group">
                <img
                  src={mediaList[activeMediaIndex].url}
                  alt={mediaList[activeMediaIndex].label}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {mediaList[activeMediaIndex].label} ({activeMediaIndex + 1}/{mediaList.length})
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-[#3D2FD1] ring-2 ring-[#3D2FD1]/30 scale-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Description & Detailed Overview */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                About This Gig
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-3 text-sm sm:text-base font-normal">
                <p>
                  Get enterprise-grade, high-converting digital deliverables engineered with modern best practices. Every milestone is fully scoped and protected by Talentio's automated smart escrow vault.
                </p>
                <p>
                  {pkg.description}
                </p>
                <p>
                  You will receive full commercial rights, editable source files, clear documentation, and dedicated milestone check-ins throughout the project delivery.
                </p>
              </div>

              {/* Tags Cloud */}
              <div className="pt-3 flex flex-wrap gap-2">
                {gig.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-[#F2F0FF] text-slate-700 hover:text-[#3D2FD1] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Freelancer Bio & Credentials Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div 
                  onClick={handleViewFreelancerProfile}
                  className="flex items-center gap-4 cursor-pointer group"
                >
                  <img
                    src={gig.freelancerAvatar}
                    alt={gig.freelancerName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#3D2FD1]/30 shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg sm:text-xl font-black text-[#1A1633] font-display group-hover:text-[#3D2FD1] transition-colors">
                        {gig.freelancerName}
                      </h3>
                      <VerifiedBadge size="md" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{gig.freelancerBadge} Specialist</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {gig.rating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>100% Job Success</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContact}
                  className="px-5 py-2.5 rounded-2xl border-2 border-[#3D2FD1] text-[#3D2FD1] hover:bg-[#3D2FD1] hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Freelancer</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">From</span>
                  <span className="font-bold text-slate-800">Global Verified</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Member Since</span>
                  <span className="font-bold text-slate-800">2023</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Avg. Response</span>
                  <span className="font-bold text-slate-800">&lt; 1 Hour</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-bold">Last Delivery</span>
                  <span className="font-bold text-slate-800">1 day ago</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Dedicated professional with a proven track record delivering milestone-based projects on time and within budget. Full communication in English and dedicated post-delivery support.
              </p>
            </div>

            {/* 5. What's Included / Services Checklist */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                What's Included in {pkg.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {pkg.features.map(feat => (
                  <div key={feat} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs sm:text-sm font-medium text-slate-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Buyer Requirements */}
            <div className="p-6 rounded-3xl bg-[#F2F0FF]/60 border border-[#A38BFF]/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-black text-[#1A1633]">
                <AlertCircle className="w-4 h-4 text-[#3D2FD1]" />
                <span>Requirements to Get Started</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside font-medium">
                <li>Brief description of project scope and design/technical preferences</li>
                <li>Brand assets, logos, or reference URLs (if applicable)</li>
                <li>Target audience & timeline expectations</li>
              </ul>
            </div>

            {/* 7. FAQ Accordion */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#1A1633] flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-[#3D2FD1]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Verified Reviews Section */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                    Verified Customer Reviews ({gig.reviewsCount})
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Authentic feedback from milestone escrow completed orders</p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{gig.rating.toFixed(1)} out of 5</span>
                </div>
              </div>

              {/* Rating breakdown summary */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 text-center sm:border-r border-slate-100 sm:pr-6 space-y-1">
                  <div className="text-4xl font-black text-[#1A1633] font-mono">{gig.rating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Based on {gig.reviewsCount} verified orders</div>
                </div>

                <div className="sm:col-span-8 space-y-2">
                  {[
                    { stars: 5, pct: 94 },
                    { stars: 4, pct: 5 },
                    { stars: 3, pct: 1 },
                    { stars: 2, pct: 0 },
                    { stars: 1, pct: 0 }
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-slate-600">{row.stars} Stars</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="w-8 text-right font-mono text-slate-400">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    author: 'Alexander Vance',
                    role: 'VP Engineering @ Vance Fintech',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                    rating: 5,
                    date: '3 days ago',
                    comment: 'Exceptional work. Delivered ahead of schedule with flawless documentation, responsive design, and milestone communication.'
                  },
                  {
                    author: 'Sarah Jenkins',
                    role: 'Product Lead @ SaaSScale',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                    rating: 5,
                    date: '2 weeks ago',
                    comment: 'Top-tier execution. The escrow process was seamless and the source deliverables exceeded all our functional benchmarks.'
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-[#1A1633]">{rev.author}</span>
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <BadgeCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified Buyer</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{rev.role}</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{rev.date}</div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Related Gigs */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                Related Services in this Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedGigs.map(rel => (
                  <ServiceCard
                    key={rel.id}
                    service={rel}
                    onSelectService={s => openGigDetails(s)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: 3-TIER PRICING & ESCROW ORDER CARD (4 Cols Sticky) */}
          <div className="lg:col-span-4 sticky top-32 space-y-6">
            
            <div className="rounded-3xl bg-white border-2 border-[#3D2FD1]/30 shadow-xl overflow-hidden">
              
              {/* 3 Tier Tab Selector */}
              <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200">
                {(['basic', 'standard', 'pro'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                      selectedTier === tier 
                        ? 'bg-white text-[#3D2FD1] shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* Package Details Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                      {pkg.name}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-[#3D2FD1]">
                      {formatPrice(pkg.price, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {pkg.description}
                  </p>
                </div>

                {/* Delivery & Revisions Strip */}
                <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#3D2FD1]" />
                    <span>{pkg.deliveryDays} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#6E5BFF]" />
                    <span>{pkg.revisions} Revisions</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Features Included</span>
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Primary Order Action Button */}
                <button
                  onClick={handleOrder}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#3D2FD1]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Order with Escrow ({formatPrice(pkg.price, currency)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Message Button */}
                <button
                  onClick={handleContact}
                  className="w-full py-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Message {gig.freelancerName}</span>
                </button>

                {/* Escrow Guarantee Pill */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Funds Locked in Escrow</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Money is only released when you approve the delivered milestone files.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
