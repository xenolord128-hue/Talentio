import React, { useState, useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { Gift, Sparkles, CheckCircle2, Copy, Check, ArrowRight, ShieldCheck, Zap, X, Clock, PartyPopper } from 'lucide-react';

interface DualGiftRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DualGiftRewardsModal: React.FC<DualGiftRewardsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, showToast } = useGuide();
  
  const [claimedGift1, setClaimedGift1] = useState<boolean>(() => {
    return localStorage.getItem('talentio_gift_1_claimed') === 'true';
  });
  const [claimedGift2, setClaimedGift2] = useState<boolean>(() => {
    return localStorage.getItem('talentio_gift_2_claimed') === 'true';
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaimGift1 = () => {
    setClaimedGift1(true);
    localStorage.setItem('talentio_gift_1_claimed', 'true');
    showToast('🎉 Gift #1 Claimed: $50 USD Escrow Voucher added to your account balance!', 'success');
  };

  const handleClaimGift2 = () => {
    setClaimedGift2(true);
    localStorage.setItem('talentio_gift_2_claimed', 'true');
    showToast('🚀 Gift #2 Claimed: 0% Platform Commission active for your next 3 orders!', 'success');
  };

  const handleClaimBothGifts = () => {
    setClaimedGift1(true);
    setClaimedGift2(true);
    localStorage.setItem('talentio_gift_1_claimed', 'true');
    localStorage.setItem('talentio_gift_2_claimed', 'true');
    showToast('🎁 Both Welcome Gifts Successfully Claimed & Activated!', 'success');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0C0A18]/90 backdrop-blur-2xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#171330] text-white rounded-3xl sm:rounded-[32px] border border-[#A38BFF]/40 shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-6 sm:p-8 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6E5BFF]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#3D2FD1]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-[#6E5BFF] flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-display">
                  Dual Welcome Gift Bundle
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  2 Gifts Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Claim both guaranteed starter gifts to jumpstart your projects and sales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Gift Cards Container */}
        <div className="py-5 space-y-4 flex-1 overflow-y-auto pr-1 relative z-10">
          
          {/* GIFT 1: Client Escrow Voucher */}
          <div className={`p-5 rounded-2xl border transition-all ${
            claimedGift1
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-white/5 hover:bg-white/10 border-[#A38BFF]/30'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#3D2FD1] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Gift 1 • Escrow Credit
                    </span>
                    <span className="text-xs text-slate-400 font-mono">CODE: ESCROW50</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    $50 USD Instant Project Escrow Voucher
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Valid on any project above $100. Applied instantly at milestone checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy('ESCROW50')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title="Copy Voucher Code"
                >
                  {copiedCode === 'ESCROW50' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClaimGift1}
                  disabled={claimedGift1}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    claimedGift1
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white shadow-md shadow-[#3D2FD1]/30'
                  }`}
                >
                  {claimedGift1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Claimed & Active</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Claim $50 Gift</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* GIFT 2: Seller 0% Fee Pass */}
          <div className={`p-5 rounded-2xl border transition-all ${
            claimedGift2
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-white/5 hover:bg-white/10 border-[#A38BFF]/30'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Gift 2 • Fee Waiver
                    </span>
                    <span className="text-xs text-slate-400 font-mono">CODE: ZEROCOMMISSION</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    0% Platform Commission Fee Pass (3 Orders)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Keep 100% of your earnings on your next 3 completed client milestones.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy('ZEROCOMMISSION')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  title="Copy Promo Code"
                >
                  {copiedCode === 'ZEROCOMMISSION' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClaimGift2}
                  disabled={claimedGift2}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    claimedGift2
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white shadow-md'
                  }`}
                >
                  {claimedGift2 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Claimed & Active</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Claim 0% Fee Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Claim Both Together Button */}
        {(!claimedGift1 || !claimedGift2) && (
          <button
            type="button"
            onClick={handleClaimBothGifts}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-rose-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#3D2FD1]/30 flex items-center justify-center gap-2 cursor-pointer transition-all mb-3 relative z-10"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Claim Both 2 Gifts Together (1-Click)</span>
          </button>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Valid for 30 days after signup</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>

    </div>
  );
};
