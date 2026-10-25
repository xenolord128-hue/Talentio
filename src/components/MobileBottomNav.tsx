import React from 'react';
import { useGuide, TalentioPage } from '../context/GuideContext';
import { TalentioLink } from './TalentioLink';
import { 
  Home, 
  Layers, 
  ShieldCheck, 
  MessageSquare,
  LayoutDashboard,
  ShieldAlert,
  Bell
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activePage, user, unreadNoticesCount } = useGuide();

  const navItems: Array<{
    id: string;
    page: TalentioPage;
    label: string;
    icon: any;
    badge?: number | string;
  }> = [
    {
      id: 'home',
      page: 'explore',
      label: 'Explore',
      icon: Home
    },
    {
      id: 'services',
      page: 'services',
      label: 'Gigs',
      icon: Layers
    },
    {
      id: 'notices',
      page: 'notices',
      label: 'Notice',
      icon: Bell,
      badge: unreadNoticesCount > 0 ? unreadNoticesCount : undefined
    },
    {
      id: 'workstation',
      page: 'workstation',
      label: 'Escrow',
      icon: ShieldCheck
    },
    {
      id: 'chat',
      page: 'chat',
      label: 'Chat',
      icon: MessageSquare
    },
    {
      id: user?.role === 'admin' ? 'admin' : 'dashboard',
      page: user?.role === 'admin' ? 'admin' : 'dashboard',
      label: user?.role === 'admin' ? 'Admin' : 'Ledger',
      icon: user?.role === 'admin' ? ShieldAlert : LayoutDashboard
    }
  ];

  return (
    <div className="fixed bottom-2 sm:bottom-5 left-0 right-0 z-40 px-2 sm:px-6 pointer-events-none flex justify-center pb-[env(safe-area-inset-bottom,0px)]">
      <nav 
        id="talentio-floating-dock"
        aria-label="Floating Navigation Dock"
        className="pointer-events-auto max-w-[420px] sm:max-w-xl w-full mx-auto smooth-dock-slide relative rounded-2xl sm:rounded-3xl p-1 sm:p-2 flex items-center justify-between sm:justify-around overflow-hidden shadow-[0_12px_36px_rgba(35,50,74,0.4)] bg-[#23324A]/95 backdrop-blur-md border border-[#3A5A86]/40 sm:border-[#3A5A86]/50"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.page || 
            (item.page === 'explore' && activePage === 'home') ||
            (item.page === 'services' && (activePage === 'catalog' || activePage === 'marketplace' || activePage === 'gig-details')) ||
            (item.page === 'notices' && activePage === 'notice') ||
            (item.page === 'workstation' && (activePage === 'escrow' || activePage === 'orders')) ||
            (item.page === 'chat' && activePage === 'messages') ||
            (item.page === 'dashboard' && (activePage === 'earnings' || activePage === 'payouts'));

          return (
            <TalentioLink
              key={item.id}
              id={`nav-dock-${item.id}`}
              to={item.page}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-[40px] xs:min-w-[46px] sm:min-w-[58px] min-h-[44px] sm:min-h-[50px] py-1 px-1 xs:px-1.5 sm:px-2 rounded-xl sm:rounded-2xl cursor-pointer transition-colors duration-150 active:scale-95 select-none ${
                isActive
                  ? 'bg-[#3A5A86] text-white shadow-sm ring-1 ring-[#E3EDF9]/30'
                  : 'text-[#E3EDF9]/75 hover:text-white hover:bg-[#3A5A86]/25'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon 
                  size={20} 
                  className={`transition-transform duration-150 ${
                    isActive ? 'stroke-[2.5] text-white' : 'stroke-2 text-[#E3EDF9]/80'
                  }`} 
                />
                {item.badge !== undefined && !isActive && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[9px] font-extrabold bg-[#3A5A86] text-white ring-1 ring-[#E3EDF9]/80 flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold mt-0.5 tracking-tight ${
                isActive ? 'text-white' : 'text-[#E3EDF9]/80'
              }`}>
                {item.label}
              </span>
            </TalentioLink>
          );
        })}
      </nav>
    </div>
  );
};
