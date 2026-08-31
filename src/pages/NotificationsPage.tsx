import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  Bell, 
  ShieldCheck, 
  MessageSquare, 
  CheckCheck, 
  Sparkles, 
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setActivePage 
  } = useGuide();

  const [filter, setFilter] = useState<'all' | 'escrow' | 'message' | 'system'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'escrow':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-[#3D2FD1]" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30 mb-2">
            <Bell className="w-3.5 h-3.5 text-[#3D2FD1]" />
            <span>Activity Feed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1A1633] font-display">
            Notifications & Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Stay informed on escrow releases, milestone deliverables, and client messages
          </p>
        </div>

        <button
          onClick={() => markAllNotificationsRead()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs cursor-pointer transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-[#3D2FD1]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {(['all', 'escrow', 'message', 'system'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === tab ? 'bg-white text-[#3D2FD1] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl) {
                  setActivePage(notif.actionUrl as any);
                }
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300 opacity-80'
                  : 'bg-white border-[#3D2FD1]/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.type === 'escrow' ? 'bg-emerald-50' : notif.type === 'message' ? 'bg-[#F2F0FF]' : 'bg-slate-100'
                }`}>
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#3D2FD1] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {notif.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-[#3D2FD1]">
                <ArrowRight className="w-4 h-4 opacity-50 hover:opacity-100" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No notifications</h3>
            <p className="text-xs text-slate-500">You're completely caught up with all activity.</p>
          </div>
        )}
      </div>

    </div>
  );
};
