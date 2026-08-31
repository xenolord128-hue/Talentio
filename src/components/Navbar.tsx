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
    user,
    isAuthenticated,
    logout,
    switchDemoAccount,
    chatMessages,
    unreadNoticesCount
  } = useGuide();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isDualGiftModalOpen, setIsDualGiftModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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

            {/* Desktop Navigation Links - Exposing Chat, Dashboard, Talent, Services, Workstation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activePage === link.id || 
                  (link.id === 'explore' && activePage === 'home') ||
                  (link.id === 'freelancers' && activePage === 'talent') ||
                  (link.id === 'services' && activePage === 'catalog') ||
                  (link.id === 'workstation' && (activePage === 'escrow' || activePage === 'orders')) ||
                  (link.id === 'chat' && activePage === 'messages') ||
                  (link.id === 'dashboard' && (activePage === 'earnings' || activePage === 'payouts'));
                
                return (
                  <button
                    key={link.id}
                    onClick={() => setActivePage(link.id)}
                    className={`px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3D2FD1] text-white shadow-sm ring-1 ring-[#A38BFF]/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#A38BFF]'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-[#A38BFF]'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Currency Switcher - Always Visible on Mobile and Desktop */}
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

            {/* Search Trigger (Tablet & Desktop) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 min-h-[40px] rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Search Talent, Gigs, or Services (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#A38BFF]" />
              <span className="hidden xl:inline font-medium text-slate-300">Search...</span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono bg-black/40 border border-white/15 rounded text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="dropdown" className="hidden md:block" />

            {/* Post Job / Create Gig Primary CTA */}
            {user?.userType === 'freelancer' ? (
              <button
                onClick={() => setIsCreateGigModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Gig</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsPostJobModalOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Job</span>
              </button>
            )}

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
