import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  X, 
  Send, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2,
  Layers,
  AlertCircle
} from 'lucide-react';

export const ProposalModal: React.FC = () => {
  const { 
    isProposalModalOpen, 
    setIsProposalModalOpen, 
    proposalJobTarget, 
    submitProposal,
    user 
  } = useGuide();

  const [bidAmount, setBidAmount] = useState<number>(() => {
    return proposalJobTarget?.budget || 1500;
  });
  const [duration, setDuration] = useState<string>('7 days');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [milestonesCount, setMilestonesCount] = useState<number>(2);

  if (!isProposalModalOpen || !proposalJobTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;

    submitProposal({
      jobId: proposalJobTarget.id,
      jobTitle: proposalJobTarget.title,
      freelancerId: user?.id || 'freelancer-1',
      freelancerName: user?.name || 'Sofia Chen',
      freelancerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bidAmount,
      duration,
      coverLetter
    });
  };

  const talentioFeePercent = 10;
  const netEarnings = Math.round(bidAmount * (1 - talentioFeePercent / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl ios-glass-dark text-white rounded-[28px] border border-[#A38BFF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8 overflow-hidden my-auto">
        
        {/* Ambient Top Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#3D2FD1]/30 to-transparent blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsProposalModalOpen(false)}
          className="absolute top-5 right-5 p-3 min-w-[48px] min-h-[48px] rounded-2xl bg-white/10 hover:bg-white/20 border border-[#A38BFF]/30 text-slate-300 hover:text-white transition-colors cursor-pointer z-10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#3D2FD1]/40 border border-[#A38BFF]/40 text-[#A38BFF]">
              Escrow Bid Application
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Client Budget: <strong className="text-white">${proposalJobTarget.budget} USD ({proposalJobTarget.budgetType === 'hourly' ? 'Hourly' : 'Fixed'})</strong>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-snug">
            {proposalJobTarget.title}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Bid & Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Your Total Bid ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A38BFF]" />
                <input
                  type="number"
                  min={50}
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>You'll receive (after 10% fee):</span>
                <strong className="text-emerald-400 font-mono font-bold">${netEarnings}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Estimated Delivery
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A38BFF]" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 text-white text-sm font-semibold focus:outline-none focus:border-[#6E5BFF]"
                >
                  <option value="3 days" className="bg-[#1A1633]">3 business days</option>
                  <option value="7 days" className="bg-[#1A1633]">7 business days (1 week)</option>
                  <option value="14 days" className="bg-[#1A1633]">14 days (2 weeks)</option>
                  <option value="21 days" className="bg-[#1A1633]">21 days (3 weeks)</option>
                  <option value="30 days" className="bg-[#1A1633]">30 days (1 month)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Cover Letter & Proposed Solution
              </label>
              <span className="text-[11px] text-slate-400">
                Explain your methodology & past deliverables
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Detail your approach, tech stack, milestones, and how you will meet the client's expectations..."
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF] resize-none leading-relaxed"
            />
          </div>

          {/* Escrow Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#6E5BFF] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <p className="font-bold text-white mb-0.5">Talentio Escrow Protection</p>
              <p className="opacity-90">
                When the client accepts your proposal, funds will be funded into Escrow before you begin work.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] text-white font-bold text-sm shadow-lg shadow-[#3D2FD1]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Submit Escrow Proposal (${bidAmount} USD)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
