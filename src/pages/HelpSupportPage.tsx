import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  HelpCircle, 
  ShieldCheck, 
  Scale, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  FileText,
  Sparkles
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does Talentio Smart Escrow protect my project funds?',
    a: 'When you order a gig or accept a proposal, your milestone deposit is locked into Talentio\'s secure cryptographic escrow vault. The freelancer begins work knowing funds are guaranteed, but the money is only disbursed to the freelancer once you review and approve the final milestone deliverable.'
  },
  {
    q: 'What happens if a deliverable does not match specifications?',
    a: 'You can request unlimited included revisions through the Workstation tab. If specifications are still unmet, you can initiate Talentio Dispute Arbitration. An impartial specialist will review contract milestones, deliverable files, and chat records to ensure fair resolution.'
  },
  {
    q: 'How do freelancer payouts and currency conversion work?',
    a: 'Talentio supports real-time multi-currency conversions (USD, EUR, GBP, BDT, INR, CAD, AUD, JPY). Upon milestone release, earnings can be withdrawn via Bank Wire, Wise, Payoneer, or Stripe Connect.'
  },
  {
    q: 'Can I negotiate custom milestones with a freelancer?',
    a: 'Yes! Through the Direct Messaging screen, clients and freelancers can exchange custom milestone offers with specific price points, delivery timelines, and file deliverable requirements.'
  }
];

export const HelpSupportPage: React.FC = () => {
  const { setActivePage, showToast } = useGuide();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    showToast('Support ticket submitted! Ticket #ESC-' + Math.floor(1000 + Math.random() * 9000), 'success');
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 pb-24">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30">
          <HelpCircle className="w-4 h-4 text-[#3D2FD1]" />
          <span>Talentio Trust & Support Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1A1633] tracking-tight font-display">
          How can we assist you?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Learn about escrow milestones, dispute resolution protocols, and account security.
        </p>
      </div>

      {/* 3 Core Trust Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">100% Escrow Protection</h3>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">Funds are securely locked until deliverables are verified and accepted.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">Neutral Dispute Arbitration</h3>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">Impartial milestone mediation powered by documented project scope.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">24/7 Priority Support</h3>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">Dedicated account assistance for enterprise milestones and payment routing.</p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1A1633] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#3D2FD1]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Ticket Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#1A1633] font-display">Submit a Support Ticket</h3>
          <p className="text-xs text-slate-500 font-normal">Need assistance with a specific order, payment, or escrow contract?</p>
        </div>

        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={contactSubject}
            onChange={e => setContactSubject(e.target.value)}
            placeholder="Subject (e.g. Escrow milestone question, Contract revision issue)..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3D2FD1]"
          />
          <textarea
            required
            rows={3}
            value={contactMessage}
            onChange={e => setContactMessage(e.target.value)}
            placeholder="Describe your issue or question in detail..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3D2FD1] resize-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-[#3D2FD1]/20 cursor-pointer transition-all active:scale-95"
          >
            Submit Ticket
          </button>
        </form>
      </div>

    </div>
  );
};
