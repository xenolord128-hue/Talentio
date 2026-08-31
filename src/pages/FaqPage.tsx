import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { FAQ_ITEMS } from '../data/faqData';
import { HelpCircle, ChevronDown, Search, Sparkles, FolderOpen } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { language } = useGuide();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const categories = ['all', 'basics', 'account', 'devices', 'gig', 'communication', 'finance', 'orders'];

  const toggleOpen = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.questionBn.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.answerBn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর' : 'Frequently Asked Questions'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'ফাইভার নিয়ে নতুনদের সব প্রশ্নের স্পষ্ট উত্তর' : 'Fiverr Freelancing Knowledge Base'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'অ্যাকাউন্ট নিয়ম, গিগ সার্চ র‍্যাংক, টাকা তোলার ক্লিয়ারেন্স ও ক্লায়েন্ট সমস্যা সম্পর্কিত যাবতীয় প্রশ্নের সমাধান।'
            : 'Clear, policy-aligned answers to essential questions regarding account security, algorithmic rankings, and withdrawals.'}
        </p>

        {/* Search Input */}
        <div className="max-w-lg mx-auto pt-2">
          <div className="flex items-center px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 focus-within:border-emerald-500">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isBn ? "প্রশ্ন খুঁজুন (যেমন: withdrawal, ban, mobile)..." : "Search questions..."}
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
            {isBn ? 'কোনো প্রশ্ন পাওয়া যায়নি।' : 'No matching questions found.'}
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      Q
                    </span>
                    <span>{isBn ? faq.questionBn : faq.question}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
                    {isBn ? faq.answerBn : faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
