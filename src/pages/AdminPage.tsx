import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { UserProfile, TalentioService, AccountStatus, GigStatus, AdminAction } from '../types';
import { TalentioLogo } from '../components/TalentioLogo';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { COUNTRIES_DATA } from '../data/countriesData';
import { formatPrice } from '../utils/currency';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  ShoppingBag, 
  DollarSign, 
  Flag, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Ban, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  MoreVertical, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  Lock, 
  Unlock, 
  Globe, 
  RefreshCw, 
  Sliders, 
  Calendar, 
  UserCheck, 
  UserX,
  Star,
  Trash2,
  X,
  Check,
  Building2,
  Briefcase,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'gigs' 
  | 'orders' 
  | 'finance' 
  | 'reports' 
  | 'system' 
  | 'security';

export const AdminPage: React.FC = () => {
  const { 
    user, 
    allUsers, 
    services, 
    adminActions, 
    approveUserAccount, 
    rejectUserAccount, 
    suspendUserAccount, 
    banUserAccount, 
    restoreUserAccount,
    approveServiceGig,
    rejectServiceGig,
    toggleFeatureServiceGig,
    removeServiceGig,
    currency,
    showToast
  } = useGuide();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // User tab filters
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | AccountStatus>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  // Gig tab filters
  const [gigSearch, setGigSearch] = useState('');
  const [gigStatusFilter, setGigStatusFilter] = useState<'all' | GigStatus>('all');
  const [selectedGigDetail, setSelectedGigDetail] = useState<TalentioService | null>(null);

  // Modal actions
  const [rejectModalTarget, setRejectModalTarget] = useState<{ type: 'user' | 'gig'; id: string; name: string } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [confirmActionModal, setConfirmActionModal] = useState<{
    title: string;
    description: string;
    actionLabel: string;
    variant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  } | null>(null);

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.handle?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.location?.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesStatus = userStatusFilter === 'all' || u.accountStatus === userStatusFilter;
    const matchesType = userTypeFilter === 'all' || u.userType === userTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Filtered Gigs
  const filteredGigs = services.filter(s => {
    const matchesSearch = 
      s.title.toLowerCase().includes(gigSearch.toLowerCase()) ||
      s.freelancerName.toLowerCase().includes(gigSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(gigSearch.toLowerCase());
    
    const matchesStatus = gigStatusFilter === 'all' || (s.status || 'approved') === gigStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics calculation
  const totalUsersCount = allUsers.length;
  const pendingUsersCount = allUsers.filter(u => u.accountStatus === 'pending').length;
  const approvedUsersCount = allUsers.filter(u => u.accountStatus === 'approved').length;
  const suspendedUsersCount = allUsers.filter(u => u.accountStatus === 'suspended' || u.accountStatus === 'banned').length;

  const totalGigsCount = services.length;
  const pendingGigsCount = services.filter(s => s.status === 'pending').length;
  const approvedGigsCount = services.filter(s => !s.status || s.status === 'approved').length;

  const totalMarketplaceVolumeUSD = 184500;
  const platformCommissionUSD = 18450; // 10% Talentio Escrow fee
  const pendingWithdrawalsUSD = 6420;

  // Handle Reject Modal Submit
  const handleConfirmRejection = () => {
    if (!rejectModalTarget) return;

    const reason = rejectionReasonInput.trim() || 'Incomplete professional verification credentials.';
    if (rejectModalTarget.type === 'user') {
      rejectUserAccount(rejectModalTarget.id, reason);
    } else {
      rejectServiceGig(rejectModalTarget.id, reason);
    }

    setRejectModalTarget(null);
    setRejectionReasonInput('');
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-slate-100 flex flex-col md:flex-row">
      
      {/* -------------------- ADMIN SIDEBAR -------------------- */}
      <aside className={`w-full md:w-64 bg-[#15102A] border-r border-white/10 flex flex-col shrink-0 z-30 ${
        sidebarOpen ? 'block' : 'hidden md:flex'
      }`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TalentioLogo size="sm" variant="gradient" />
            <div>
              <div className="text-sm font-black text-white font-display">TALENTIO</div>
              <div className="text-[9px] font-mono uppercase text-[#A38BFF] font-bold">Admin Console v3.4</div>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg bg-white/5 md:hidden text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-6 flex-1 overflow-y-auto">
          <div>
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Main Management
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-[#A38BFF]" />
                  <span>Dashboard Overview</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>User Management</span>
                </div>
                {pendingUsersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[10px] font-mono text-black font-extrabold">
                    {pendingUsersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('gigs'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'gigs'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#6E5BFF]" />
                  <span>Gig Moderation</span>
                </div>
                {pendingGigsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[10px] font-mono text-black font-extrabold">
                    {pendingGigsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span>Escrow Orders</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">12 Active</span>
              </button>
            </div>
          </div>

          <div>
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Financial & Moderation
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab('finance'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'finance'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Finance & Payouts</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">10% Fee</span>
              </button>

              <button
                onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flag className="w-4 h-4 text-rose-400" />
                  <span>User & Gig Reports</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              System & Security
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab('system'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'system'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#A38BFF]" />
                  <span>Countries & Currencies</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Security & Audit Logs</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Current Admin Badge */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#3D2FD1] flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[10px] text-emerald-400 font-mono">Super Admin Access</div>
            </div>
          </div>
        </div>
      </aside>

      {/* -------------------- MAIN ADMIN CONTENT AREA -------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Bar */}
        <header className="p-4 sm:p-5 border-b border-white/10 bg-[#15102A]/80 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-white/10 text-slate-200 md:hidden"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-white font-display capitalize">
                {activeTab === 'overview' && 'Marketplace Dashboard & Real-Time Stats'}
                {activeTab === 'users' && 'User Accounts & Seller Approval Queue'}
                {activeTab === 'gigs' && 'Service Gigs & Marketplace Moderation'}
                {activeTab === 'orders' && 'Escrow Contracts & Milestone Verification'}
                {activeTab === 'finance' && 'Financial Settlements & 10% Escrow Commissions'}
                {activeTab === 'reports' && 'Security Scanner & User Abuse Reports'}
                {activeTab === 'system' && 'Global Country & Currency Dataset Configuration'}
                {activeTab === 'security' && 'Immutable Audit Logs & Administrator Actions'}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Talentio Admin Core • Complete Platform Governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Engine</span>
            </span>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* ==================== TAB 1: OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
                    <Users className="w-5 h-5 text-[#A38BFF]" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{totalUsersCount}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingUsersCount} pending approval</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Marketplace Gigs</span>
                    <Layers className="w-5 h-5 text-[#6E5BFF]" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{totalGigsCount}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{approvedGigsCount} live in catalog</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Escrow Volume</span>
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatPrice(totalMarketplaceVolumeUSD, currency)}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% this month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Platform Revenue (10%)</span>
                    <Sparkles className="w-5 h-5 text-[#A38BFF]" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatPrice(platformCommissionUSD, currency)}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
                    <span>From escrow fee</span>
                  </div>
                </div>
              </div>

              {/* Pending Approvals Quick Action Section */}
              {pendingUsersCount > 0 && (
                <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      <h3 className="text-sm sm:text-base font-extrabold text-amber-200">
                        {pendingUsersCount} Seller Account Applications Pending Review
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Pending</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allUsers
                      .filter(u => u.accountStatus === 'pending')
                      .slice(0, 3)
                      .map(u => (
                        <div key={u.id} className="p-4 rounded-2xl bg-[#1A1633] border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2.5">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400"
                              />
                              <div className="overflow-hidden">
                                <div className="text-xs font-extrabold text-white truncate">{u.name}</div>
                                <div className="text-[11px] text-slate-300 truncate">{u.title || u.handle}</div>
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                              {u.bio || 'Registered seller awaiting admin verification.'}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => approveUserAccount(u.id)}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectModalTarget({ type: 'user', id: u.id, name: u.name })}
                              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Recent Admin Audit Stream */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-extrabold text-white font-display mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#A38BFF]" />
                  <span>Recent Platform Governance Activity</span>
                </h3>

                <div className="space-y-2.5">
                  {adminActions.slice(0, 6).map(action => (
                    <div key={action.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          action.action === 'approve' ? 'bg-emerald-500/20 text-emerald-400' :
                          action.action === 'reject' ? 'bg-rose-500/20 text-rose-400' :
                          action.action === 'suspend' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#3D2FD1]/30 text-[#A38BFF]'
                        }`}>
                          {action.action === 'approve' && <CheckCircle2 className="w-4 h-4" />}
                          {action.action === 'reject' && <XCircle className="w-4 h-4" />}
                          {action.action === 'suspend' && <AlertTriangle className="w-4 h-4" />}
                          {action.action === 'ban' && <Ban className="w-4 h-4" />}
                          {action.action === 'restore' && <RefreshCw className="w-4 h-4" />}
                          {action.action === 'feature' && <Star className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            Admin {action.action.toUpperCase()}: <span className="text-[#A38BFF]">{action.targetName}</span>
                          </div>
                          {action.reason && (
                            <div className="text-[11px] text-slate-400 mt-0.5">Reason: {action.reason}</div>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 shrink-0">
                        {action.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: USERS MANAGEMENT ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, country..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 text-white text-xs sm:text-sm placeholder:text-slate-500 border border-white/10 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                  {/* Status filter pills */}
                  {(['all', 'pending', 'approved', 'rejected', 'suspended', 'banned'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setUserStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                        userStatusFilter === st
                          ? 'bg-[#3D2FD1] text-white shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {st === 'all' ? 'All Users' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Data Table */}
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-black/30 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4">User Details</th>
                        <th className="py-3.5 px-4">Account Type</th>
                        <th className="py-3.5 px-4">Country & Phone</th>
                        <th className="py-3.5 px-4">Profile Score</th>
                        <th className="py-3.5 px-4">Approval Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map(u => {
                        const status = u.accountStatus || 'pending';
                        return (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/20"
                                />
                                <div>
                                  <div className="font-extrabold text-white">{u.name}</div>
                                  <div className="text-[11px] text-slate-400">{u.handle || u.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="capitalize font-bold px-2 py-0.5 rounded-lg bg-white/10 text-slate-200 text-xs">
                                {u.userType || 'Client'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span>{u.countryFlag || '🌐'}</span>
                                <span className="text-slate-200">{u.location || 'Global'}</span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">{u.phone || 'No phone'}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-black/40 overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      (u.profileCompletionScore || 0) >= 100 ? 'bg-emerald-400' : 'bg-amber-400'
                                    }`}
                                    style={{ width: `${u.profileCompletionScore || 70}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-slate-300">
                                  {u.profileCompletionScore || 70}%
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase font-mono ${
                                status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                                status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                status === 'suspended' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-red-950 text-red-400 border border-red-800'
                              }`}>
                                {status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => approveUserAccount(u.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                                      title="Approve Seller Account"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => setRejectModalTarget({ type: 'user', id: u.id, name: u.name })}
                                      className="px-2.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                                      title="Reject with Reason"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}

                                {status === 'approved' && (
                                  <button
                                    onClick={() => suspendUserAccount(u.id, 'Temporary administrative review')}
                                    className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-xs cursor-pointer"
                                    title="Suspend User"
                                  >
                                    Suspend
                                  </button>
                                )}

                                {(status === 'suspended' || status === 'rejected' || status === 'banned') && (
                                  <button
                                    onClick={() => restoreUserAccount(u.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs cursor-pointer"
                                    title="Restore User Account"
                                  >
                                    Restore
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedUserDetail(u)}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                                  title="View User Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 3: GIGS MODERATION ==================== */}
          {activeTab === 'gigs' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Gig Filters */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gigSearch}
                    onChange={(e) => setGigSearch(e.target.value)}
                    placeholder="Search by title, seller, category..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 text-white text-xs sm:text-sm placeholder:text-slate-500 border border-white/10 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'approved', 'pending', 'rejected'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGigStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        gigStatusFilter === st
                          ? 'bg-[#3D2FD1] text-white shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {st} Gigs
                    </button>
                  ))}
                </div>
              </div>

              {/* Gigs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGigs.map(gig => {
                  const status = gig.status || 'approved';
                  return (
                    <div key={gig.id} className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="relative h-36 rounded-2xl overflow-hidden mb-3">
                          <img
                            src={gig.coverImage}
                            alt={gig.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 right-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                              status === 'approved' ? 'bg-emerald-500 text-white' :
                              status === 'pending' ? 'bg-amber-500 text-black' : 'bg-rose-500 text-white'
                            }`}>
                              {status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={gig.freelancerAvatar}
                            alt={gig.freelancerName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-200">{gig.freelancerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({gig.category})</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 mb-2">
                          {gig.title}
                        </h4>

                        <div className="text-xs font-mono font-bold text-emerald-400 mb-3">
                          Starting at {formatPrice(gig.startingPrice, currency)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        {status === 'pending' && (
                          <button
                            onClick={() => approveServiceGig(gig.id)}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Gig</span>
                          </button>
                        )}
                        <button
                          onClick={() => toggleFeatureServiceGig(gig.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            gig.isFeatured ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 border-white/10 text-slate-300'
                          }`}
                          title="Feature in Marketplace"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeServiceGig(gig.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/30 text-rose-400 border border-white/10 cursor-pointer"
                          title="Remove Gig"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================== TAB 4: ESCROW ORDERS ==================== */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-extrabold text-white">Active Escrow Contracts & Financial Vaults</h3>
              <p className="text-xs text-slate-400">All funds are locked in Talentio 3-Tier Escrow protection.</p>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Contract #ORD-84920</div>
                  <div className="text-sm font-extrabold text-white">Full-Stack SaaS MVP & Milestone Scope</div>
                  <div className="text-xs text-slate-400 mt-1">Client: Alexander Vance • Seller: Sofia Chen</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400 font-mono">{formatPrice(3800, currency)}</div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Escrow Funded
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: FINANCE & PAYOUTS ==================== */}
          {activeTab === 'finance' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Platform Revenue</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {formatPrice(platformCommissionUSD, currency)}
                  </div>
                  <span className="text-[11px] text-slate-400">10% standard marketplace fee</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pending Withdrawals</span>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {formatPrice(pendingWithdrawalsUSD, currency)}
                  </div>
                  <span className="text-[11px] text-amber-300">3 payout requests waiting</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Settled This Month</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {formatPrice(124800, currency)}
                  </div>
                  <span className="text-[11px] text-slate-400">Bank & Crypto Escrow Transfers</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 7: COUNTRIES & CURRENCIES ==================== */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#A38BFF]" />
                  <span>Global Currencies Supported ({CURRENCIES_DATA.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Real-time benchmark exchange rates applied dynamically across all marketplace listings.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {CURRENCIES_DATA.map(c => (
                    <div key={c.code} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <div className="text-xs font-extrabold text-white">{c.code} ({c.symbol})</div>
                          <div className="text-[10px] text-slate-400">{c.name}</div>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        {c.exchangeRateToUSD}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-2">
                  International Country Database ({COUNTRIES_DATA.length} Countries)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Full ISO country mapping with calling codes and currency auto-association.
                </p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-black/20 rounded-2xl">
                  {COUNTRIES_DATA.map(c => (
                    <span key={c.code} className="px-2.5 py-1 rounded-xl bg-white/5 text-xs text-slate-300 flex items-center gap-1.5">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{c.callingCode}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 8: SECURITY AUDIT LOGS ==================== */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Immutable Administrator & Security Audit Trail</span>
              </h3>

              <div className="space-y-2">
                {adminActions.map(action => (
                  <div key={action.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-[#A38BFF]">{action.adminName}</span>
                      <span className="text-slate-300"> performed </span>
                      <span className="font-bold text-white uppercase">{action.action}</span>
                      <span className="text-slate-300"> on </span>
                      <span className="font-bold text-white">{action.targetName}</span>
                      {action.reason && <span className="text-slate-400"> ({action.reason})</span>}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{action.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* -------------------- USER DETAIL MODAL -------------------- */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#1A1633] text-white rounded-3xl border border-white/20 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserDetail.avatar}
                  alt={selectedUserDetail.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#6E5BFF]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedUserDetail.name}</h3>
                    {selectedUserDetail.verifiedBadge && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{selectedUserDetail.handle || selectedUserDetail.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#3D2FD1] text-white">
                      {selectedUserDetail.userType || 'Client'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedUserDetail.accountStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      selectedUserDetail.accountStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {selectedUserDetail.accountStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Database & Security Credentials Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#A38BFF]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Database Credentials & Auth Security</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SHA-256 / PBKDF2 Encrypted
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Auth Method</span>
                  <span className="text-white font-mono capitalize">
                    {selectedUserDetail.authMethod || 'Email/Password'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Password Security</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {selectedUserDetail.passwordStatus || 'Encrypted (PBKDF2/Argon2)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Email Record</span>
                  <span className="text-white font-mono truncate block">
                    {selectedUserDetail.email || 'None'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone Record</span>
                  <span className="text-white font-mono truncate block">
                    {selectedUserDetail.phone || 'None'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                <span>Account ID: {selectedUserDetail.id}</span>
                <button
                  type="button"
                  onClick={() => showToast(`Password reset link generated and dispatched to ${selectedUserDetail.email || selectedUserDetail.name}`, 'info')}
                  className="text-[#A38BFF] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Trigger Password Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold">Professional Title:</span>
                <p className="text-white mt-0.5">{selectedUserDetail.title || 'Not provided'}</p>
              </div>

              <div>
                <span className="text-slate-400 font-bold">Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedUserDetail.skills && selectedUserDetail.skills.length > 0 ? (
                    selectedUserDetail.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No skills specified</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold">Bio:</span>
                <p className="text-slate-300 mt-0.5">{selectedUserDetail.bio || 'Registered user awaiting further details.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase">Country / Location</span>
                  <div className="text-white font-bold">{selectedUserDetail.location || 'Global'}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-slate-400 text-[10px] uppercase">Available Balance</span>
                  <div className="text-emerald-400 font-bold font-mono">${selectedUserDetail.balanceAvailable || 0} USD</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  approveUserAccount(selectedUserDetail.id);
                  setSelectedUserDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Approve Account</span>
              </button>
              <button
                onClick={() => {
                  const target = { type: 'user' as const, id: selectedUserDetail.id, name: selectedUserDetail.name };
                  setSelectedUserDetail(null);
                  setRejectModalTarget(target);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 text-xs font-bold cursor-pointer"
              >
                Reject with Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- REJECTION REASON MODAL -------------------- */}
      {rejectModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1A1633] text-white rounded-3xl border border-rose-500/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Reject {rejectModalTarget.name}</h3>
                <p className="text-xs text-slate-400">Specify an administrative rejection reason</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Rejection Reason (Visible to applicant)
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Incomplete professional experience verification or missing portfolio deliverables."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectModalTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
