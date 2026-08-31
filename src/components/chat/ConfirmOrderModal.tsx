import React, { useState } from 'react';
import { ConversationParticipant } from '../../types';
import { useGuide } from '../../context/GuideContext';
import { formatPrice } from '../../utils/currency';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  FileText, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { VerifiedBadge } from '../VerifiedBadge';

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ConversationParticipant;
  onSendOrderRequest: (details: {
    title: string;
    amount: number;
    deliveryDays: number;
    requirements: string;
  }) => void;
}

export const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  client,
  onSendOrderRequest
}) => {
  const { currency, user, showToast } = useGuide();

  // Form State
  const [title, setTitle] = useState('Full-Stack Web Development & Escrow Milestone Delivery');
  const [amount, setAmount] = useState('450');
  const [deliveryDays, setDeliveryDays] = useState('5');
  const [requirements, setRequirements] = useState(
    '1. Complete frontend UI & responsive layout\n2. Backend API routes & database models\n3. Quality assurance & live production deployment'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const numDays = parseInt(deliveryDays, 10) || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a project title', 'warning');
      return;
    }
    if (numAmount <= 0) {
      showToast('Please enter a valid order amount greater than 0', 'warning');
      return;
    }
    if (numDays <= 0) {
      showToast('Delivery timeline must be at least 1 day', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSendOrderRequest({
        title: title.trim(),
        amount: numAmount,
        deliveryDays: numDays,
        requirements: requirements.trim()
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#1A1633] via-[#2D1B69] to-[#1A1633] text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#6E5BFF]/30 border border-[#6E5BFF]/50 flex items-center justify-center text-[#C4B8FF]">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Confirm Order Request</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  Escrow 2.0
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Send an official hiring contract request to the client
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
          
          {/* Target Client Bar */}
          <div className="p-3 rounded-2xl bg-[#F2F0FF] border border-[#6E5BFF]/20 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={client.avatar}
                alt={client.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#6E5BFF]/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase text-slate-500">Recipient Client</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#1A1633] truncate flex items-center gap-1">
                  <span>{client.name}</span>
                  {client.countryFlag && <span>{client.countryFlag}</span>}
                  {client.verified && <VerifiedBadge size="xs" />}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Buyer</span>
              </span>
            </div>
          </div>

          {/* Primary Prompt Text */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Are you sure you want to send an order confirmation request to this client?
              </p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                The client will receive an interactive order confirmation card in the chat. When they confirm, the contract becomes active and escrow funds are locked.
              </p>
            </div>
          </div>

          {/* Project Title Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 flex items-center justify-between">
              <span>Project / Service Scope Title</span>
              <span className="text-[10px] font-normal text-slate-400">Required</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Web Development & Escrow Milestone Delivery"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#1A1633] placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20"
              />
            </div>
          </div>

          {/* Amount and Delivery Days Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Amount ($ USD) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700 flex items-center justify-between">
                <span>Agreed Price ($ USD)</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  {formatPrice(numAmount, currency)}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="450"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-[#1A1633] focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20"
                />
              </div>
            </div>

            {/* Delivery Days */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                <span>Delivery Timeline</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  placeholder="5"
                  required
                  className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-[#1A1633] focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Days
                </span>
              </div>
            </div>
          </div>

          {/* Scope / Deliverables / Requirements Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 flex items-center justify-between">
              <span>Scope & Milestones Specification</span>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-[11px] text-[#6E5BFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Tips</span>
              </button>
            </label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Outline deliverables, source code repositories, revisions or requirements..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-[#1A1633] placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 resize-none leading-relaxed"
            />
          </div>

          {/* Escrow Guarantee Box */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5 text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Talentio 3-Tier Multi-Sig Escrow Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Once confirmed, payment is safely held by Talentio Escrow Vault and will be disbursed to your balance as milestone deliverables are approved.
            </p>
          </div>

        </form>

        {/* Modal Footer with Actions */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C4B8FF]" />
                <span>Send Confirmation Request</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
