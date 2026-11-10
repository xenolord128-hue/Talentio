import React, { useState, useEffect, useRef } from 'react';
import { useGuide, TalentioPage } from '../context/GuideContext';
import { 
  LayoutDashboard, 
  User, 
  Folder, 
  TrendingUp, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  X, 
  ChevronRight, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  Maximize2,
  Minimize2,
  LogIn
} from 'lucide-react';

interface GlassMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlassMenuPanel: React.FC<GlassMenuPanelProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    isAuthenticated, 
    activePage, 
    setActivePage, 
    logout, 
    unreadNoticesCount,
    postedJobs,
    contract
  } = useGuide();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when panel opens in expanded mode
  useEffect(() => {
    if (isOpen && !isCollapsed) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isCollapsed]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Menu items specification from reference code & Talentio routes
  const menuItems: Array<{
    id: string;
    label: string;
    page?: TalentioPage;
    icon: React.ComponentType<{ className?: string }>;
    section: 'main' | 'work' | 'account';
    badge?: string | number;
    badgeColor?: string;
    action?: () => void;
    requiresAuth?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      page: 'dashboard',
      icon: LayoutDashboard,
      section: 'main',
    },
    {
      id: 'profile',
      label: 'My Profile',
      page: 'profile',
      icon: User,
      section: 'main',
    },
    {
      id: 'projects',
      label: 'Projects',
      page: 'workstation',
      icon: Folder,
      section: 'work',
      badge: contract?.orderNumber ? `#${contract.orderNumber}` : (postedJobs.length > 0 ? `${postedJobs.length}` : undefined),
      badgeColor: 'bg-[#3D2FD1]/40 text-[#A38BFF] border-[#6E5BFF]/30',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      page: 'dashboard',
      icon: TrendingUp,
      section: 'work',
    },
    {
      id: 'message',
      label: 'Message',
      page: 'chat',
      icon: MessageSquare,
      section: 'work',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      page: 'notices',
      icon: Bell,
      section: 'work',
      badge: unreadNoticesCount > 0 ? unreadNoticesCount : undefined,
      badgeColor: 'bg-[#6E5BFF] text-white',
    },
    {
      id: 'settings',
      label: 'Settings',
      page: 'settings',
      icon: Settings,
      section: 'account',
    },
    {
      id: 'logout',
      label: isAuthenticated ? 'Logout' : 'Sign In',
      icon: isAuthenticated ? LogOut : LogIn,
      section: 'account',
      action: () => {
        if (isAuthenticated) {
          logout();
          onClose();
        } else {
          setActivePage('login');
          onClose();
        }
      },
    },
  ];

  // Filter menu items by search query
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
  });

  const handleNavigate = (page?: TalentioPage, customAction?: () => void) => {
    if (customAction) {
      customAction();
    } else if (page) {
      setActivePage(page);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Subtle translucent backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Glassmorphism Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Navigation Menu Panel"
        aria-modal="true"
        className={`fixed top-16 sm:top-20 right-3 sm:right-6 lg:right-8 z-50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCollapsed ? 'w-20' : 'w-[330px] sm:w-[350px] max-w-[calc(100vw-24px)]'
        } max-h-[calc(100vh-80px)] rounded-3xl bg-[#130E2C]/95 backdrop-blur-2xl border border-[#A38BFF]/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white p-5 sm:p-6 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 slide-in-from-top-2`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle ambient lighting inside the glass card */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#3D2FD1]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#6E5BFF]/15 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header with Title and Toggle/Close Buttons */}
        <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-5`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3D2FD1] to-[#6E5BFF] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-[#F2F0FF]" />
              </div>
              <div>
                <h2 className="text-lg font-black font-display text-white tracking-tight leading-none">
                  User Panel
                </h2>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Talentio Hub
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {/* Collapse / Expand Toggle Button (Reference Code inspired) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              aria-label={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              title="Close Panel"
              aria-label="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Search Field (from reference index.html) */}
        {!isCollapsed && (
          <div className="relative z-10 mb-4">
            <div className="h-11 flex items-center gap-2.5 px-3.5 rounded-2xl border border-[#A38BFF]/25 bg-white/5 hover:bg-white/10 focus-within:bg-[#1A1633]/80 focus-within:border-[#A38BFF] transition-all">
              <Search className="w-4 h-4 text-[#A38BFF] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-white placeholder-slate-400 outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. Navigation Menu Items */}
        <nav 
          className="relative z-10 flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          aria-label="User Panel Links"
        >
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching items for &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.page && (
                activePage === item.page ||
                (item.page === 'dashboard' && item.id === 'analytics' && activePage === 'dashboard')
              );
              
              // Divider insertion matching reference design structure
              const showDividerBefore = 
                (item.section === 'work' && index > 0 && filteredItems[index - 1]?.section === 'main') ||
                (item.section === 'account' && index > 0 && filteredItems[index - 1]?.section === 'work');

              return (
                <React.Fragment key={item.id}>
                  {showDividerBefore && !isCollapsed && (
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent my-2" />
                  )}

                  <button
                    onClick={() => handleNavigate(item.page, item.action)}
                    className={`w-full group flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                    } rounded-2xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#3D2FD1]/45 to-[#6E5BFF]/35 text-white border border-[#A38BFF]/40 shadow-xs'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive 
                          ? 'bg-[#3D2FD1] text-white shadow-xs' 
                          : 'bg-white/5 text-[#A38BFF] group-hover:bg-[#3D2FD1]/30 group-hover:text-white'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {!isCollapsed && (
                        <span className={`text-xs sm:text-sm font-semibold truncate ${
                          isActive ? 'text-white font-bold' : 'text-slate-200'
                        }`}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge !== undefined && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    )}
                  </button>
                </React.Fragment>
              );
            })
          )}
        </nav>

        {/* 4. Footer User Strip (When user is authenticated) */}
        {!isCollapsed && isAuthenticated && user && (
          <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#3D2FD1]"
              />
              <div className="truncate">
                <span className="font-bold text-white block truncate leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-400 capitalize">{user.userType || 'Member'}</span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>
        )}
      </div>
    </>
  );
};
