import React from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Home, 
  Users, 
  Layers, 
  ShieldCheck, 
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  Bell
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activePage, setActivePage, user, unreadNoticesCount } = useGuide();

  const navItems = [
    {
      id: 'home',
      label: 'Explore',
      icon: Home,
      action: () => setActivePage('home')
    },
    {
      id: 'services',
      label: 'Gigs',
      icon: Layers,
      action: () => setActivePage('services')
    },
    {
      id: 'notices',
      label: 'Notice',
      icon: Bell,
      badge: unreadNoticesCount > 0 ? unreadNoticesCount : undefined,
      action: () => setActivePage('notices')
    },
    {
      id: 'workstation',
      label: 'Escrow',
      icon: ShieldCheck,
      action: () => setActivePage('workstation')
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      action: () => setActivePage('chat')
    },
    {
      id: user?.role === 'admin' ? 'admin' : 'dashboard',
      label: user?.role === 'admin' ? 'Admin' : 'Ledger',
      icon: user?.role === 'admin' ? ShieldAlert : LayoutDashboard,
      action: () => setActivePage(user?.role === 'admin' ? 'admin' : 'dashboard')
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <nav 
        id="talentio-mobile-dock"
        aria-label="Mobile Navigation"
        className="pointer-events-auto max-w-md mx-auto ios-glass rounded-[26px] p-1.5 flex items-center justify-around ring-1 ring-[#6E5BFF]/25 shadow-[0_16px_45px_rgba(61,47,209,0.22)]"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id || 
            (item.id === 'home' && activePage === 'explore') ||
            (item.id === 'services' && (activePage === 'catalog' || activePage === 'marketplace')) ||
            (item.id === 'notices' && activePage === 'notice') ||
            (item.id === 'workstation' && (activePage === 'escrow' || activePage === 'orders')) ||
            (item.id === 'chat' && activePage === 'messages') ||
            (item.id === 'dashboard' && (activePage === 'earnings' || activePage === 'payouts'));

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md shadow-[#3D2FD1]/35 scale-105'
                  : 'text-slate-600 hover:text-[#1A1633] active:scale-95 hover:bg-white/40'
              }`}
            >
              <div className="relative">
                <Icon 
                  size={18} 
                  className={`transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5] text-white scale-110' : 'stroke-2 text-slate-700'
                  }`} 
                />
                {item.badge !== undefined && !isActive && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-[#3D2FD1] text-white ring-1 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                isActive ? 'text-white' : 'text-slate-600'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#A38BFF] ring-2 ring-white shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
