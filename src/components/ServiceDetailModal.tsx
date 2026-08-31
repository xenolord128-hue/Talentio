import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { getCurrencyByCode } from '../data/currenciesData';
import { EscrowContract } from '../types';
import { 
  X, 
  Star, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers,
  Check,
  Zap,
  FileCode2,
  Headphones,
  RotateCcw,
  Receipt,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

interface OptionalAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  deliveryDaysDelta?: number;
  revisionsDelta?: number;
}

const AVAILABLE_ADD_ONS: OptionalAddOn[] = [
  {
    id: 'express',
    name: 'Super Express Fast Delivery',
    description: 'Priority queue placement with delivery timeline reduced by up to 2 days',
    price: 30,
    icon: Zap,
    deliveryDaysDelta: -2
  },
  {
    id: 'source_files',
    name: 'Full Commercial License & Source Files',
    description: 'Includes editable raw design/code repository assets and lifetime commercial rights',
    price: 35,
    icon: FileCode2
  },
  {
    id: 'extra_revision',
    name: 'Additional Milestone Revision Round',
    description: 'Add 1 comprehensive round of design/code tweaks to the milestone scope',
    price: 20,
    icon: RotateCcw,
    revisionsDelta: 1
  },
  {
    id: 'vip_support',
    name: 'Dedicated 24/7 VIP Escalation Support',
    description: 'Direct mediation hotline and priority technical support during milestones',
    price: 15,
    icon: Headphones
  }
];

