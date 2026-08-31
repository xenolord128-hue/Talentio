import React, { useState, useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  Send, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';

interface OrderState {
  orderNumber: string;
  buyerName: string;
  gigTitle: string;
  packageTier: string;
  orderAmount: number;
  totalDays: number;
  remainingSeconds: number;
  status: 'requirements' | 'in_progress' | 'delivered' | 'revision' | 'completed' | 'cleared';
  revisionCount: number;
  deliveryNote: string;
  isWatermarked: boolean;
}

export const OrderLifecyclePage: React.FC = () => {
  const { language, setActiveGuideId } = useGuide();
  const isBn = language === 'bn';

  const [order, setOrder] = useState<OrderState>({
    orderNumber: '#FO-894218',
    buyerName: 'Alexander Vance (UK 🇬🇧)',
    gigTitle: 'Modern Responsive React & Tailwind Website',
    packageTier: 'Standard Package ($150)',
    orderAmount: 150,
    totalDays: 3,
    remainingSeconds: 3 * 86400 - 3600 * 5, // 2 days 19 hours
    status: 'in_progress',
    revisionCount: 0,
    deliveryNote: 'Hi Alexander! Here is your completed React landing page. All source files, Tailwind config, and production assets are packaged cleanly in the zip file. Let me know if you need any adjustments!',
    isWatermarked: false
  });

  const [simulatedNote, setSimulatedNote] = useState(order.deliveryNote);
  const [deliveryFileAttached, setDeliveryFileAttached] = useState(true);

  // Format seconds to DD:HH:MM:SS
  const formatTimer = (secs: number) => {
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${days}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const steps = [
    {
      id: 'requirements',
      label: isBn ? '১. রিকোয়ারমেন্টস' : '1. Requirements',
      desc: isBn ? 'বায়ার তথ্য জমা দেওয়ার পর কাউন্টডাউন শুরু হয়' : 'Countdown starts only after buyer submits brief'
    },
    {
      id: 'in_progress',
      label: isBn ? '২. ইন প্রোগ্রেস' : '2. In Progress',
      desc: isBn ? 'কাজ তৈরির সময় ও সময়মতো ডেলিভারি নিশ্চিতকরণ' : 'Active production with live delivery countdown'
    },
    {
      id: 'delivered',
      label: isBn ? '৩. ডেলিভার্ড' : '3. Delivered',
      desc: isBn ? 'ফাইল ও প্রফেশনাল নোট সহ ডেলিভারি জমা দেওয়া' : 'Zip package + delivery message submitted'
    },
    {
      id: 'revision',
      label: isBn ? '৪. রিভিশন হ্যান্ডলিং' : '4. Revision',
      desc: isBn ? 'বায়ার কোনো পরিবর্তন চাইলে তা শান্তভাবে সমাধান' : 'Handling requested tweaks within 24 hours'
    },
    {
      id: 'completed',
      label: isBn ? '৫. অর্ডার কমপ্লিট' : '5. Completed',
      desc: isBn ? 'বায়ার সন্তুষ্ট হয়ে অর্ডার গ্রহণ ও রিভিউ প্রদান' : 'Order accepted, funds move to 14-day clearance'
    }
  ];

  const handleDeliverNow = () => {
    setOrder(prev => ({ ...prev, status: 'delivered' }));
  };

  const handleRequestRevision = () => {
    setOrder(prev => ({ 
      ...prev, 
      status: 'revision', 
      revisionCount: prev.revisionCount + 1 
    }));
  };

  const handleAcceptOrder = () => {
    setOrder(prev => ({ ...prev, status: 'completed' }));
  };

  const handleReset = () => {
    setOrder({
      orderNumber: '#FO-894218',
      buyerName: 'Alexander Vance (UK 🇬🇧)',
      gigTitle: 'Modern Responsive React & Tailwind Website',
      packageTier: 'Standard Package ($150)',
      orderAmount: 150,
      totalDays: 3,
      remainingSeconds: 3 * 86400 - 3600 * 5,
      status: 'in_progress',
      revisionCount: 0,
      deliveryNote: 'Hi Alexander! Here is your completed React landing page. All source files, Tailwind config, and production assets are packaged cleanly in the zip file. Let me know if you need any adjustments!',
      isWatermarked: false
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <PackageCheck className="w-3.5 h-3.5" />
          <span>{isBn ? 'ইন্টারেক্টিভ অর্ডার লাইফসাইকেল ল্যাব' : 'Order Lifecycle Simulator'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'একটি অর্ডারের শুরু থেকে আর্নিং ক্লিয়ারেন্স পর্যন্ত সম্পূর্ণ প্রক্রিয়া' : 'From First Ping to Payout: The 5 Order Stages'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'অর্ডার আসলে কীভাবে কাজ শুরু করবেন, ডেলিভারি বাটন কীভাবে কাজ করে, রিভিশন আসলে কীভাবে হ্যান্ডেল করবেন এবং টাকা তোলার ১৪ দিনের ক্লিয়ারেন্স সাইকেল কীভাবে কাজ করে তা সিমুলেট করে দেখুন।'
            : 'Experience the complete live order workflow: requirements trigger, active countdown timers, zip delivery packaging, revision resolution, and the 14-day financial clearance cycle.'}
        </p>
      </div>

      {/* 5-Step Visual Progress Tracker */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isBn ? 'অর্ডারের বর্তমান স্টেজ' : 'Active Order Progression'}
          </h2>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {order.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {steps.map((s, idx) => {
            const isCurrent = order.status === s.id;
            const isPassed = 
              (order.status === 'in_progress' && idx === 0) ||
              (order.status === 'delivered' && idx <= 1) ||
              (order.status === 'revision' && idx <= 1) ||
              (order.status === 'completed' && idx <= 4);

            return (
              <div 
                key={s.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : isPassed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold font-mono">0{idx + 1}</span>
                  {isPassed ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  )}
                </div>
                <div className="text-xs font-bold leading-tight">{s.label}</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug hidden sm:block">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Order Simulated Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Order Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Order Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Buyer: <strong className="text-slate-900 dark:text-white">{order.buyerName}</strong>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {order.gigTitle}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Order Total:</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${order.orderAmount}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Net Earnings: ${Math.round(order.orderAmount * 0.8)} (80%)
                </span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={20} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    {isBn ? 'ডেলিভারির বাকি সময় (Countdown Timer)' : 'Delivery Countdown Timer'}
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400">
                    {order.status === 'completed' ? 'Order Completed!' : formatTimer(order.remainingSeconds)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-slate-400 block">{isBn ? 'টাইমার পলিসি:' : 'Timer Policy:'}</span>
                <span className="font-medium text-amber-300">
                  {isBn ? 'সময় শেষ হওয়ার আগেই "Deliver Now" চাপুন' : 'Deliver before 00:00:00 to avoid late penalty'}
                </span>
              </div>
            </div>

            {/* Interactive Stage Actions */}
            {order.status === 'in_progress' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'ডেলিভারি মেসেজ / নোট (Delivery Note):' : 'Delivery Message / Note:'}
                  </label>
                  <textarea
                    value={simulatedNote}
                    onChange={e => setSimulatedNote(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Describe your delivery and thank the buyer..."
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <Upload size={14} className="text-emerald-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      project_source_files.zip (18.4 MB)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                    Ready to Ship
                  </span>
                </div>

                <button
                  onClick={handleDeliverNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>{isBn ? 'এখনই ডেলিভারি জমা দিন (Deliver Completed Work)' : 'Submit Delivery Now'}</span>
                </button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      {isBn ? 'ডেলিভারি জমা দেওয়া হয়েছে!' : 'Work Successfully Delivered!'}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
                      {isBn
                        ? 'বায়ার এখন কাজটি রিভিউ করছেন। ৩ দিনের মধ্যে বায়ার কোনো উত্তর না দিলে অর্ডারটি স্বয়ংক্রিয়ভাবে Complete হয়ে যাবে।'
                        : 'The buyer has 3 days to review. If they do not respond within 72 hours, the order auto-completes and funds enter 14-day clearance.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleAcceptOrder}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isBn ? 'সিমুলেশন: বায়ার গ্রহণ করলেন (Accept Order)' : 'Simulate: Buyer Accepts & Leaves 5-Star Review'}
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    className="py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isBn ? 'সিমুলেশন: বায়ার রিভিশন চাইলেন' : 'Simulate: Buyer Requests Minor Revision'}
                  </button>
                </div>
              </div>
            )}

            {order.status === 'revision' && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {isBn ? 'বায়ার রিভিশন চেয়েছেন' : 'Buyer Requested a Revision'}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                      "Could you please adjust the hero section background color to dark navy and increase the font size of the header?"
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDeliverNow}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>{isBn ? 'সংশোধিত কাজ পুনরায় ডেলিভারি দিন (Re-deliver)' : 'Submit Revised Files (Re-deliver)'}</span>
                </button>
              </div>
            )}

            {order.status === 'completed' && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-200">
                    🎉 {isBn ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Successfully Completed!'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                    {isBn
                      ? 'অভিনন্দন! বায়ার ৫-স্টার রিভিউ দিয়েছেন। আপনার নিট আয় $১২০ ফাইভারের ১৪ দিনের সিকিউরিটি ক্লিয়ারেন্স সাইকেলে প্রবেশ করেছে।'
                      : 'Congratulations! The buyer left a 5-star rating. Your net $120 earnings have entered the 14-day clearance holding period.'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>{isBn ? 'পুনরায় সিমুলেশন করুন' : 'Reset Lifecycle Simulation'}</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Financial Clearance & Best Practices */}
        <div className="space-y-6">
          
          {/* Clearance Cycle Explainer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{isBn ? '১৪ দিনের ক্লিয়ারেন্স পলিসি' : '14-Day Clearance Cycle'}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'অর্ডার Complete হওয়ার পর টাকা সাথে সাথে তোলা যায় না। ফাইভার ১৪ দিন (Top Rated সেলারদের জন্য ৭ দিন) টাকা হোল্ড রাখে যেন কোনো চার্জব্যাক না ঘটে।'
                : 'After an order completes, funds are held in pending clearance for exactly 14 days (7 days for Top Rated Sellers) before becoming available for Payoneer or Bank withdrawal.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Order Placed:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Day 0 (Escrow held)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Order Accepted:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Day 3 (Pending Clearance)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Funds Cleared:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Day 17 (Available for Payout)</span>
              </div>
            </div>
          </div>

          {/* Critical Delivery Rules */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'গোল্ডেন ডেলিভারি রুলস' : 'Golden Delivery Rules'}</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isBn ? 'ইনবক্স চ্যাটে ফাইল না পাঠিয়ে সর্বদা "Deliver Now" বাটনে ফাইল আপলোড করবেন।' : 'Always use the official "Deliver Now" button, not inbox chat.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isBn ? 'অসমাপ্ত কাজের খালি ডেলিভারি দিলে একাউন্ট সাসপেন্ড হতে পারে।' : 'Never submit empty deliveries to stop the countdown timer.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isBn ? 'রিভিউ চাইতে পারবেন না—শুধু কাজের সন্তুষ্টি নিশ্চিত করতে অনুরোধ করুন।' : 'Never solicit 5-star feedback; ask if any tweaks are required.'}</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
