import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { Sparkles, Search, BookOpen, Layers } from 'lucide-react';

export const GlossaryPage: React.FC = () => {
  const { language } = useGuide();
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.termBn.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.definitionBn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isBn ? 'ফাইভার পরিভাষা অভিধান' : 'Fiverr Marketplace Glossary'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'ফাইভারের প্রয়োজনীয় সকল শব্দের সহজ অর্থ' : 'Essential Marketplace Vocabulary'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'Gig, Buyer Briefs, Resolution Center, Private Feedback, Clearance Period ইত্যাদি প্রতিটি গুরুত্বপূর্ণ শব্দের সহজ বাংলা ব্যাখ্যা।'
            : 'A comprehensive dictionary of key freelancing terms, metrics, and workflows used across the Fiverr ecosystem.'}
        </p>

        {/* Search */}
        <div className="max-w-md pt-2">
          <div className="flex items-center px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isBn ? "শব্দ খুঁজুন (যেমন: gig, clearance)..." : "Search term..."}
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Glossary Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(term => (
          <div
            key={term.term}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                {term.context}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                term.importance === 'essential'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-indigo-500/10 text-indigo-600'
              }`}>
                {term.importance}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? term.termBn : term.term}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn ? term.definitionBn : term.definition}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