export const ServiceDetailModal: React.FC = () => {
  const { 
    selectedService, 
    isServiceModalOpen, 
    setIsServiceModalOpen, 
    currency,
    setActivePage,
    user,
    startServiceOrderEscrow
  } = useGuide();

  const [step, setStep] = useState<'select' | 'summary'>('select');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'pro'>('standard');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [clientBriefNotes, setClientBriefNotes] = useState('');
  const [isProcessingEscrow, setIsProcessingEscrow] = useState(false);

  if (!isServiceModalOpen || !selectedService) return null;

  const currencyItem = getCurrencyByCode(currency);

  const formatCurrency = (amtInUSD: number) => {
    const converted = amtInUSD * (currencyItem.exchangeRateToUSD || 1);
    if (currencyItem.decimalDigits === 0) {
      return `${currencyItem.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currencyItem.symbol}${converted.toFixed(currencyItem.decimalDigits)}`;
  };

  const currentPkg = selectedService.packages[selectedTier];

  // Calculate selected add-ons
  const activeAddOns = AVAILABLE_ADD_ONS.filter(addon => selectedAddOnIds.includes(addon.id));
  const addOnsTotal = activeAddOns.reduce((sum, item) => sum + item.price, 0);
  const basePrice = currentPkg.price;
  const totalPrice = basePrice + addOnsTotal;

  // Calculate delivery timeline taking express into account
  const expressSelected = selectedAddOnIds.includes('express');
  const effectiveDeliveryDays = expressSelected 
    ? Math.max(1, currentPkg.deliveryDays - 2) 
    : currentPkg.deliveryDays;

  // Calculate revisions
  const extraRevisionsCount = activeAddOns.reduce((sum, a) => sum + (a.revisionsDelta || 0), 0);
  const totalRevisions = currentPkg.revisions + extraRevisionsCount;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    setIsServiceModalOpen(false);
    // Reset back to tier selection for next open
    setTimeout(() => {
      setStep('select');
      setSelectedAddOnIds([]);
      setClientBriefNotes('');
    }, 200);
  };

  const handleConfirmAndLockEscrow = async () => {
    setIsProcessingEscrow(true);

    try {
      const orderNumber = `TLN-${Math.floor(100000 + Math.random() * 900000)}`;
      const contractId = `escrow-${Date.now()}`;

      // Milestone split: 50% Milestone 1, 50% Milestone 2
      const halfPrice = Math.round(totalPrice / 2);
      const remainingPrice = totalPrice - halfPrice;

      const milestones = [
        {
          id: `m1-${Date.now()}`,
          name: `Milestone 1: Project Architecture & Initial Draft`,
          amount: halfPrice,
          status: 'in_progress' as const,
          dueDate: `${Math.max(1, Math.floor(effectiveDeliveryDays / 2))} Days`
        },
        {
          id: `m2-${Date.now()}`,
          name: `Milestone 2: Final Deliverables & Source Review`,
          amount: remainingPrice,
          status: 'pending' as const,
          dueDate: `${effectiveDeliveryDays} Days`
        }
      ];

      const newContract: EscrowContract = {
        id: contractId,
        orderNumber,
        title: `${selectedService.title} (${currentPkg.name})`,
        clientName: user?.name || 'Authorized Client',
        clientCountry: user?.country || 'United States',
        freelancerName: selectedService.freelancerName,
        freelancerAvatar: selectedService.freelancerAvatar,
        totalAmount: totalPrice,
        escrowFunded: true,
        status: 'funded',
        remainingSeconds: effectiveDeliveryDays * 86400,
        deliverables: [],
        milestones,
        deliveryMessage: clientBriefNotes.trim() || `Ordered ${currentPkg.name} package under 100% Escrow Protection terms.`
      };

      await startServiceOrderEscrow(newContract);
      handleClose();
    } finally {
      setIsProcessingEscrow(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#120F24]/80 backdrop-blur-xl animate-in fade-in duration-150 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white text-[#1A1633] shadow-[0_25px_80px_rgba(18,15,36,0.5)] border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto">
        
        {/* Top Header & Step Progress Bar */}
        <div className="p-4 sm:p-5 bg-[#171330] text-white border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedService.freelancerAvatar}
                alt={selectedService.freelancerName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#6E5BFF]/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">{selectedService.freelancerName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#3D2FD1] text-white shrink-0">
                    {selectedService.freelancerBadge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{selectedService.rating}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({selectedService.reviewsCount} verified reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClose}
                className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2-Step Navigation Indicator */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setStep('select')}
              className={`p-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-left ${
                step === 'select'
                  ? 'bg-[#3D2FD1] text-white shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] ${
                step === 'summary' ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {step === 'summary' ? '✓' : '1'}
              </span>
              <div className="truncate">
                <p className="text-[11px] leading-tight">Step 1: Packages & Scope</p>
                <p className="text-[10px] font-normal text-slate-300 truncate">Select tier & add-ons</p>
              </div>
            </button>

            <button
              onClick={() => setStep('summary')}
              className={`p-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-left ${
                step === 'summary'
                  ? 'bg-[#3D2FD1] text-white shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span className="w-5 h-5 rounded-lg bg-white/20 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <div className="truncate">
                <p className="text-[11px] leading-tight">Step 2: Summary & Escrow</p>
                <p className="text-[10px] font-normal text-slate-300 truncate">Price & escrow breakdown</p>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {step === 'select' ? (
            /* STEP 1: Package Selection & Add-Ons */
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Main Service Title & Preview Banner */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-xl font-bold text-[#1A1633] leading-snug">
                  {selectedService.title}
                </h2>

                <div className="aspect-[21/8] sm:aspect-[21/7] w-full rounded-2xl overflow-hidden bg-slate-200 relative border border-slate-200 shadow-xs">
                  <img
                    src={selectedService.coverImage}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {selectedService.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-[#171330]/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Tier Package Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Milestone Tier
                  </h4>
                  <span className="text-xs text-[#3D2FD1] font-semibold">
                    100% Escrow Protection on all tiers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['basic', 'standard', 'pro'] as const).map(tierKey => {
                    const pkg = selectedService.packages[tierKey];
                    const isSelected = selectedTier === tierKey;
                    return (
                      <div
                        key={tierKey}
                        onClick={() => setSelectedTier(tierKey)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#3D2FD1] bg-[#FAF9FF] shadow-sm ring-1 ring-[#3D2FD1]/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-[#3D2FD1]' : 'text-slate-500'}`}>
                              {tierKey}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#3D2FD1] text-white flex items-center justify-center text-xs">
                                ✓
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-[#1A1633] mt-1">{pkg.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-base font-extrabold text-[#3D2FD1]">
                            {formatCurrency(pkg.price)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{pkg.deliveryDays}d</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Tier Features Breakdown */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#3D2FD1]">Tier Scope</span>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">{currentPkg.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100">
                      <Clock className="w-3.5 h-3.5 text-[#3D2FD1]" />
                      <span>{currentPkg.deliveryDays} Days Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100">
                      <Layers className="w-3.5 h-3.5 text-[#6E5BFF]" />
                      <span>{currentPkg.revisions} Revisions</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentPkg.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentPkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Package Add-Ons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Optional Package Add-Ons
                  </h4>
                  <span className="text-[11px] text-slate-400">Select to enhance your order</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_ADD_ONS.map(addon => {
                    const isChecked = selectedAddOnIds.includes(addon.id);
                    const AddOnIcon = addon.icon;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isChecked
                            ? 'bg-[#FAF9FF] border-[#3D2FD1] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked ? 'bg-[#3D2FD1] text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <AddOnIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#1A1633]">{addon.name}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{addon.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xs font-extrabold text-[#3D2FD1]">
                            +{formatCurrency(addon.price)}
                          </span>
                          <span className={`w-4 h-4 rounded-md border mt-1.5 flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-[#3D2FD1] border-[#3D2FD1] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && '✓'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* STEP 2: Dedicated Order Summary & Escrow Breakdown Confirmation */
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Summary Hero Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#171330] text-white border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#3D2FD1] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38BFF]">
                      Pre-Payment Verification Step
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Order Summary & Escrow Deposit Breakdown
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Escrow Protected</span>
                </div>
              </div>

              {/* Itemized Price Breakdown Table */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Itemized Scope & Cost Breakdown</span>
                  <span className="text-[11px] font-normal text-slate-400">All prices converted to {currency}</span>
                </h4>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  {/* Base Package Line Item */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="font-bold text-[#1A1633]">{selectedService.title}</span>
                      <p className="text-[11px] text-slate-500 capitalize">{selectedTier} Package — {currentPkg.name}</p>
                    </div>
                    <span className="font-bold text-slate-800">{formatCurrency(basePrice)}</span>
                  </div>

                  {/* Add-ons line items */}
                  {activeAddOns.map(addon => (
                    <div key={addon.id} className="flex items-center justify-between py-1 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#F2F0FF] text-[#3D2FD1] font-bold text-[10px]">Add-on</span>
                        <span className="font-medium text-slate-700">{addon.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">+{formatCurrency(addon.price)}</span>
                    </div>
                  ))}

                  {/* Escrow Fee (Zero Fee) */}
                  <div className="flex items-center justify-between py-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-700">Talentio Milestone Escrow Protection</span>
                    </div>
                    <span className="font-bold text-emerald-600 uppercase text-[11px]">Free ($0.00)</span>
                  </div>

                  {/* Total Deposit Row */}
                  <div className="flex items-center justify-between pt-3 border-t-2 border-slate-200">
                    <div>
                      <span className="font-extrabold text-sm sm:text-base text-[#1A1633]">Total Escrow Deposit</span>
                      <p className="text-[11px] text-slate-500">Funds locked securely in vault until delivery sign-off</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-[#3D2FD1]">
                        {formatCurrency(totalPrice)}
                      </span>
                      {currency !== 'USD' && (
                        <p className="text-[10px] font-mono text-slate-400">≈ ${totalPrice} USD Base</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service SLA & Included Deliverables Checklist */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Included Milestone Deliverables & SLA Guarantee
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#3D2FD1]" />
                    <span className="font-medium text-slate-700">
                      Estimated Delivery: <strong className="text-slate-900">{effectiveDeliveryDays} Days</strong>
                      {expressSelected && <span className="ml-1 text-[10px] text-amber-600 font-bold">(Super Express)</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#6E5BFF]" />
                    <span className="font-medium text-slate-700">
                      Included Revisions: <strong className="text-slate-900">{totalRevisions} Rounds</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Deliverables Checklist:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentPkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {selectedAddOnIds.includes('source_files') && (
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Editable Source Files & Lifetime Commercial License</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Project Brief / Instructions Note Input */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#3D2FD1]" />
                    <span>Project Brief / Instructions for {selectedService.freelancerName} (Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Sent immediately upon escrow deposit</span>
                </div>
                <textarea
                  rows={2}
                  value={clientBriefNotes}
                  onChange={e => setClientBriefNotes(e.target.value)}
                  placeholder="Share details, specifications, reference links, or target deadlines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3D2FD1] bg-slate-50/50"
                />
              </div>

              {/* Multi-Sig Escrow Vault Explanation */}
              <div className="p-4 rounded-2xl bg-[#171330] border border-white/10 text-white flex items-start gap-3 shadow-md">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h5 className="font-bold text-white">How Milestone Escrow Protects You:</h5>
                  <p className="text-slate-300 leading-relaxed">
                    Your payment of <strong className="text-white font-mono">{formatCurrency(totalPrice)}</strong> will be locked in the secure multi-signature escrow contract. {selectedService.freelancerName} cannot withdraw funds until you inspect and formally approve each completed milestone.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              {step === 'select' ? 'Total with Add-ons' : 'Escrow Deposit Total'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#3D2FD1]">
                {formatCurrency(totalPrice)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({effectiveDeliveryDays}d delivery)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {step === 'select' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActivePage('chat');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Contact Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setStep('summary')}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Packages</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessingEscrow}
                  onClick={handleConfirmAndLockEscrow}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-[#A38BFF]" />
                  <span>{isProcessingEscrow ? 'Locking Escrow...' : `Authorize Escrow (${formatCurrency(totalPrice)})`}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
