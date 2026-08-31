import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  ShieldCheck, 
  BookOpen, 
  Search, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  FileCheck
} from 'lucide-react';

export const PlaybookPage: React.FC = () => {
  const { guideChapters, selectedChapterId, setSelectedChapterId } = useGuide();
  const [search, setSearch] = useState('');

  const activeChapter = guideChapters.find(c => c.id === selectedChapterId) || guideChapters[0];

  const filteredChapters = guideChapters.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1A1633] text-white border border-[#3D2FD1]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#3D2FD1]/40 text-[#A38BFF] border border-[#6E5BFF]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Operating & Escrow Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Talentio Platform Standards & Defense Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Rules of engagement, dispute resolution framework, IP ownership protocols, and payout guarantees.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 text-xs font-semibold flex items-center gap-2 text-slate-200">
          <Scale className="w-4 h-4 text-[#A38BFF]" />
          <span>Legally Binding Global Terms</span>
        </div>
      </div>

      {/* Grid: Chapter List Left, Chapter Content Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#3D2FD1] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search policies & rules..."
              className="w-full bg-white text-[#1A1633] placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#6E5BFF] focus:outline-none text-xs"
            />
          </div>

          <div className="p-3 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1.5">
            {filteredChapters.map(chap => {
              const isSelected = activeChapter?.id === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D2FD1] text-white shadow-md shadow-[#3D2FD1]/20'
                      : 'hover:bg-[#F2F0FF] text-[#1A1633]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F2F0FF] text-[#3D2FD1]'
                  }`}>
                    {chap.category === 'escrow' ? '🛡️' : chap.category === 'defense' ? '⚖️' : '📋'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs truncate">{chap.title}</h4>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      {chap.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2F0FF] text-[#3D2FD1]">
              Section: {activeChapter.category.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1633]">
              {activeChapter.title}
            </h2>
            <p className="text-xs text-slate-500">
              {activeChapter.description}
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            
            {activeChapter.content ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-xs text-[#1A1633] mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#3D2FD1]" />
                    <span>Operational Directive</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {activeChapter.content}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Core Escrow Golden Rules */}
            <div className="p-5 rounded-2xl bg-[#F2F0FF] border border-[#3D2FD1]/20 space-y-3">
              <h4 className="font-bold text-xs text-[#1A1633] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3D2FD1]" />
                <span>Talentio Escrow & Safety Enforcement</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Full Milestone Escrow Lock:</strong> Work only commences when client deposits 100% of the active milestone funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>On-Platform IP Assignment:</strong> Automated copyright and intellectual property transfer immediately upon milestone release.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>48-Hour Dispute Arbitration:</strong> Dedicated Talentio mediators review Git commits and Figma version history in event of contest.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
