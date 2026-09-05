import React from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Home, 
  Layers, 
  ShieldCheck, 
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  Sparkles
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
    <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center">
      <nav 
        id="talentio-floating-dock"
        aria-label="Floating Navigation Dock"
        className="pointer-events-auto max-w-md sm:max-w-xl w-full mx-auto smooth-dock-slide relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 flex items-center justify-around overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.5)] bg-[#130F26]/95 backdrop-blur-md border border-white/15 sm:border-[#6E5BFF]/30"
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
              id={`nav-dock-${item.id}`}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center min-w-[48px] sm:min-w-[62px] min-h-[46px] sm:min-h-[50px] py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl cursor-pointer transition-colors duration-150 active:scale-95 select-none ${
                isActive
                  ? 'bg-[#3D2FD1] text-white shadow-sm ring-1 ring-white/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon 
                  size={20} 
                  className={`transition-transform duration-150 ${
                    isActive ? 'stroke-[2.5] text-white' : 'stroke-2 text-slate-300'
                  }`} 
                />
                {item.badge !== undefined && !isActive && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[9px] font-extrabold bg-[#6E5BFF] text-white ring-1 ring-white/80 flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold mt-0.5 tracking-tight ${
                isActive ? 'text-white' : 'text-slate-300'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
