import React, { useState } from 'react';
import { 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ShoppingBag, 
  UserCheck, 
  Clock, 
  Filter, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ActivityItem } from './types';
import { DEFAULT_ACTIVITIES } from './mockWidgetData';

interface ActivityWidgetProps {
  title?: string;
  subtitle?: string;
  activities?: ActivityItem[];
  className?: string;
  onViewAll?: () => void;
  onItemClick?: (item: ActivityItem) => void;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  title = 'Real-time Escrow & Workstation Activity',
  subtitle = 'Live transaction events, milestone updates, and system verification',
  activities = DEFAULT_ACTIVITIES,
  className = '',
  onViewAll,
  onItemClick,
}) => {
  const [filter, setFilter] = useState<'all' | 'payment' | 'project' | 'order'>('all');

  const filteredItems = activities.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'payment') return item.type === 'payment';
    if (filter === 'project') return item.type === 'project' || item.type === 'proposal' || item.type === 'completed';
    if (filter === 'order') return item.type === 'order' || item.type === 'user';
    return true;
  });

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'project':
        return <Layers className="w-4 h-4 text-[#3D2FD1]" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#6E5BFF]" />;
      case 'proposal':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-[#A38BFF]" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-sky-600" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusDot = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-emerald-500 ring-emerald-200';
      case 'in_progress':
        return 'bg-sky-500 ring-sky-200';
      case 'pending':
        return 'bg-amber-500 ring-amber-200';
      case 'alert':
        return 'bg-rose-500 ring-rose-200';
      default:
        return 'bg-slate-400 ring-slate-200';
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1633] font-display">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-[#F2F0FF] border border-[#A38BFF]/25 text-xs font-semibold self-start sm:self-auto">
            {(['all', 'payment', 'project', 'order'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg capitalize cursor-pointer transition-all ${
                  filter === cat
                    ? 'bg-[#3D2FD1] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#3D2FD1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline list */}
        <div className="space-y-3 mt-4">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent activity found for this filter.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={onItemClick ? () => onItemClick(item) : undefined}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white/70 hover:bg-white/95 border border-[#A38BFF]/20 hover:border-[#A38BFF]/50 transition-all flex items-start gap-3.5 group ${
                  onItemClick ? 'cursor-pointer hover:shadow-sm' : ''
                }`}
              >
                {/* Icon or Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.entityName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#A38BFF]/30 group-hover:ring-[#3D2FD1] transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#F2F0FF] flex items-center justify-center ring-2 ring-[#A38BFF]/20 group-hover:ring-[#3D2FD1] transition-all">
                      {getIcon(item.type)}
                    </div>
                  )}

                  {/* Status dot */}
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ${getStatusDot(
                      item.status
                    )}`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A1633] truncate group-hover:text-[#3D2FD1] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {item.relativeTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                  {item.entityName && (
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-medium">
                      <span className="text-[#3D2FD1] font-semibold">{item.entityName}</span>
                      {item.amount && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-bold text-emerald-600">
                            +${item.amount.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Action */}
      {onViewAll && (
        <div className="mt-5 pt-4 border-t border-[#A38BFF]/20 flex items-center justify-end">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
