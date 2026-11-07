import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  AlertCircle, 
  Clock, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { NotificationItem } from './types';
import { DEFAULT_NOTIFICATIONS } from './mockWidgetData';

interface NotificationWidgetProps {
  title?: string;
  notifications?: NotificationItem[];
  className?: string;
  onNotificationClick?: (notif: NotificationItem) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export const NotificationWidget: React.FC<NotificationWidgetProps> = ({
  title = 'Notifications & Alerts',
  notifications = DEFAULT_NOTIFICATIONS,
  className = '',
  onNotificationClick,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [items, setItems] = useState<NotificationItem[]>(notifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  const handleClear = () => {
    setItems([]);
    if (onClearAll) onClearAll();
  };

  const getCategoryBadge = (category: NotificationItem['category']) => {
    switch (category) {
      case 'payment':
        return { label: 'Payment', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'order':
        return { label: 'Proposal', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'milestone':
        return { label: 'Milestone', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'security':
        return { label: 'Security', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'System', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center shrink-0 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1A1633] font-display">
                {title}
              </h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread platform alerts` : 'All caught up'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#3D2FD1] hover:bg-[#F2F0FF] transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            items.map((notif) => {
              const badge = getCategoryBadge(notif.category);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    // Mark single as read
                    setItems((prev) =>
                      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                    );
                    if (onNotificationClick) onNotificationClick(notif);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white/60 border-slate-200/50 hover:bg-white/90'
                      : 'bg-[#F2F0FF]/60 border-[#A38BFF]/40 hover:bg-[#F2F0FF]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      notif.read ? 'text-slate-700' : 'text-[#1A1633]'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-[#A38BFF]/20 flex items-center justify-between text-xs text-slate-400">
        <span>Protected by Web Push & SSL</span>
        <span className="text-[#3D2FD1] font-semibold">Real-time Delivery</span>
      </div>
    </div>
  );
};
