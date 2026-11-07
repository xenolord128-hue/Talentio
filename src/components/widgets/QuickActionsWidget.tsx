import React from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Briefcase, 
  Layers, 
  BarChart2, 
  Settings, 
  UserPlus, 
  CreditCard,
  LucideIcon
} from 'lucide-react';
import { QuickActionItem } from './types';

interface QuickActionsWidgetProps {
  title?: string;
  subtitle?: string;
  actions?: QuickActionItem[];
  className?: string;
  onCreateProject?: () => void;
  onCreateGig?: () => void;
  onViewWorkstation?: () => void;
  onManageOrders?: () => void;
  onOpenSettings?: () => void;
  onInvite?: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  PlusCircle,
  Sparkles,
  Briefcase,
  Layers,
  BarChart2,
  Settings,
  UserPlus,
  CreditCard,
};

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  title = 'Quick Actions & Management',
  subtitle = 'Fast access to key project and workspace operations',
  actions,
  className = '',
  onCreateProject,
  onCreateGig,
  onViewWorkstation,
  onManageOrders,
  onOpenSettings,
  onInvite,
}) => {
  // Built-in default action list if none passed
  const defaultActions: QuickActionItem[] = [
    {
      id: 'act-post-job',
      label: 'Post New Project',
      description: 'Hire vetted talent with escrow protection',
      icon: 'PlusCircle',
      variant: 'primary',
      action: onCreateProject || (() => {}),
      badge: 'Escrow',
    },
    {
      id: 'act-create-gig',
      label: 'Publish Service Gig',
      description: 'Package your services for direct orders',
      icon: 'Sparkles',
      variant: 'accent',
      action: onCreateGig || (() => {}),
      badge: 'Direct Pay',
    },
    {
      id: 'act-workstation',
      label: 'Open Workstation',
      description: 'Track active milestones and files',
      icon: 'Layers',
      variant: 'secondary',
      action: onViewWorkstation || (() => {}),
    },
    {
      id: 'act-orders',
      label: 'Manage Orders',
      description: 'Review active contracts and proposals',
      icon: 'Briefcase',
      variant: 'outline',
      action: onManageOrders || (() => {}),
    },
    {
      id: 'act-invite',
      label: 'Invite Collaborator',
      description: 'Add team members or enterprise clients',
      icon: 'UserPlus',
      variant: 'outline',
      action: onInvite || (() => {}),
    },
    {
      id: 'act-settings',
      label: 'Workspace Settings',
      description: 'Configure payouts, 2FA, and notifications',
      icon: 'Settings',
      variant: 'outline',
      action: onOpenSettings || (() => {}),
    },
  ];

  const items = actions || defaultActions;

  const getButtonStyles = (variant?: QuickActionItem['variant']) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] text-white shadow-md shadow-[#3D2FD1]/30 hover:opacity-95 border-transparent';
      case 'accent':
        return 'bg-[#3D2FD1] text-white hover:bg-[#2F23A8] shadow-sm border-transparent';
      case 'secondary':
        return 'bg-[#F2F0FF] text-[#3D2FD1] hover:bg-[#E3EDF9] border border-[#A38BFF]/30';
      default:
        return 'bg-white/80 hover:bg-white text-slate-800 border border-[#A38BFF]/25 hover:border-[#A38BFF] shadow-xs';
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-extrabold text-[#1A1633] font-display">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Grid of buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const IconComp = ICON_MAP[item.icon] || PlusCircle;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 ${getButtonStyles(
                item.variant
              )}`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/10 group-hover:scale-105 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>

              <div>
                <span className="font-bold text-sm block leading-snug">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs opacity-75 line-clamp-1 mt-0.5 font-normal">
                    {item.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
