import React, { useState } from 'react';
import { OrderRequestDetails } from '../../types';
import { useGuide } from '../../context/GuideContext';
import { formatPrice } from '../../utils/currency';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Lock,
  DollarSign
} from 'lucide-react';
import { VerifiedBadge } from '../VerifiedBadge';

interface OrderConfirmationCardProps {
  messageId: string;
  orderRequest: OrderRequestDetails;
  isMe: boolean;
  onConfirm: (messageId: string) => void;
  onCancel: (messageId: string) => void;
  onViewWorkstation?: (contractId?: string) => void;
}

export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  messageId,
  orderRequest,
  isMe,
  onConfirm,
  onCancel,
  onViewWorkstation
}) => {
  const { user, currency, setActivePage } = useGuide();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const isPending = orderRequest.status === 'pending';
  const isConfirmed = orderRequest.status === 'confirmed';
  const isCancelled = orderRequest.status === 'cancelled';

  // Determine if current viewer is the Client (buyer) or Freelancer (seller)
  const isClientViewer = user?.userType === 'client' || (!isMe && orderRequest.clientId === user?.id) || !isMe;

  const handleConfirmClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(messageId);
      setIsProcessing(false);
    }, 400);
  };

  const handleCancelClick = () => {
    onCancel(messageId);
    setShowCancelPrompt(false);
  };

  const handleGoToWorkstation = () => {
    if (onViewWorkstation) {
      onViewWorkstation(orderRequest.contractId || orderRequest.orderNumber);
    } else {
      setActivePage('workstation');
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-lg border border-purple-200/80 bg-white text-[#1A1633] transition-all">
      
      {/* CARD HEADER */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1A1633] via-[#2E1A66] to-[#1A1633] text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#6E5BFF]/30 border border-[#6E5BFF]/50 flex items-center justify-center text-[#C4B8FF]">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold tracking-wide text-white flex items-center gap-1.5">
              <span>Order Confirmation Request</span>
            </span>
            <div className="text-[10px] text-slate-300 font-mono">
              #{orderRequest.orderNumber || orderRequest.id.slice(0, 10)}
            </div>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Pending Client Confirmation</span>
            </span>
          )}
          {isConfirmed && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confirmed & Active</span>
            </span>
          )}
          {isCancelled && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Cancelled</span>
            </span>
          )}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 sm:p-5 space-y-3.5">
        
        {/* Project Scope Title */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Service & Deliverable Scope
          </span>
          <h4 className="text-sm sm:text-base font-extrabold text-[#1A1633] leading-snug">
            {orderRequest.title}
          </h4>
        </div>

        {/* Requirements / Deliverables note */}
        {orderRequest.requirements && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
            <span className="font-bold text-[#3D2FD1] block mb-1">Scope Details:</span>
            {orderRequest.requirements}
          </div>
        )}

        {/* 3-Column Stats Breakdown */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Price */}
          <div className="p-2.5 rounded-xl bg-[#F2F0FF] border border-[#6E5BFF]/20 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Escrow</span>
            <div className="text-sm sm:text-base font-black text-[#3D2FD1] font-mono mt-0.5">
              ${orderRequest.amount}
            </div>
            <span className="text-[9px] font-medium text-[#6E5BFF] block truncate">
              {formatPrice(orderRequest.amount, currency)}
            </span>
          </div>

          {/* Delivery */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Timeline</span>
            <div className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{orderRequest.deliveryDays}d</span>
            </div>
            <span className="text-[9px] font-medium text-slate-500 block">
              Estimated Delivery
            </span>
          </div>

          {/* Protection */}
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">Security</span>
            <div className="text-sm sm:text-base font-extrabold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100%</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 block">
              Escrow Vault
            </span>
          </div>
        </div>

        {/* Parties Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span>Freelancer:</span>
            <span className="font-bold text-slate-800">{orderRequest.freelancerName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Client:</span>
            <span className="font-bold text-slate-800">{orderRequest.clientName}</span>
          </div>
        </div>

        {/* ACTION / STATUS FOOTER */}
        <div className="pt-2">
          
          {/* PENDING STATE */}
          {isPending && (
            <div>
              {/* Cancel Confirmation Prompt */}
              {showCancelPrompt ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-in fade-in">
                  <div className="font-bold">Decline or Cancel this Order Request?</div>
                  <p className="text-[11px] text-rose-800">
                    This will mark the hiring request as cancelled. No funds will be charged.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleCancelClick}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Yes, Cancel Request
                    </button>
                    <button
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Keep Pending
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Actions */
                <div className="flex items-center gap-2">
                  
                  {/* Cancel button */}
                  <button
                    type="button"
                    onClick={() => setShowCancelPrompt(true)}
                    disabled={isProcessing}
                    className="py-2.5 px-3 sm:px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={handleConfirmClick}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Locking Escrow & Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Order</span>
                      </>
                    )}
                  </button>

                </div>
              )}
            </div>
          )}

          {/* CONFIRMED STATE */}
          {isConfirmed && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Order Confirmed & Escrow Locked!</span>
                    <span className="text-[11px] text-emerald-700">
                      Workstation collaboration workspace is now active.
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoToWorkstation}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-extrabold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Go to Workstation & Escrow Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CANCELLED STATE */}
          {isCancelled && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-900">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold block">Order Request Cancelled</span>
                <span className="text-[11px] text-rose-700">
                  This confirmation proposal was declined. You can negotiate or send a new request anytime.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
