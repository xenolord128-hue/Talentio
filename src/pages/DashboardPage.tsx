import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  CreditCard, 
  Building, 
  Globe, 
  Sparkles,
  Layers,
  Users,
  Briefcase,
  PlusCircle,
  FileText,
  UserCheck,
  Send,
  Building2,
  ExternalLink,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    contract, 
    currency, 
    showToast, 
    postedJobs, 
    proposals, 
    services, 
    setIsPostJobModalOpen,
    setIsCreateGigModalOpen,
    openProposalModal,
    setActivePage,
    setSelectedFreelancer,
    freelancers
  } = useGuide();

  // Dynamic Tabs based on User Role
  const isClient = user?.userType === 'client';
  const isAgency = user?.userType === 'agency';
  const isFreelancer = user?.userType === 'freelancer' || (!isClient && !isAgency);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [payoutAmount, setPayoutAmount] = useState('2450');
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'payoneer' | 'stripe' | 'bkash'>('bank');

  const formatCurrency = (amt: number) => {
    if (currency === 'EUR') return `€${Math.round(amt * 0.92)}`;
    if (currency === 'GBP') return `£${Math.round(amt * 0.79)}`;
    return `$${amt.toLocaleString()}`;
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Payout request of $${payoutAmount} submitted via ${payoutMethod.toUpperCase()}! Transfer arriving in 24h.`, 'success');
  };

  // Filter recommended jobs for freelancer
  const recommendedJobs = postedJobs.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner with User Greeting & Role Badge */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#1A1633]/90 backdrop-blur-md text-white border border-[#A38BFF]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3D2FD1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#6E5BFF]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#6E5BFF] shadow-lg shrink-0"
          />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-[#3D2FD1]/50 backdrop-blur-md text-[#A38BFF] border border-[#6E5BFF]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isClient ? 'Verified Client Buyer' : isAgency ? 'Verified Digital Agency' : 'Pro Freelancer Member'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-display text-white">
              {user?.name || 'Alexander Vance'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isClient 
                ? (user?.companyName || 'Vance Fintech Solutions') 
                : (user?.title || 'Senior UI/UX & Design Systems Architect')}
              {' • '}<span className="text-[#A38BFF] font-mono">{user?.location || 'Global'}</span>
            </p>
          </div>
        </div>

        {/* Primary Action Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full sm:w-auto">
          {isClient ? (
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] text-white font-bold text-xs shadow-lg shadow-[#3D2FD1]/35 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Project</span>
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsCreateGigModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Service Gig</span>
              </button>
              <button
                onClick={() => setActivePage('freelancers')}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[#A38BFF]/30"
              >
                <span>Find Jobs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Role Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 p-2 sm:p-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
            activeTab === 'overview' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
          }`}
        >
          Executive Overview
        </button>

        {isClient && (
          <>
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                activeTab === 'my-jobs' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
              }`}
            >
              My Posted Jobs ({postedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                activeTab === 'contracts' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
              }`}
            >
              Active Escrow Orders
            </button>
          </>
        )}

        {!isClient && (
          <>
            <button
              onClick={() => setActiveTab('jobs-feed')}
              className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                activeTab === 'jobs-feed' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
              }`}
            >
              Recommended Jobs ({postedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                activeTab === 'proposals' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
              }`}
            >
              My Proposals ({proposals.length})
            </button>
            <button
              onClick={() => setActiveTab('my-gigs')}
              className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                activeTab === 'my-gigs' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
              }`}
            >
              My Service Catalog
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 sm:px-5 py-3 min-h-[48px] rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
            activeTab === 'payouts' ? 'bg-[#3D2FD1] text-white shadow-md' : 'text-slate-600 hover:text-[#1A1633] hover:bg-white/80'
          }`}
        >
          {isClient ? 'Billing & Escrow Ledger' : 'Withdrawals & Payouts'}
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Stat 1 */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-lg transition-all space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isClient ? 'Available Balance' : 'Cleared Earnings'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3D2FD1] font-display">
            {formatCurrency(user?.balanceAvailable || 8450)}
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Ready for withdrawal or escrow lock</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-lg transition-all space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Escrow In-Holding</span>
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#6E5BFF] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1633] font-display">
            {formatCurrency(contract.totalAmount)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Protected in Contract #{contract.orderNumber}
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-lg transition-all space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isClient ? 'Active Open Jobs' : 'Active Proposals'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1A1633] font-display">
            {isClient ? postedJobs.length : proposals.length}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {isClient ? 'Receiving bids from top talent' : 'Under client review'}
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-lg transition-all space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Escrow Tier Status</span>
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3D2FD1] font-display">
            Tier {user?.escrowTier || 1} Pro
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Dispute-Free Payouts</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TAB: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2 Cols: Active Workstation & Milestones */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1633]">Live Workstation Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Current escrow contracts and milestone deliverables</p>
              </div>
              <button
                onClick={() => setActivePage('workstation')}
                className="text-xs font-bold text-[#3D2FD1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Workstation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contract Item */}
            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3D2FD1] to-[#6E5BFF] text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6 text-[#A38BFF]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1633]">{contract.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Client: <strong>{contract.clientName}</strong></span>
                    <span>•</span>
                    <span>Talent: <strong>{contract.freelancerName}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-[#3D2FD1] block font-mono">{formatCurrency(contract.totalAmount)}</span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {contract.status}
                </span>
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Milestone Deliverables</span>
              {(contract.milestones || []).map((m, idx) => (
                <div key={m.id} className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-[#A38BFF]/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">{m.name}</span>
                      <span className="text-[11px] text-slate-500">{m.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-700">{formatCurrency(m.amount)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ledger / Multi-Currency Box (1 Col) */}
          <div className="p-6 rounded-3xl bg-[#1A1633]/90 backdrop-blur-md text-white border border-[#A38BFF]/40 shadow-md space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Multi-Currency Wallet</h3>
              <p className="text-xs text-slate-300">Escrow-backed balances in major currencies.</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">USD Primary Balance</span>
                <span className="font-extrabold text-white font-mono">${user?.balanceAvailable || 8450}.00</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">EUR Escrow Ledger</span>
                <span className="font-extrabold text-white font-mono">€3,200.00</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">GBP Balance</span>
                <span className="font-extrabold text-white font-mono">£1,850.00</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('payouts')}
              className="w-full py-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isClient ? 'Deposit Escrow Funds' : 'Initiate Payout'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: RECOMMENDED JOBS FEED (For Freelancers) */}
      {/* ========================================================================= */}
      {activeTab === 'jobs-feed' && !isClient && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#1A1633] font-display">
                Matching Client Contracts for Your Skill Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted projects matching your category: <strong className="text-[#3D2FD1]">{user?.category || 'Web & Design'}</strong>
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F2F0FF] text-[#3D2FD1] border border-[#3D2FD1]/15">
              Escrow Guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postedJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F2F0FF] text-[#3D2FD1]">
                      {job.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {job.postedAgo}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#1A1633] mb-2 leading-snug">
                    {job.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(job.skills || []).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/80 text-[11px] text-slate-700 font-semibold border border-[#A38BFF]/20">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#A38BFF]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget</span>
                    <strong className="text-sm font-extrabold text-[#3D2FD1] font-mono">
                      ${job.budget} USD ({job.budgetType === 'hourly' ? 'Hourly' : 'Fixed'})
                    </strong>
                  </div>

                  <button
                    onClick={() => openProposalModal(job)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply / Bid</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MY PROPOSALS */}
      {/* ========================================================================= */}
      {activeTab === 'proposals' && !isClient && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1A1633]">My Submitted Escrow Proposals</h3>
              <p className="text-xs text-slate-500">Track application bids submitted to international buyers</p>
            </div>
            <button
              onClick={() => setActiveTab('jobs-feed')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F2F0FF] text-[#3D2FD1] hover:bg-[#3D2FD1] hover:text-white transition-colors cursor-pointer"
            >
              + Submit New Bid
            </button>
          </div>

          <div className="space-y-3">
            {proposals.map((prop) => (
              <div key={prop.id} className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {prop.status}
                    </span>
                    <span className="text-xs text-slate-400">{prop.submittedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1633]">{prop.jobTitle}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{prop.coverLetter}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-[#3D2FD1] font-mono">${prop.bidAmount} USD</div>
                  <span className="text-xs text-slate-500">{prop.duration} delivery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MY POSTED JOBS (For Clients) */}
      {/* ========================================================================= */}
      {activeTab === 'my-jobs' && isClient && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1A1633]">My Posted Job Contracts</h3>
              <p className="text-xs text-slate-500">Manage active job openings and applicant proposals</p>
            </div>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white font-bold text-xs shadow-md cursor-pointer"
            >
              + Post New Project
            </button>
          </div>

          <div className="space-y-4">
            {postedJobs.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#F2F0FF] text-[#3D2FD1]">
                      {job.category}
                    </span>
                    <span className="text-xs text-slate-400">Posted {job.postedAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1633]">{job.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{job.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#3D2FD1]">
                      ${job.budget} USD ({job.budgetType === 'hourly' ? 'Hourly' : 'Fixed'})
                    </div>
                    <span className="text-xs text-slate-500">{job.proposalsCount} Applicants</span>
                  </div>

                  <button
                    onClick={() => setActivePage('freelancers')}
                    className="px-3.5 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs cursor-pointer"
                  >
                    View Talent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: WITHDRAWALS & PAYOUTS */}
      {/* ========================================================================= */}
      {activeTab === 'payouts' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1A1633]">
              {isClient ? 'Deposit to Escrow Holding' : 'Withdraw Available Funds'}
            </h3>
            <p className="text-xs text-slate-500">
              Instant disbursement to connected bank wire, Payoneer, or local mobile wallet.
            </p>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-5 text-xs">
            
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A1633] block">Amount ($ USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="w-full bg-white text-[#1A1633] pl-8 pr-4 py-3 min-h-[48px] rounded-2xl border border-slate-200 focus:border-[#6E5BFF] focus:outline-none font-extrabold text-base"
                />
              </div>
              <span className="text-[11px] text-slate-400">Available cleared balance: ${user?.balanceAvailable || 8450}.00</span>
            </div>

            {/* Payout Method */}
            <div className="space-y-2">
              <label className="font-bold text-[#1A1633] block">Select Destination</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div
                  onClick={() => setPayoutMethod('bank')}
                  className={`p-3.5 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1 flex flex-col items-center justify-center ${
                    payoutMethod === 'bank' ? 'border-[#3D2FD1] bg-[#F2F0FF]' : 'border-slate-200'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto text-[#3D2FD1]" />
                  <span className="font-bold block text-xs text-[#1A1633]">Bank Wire</span>
                  <span className="text-[10px] text-slate-400">1-2 Days</span>
                </div>

                <div
                  onClick={() => setPayoutMethod('payoneer')}
                  className={`p-3.5 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1 flex flex-col items-center justify-center ${
                    payoutMethod === 'payoneer' ? 'border-[#3D2FD1] bg-[#F2F0FF]' : 'border-slate-200'
                  }`}
                >
                  <Globe className="w-5 h-5 mx-auto text-[#6E5BFF]" />
                  <span className="font-bold block text-xs text-[#1A1633]">Payoneer</span>
                  <span className="text-[10px] text-slate-400">Instant</span>
                </div>

                <div
                  onClick={() => setPayoutMethod('stripe')}
                  className={`p-3.5 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1 flex flex-col items-center justify-center ${
                    payoutMethod === 'stripe' ? 'border-[#3D2FD1] bg-[#F2F0FF]' : 'border-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto text-[#3D2FD1]" />
                  <span className="font-bold block text-xs text-[#1A1633]">Stripe</span>
                  <span className="text-[10px] text-slate-400">Same-Day</span>
                </div>

                <div
                  onClick={() => setPayoutMethod('bkash')}
                  className={`p-3.5 min-h-[64px] rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1 flex flex-col items-center justify-center ${
                    payoutMethod === 'bkash' ? 'border-[#3D2FD1] bg-[#F2F0FF]' : 'border-slate-200'
                  }`}
                >
                  <div className="w-5 h-5 mx-auto rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">৳</div>
                  <span className="font-bold block text-xs text-[#1A1633]">bKash / Nagad</span>
                  <span className="text-[10px] text-slate-400">BD Instant</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 min-h-[48px] rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#3D2FD1]/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
            >
              Confirm Transfer of ${payoutAmount} USD
            </button>

          </form>
        </div>
      )}

    </div>
  );
};
