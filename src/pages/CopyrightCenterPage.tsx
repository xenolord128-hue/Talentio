import React from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  ShieldCheck, 
  FileCheck, 
  Sparkles, 
  AlertTriangle, 
  Lock, 
  Scale, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';

export const CopyrightCenterPage: React.FC = () => {
  const { language } = useGuide();
  const isBn = language === 'bn';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Scale className="w-3.5 h-3.5" />
          <span>{isBn ? 'কপিরাইট ও মেধা সম্পত্তি সুরক্ষা' : 'Copyright & Asset Legality'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'কপিরাইট, স্টক লাইসেন্স ও এআই (AI) ব্যবহারের নিয়মাবলী' : 'Commercial Rights, Asset Licensing & AI Rules'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'ইন্টারনেট থেকে সরাসরি ছবি ডাউনলোড করে গিগ বা ডেলিভারিতে দেওয়া সম্পূর্ণ নিষিদ্ধ। বাণিজ্যিক লাইসেন্সযুক্ত ফন্ট, স্টক ফটো ও অরিজিনাল কাজের নীতি জানুন।'
            : 'Understand commercial transfer clauses, royalty-free stock asset licensing, AI disclosure guidelines, and DMCA protection on Fiverr.'}
        </p>
      </div>

      {/* 4 Essential Copyright Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rule 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <ImageIcon className="w-5 h-5" />
            <span>{isBn ? '১. গিগ থাম্বনেইল ও অরিজিনাল কাজ' : '1. Original Gig Thumbnail Artwork'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'গিগ ব্যানার বা ইমেজ হিসেবে গুগল থেকে নামানো অন্য কারো কাজ ব্যবহার করবেন না। নিজের হাতে ডিজাইন করা কাজের স্ক্রিনশট বা পোর্টফোলিও ব্যবহার করুন।'
              : 'Never copy thumbnail images from other Fiverr sellers or Google Search. Showcase authentic mockups created exclusively by you.'}
          </p>
        </div>

        {/* Rule 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <FileCheck className="w-5 h-5" />
            <span>{isBn ? '২. বাণিজ্যিক ফন্ট ও স্টক মিডিয়া লাইসেন্স' : '2. Commercial Font & Stock Licenses'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'কাজের জন্য গুগল ফন্টস (Google Fonts) বা বাণিজ্যিক ব্যবহারের অনুমতিপ্রাপ্ত ফ্রি ফন্ট (OFL/Commercial Free) এবং আনস্প্ল্যাশ/পেক্সেলসের মতো লাইসেন্সপ্রাপ্ত ছবি ব্যবহার করুন।'
              : 'Ensure all third-party fonts (e.g. Google Fonts / OFL) and stock assets permit commercial redistribution to protect your client.'}
          </p>
        </div>

        {/* Rule 3 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>{isBn ? '৩. জেনারেটিভ এআই (AI) ব্যবহারে স্বচ্ছতা' : '3. Generative AI Tools Disclosure'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'যদি আপনি কোনো কাজে এআই টুল (যেমন Midjourney বা ChatGPT) ব্যবহার করেন, তবে গিগ ডেসক্রিপশনে এবং বায়ারের সাথে চ্যাটে তা স্পষ্টভাবে প্রকাশ করুন।'
              : 'Fiverr requires full transparency if Generative AI tools are utilized. Tag appropriate AI metadata during Gig creation.'}
          </p>
        </div>

        {/* Rule 4 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{isBn ? '৪. ট্রেডমার্ক ও ব্র্যান্ড লোগো লঙ্ঘন' : '4. Trademark & Brand Piracy'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'বিখ্যাত কোনো ব্র্যান্ডের (যেমন Nike, Apple, Disney) কপিরাইট করা লোগো বা চরিত্র নকল করে গিগ বানাবেন না। এটি সরাসরি একাউন্ট ব্যান হওয়ার কারণ।'
              : 'Never replicate protected brand trademarks or copyrighted characters. Fiverr instantly disables infringing gigs upon DMCA notice.'}
          </p>
        </div>

      </div>

    </div>
  );
};
