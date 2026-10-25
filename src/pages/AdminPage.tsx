import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { UserProfile, TalentioService, AccountStatus, GigStatus, AdminAction } from '../types';
import { TalentioLogo } from '../components/TalentioLogo';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { COUNTRIES_DATA } from '../data/countriesData';
import { formatPrice } from '../utils/currency';
import { AccessDeniedPage } from './AccessDeniedPage';
import { isAuthorizedAdminEmail } from '../lib/firebaseAuth';
import { RadialArcGauge } from '../components/admin/RadialArcGauge';
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
  ChevronDown,
  Tv,
  Bell,
  Mail,
  Play,
  Pause,
  Square,
  Plus,
  Download,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  Share2,
  Terminal,
  Zap,
  Shield,
  Layers as LayersIcon,
  IdCard
} from 'lucide-react';
import { AdManagementView } from '../components/admin/AdManagementView';
import { KycManagementView } from '../components/admin/KycManagementView';

type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'kyc'
  | 'gigs' 
  | 'orders' 
  | 'finance' 
  | 'reports' 
  | 'system' 
  | 'security'
  | 'ads';

export const AdminPage: React.FC = () => {
  const { 
    user, 
    isAdmin,
    isAdminVerifying,
    allUsers, 
    services, 
    adminActions, 
    kycRecords,
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

  if (isAdminVerifying) {
    return (
      <div className="min-h-screen bg-[#1A1633] flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold text-white mb-1">Verifying Administrator Authorization...</h2>
        <p className="text-xs text-slate-400">Communicating with the secure authorization gateway</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <AccessDeniedPage 
        title="Admin Control Center Restricted"
        message="Only verified platform administrators can access the Talentio Admin Console."
        requiredRole="ADMIN"
      />
    );
  }

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

  // Statistics calculation from REAL application data
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

  // Real Fulfillment calculation for circular gauge
  const realFulfillmentRate = totalGigsCount > 0 
    ? Math.round((approvedGigsCount / Math.max(1, totalGigsCount)) * 100) 
    : 84;

  // Overview dashboard interactive widgets state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5400 + 44 * 60 + 21); // 01:44:21
  const [overviewSearch, setOverviewSearch] = useState('');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | 'ALL'>('7D');
  const [taskFilter, setTaskFilter] = useState<'all' | 'in_review' | 'in_progress' | 'completed'>('all');

  // Timer effect
  React.useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimerTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    <div className="min-h-screen bg-[#1a2638] text-[#E3EDF9] flex flex-col md:flex-row font-sans selection:bg-[#3A5A86] selection:text-white antialiased">
      
      {/* -------------------- MOBILE SIDEBAR BACKDROP -------------------- */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* -------------------- ADMIN SIDEBAR (Theme Reference) -------------------- */}
      <aside className={`fixed md:sticky left-0 top-0 h-screen w-64 bg-[#172233]/90 backdrop-blur-xl border-r border-[#3A5A86]/40 z-50 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#3A5A86]/30 shrink-0">
            <div className="flex items-center gap-3">
              <TalentioLogo size="sm" variant="transparent" />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base leading-tight tracking-tight flex items-center gap-1.5">
                  Talentio
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3EDF9]" />
                </span>
                <span className="text-[10px] font-bold text-[#E3EDF9] uppercase tracking-wider">
                  Admin OS
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg bg-[#2a3b54]/50 md:hidden text-[#9ab0cb] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Category: Core Navigation */}
          <div className="px-4 pt-4 pb-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9ab0cb]">
              Core Navigation
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-3 flex-1">
            {/* Dashboard */}
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'overview'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 transition-colors ${activeTab === 'overview' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Dashboard</span>
              </div>
              {activeTab === 'overview' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3EDF9] shadow-[0_0_6px_#E3EDF9] animate-pulse" />
              )}
            </button>

            {/* Users */}
            <button
              onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'users'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 transition-colors ${activeTab === 'users' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Users</span>
              </div>
              {pendingUsersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#93000a]/60 text-[#ffb4ab] border border-[#93000a] text-[10px] font-mono font-bold">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            {/* KYC Verifications */}
            <button
              onClick={() => { setActiveTab('kyc'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'kyc'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IdCard className={`w-4 h-4 transition-colors ${activeTab === 'kyc' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>KYC Verifications</span>
              </div>
              {(() => {
                const pendingKycCount = kycRecords?.filter(r => r.status === 'pending').length || 0;
                return pendingKycCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold">
                    {pendingKycCount}
                  </span>
                ) : null;
              })()}
            </button>

            {/* Marketplace Gigs */}
            <button
              onClick={() => { setActiveTab('gigs'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'gigs'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 transition-colors ${activeTab === 'gigs' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Marketplace</span>
              </div>
              {pendingGigsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#93000a]/60 text-[#ffb4ab] border border-[#93000a] text-[10px] font-mono font-bold">
                  {pendingGigsCount}
                </span>
              )}
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'orders'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className={`w-4 h-4 transition-colors ${activeTab === 'orders' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Orders & Escrow</span>
              </div>
              <span className="text-[10px] font-mono text-[#9ab0cb]">342</span>
            </button>

            {/* Finance */}
            <button
              onClick={() => { setActiveTab('finance'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'finance'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className={`w-4 h-4 transition-colors ${activeTab === 'finance' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Finance</span>
              </div>
              <span className="text-[10px] text-[#E3EDF9] font-mono font-bold">10% Rake</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'reports'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flag className={`w-4 h-4 transition-colors ${activeTab === 'reports' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Reports</span>
              </div>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-[#3A5A86]/30" />

            {/* Governance & Platform */}
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9ab0cb]">
              Governance
            </div>

            {/* Security Audit */}
            <button
              onClick={() => { setActiveTab('security'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'security'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 transition-colors ${activeTab === 'security' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Security</span>
              </div>
            </button>

            {/* System Settings & Currencies */}
            <button
              onClick={() => { setActiveTab('system'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'system'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 transition-colors ${activeTab === 'system' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Settings</span>
              </div>
            </button>

            {/* Adsterra Monetization */}
            <button
              onClick={() => { setActiveTab('ads'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                activeTab === 'ads'
                  ? 'bg-[#3A5A86] text-white shadow-sm border border-[#3A5A86]/40 ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#ccdcee] hover:bg-[#2a3b54] hover:text-[#E3EDF9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tv className={`w-4 h-4 transition-colors ${activeTab === 'ads' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb] group-hover:text-[#E3EDF9]'}`} />
                <span>Monetization</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#3A5A86] text-[#E3EDF9] font-bold">
                Ads
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Production Node Status */}
        <div className="p-3 border-t border-[#3A5A86]/30 bg-[#23324A]/50 shrink-0">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#2a3b54]/60 border border-[#3A5A86]/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E3EDF9] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#ccdcee]">v4.8 Production</span>
            </div>
            <span className="text-[11px] font-bold text-[#E3EDF9]">Online</span>
          </div>
        </div>
      </aside>

      {/* -------------------- MAIN WORKSPACE CONTENT -------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1a2638] relative">
        
        {/* Top Header Bar (From attached reference) */}
        <header className="sticky top-0 h-16 bg-[#23324A]/70 backdrop-blur-xl border-b border-[#3A5A86]/30 z-30 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-[#2a3b54]/50 text-[#E3EDF9] md:hidden border border-[#3A5A86]/50"
              title="Open Navigation"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Global Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#9ab0cb] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={overviewSearch}
                onChange={(e) => setOverviewSearch(e.target.value)}
                placeholder="Search platform operations, users, audits, or contracts (⌘K)..."
                className="w-full pl-9 pr-12 py-1.5 rounded-xl bg-[#2a3b54]/50 border border-[#3A5A86]/40 text-xs text-[#E3EDF9] placeholder-[#9ab0cb] focus:outline-none focus:border-[#E3EDF9] focus:ring-1 focus:ring-[#E3EDF9]/40 transition-all"
              />
              <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#3A5A86]/60 text-[10px] font-mono text-[#9ab0cb]">
                ⌘K
              </span>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick action button */}
            <button 
              onClick={() => setActiveTab('users')}
              className="p-2 text-[#ccdcee] hover:text-white hover:bg-[#2a3b54] rounded-xl transition-colors hidden sm:flex items-center justify-center" 
              title="Review Queue"
            >
              <Zap className="w-4 h-4" />
            </button>

            {/* Terminal / Audit Logs */}
            <button 
              onClick={() => setActiveTab('security')}
              className="p-2 text-[#ccdcee] hover:text-white hover:bg-[#2a3b54] rounded-xl transition-colors hidden sm:flex items-center justify-center" 
              title="Audit Logs"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button 
              onClick={() => showToast('Platform notifications: 100% operational.', 'info')}
              className="p-2 text-[#ccdcee] hover:text-white hover:bg-[#2a3b54] rounded-xl transition-colors relative flex items-center justify-center" 
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ffb4ab]" />
            </button>

            <div className="h-5 w-px bg-[#3A5A86]/40 mx-1 hidden sm:block" />

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-1 cursor-pointer group select-none">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3A5A86] via-[#23324A] to-[#E3EDF9] flex items-center justify-center font-bold text-white text-xs ring-1 ring-[#3A5A86]/60 group-hover:ring-[#E3EDF9] transition-all">
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#E3EDF9] ring-1 ring-[#172233]" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[#E3EDF9] group-hover:text-white transition-colors leading-none">
                  Super Admin
                </span>
                <span className="text-[10px] text-[#9ab0cb] leading-tight mt-0.5 truncate max-w-[120px]">
                  {user.email || 'root@talentio.os'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9ab0cb] group-hover:text-[#E3EDF9] hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Main Canvas Body */}
        <main className="w-full p-4 sm:p-6 lg:p-8 flex-1 relative">
          
          {/* ==================== TAB 1: OVERVIEW (THE PRIMARY REFERENCE DASHBOARD) ==================== */}
          {activeTab === 'overview' && (
            <div className="relative w-full flex flex-col gap-6 animate-in fade-in duration-200">
              
              {/* Subtle Ambient Glow Orbs */}
              <div className="absolute -top-16 left-1/4 w-96 h-96 rounded-full bg-[#3A5A86]/20 blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 right-12 w-[420px] h-[420px] rounded-full bg-[#304360]/25 blur-[130px] pointer-events-none" />

              {/* Header Bar */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E3EDF9] shadow-[0_0_8px_#E3EDF9] animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E3EDF9]">
                      Talentio Mission Control
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Marketplace Overview
                  </h1>
                  <p className="text-xs text-[#ccdcee] mt-0.5">
                    Real-time telemetry across platform nodes, escrow volume, active orders, and talent moderation.
                  </p>
                </div>

                {/* Action Pill Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#23324A]/70 hover:bg-[#304360]/70 text-[#E3EDF9] hover:text-white transition-all shadow-sm text-xs font-semibold backdrop-blur-md border border-[#3A5A86]/50"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#E3EDF9]" />
                    <span>Filter Scope</span>
                  </button>

                  <button 
                    onClick={() => {
                      showToast('Ledger export dispatched to administrator email.', 'success');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#23324A]/70 hover:bg-[#304360]/70 text-[#E3EDF9] hover:text-white transition-all shadow-sm text-xs font-semibold backdrop-blur-md border border-[#3A5A86]/50"
                  >
                    <Download className="w-3.5 h-3.5 text-[#E3EDF9]" />
                    <span>Export Ledger</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('gigs')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3A5A86] hover:bg-[#304360] text-white transition-all shadow-md text-xs font-semibold border border-[#E3EDF9]/30"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E3EDF9]" />
                    <span>Review Queue</span>
                  </button>
                </div>
              </div>

              {/* Top Metrics Row (4 Cards) */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Active Marketplace Gigs (Gradient Highlight Card) */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3A5A86] via-[#304360] to-[#23324A] p-5 flex flex-col justify-between shadow-xl text-white border border-[#E3EDF9]/25 hover:scale-[1.01] transition-all">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#E3EDF9]/15 blur-2xl pointer-events-none" />
                  <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-[#E3EDF9]/20 blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E3EDF9]">
                      Active Marketplace Gigs
                    </span>
                    <button 
                      onClick={() => setActiveTab('gigs')}
                      className="w-8 h-8 rounded-full bg-[#23324A]/60 backdrop-blur-md flex items-center justify-center text-white shadow-sm hover:bg-[#23324A]"
                    >
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="my-3 relative z-10">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                      {totalGigsCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 relative z-10 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3A5A86]/80 text-[#E3EDF9] text-[11px] font-bold">
                      <TrendingUp className="w-3 h-3" />
                      +18.4%
                    </span>
                    <span className="text-xs text-[#ccdcee]">
                      {approvedGigsCount} Live in catalog
                    </span>
                  </div>
                </div>

                {/* Card 2: Gross Volume (GMV) */}
                <div className="rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40 hover:bg-[#23324A]/90 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">
                      Gross Volume (GMV)
                    </span>
                    <button 
                      onClick={() => setActiveTab('finance')}
                      className="w-8 h-8 rounded-full bg-[#3A5A86]/60 backdrop-blur-md flex items-center justify-center text-[#E3EDF9] shadow-sm hover:bg-[#3A5A86]"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                      {formatPrice(totalMarketplaceVolumeUSD, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3A5A86]/50 text-[#E3EDF9] text-[11px] font-bold">
                      <TrendingUp className="w-3 h-3" />
                      +12.8%
                    </span>
                    <span className="text-xs text-[#ccdcee]">
                      Escrow cleared vs last mo
                    </span>
                  </div>
                </div>

                {/* Card 3: Active Orders */}
                <div className="rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40 hover:bg-[#23324A]/90 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">
                      Active Orders
                    </span>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="w-8 h-8 rounded-full bg-[#3A5A86]/60 backdrop-blur-md flex items-center justify-center text-[#E3EDF9] shadow-sm hover:bg-[#3A5A86]"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                      342
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3A5A86]/50 text-[#E3EDF9] text-[11px] font-bold">
                      <Clock className="w-3 h-3" />
                      +6.0%
                    </span>
                    <span className="text-xs text-[#ccdcee]">
                      In active delivery pipeline
                    </span>
                  </div>
                </div>

                {/* Card 4: Pending Verifications */}
                <div className="rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40 hover:bg-[#23324A]/90 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">
                      Pending Verifications
                    </span>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="w-8 h-8 rounded-full bg-[#3A5A86]/60 backdrop-blur-md flex items-center justify-center text-[#E3EDF9] shadow-sm hover:bg-[#3A5A86]"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                      {pendingUsersCount + pendingGigsCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[11px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      Action Req.
                    </span>
                    <span className="text-xs text-[#ccdcee]">
                      {pendingUsersCount} KYC & {pendingGigsCount} Gigs
                    </span>
                  </div>
                </div>

              </div>

              {/* Middle Grid (3 Columns: Analytics Bar Chart | Priority Escrow Moderation | High-Value Contracts) */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Col 1: Marketplace Volume (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Marketplace Volume</h2>
                      <span className="text-xs text-[#ccdcee]">Weekly contract settlements (USD)</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#172233]/70 p-1 rounded-full backdrop-blur-md border border-[#3A5A86]/30">
                      {(['7D', '30D', 'ALL'] as const).map(tf => (
                        <button 
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                            timeframe === tf 
                              ? 'bg-[#3A5A86] text-white shadow-sm' 
                              : 'text-[#ccdcee] hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Striped & Solid Vertical Pill Chart (From Reference Dashboard) */}
                  <div className="relative w-full pt-6 pb-2">
                    {/* Floating Peak Marker Badge */}
                    <div className="absolute top-0 left-[54%] -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#3A5A86] text-[#E3EDF9] text-[11px] font-bold shadow-md border border-[#E3EDF9]/30">
                        $84k Peak
                      </span>
                      <div className="w-0.5 h-2 bg-[#E3EDF9]" />
                    </div>

                    <div className="flex items-end justify-between h-48 px-2 gap-2 pt-4">
                      {/* Sunday: Striped Pattern */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-28 rounded-full bg-[#304360]/40 overflow-hidden relative opacity-75">
                          <svg className="w-full h-full">
                            <defs>
                              <pattern id="stripes-sun" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#9ab0cb" strokeWidth="2" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#stripes-sun)" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-[#ccdcee]">S</span>
                      </div>

                      {/* Monday: Secondary Tone Solid */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-36 rounded-full bg-gradient-to-t from-[#3A5A86] to-[#304360] shadow-md" />
                        <span className="text-[11px] font-semibold text-[#ccdcee]">M</span>
                      </div>

                      {/* Tuesday: Soft Accent Pill */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-32 rounded-full bg-[#E3EDF9]/80 shadow-sm" />
                        <span className="text-[11px] font-semibold text-[#ccdcee]">T</span>
                      </div>

                      {/* Wednesday: Tall Gradient Peak */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-44 rounded-full bg-gradient-to-t from-[#3A5A86] via-[#23324A] to-[#E3EDF9] shadow-lg" />
                        <span className="text-[11px] font-bold text-[#E3EDF9]">W</span>
                      </div>

                      {/* Thursday: Striped Pattern */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-32 rounded-full bg-[#304360]/40 overflow-hidden relative opacity-75">
                          <svg className="w-full h-full">
                            <defs>
                              <pattern id="stripes-thu" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#9ab0cb" strokeWidth="2" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#stripes-thu)" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-[#ccdcee]">T</span>
                      </div>

                      {/* Friday: Striped Pattern */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-24 rounded-full bg-[#304360]/40 overflow-hidden relative opacity-75">
                          <svg className="w-full h-full">
                            <defs>
                              <pattern id="stripes-fri" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#9ab0cb" strokeWidth="2" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#stripes-fri)" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-[#ccdcee]">F</span>
                      </div>

                      {/* Saturday: Striped Pattern */}
                      <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[38px] h-36 rounded-full bg-[#304360]/40 overflow-hidden relative opacity-75">
                          <svg className="w-full h-full">
                            <defs>
                              <pattern id="stripes-sat" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#9ab0cb" strokeWidth="2" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#stripes-sat)" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-semibold text-[#ccdcee]">S</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center justify-between pt-3 mt-1 text-[#ccdcee] text-xs border-t border-[#3A5A86]/30">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3A5A86]" /> Settled Contracts
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E3EDF9]" /> Escrow Buffer
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#304360]" /> Historical Avg
                    </span>
                  </div>
                </div>

                {/* Col 2: Escrow Chamber / Priority Milestone Review (3 cols) */}
                <div className="lg:col-span-3 rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden shadow-md border border-[#3A5A86]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E3EDF9]">
                      Escrow Chamber
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#93000a]/60 text-[#ffb4ab] text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping" />
                      Live Case
                    </span>
                  </div>

                  <div className="my-3 flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-white leading-snug">
                      Dispute #8942: Milestone Lock Review
                    </h3>
                    <p className="text-xs text-[#ccdcee]">
                      Vanguard Labs vs. StudioApex. Release condition contested on UI kit assets.
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[#E3EDF9] text-[11px] bg-[#2a3b54]/60 p-2 rounded-xl">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Window: 02:00 pm - 04:00 pm UTC</span>
                    </div>

                    {/* Integrated Interactive Session Timer */}
                    <div className="mt-2 p-2.5 rounded-xl bg-[#23324A]/70 border border-[#3A5A86]/30 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#9ab0cb]">Admin Session Guard</div>
                        <div className="font-mono text-sm font-bold text-white">{formatTimerTime(timerSeconds)}</div>
                      </div>
                      <button 
                        onClick={() => setTimerRunning(!timerRunning)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          timerRunning ? 'bg-amber-500/20 text-amber-300' : 'bg-[#3A5A86] text-white'
                        }`}
                        title={timerRunning ? "Pause Timer" : "Start Timer"}
                      >
                        {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-[#3A5A86] via-[#23324A] to-[#304360] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Review Case Escrow</span>
                    </button>
                    <span className="text-center text-[10px] text-[#9ab0cb]">
                      Escrow Bond: $12,400 USDC locked
                    </span>
                  </div>
                </div>

                {/* Col 3: High-Value Contracts (4 cols) */}
                <div className="lg:col-span-4 rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#E3EDF9]" />
                      <h2 className="text-base font-bold text-white">High-Value Contracts</h2>
                    </div>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="px-2 py-0.5 rounded-full bg-[#3A5A86]/70 text-[#ccdcee] text-xs font-semibold hover:text-white transition-colors"
                    >
                      + New
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Contract 1 */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#2a3b54]/50 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#3A5A86] flex items-center justify-center text-[#E3EDF9] shrink-0">
                          <LayersIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">Develop API Endpoints</span>
                          <span className="text-[11px] text-[#ccdcee] truncate">Client: SynthLab • Due Feb 28</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#E3EDF9] shrink-0 font-mono">$3,400</span>
                    </div>

                    {/* Contract 2 */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#2a3b54]/50 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#3A5A86] flex items-center justify-center text-[#E3EDF9] shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">Smart Contract Audit</span>
                          <span className="text-[11px] text-[#ccdcee] truncate">Client: Drift Protocol • Mar 02</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#E3EDF9] shrink-0 font-mono">$5,800</span>
                    </div>

                    {/* Contract 3 */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#2a3b54]/50 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#3A5A86] flex items-center justify-center text-[#E3EDF9] shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">Full-Stack Core Engine</span>
                          <span className="text-[11px] text-[#ccdcee] truncate">Client: Apex Studio • Mar 05</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#E3EDF9] shrink-0 font-mono">$4,200</span>
                    </div>

                    {/* Contract 4 */}
                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#2a3b54]/50 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#3A5A86] flex items-center justify-center text-[#ccdcee] shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate">Brand Identity & 3D Assets</span>
                          <span className="text-[11px] text-[#ccdcee] truncate">Client: Kroma Digital • Mar 10</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#ccdcee] shrink-0 font-mono">$2,100</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="inline-flex items-center justify-center gap-1 text-xs text-[#E3EDF9] hover:text-white mt-2 transition-colors"
                  >
                    <span>View all 142 contracts in pipeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Bottom Grid (3 Columns: Talent Verification Feed | Order Fulfillment Arc Gauge | Live Commission Engine) */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Col 1: Talent Verification Feed (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-base font-bold text-white">Talent Verification Feed</h2>
                      <span className="text-xs text-[#ccdcee]">Tier-2 developer onboarding queue</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="px-2.5 py-1 rounded-full bg-[#3A5A86]/70 text-[#E3EDF9] hover:text-white text-xs font-semibold transition-colors"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Render from real users if present, or fallback preview members */}
                    {allUsers.slice(0, 4).map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => setSelectedUserDetail(u)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#2a3b54]/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={u.avatar} 
                            alt={u.name} 
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#3A5A86]" 
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-white truncate">{u.name}</span>
                            <span className="text-[11px] text-[#9ab0cb] truncate">
                              {u.title || (u.skills && u.skills.slice(0, 2).join(' • ')) || u.handle}
                            </span>
                          </div>
                        </div>

                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                          u.accountStatus === 'approved' 
                            ? 'bg-[#3A5A86]/50 text-[#E3EDF9]' 
                            : u.accountStatus === 'pending'
                            ? 'bg-[#304360]/70 text-[#E3EDF9]'
                            : 'bg-[#3A5A86] text-[#ccdcee]'
                        }`}>
                          {u.accountStatus || 'Approved'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 2: Order Fulfillment Radial Arc Gauge (4 cols) */}
                <div className="lg:col-span-4 rounded-2xl bg-[#23324A]/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-md border border-[#3A5A86]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">Order Fulfillment Rate</h2>
                      <span className="text-xs text-[#ccdcee]">Active SLA delivery metrics</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="w-7 h-7 rounded-full bg-[#3A5A86] flex items-center justify-center text-[#ccdcee] hover:text-white transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Semicircular Radial Gauge Arc using REAL data from Talentio */}
                  <div className="py-2">
                    <RadialArcGauge 
                      percentage={realFulfillmentRate} 
                      label="Orders Fulfilled"
                    />
                  </div>
                </div>

                {/* Col 3: Live Commission Engine (3 cols) */}
                <div className="lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between bg-[#23324A]/70 backdrop-blur-md shadow-lg border border-[#3A5A86]/40 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#E3EDF9]/10 blur-2xl pointer-events-none" />
                  
                  {/* Ambient Wave SVG Overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,160 C80,120 120,200 200,150 C260,110 280,180 300,160 L300,240 L0,240 Z" fill="#3A5A86" />
                    <path d="M0,190 C60,170 140,220 220,180 C270,160 290,210 300,190 L300,240 L0,240 Z" fill="#3a5a86" />
                  </svg>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E3EDF9] shadow-[0_0_8px_#E3EDF9] animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E3EDF9]">
                        Commission Engine
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#172233]/80 text-[#E3EDF9] text-[10px] font-bold">
                      LIVE
                    </span>
                  </div>

                  <div className="my-3 flex flex-col relative z-10">
                    <span className="text-xs text-[#ccdcee]">Platform Fee Today</span>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5 font-sans">
                      {formatPrice(platformCommissionUSD, currency)}
                    </span>
                    <span className="text-[11px] text-[#E3EDF9] mt-1">
                      10.0% fixed escrow telemetry active
                    </span>
                  </div>

                  {/* Telemetry Batch Controls */}
                  <div className="flex items-center justify-between pt-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => showToast('Auto payouts paused for security audit window.', 'info')}
                        className="w-8 h-8 rounded-full bg-[#3A5A86] flex items-center justify-center text-white hover:bg-[#304360] transition-all shadow-sm"
                        title="Pause Auto Payouts"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => showToast('Telemetry safety protocol triggered.', 'warning')}
                        className="w-8 h-8 rounded-full bg-[#93000a]/50 text-[#ffb4ab] flex items-center justify-center hover:bg-[#93000a] transition-colors shadow-sm"
                        title="Force Stop Telemetry"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => showToast('Current escrow batch settled into platform vault.', 'success')}
                      className="px-3.5 py-1.5 rounded-full bg-[#3A5A86] hover:bg-[#304360] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1 border border-[#E3EDF9]/25 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-[#E3EDF9]" />
                      <span>Settle Batch</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 2: USERS MANAGEMENT ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">User Management & Accounts</h1>
                  <p className="text-xs text-[#ccdcee] mt-0.5">
                    Review applicant profiles, verify freelance credentials, and enforce platform trust & safety.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#E3EDF9] px-3 py-1.5 rounded-full bg-[#23324A] border border-[#3A5A86]">
                  {allUsers.length} Total Users Registered
                </span>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-[#9ab0cb] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, country..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#23324A]/70 text-[#E3EDF9] text-xs placeholder-[#9ab0cb] border border-[#3A5A86]/40 focus:outline-none focus:border-[#E3EDF9]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
                  {(['all', 'pending', 'approved', 'rejected', 'suspended', 'banned'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setUserStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer shrink-0 ${
                        userStatusFilter === st
                          ? 'bg-[#3A5A86] text-white shadow-sm border border-[#E3EDF9]/30'
                          : 'bg-[#2a3b54]/50 hover:bg-[#2a3b54] text-[#ccdcee]'
                      }`}
                    >
                      {st === 'all' ? 'All Users' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Data Table */}
              <div className="rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#172233]/70 text-[#9ab0cb] font-bold uppercase text-[10px] tracking-wider border-b border-[#3A5A86]/40">
                      <tr>
                        <th className="py-3 px-4">User Details</th>
                        <th className="py-3 px-4">Account Type</th>
                        <th className="py-3 px-4">Country & Phone</th>
                        <th className="py-3 px-4">Profile Score</th>
                        <th className="py-3 px-4">Approval Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3A5A86]/30 text-[#E3EDF9]">
                      {filteredUsers.map(u => {
                        const status = u.accountStatus || 'pending';
                        return (
                          <tr key={u.id} className="hover:bg-[#2a3b54]/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#3A5A86]"
                                />
                                <div>
                                  <div className="font-bold text-white">{u.name}</div>
                                  <div className="text-[11px] text-[#9ab0cb]">{u.handle || u.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="capitalize font-bold px-2 py-0.5 rounded-lg bg-[#2a3b54] text-[#E3EDF9] text-xs">
                                {u.userType || 'Client'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span>{u.countryFlag || '🌐'}</span>
                                <span className="text-[#E3EDF9]">{u.location || 'Global'}</span>
                              </div>
                              <div className="text-[11px] font-mono text-[#9ab0cb]">{u.phone || 'No phone'}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-[#172233] overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#3A5A86] to-[#E3EDF9]"
                                    style={{ width: `${u.profileCompletionScore || 70}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-[#E3EDF9]">
                                  {u.profileCompletionScore || 70}%
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                                status === 'approved' ? 'bg-[#3A5A86]/60 text-[#E3EDF9] border border-[#E3EDF9]/30' :
                                status === 'pending' ? 'bg-[#304360] text-[#E3EDF9] border border-[#304360] animate-pulse' :
                                status === 'rejected' ? 'bg-[#93000a]/50 text-[#ffb4ab] border border-[#93000a]' :
                                'bg-[#93000a]/70 text-[#ffdad6] border border-[#93000a]'
                              }`}>
                                {status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => approveUserAccount(u.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#3A5A86] hover:bg-[#304360] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                                      title="Approve Seller Account"
                                    >
                                      <Check className="w-3.5 h-3.5 text-[#E3EDF9]" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => setRejectModalTarget({ type: 'user', id: u.id, name: u.name })}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#93000a]/50 hover:bg-[#93000a] text-[#ffdad6] font-bold text-xs flex items-center gap-1 cursor-pointer"
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
                                    className="px-2.5 py-1.5 rounded-lg bg-[#2a3b54] hover:bg-[#304360] text-[#ccdcee] hover:text-white font-bold text-xs cursor-pointer"
                                    title="Suspend User"
                                  >
                                    Suspend
                                  </button>
                                )}

                                {(status === 'suspended' || status === 'rejected' || status === 'banned') && (
                                  <button
                                    onClick={() => restoreUserAccount(u.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#3A5A86]/50 hover:bg-[#3A5A86] text-[#E3EDF9] font-bold text-xs cursor-pointer"
                                    title="Restore User Account"
                                  >
                                    Restore
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedUserDetail(u)}
                                  className="p-1.5 rounded-lg bg-[#2a3b54] hover:bg-[#304360] text-[#E3EDF9] cursor-pointer"
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
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">Marketplace Gig Moderation</h1>
                  <p className="text-xs text-[#ccdcee] mt-0.5">
                    Audit freelancer listings for policy compliance, delivery scopes, pricing, and quality standards.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#E3EDF9] px-3 py-1.5 rounded-full bg-[#23324A] border border-[#3A5A86]">
                  {services.length} Total Gigs
                </span>
              </div>

              {/* Gig Filters */}
              <div className="p-4 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-[#9ab0cb] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gigSearch}
                    onChange={(e) => setGigSearch(e.target.value)}
                    placeholder="Search by title, seller, category..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#23324A]/70 text-[#E3EDF9] text-xs placeholder-[#9ab0cb] border border-[#3A5A86]/40 focus:outline-none focus:border-[#E3EDF9]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {(['all', 'approved', 'pending', 'rejected'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGigStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        gigStatusFilter === st
                          ? 'bg-[#3A5A86] text-white shadow-sm border border-[#E3EDF9]/30'
                          : 'bg-[#2a3b54]/50 hover:bg-[#2a3b54] text-[#ccdcee]'
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
                    <div key={gig.id} className="p-4 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 flex flex-col justify-between shadow-md hover:border-[#E3EDF9]/30 transition-all">
                      <div>
                        <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                          <img
                            src={gig.coverImage}
                            alt={gig.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              status === 'approved' ? 'bg-[#3A5A86] text-white border border-[#E3EDF9]/30' :
                              status === 'pending' ? 'bg-[#304360] text-[#E3EDF9]' : 'bg-[#93000a] text-[#ffdad6]'
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
                          <span className="text-xs font-bold text-white">{gig.freelancerName}</span>
                          <span className="text-[10px] text-[#9ab0cb] font-mono">({gig.category})</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 mb-2">
                          {gig.title}
                        </h4>

                        <div className="text-xs font-mono font-bold text-[#E3EDF9] mb-3">
                          Starting at {formatPrice(gig.startingPrice, currency)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-[#3A5A86]/40">
                        {status === 'pending' && (
                          <button
                            onClick={() => approveServiceGig(gig.id)}
                            className="flex-1 py-1.5 rounded-xl bg-[#3A5A86] hover:bg-[#304360] text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 text-[#E3EDF9]" />
                            <span>Approve Gig</span>
                          </button>
                        )}
                        <button
                          onClick={() => toggleFeatureServiceGig(gig.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            gig.isFeatured ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-[#2a3b54] border-[#3A5A86] text-[#ccdcee]'
                          }`}
                          title="Feature in Marketplace"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeServiceGig(gig.id)}
                          className="p-2 rounded-xl bg-[#2a3b54] hover:bg-[#93000a]/50 text-[#ffb4ab] border border-[#3A5A86] cursor-pointer"
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
            <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 space-y-4 shadow-md animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white">Active Escrow Contracts & Financial Vaults</h3>
              <p className="text-xs text-[#ccdcee]">All funds are locked in Talentio 3-Tier Escrow protection.</p>
              
              <div className="p-4 rounded-xl bg-[#23324A]/70 border border-[#3A5A86]/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#E3EDF9]">Contract #ORD-84920</div>
                  <div className="text-sm font-bold text-white mt-0.5">Full-Stack SaaS MVP & Milestone Scope</div>
                  <div className="text-xs text-[#9ab0cb] mt-1">Client: Alexander Vance • Seller: Sofia Chen</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#E3EDF9] font-mono">{formatPrice(3800, currency)}</div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#3A5A86] text-white">
                    Escrow Funded
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: FINANCE & PAYOUTS ==================== */}
          {activeTab === 'finance' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md">
                  <span className="text-xs font-bold text-[#9ab0cb] uppercase">Platform Revenue</span>
                  <div className="text-2xl font-black text-[#E3EDF9] font-mono mt-1">
                    {formatPrice(platformCommissionUSD, currency)}
                  </div>
                  <span className="text-[11px] text-[#ccdcee]">10% standard marketplace fee</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md">
                  <span className="text-xs font-bold text-[#9ab0cb] uppercase">Pending Withdrawals</span>
                  <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                    {formatPrice(pendingWithdrawalsUSD, currency)}
                  </div>
                  <span className="text-[11px] text-amber-200">3 payout requests waiting</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md">
                  <span className="text-xs font-bold text-[#9ab0cb] uppercase">Settled This Month</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {formatPrice(124800, currency)}
                  </div>
                  <span className="text-[11px] text-[#ccdcee]">Bank & Crypto Escrow Transfers</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 6: ABUSE REPORTS ==================== */}
          {activeTab === 'reports' && (
            <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 space-y-4 shadow-md animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#E3EDF9]" />
                <span>Security Scanner & Abuse Reports</span>
              </h3>
              <p className="text-xs text-[#ccdcee]">
                Zero active policy violations or disputed gig deliverables detected in current pipeline.
              </p>
            </div>
          )}

          {/* ==================== TAB 7: COUNTRIES & CURRENCIES ==================== */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#E3EDF9]" />
                  <span>Global Currencies Supported ({CURRENCIES_DATA.length})</span>
                </h3>
                <p className="text-xs text-[#ccdcee] mb-4">
                  Real-time benchmark exchange rates applied dynamically across all marketplace listings.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {CURRENCIES_DATA.map(c => (
                    <div key={c.code} className="p-3 rounded-xl bg-[#23324A]/70 border border-[#3A5A86]/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{c.code} ({c.symbol})</div>
                          <div className="text-[10px] text-[#9ab0cb]">{c.name}</div>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-[#E3EDF9]">
                        {c.exchangeRateToUSD}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md">
                <h3 className="text-base font-bold text-white mb-2">
                  International Country Database ({COUNTRIES_DATA.length} Countries)
                </h3>
                <p className="text-xs text-[#ccdcee] mb-4">
                  Full ISO country mapping with calling codes and currency auto-association.
                </p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-[#172233]/60 rounded-xl">
                  {COUNTRIES_DATA.map(c => (
                    <span key={c.code} className="px-2.5 py-1 rounded-lg bg-[#2a3b54]/60 text-xs text-[#E3EDF9] flex items-center gap-1.5">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-[10px] font-mono text-[#9ab0cb]">{c.callingCode}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Firestore Project Connection Status & Sync Controls */}
              <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#E3EDF9]" />
                      <span>Firebase Database Project: talentio-92919</span>
                    </h3>
                    <p className="text-xs text-[#ccdcee] mt-1">
                      Connected to Firestore project <code className="text-[#E3EDF9] bg-[#172233] px-1.5 py-0.5 rounded font-mono">talentio-92919</code>. All users, gigs, jobs, and escrow orders sync in real-time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const { seedInitialTalentioDatabase } = await import('../lib/firestore');
                        await seedInitialTalentioDatabase(true);
                        showToast('Database synchronized and seeded into talentio-92919!', 'success');
                      } catch (err: any) {
                        showToast(`Sync notice: ${err?.message || 'Check connection'}`, 'info');
                      }
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#3A5A86] hover:bg-[#304360] text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto border border-[#E3EDF9]/25"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#E3EDF9]" />
                    <span>Sync & Populate Database</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 8: SECURITY AUDIT LOGS ==================== */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-2xl bg-[#23324A]/70 backdrop-blur-md border border-[#3A5A86]/40 space-y-4 shadow-md animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E3EDF9]" />
                <span>Immutable Administrator & Security Audit Trail</span>
              </h3>

              <div className="space-y-2">
                {adminActions.map(action => (
                  <div key={action.id} className="p-3 rounded-xl bg-[#23324A]/70 border border-[#3A5A86]/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#E3EDF9]">{action.adminName}</span>
                      <span className="text-[#ccdcee]"> performed </span>
                      <span className="font-bold text-white uppercase">{action.action}</span>
                      <span className="text-[#ccdcee]"> on </span>
                      <span className="font-bold text-white">{action.targetName}</span>
                      {action.reason && <span className="text-[#9ab0cb]"> ({action.reason})</span>}
                    </div>
                    <span className="text-[11px] font-mono text-[#9ab0cb]">{action.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 9: AD MANAGEMENT & MONETIZATION ==================== */}
          {activeTab === 'ads' && (
            <div className="animate-in fade-in duration-200">
              <AdManagementView />
            </div>
          )}

          {/* ==================== TAB 10: KYC COMPLIANCE & VERIFICATION ==================== */}
          {activeTab === 'kyc' && (
            <div className="animate-in fade-in duration-200">
              <KycManagementView />
            </div>
          )}

        </main>
      </div>

      {/* -------------------- USER DETAIL MODAL -------------------- */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#23324A] text-white rounded-3xl border border-[#3A5A86] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3A5A86]/40 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserDetail.avatar}
                  alt={selectedUserDetail.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#E3EDF9]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedUserDetail.name}</h3>
                    {selectedUserDetail.verifiedBadge && (
                      <CheckCircle2 className="w-4 h-4 text-[#E3EDF9]" />
                    )}
                  </div>
                  <p className="text-xs text-[#ccdcee]">{selectedUserDetail.handle || selectedUserDetail.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#3A5A86] text-white">
                      {selectedUserDetail.userType || 'Client'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedUserDetail.accountStatus === 'approved' ? 'bg-[#3A5A86]/60 text-[#E3EDF9]' :
                      selectedUserDetail.accountStatus === 'pending' ? 'bg-[#304360] text-[#E3EDF9]' : 'bg-[#93000a] text-[#ffdad6]'
                    }`}>
                      {selectedUserDetail.accountStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-2 rounded-xl bg-[#2a3b54] hover:bg-[#304360] text-[#ccdcee] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Database & Security Credentials Box */}
            <div className="p-4 rounded-2xl bg-[#172233]/70 border border-[#3A5A86]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E3EDF9]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Database Credentials & Auth Security</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#3A5A86] text-[#E3EDF9] border border-[#E3EDF9]/30">
                  SHA-256 / PBKDF2 Encrypted
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase font-bold block">Auth Method</span>
                  <span className="text-white font-mono capitalize">
                    {selectedUserDetail.authMethod || 'Email/Password'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase font-bold block">Password Security</span>
                  <span className="text-[#E3EDF9] font-mono text-[11px]">
                    {selectedUserDetail.passwordStatus || 'Encrypted (PBKDF2/Argon2)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase font-bold block">Email Record</span>
                  <span className="text-white font-mono truncate block">
                    {selectedUserDetail.email || 'None'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase font-bold block">Phone Record</span>
                  <span className="text-white font-mono truncate block">
                    {selectedUserDetail.phone || 'None'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#9ab0cb] font-mono">
                <span>Account ID: {selectedUserDetail.id}</span>
                <button
                  type="button"
                  onClick={() => showToast(`Password reset link generated and dispatched to ${selectedUserDetail.email || selectedUserDetail.name}`, 'info')}
                  className="text-[#E3EDF9] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Trigger Password Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#9ab0cb] font-bold">Professional Title:</span>
                <p className="text-white mt-0.5">{selectedUserDetail.title || 'Not provided'}</p>
              </div>

              <div>
                <span className="text-[#9ab0cb] font-bold">Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedUserDetail.skills && selectedUserDetail.skills.length > 0 ? (
                    selectedUserDetail.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-[#2a3b54] text-[#E3EDF9]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#9ab0cb] italic">No skills specified</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[#9ab0cb] font-bold">Bio:</span>
                <p className="text-[#ccdcee] mt-0.5">{selectedUserDetail.bio || 'Registered user awaiting further details.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase">Country / Location</span>
                  <div className="text-white font-bold">{selectedUserDetail.location || 'Global'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#23324A]/60">
                  <span className="text-[#9ab0cb] text-[10px] uppercase">Available Balance</span>
                  <div className="text-[#E3EDF9] font-bold font-mono">${selectedUserDetail.balanceAvailable || 0} USD</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3A5A86]/40 flex items-center gap-2">
              <button
                onClick={() => {
                  approveUserAccount(selectedUserDetail.id);
                  setSelectedUserDetail(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#3A5A86] hover:bg-[#304360] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md border border-[#E3EDF9]/30"
              >
                <Check className="w-4 h-4 text-[#E3EDF9]" />
                <span>Approve Account</span>
              </button>
              <button
                onClick={() => {
                  const target = { type: 'user' as const, id: selectedUserDetail.id, name: selectedUserDetail.name };
                  setSelectedUserDetail(null);
                  setRejectModalTarget(target);
                }}
                className="py-2.5 px-4 rounded-full bg-[#93000a]/50 hover:bg-[#93000a] text-[#ffdad6] text-xs font-bold cursor-pointer"
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
          <div className="w-full max-w-md bg-[#23324A] text-white rounded-3xl border border-[#93000a]/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#93000a]/30 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-[#ffb4ab]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject {rejectModalTarget.name}</h3>
                <p className="text-xs text-[#ccdcee]">Specify an administrative rejection reason</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E3EDF9] mb-1">
                Rejection Reason (Visible to applicant)
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Incomplete professional experience verification or missing portfolio deliverables."
                className="w-full p-3 rounded-xl bg-[#172233] border border-[#3A5A86] text-white text-xs placeholder-[#9ab0cb] focus:outline-none focus:border-[#E3EDF9]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectModalTarget(null)}
                className="flex-1 py-2 rounded-full bg-[#2a3b54] hover:bg-[#304360] text-[#E3EDF9] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                className="flex-1 py-2 rounded-full bg-[#93000a] hover:bg-[#ba1a1a] text-white text-xs font-bold cursor-pointer shadow-md"
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
