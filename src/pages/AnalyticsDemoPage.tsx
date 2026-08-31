import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  ShoppingBag, 
  DollarSign, 
  Sparkles, 
  HelpCircle,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const AnalyticsDemoPage: React.FC = () => {
  const { language } = useGuide();
  const isBn = language === 'bn';

  // Interactive inputs for dynamic conversion calculator
  const [impressions, setImpressions] = useState(2400);
  const [clicks, setClicks] = useState(120);
  const [orders, setOrders] = useState(12);
  const [avgOrderValue, setAvgOrderValue] = useState(65);

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0';
  const conversionRate = clicks > 0 ? ((orders / clicks) * 100).toFixed(1) : '0';
  const totalRevenue = orders * avgOrderValue;
  const netEarnings = Math.round(totalRevenue * 0.8); // 80% to freelancer, 20% Fiverr fee

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{isBn ? 'শিক্ষামূলক অ্যানালিটিক্স ল্যাব' : 'Educational Analytics Lab'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'ফাইভার মেট্রিক্স, ইমপ্রেশন ও কনভার্সন রেট সিমুলেটর' : 'Master Fiverr Analytics & Algorithm Funnel'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'ইমপ্রেশন, ক্লিক, কনভার্সন রেট ও ফাইভারের ২০% ফি কীভাবে কাজ করে তা ইন্টারেক্টিভভাবে ক্যালকুলেট করুন এবং অ্যালগরিদম কীভাবে কাজ করে তা বুঝুন।'
            : 'Simulate how buyer search impressions convert into clicks, orders, and net revenue while learning key algorithm ranking drivers.'}
        </p>
      </div>

      {/* 4 Interactive Funnel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Impressions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Eye className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-slate-400">Search Views</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {impressions.toLocaleString()}
            </div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {isBn ? 'ইমপ্রেশন (Impressions)' : 'Impressions'}
            </h4>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={impressions}
            onChange={e => setImpressions(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            {isBn ? 'সার্চ রেজাল্টে গিগ কতবার প্রদর্শিত হয়েছে।' : 'How many times your thumbnail was shown.'}
          </p>
        </div>

        {/* Clicks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MousePointer className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600">CTR: {ctr}%</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {clicks.toLocaleString()}
            </div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {isBn ? 'ক্লিক (Clicks)' : 'Clicks'}
            </h4>
          </div>
          <input
            type="range"
            min={5}
            max={500}
            step={5}
            value={clicks}
            onChange={e => setClicks(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            {isBn ? 'কতজন বায়ার আপনার গিগ পেজে ঢুকেছে।' : 'Buyers who clicked into your full gig.'}
          </p>
        </div>

        {/* Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-amber-600">CR: {conversionRate}%</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {orders}
            </div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              {isBn ? 'অর্ডার (Completed Orders)' : 'Orders'}
            </h4>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={orders}
            onChange={e => setOrders(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            {isBn ? 'সফলভাবে সম্পন্ন হওয়া অর্ডার সংখ্যা।' : 'Successfully delivered client orders.'}
          </p>
        </div>

        {/* Net Take-Home Earnings */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-mono text-slate-400">80% Net Share</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ${netEarnings.toLocaleString()}
            </div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">
              {isBn ? 'আপনার আসল আয় (Net Profit)' : 'Net Take-Home'}
            </h4>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Gross: ${totalRevenue}</span>
            <span>Fee: ${totalRevenue - netEarnings}</span>
          </div>
        </div>

      </div>

      {/* Fiverr Algorithm Ranking Secrets */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span>{isBn ? 'ফাইভার অ্যালগরিদম কীভাবে র‍্যাংক নির্ধারণ করে?' : 'Key Algorithm Ranking Signals on Fiverr'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
              1. 95%+ Response Rate
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              {isBn ? 'নতুন বায়ার মেসেজ দেওয়ার ১ ঘণ্টার মধ্যে উত্তর দেওয়া র‍্যাংকিংয়ের জন্য অত্যন্ত জরুরি।' : 'Responding to initial messages within 1 hour boosts your visibility in search rotations.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
              2. 100% On-Time Delivery
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              {isBn ? 'অর্ডার কাউন্টডাউন টাইমার শেষ হওয়ার আগে ডেলিভারি দেওয়া অ্যালগরিদমের প্রধান ফ্যাক্টর।' : 'Never let the delivery timer hit zero without mutual deadline extension.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">
              3. Positive Private Reviews
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              {isBn ? 'বায়ারের সন্তুষ্টি ও প্রাইভেট রেকমেন্ডেশন স্কোর আপনার গিগকে টপ পেজে নিয়ে আসে।' : 'Buyer private feedback heavily determines whether the algorithm continues recommending your gig.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
