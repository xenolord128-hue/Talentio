import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { 
  X, 
  PlusCircle, 
  Briefcase, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { TALENTIO_CATEGORIES } from '../data/talentioData';

export const PostJobModal: React.FC = () => {
  const { isPostJobModalOpen, setIsPostJobModalOpen, addPostedJob, currency, setActivePage } = useGuide();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('web-dev');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budget, setBudget] = useState('2500');
  const [duration, setDuration] = useState('2-4 weeks');
  const [skillsInput, setSkillsInput] = useState('React, Tailwind CSS, TypeScript');
  const [requireNda, setRequireNda] = useState(true);

  if (!isPostJobModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addPostedJob({
      title,
      clientName: 'Alexander Vance (Enterprise)',
      clientCompany: 'Enterprise Client',
      clientCountry: 'United Kingdom 🇬🇧',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      budget: parseFloat(budget) || 1000,
      budgetType,
      duration,
      description,
      skills: skillsArray.length ? skillsArray : ['Full-Stack', 'Cloud'],
      verifiedPayment: true,
      category
    });

    setIsPostJobModalOpen(false);
    setActivePage('freelancers');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-150">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsPostJobModalOpen(false)} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-[28px] ios-glass text-[#1A1633] shadow-[0_25px_80px_rgba(26,22,51,0.35)] border border-white/80 overflow-hidden z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#1A1633] text-white border-b border-[#A38BFF]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TalentioLogo size="sm" variant="gradient" />
            <div>
              <h3 className="text-base sm:text-lg font-bold">Post a Project with Escrow Protection</h3>
              <p className="text-xs text-slate-300">Receive vetted proposals from top 3% international freelancers</p>
            </div>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(false)}
            className="p-3 min-w-[48px] min-h-[48px] rounded-2xl bg-white/10 hover:bg-white/20 border border-[#A38BFF]/30 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#1A1633] block">
              Project Title <span className="text-[#3D2FD1]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Senior Full-Stack Next.js 15 Engineer for SaaS Dashboard"
              required
              className="w-full bg-white/90 backdrop-blur-xs text-[#1A1633] placeholder:text-slate-400 px-4 py-3.5 min-h-[48px] rounded-2xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 focus:outline-none text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Category & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1633] block">Category Specialty</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-xs text-[#1A1633] px-4 py-3.5 min-h-[48px] rounded-2xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none font-medium"
              >
                {TALENTIO_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1633] block">Estimated Timeline</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-xs text-[#1A1633] px-4 py-3.5 min-h-[48px] rounded-2xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none font-medium"
              >
                <option value="< 1 week">Under 1 week (Fast Sprint)</option>
                <option value="2-4 weeks">2 to 4 weeks (Standard Project)</option>
                <option value="1-3 months">1 to 3 months (Comprehensive Build)</option>
                <option value="3+ months">3+ months (Long-term Dedicated)</option>
              </select>
            </div>

          </div>

          {/* Budget Setup */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#A38BFF]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-[#1A1633]">Escrow Budget Allocation</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType('fixed')}
                  className={`px-4 py-2.5 min-h-[44px] rounded-xl font-bold transition-all ${
                    budgetType === 'fixed'
                      ? 'bg-[#3D2FD1] text-white shadow-sm'
                      : 'bg-white/80 border border-[#A38BFF]/20 text-slate-700'
                  }`}
                >
                  Fixed Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType('hourly')}
                  className={`px-4 py-2.5 min-h-[44px] rounded-xl font-bold transition-all ${
                    budgetType === 'hourly'
                      ? 'bg-[#3D2FD1] text-white shadow-sm'
                      : 'bg-white/80 border border-[#A38BFF]/20 text-slate-700'
                  }`}
                >
                  Hourly Rate
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  {currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="2500"
                  className="w-full bg-white text-[#1A1633] pl-9 pr-4 py-3 min-h-[48px] rounded-xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none font-bold text-sm"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {budgetType === 'fixed' ? 'Total Project Escrow' : 'Per Hour Target'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#1A1633] block">
              Scope of Work & Deliverables <span className="text-[#3D2FD1]">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your requirements, design system needs, technical architecture, and expected deliverables..."
              required
              className="w-full bg-white/90 backdrop-blur-xs text-[#1A1633] placeholder:text-slate-400 p-4 rounded-2xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 focus:outline-none text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Required Skills */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#1A1633] block">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="React, Next.js, Figma, Tailwind, AWS"
              className="w-full bg-white/90 text-[#1A1633] px-4 py-3.5 min-h-[48px] rounded-2xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none"
            />
          </div>

          {/* Security & NDA Checkbox */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/30">
            <input
              type="checkbox"
              id="nda"
              checked={requireNda}
              onChange={e => setRequireNda(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-[#3D2FD1] focus:ring-[#6E5BFF] cursor-pointer"
            />
            <label htmlFor="nda" className="text-xs sm:text-sm text-slate-700 cursor-pointer flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3D2FD1] shrink-0" />
              <span>Require standard automated Talentio IP & NDA Agreement upon contract acceptance</span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(false)}
              className="w-full sm:w-auto px-5 py-3.5 min-h-[48px] rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-[#A38BFF]" />
              <span>Post Project with Escrow</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
