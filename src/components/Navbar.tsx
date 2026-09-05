import React, { useState, useRef, useEffect } from 'react';
import { useGuide, TalentioPage } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySelectorModal } from './CurrencySelectorModal';
import { DualGiftRewardsModal } from './DualGiftRewardsModal';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { 
  Search, 
  Sparkles, 
  Briefcase, 
  Users, 
  Layers, 
  ShieldCheck, 
  MessageSquare, 
  LayoutDashboard, 
  PlusCircle, 
  Globe, 
  Menu, 
  X,
  ChevronDown,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Sliders,
  User,
  Zap,
  Gift,
  Keyboard,
  ShieldAlert,
  SlidersHorizontal,
  Wallet,
  FileText,
  Clock,
  Sparkle,
  Trophy,
  Bell
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    setIsSearchModalOpen, 
    setIsPostJobModalOpen,
    setIsAuthModalOpen,
    setIsOnboardingModalOpen,
    setIsCreateGigModalOpen,
    setIsShortcutsModalOpen,
    currency,
    setCurrency,
    user,
    isAuthenticated,
    logout,
    switchDemoAccount,
    chatMessages,
    unreadNoticesCount
  } = useGuide();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isDualGiftModalOpen, setIsDualGiftModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCurrencyObj = CURRENCIES_DATA.find(c => c.code === currency) || CURRENCIES_DATA[0];

  // Core navigation links with direct feature parity across desktop and mobile
  const navLinks: Array<{ id: TalentioPage; label: string; icon: any; badge?: string }> = [
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'freelancers', label: 'Talent', icon: Users },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Top 10' },
    { id: 'notices', label: 'Notice', icon: Bell, badge: unreadNoticesCount > 0 ? `${unreadNoticesCount}` : undefined },
    { id: 'workstation', label: 'Workstation', icon: ShieldCheck, badge: 'Escrow' },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: 'Live' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Desk', icon: ShieldAlert, badge: 'Admin' });
  }

  const handleProfileClick = () => {
    if (isAuthenticated && user) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#120F24]/95 backdrop-blur-xl text-white border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)] max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            <button
              onClick={() => setActivePage('explore')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
              title="Talentio Marketplace"
            >
              <TalentioLogo size="sm" variant="gradient" animated />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-display">TALENTIO</span>
              </div>
            </button>

          </div>

          {/* Right Action Bar - Only Currency, Profile, and Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Currency Switcher - Visible on Mobile and Desktop */}
            <button
              onClick={() => setIsCurrencyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[40px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Change Global Currency (150+ Currencies Supported)"
              aria-label={`Current Currency: ${currency}. Click to switch.`}
            >
              <span className="text-base leading-none">{currentCurrencyObj.flag}</span>
              <span className="tracking-wide">{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-300 hidden xs:inline opacity-75" />
            </button>

            {/* Direct Profile & Account Menu - Always Visible on Mobile and Desktop */}
            <div className="relative" ref={profileDropdownRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer shadow-sm transition-all min-h-[40px] justify-center active:scale-95"
                  aria-label="User Profile and Account Settings"
                  title={`${user.name} (${user.userType})`}
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-[#A38BFF]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#120F24]" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-0.5">
                    <span className="text-xs font-bold text-white leading-tight line-clamp-1">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#A38BFF] font-semibold uppercase leading-none">
                      {user.role === 'admin' ? 'ADMIN' : user.userType}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                  title="Sign In or Register"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {dropdownOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[#171330] border border-white/15 text-white p-2.5 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* User Profile Header */}
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#A38BFF]"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs sm:text-sm font-extrabold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-300 font-medium truncate">{user.handle || user.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3D2FD1]/50 text-white border border-[#A38BFF]/30 capitalize">
                        {user.role === 'admin' ? 'Super Admin' : `${user.userType} Account`}
                      </span>
                      {user.userType !== 'client' && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          user.accountStatus === 'approved' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : user.accountStatus === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {user.accountStatus === 'approved' ? '✓ Approved Seller' : user.accountStatus === 'rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => { setActivePage('admin'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#3D2FD1]/40 text-[#A38BFF] hover:bg-[#3D2FD1] hover:text-white transition-colors cursor-pointer border border-[#A38BFF]/30 mb-1"
                    >
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <span>Admin Control Center</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setActivePage('dashboard'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#A38BFF]" />
                    <span>{user.userType === 'client' ? 'Client Workspace' : 'Freelancer Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => { setIsOnboardingModalOpen(true); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-[#6E5BFF]" />
                    <span>Profile & KYC Details</span>
                  </button>

                  <button
                    onClick={() => { setActivePage('workstation'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Active Escrow Contracts</span>
                  </button>

                  <button
                    onClick={() => { setActivePage('chat'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#A38BFF]" />
                    <span>Messages & Live Chat</span>
                  </button>

                  <button
                    onClick={() => { setActivePage('notices'); setDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-[#A38BFF]" />
                      <span>Notices & Platform Updates</span>
                    </div>
                    {unreadNoticesCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#3D2FD1] text-white">
                        {unreadNoticesCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setIsDualGiftModalOpen(true); setDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer border border-amber-500/20 my-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>2 Guaranteed Gifts</span>
                    </div>
                    <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black font-mono uppercase">Claim</span>
                  </button>

                  <button
                    onClick={() => { setIsCurrencyModalOpen(true); setDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-[#A38BFF]" />
                      <span>Currency ({currency})</span>
                    </div>
                    <span className="text-xs">{currentCurrencyObj.flag}</span>
                  </button>

                  {/* Demo Role Switcher */}
                  <div className="my-1 border-t border-white/10 pt-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ⚡ Demo Role Quick Switch
                    </div>
                    <div className="grid grid-cols-3 gap-1 px-1">
                      <button
                        onClick={() => { switchDemoAccount('client'); setDropdownOpen(false); }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                          user.userType === 'client' && user.role !== 'admin' ? 'bg-[#3D2FD1] text-white' : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        Client
                      </button>
                      <button
                        onClick={() => { switchDemoAccount('freelancer'); setDropdownOpen(false); }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                          user.userType === 'freelancer' ? 'bg-[#3D2FD1] text-white' : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        Seller
                      </button>
                      <button
                        onClick={() => { switchDemoAccount('admin'); setDropdownOpen(false); }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                          user.role === 'admin' ? 'bg-emerald-600 text-white' : 'hover:bg-white/10 text-emerald-300'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Menu Button - Unified Hub for Currency, Profile, Quick Actions & Settings */}
            <div className="relative hidden md:block" ref={desktopMenuRef}>
              <button
                id="desktop-header-menu-btn"
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[40px] rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95 border ${
                  desktopMenuOpen
                    ? 'bg-[#3D2FD1] text-white border-[#A38BFF]/50 ring-2 ring-[#6E5BFF]/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                aria-label="Open Desktop Menu"
                title="Talentio Desktop Menu"
              >
                <Menu className="w-4 h-4 text-[#A38BFF]" />
                <span className="font-display tracking-wide">Menu</span>
                {unreadNoticesCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#6E5BFF] animate-pulse" />
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Desktop Menu Dropdown / Popover */}
              {desktopMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-[380px] rounded-3xl bg-[#14102B]/98 backdrop-blur-2xl border border-white/20 text-white p-3 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.65)] animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto space-y-3">
                  
                  {/* 1. User Profile & Account Summary */}
                  {isAuthenticated && user ? (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#1E1940] to-[#2B2358] border border-white/15 shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#A38BFF]"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#14102B]" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-extrabold text-white truncate">{user.name}</div>
                          <div className="text-[11px] text-slate-300 font-medium truncate">{user.handle || user.email}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#3D2FD1] text-white border border-[#A38BFF]/30 uppercase">
                              {user.role === 'admin' ? 'Super Admin' : `${user.userType} Account`}
                            </span>
                            {user.userType !== 'client' && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                user.accountStatus === 'approved' 
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}>
                                {user.accountStatus === 'approved' ? '✓ Verified' : '⏳ Review'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-white/10">
                        <button
                          onClick={() => {
                            setIsOnboardingModalOpen(true);
                            setDesktopMenuOpen(false);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#6E5BFF]" />
                          <span>Profile & KYC</span>
                        </button>
                        <button
                          onClick={() => {
                            setActivePage('dashboard');
                            setDesktopMenuOpen(false);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dashboard</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md">
                      <div className="text-sm font-black mb-1">Welcome to Talentio</div>
                      <div className="text-xs text-[#E0DBFF] mb-3">Sign in to access milestone escrow, live chat, and seller workstations.</div>
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full py-2 rounded-xl bg-white text-[#1A1633] font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#3D2FD1]" />
                        <span>Sign In or Register</span>
                      </button>
                    </div>
                  )}

                  {/* 2. Currency Selector Hub */}
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#A38BFF]" />
                        <span>Global Currency</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {currentCurrencyObj.flag} {currency} ({currentCurrencyObj.symbol})
                      </span>
                    </div>

                    {/* Quick 1-Click Select Currencies */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { code: 'USD', flag: '🇺🇸' },
                        { code: 'EUR', flag: '🇪🇺' },
                        { code: 'GBP', flag: '🇬🇧' },
                        { code: 'BDT', flag: '🇧🇩' },
                        { code: 'INR', flag: '🇮🇳' },
                        { code: 'AED', flag: '🇦🇪' },
                        { code: 'CAD', flag: '🇨🇦' },
                        { code: 'AUD', flag: '🇦🇺' },
                      ].map(item => (
                        <button
                          key={item.code}
                          onClick={() => {
                            setCurrency(item.code);
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            currency === item.code
                              ? 'bg-[#3D2FD1] text-white ring-1 ring-[#A38BFF]'
                              : 'bg-white/5 hover:bg-white/15 text-slate-300'
                          }`}
                        >
                          <span>{item.flag}</span>
                          <span>{item.code}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setIsCurrencyModalOpen(true);
                        setDesktopMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Explore 150+ World Currencies...</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </div>

                  {/* 3. Core Header Options & Platform Workspaces */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Workspaces & Navigation
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setActivePage('workstation');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Escrow Workstation</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('chat');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#A38BFF] shrink-0" />
                        <span className="truncate">Messages & Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('notices');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Bell className="w-4 h-4 text-[#A38BFF] shrink-0" />
                          <span className="truncate">Notices</span>
                        </div>
                        {unreadNoticesCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#3D2FD1] text-white">
                            {unreadNoticesCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('leaderboard');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">Leaderboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('freelancers');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-[#A38BFF] shrink-0" />
                        <span className="truncate">Browse Talent</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('services');
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[#A38BFF] shrink-0" />
                        <span className="truncate">Browse Services</span>
                      </button>
                    </div>

                    {/* Admin Desk if Admin */}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActivePage('admin');
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer mt-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-emerald-400" />
                          <span>Admin Control Center</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-mono font-bold uppercase">Super Admin</span>
                      </button>
                    )}

                    {/* 2 Guaranteed Gifts & Shortcuts */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setIsDualGiftModalOpen(true);
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span>2 Gifts</span>
                        </div>
                        <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black font-mono uppercase">Claim</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsShortcutsModalOpen(true);
                          setDesktopMenuOpen(false);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Keyboard className="w-3.5 h-3.5 text-[#A38BFF]" />
                          <span>Hotkeys</span>
                        </div>
                        <kbd className="text-[9px] font-mono bg-black/40 px-1 py-0.2 rounded border border-white/10">?</kbd>
                      </button>
                    </div>
                  </div>

                  {/* 4. Quick Action Button */}
                  <div className="pt-1 border-t border-white/10">
                    {user?.userType === 'freelancer' ? (
                      <button
                        onClick={() => {
                          setIsCreateGigModalOpen(true);
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Create & Publish Gig</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isAuthenticated) {
                            setIsPostJobModalOpen(true);
                          } else {
                            setIsAuthModalOpen(true);
                          }
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Post a Project (Escrow Job)</span>
                      </button>
                    )}
                  </div>

                  {/* 5. Demo Role Switcher & System Preferences */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div>
                      <div className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        ⚡ Demo Account Role Switch
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            switchDemoAccount('client');
                            setDesktopMenuOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                            user?.userType === 'client' && user?.role !== 'admin'
                              ? 'bg-[#3D2FD1] text-white'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          Client
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('freelancer');
                            setDesktopMenuOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                            user?.userType === 'freelancer'
                              ? 'bg-[#3D2FD1] text-white'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          Seller
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('admin');
                            setDesktopMenuOpen(false);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer ${
                            user?.role === 'admin'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white/5 hover:bg-white/10 text-emerald-300'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    {/* Sign out if authenticated */}
                    {isAuthenticated && (
                      <button
                        onClick={() => {
                          logout();
                          setDesktopMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer border border-rose-500/20"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 min-w-[40px] min-h-[40px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer / Full Screen Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#120F24] border-t border-white/10 px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* User Account / Sign In Header Card in Mobile Drawer */}
          {isAuthenticated && user ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1940] to-[#2B2358] border border-white/15 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#A38BFF]"
                />
                <div className="overflow-hidden">
                  <div className="text-xs sm:text-sm font-extrabold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-300 truncate">{user.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#3D2FD1] text-white border border-[#A38BFF]/30 uppercase">
                      {user.role === 'admin' ? 'Admin' : user.userType}
                    </span>
                    {user.accountStatus === 'approved' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-left flex items-center justify-between gap-3 cursor-pointer shadow-md text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Sign In to Talentio</div>
                  <div className="text-xs text-[#E0DBFF]">Access escrow contracts, gigs, and messaging</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white shrink-0" />
            </button>
          )}

          {/* Quick Navigation Grid */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Navigation Menu</div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 min-h-[44px] rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3D2FD1] text-white shadow-md'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A38BFF]'}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Account Quick Section */}
          {isAuthenticated && user && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Account & KYC</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsOnboardingModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-2 text-left"
                >
                  <Sliders className="w-4 h-4 text-[#6E5BFF]" />
                  <span>Profile & KYC</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-2 text-left"
                >
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Balance & Stats</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Currency & Theme Settings */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsCurrencyModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#A38BFF]" />
                  <span>Currency: <span className="font-mono text-[#A38BFF]">{currency}</span></span>
                </div>
                <span className="text-sm">{currentCurrencyObj.flag}</span>
              </button>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    if (user?.userType === 'freelancer') {
                      setIsCreateGigModalOpen(true);
                    } else {
                      setIsPostJobModalOpen(true);
                    }
                  } else {
                    setIsAuthModalOpen(true);
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 min-h-[44px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{user?.userType === 'freelancer' ? 'Create Gig' : 'Post Project'}</span>
              </button>
            </div>

            <ThemeToggle variant="expanded" />
          </div>

        </div>
      )}

      {/* Global Currency Selection Full-Screen Modal */}
      <CurrencySelectorModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
      />

      {/* Dual Welcome Gifts Modal */}
      <DualGiftRewardsModal
        isOpen={isDualGiftModalOpen}
        onClose={() => setIsDualGiftModalOpen(false)}
      />

    </header>
  );
};
