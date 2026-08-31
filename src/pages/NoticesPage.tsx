import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from '../components/TalentioLogo';
import { PlatformNotice, NoticeCategory } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Check, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Send, 
  Filter, 
  Layers,
  ChevronRight,
  TrendingUp,
  Megaphone,
  UserCheck
} from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { 
    notices, 
    unreadNoticesCount, 
    markNoticeRead, 
    markAllNoticesRead, 
    deleteNotice, 
    addNotice,
    setActivePage,
    user,
    allUsers
  } = useGuide();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | NoticeCategory>('all');
  const [showAdminNoticeCreator, setShowAdminNoticeCreator] = useState(false);

  // Admin New Notice Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('announcement');
  const [newPriority, setNewPriority] = useState<'high' | 'normal' | 'low'>('normal');
  const [targetUser, setTargetUser] = useState<'all' | string>('all');

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    await addNotice({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      priority: newPriority,
      targetUserId: targetUser,
      iconType: newCategory === 'approval' ? 'check' : newCategory === 'rank' ? 'award' : 'bell',
      actionUrl: newCategory === 'rank' ? 'leaderboard' : newCategory === 'approval' ? 'services' : 'explore'
    });

    setNewTitle('');
    setNewDesc('');
    setShowAdminNoticeCreator(false);
  };

  const filteredNotices = notices.filter(item => {
    // Target user filter (if specified)
    if (item.targetUserId && item.targetUserId !== 'all' && item.targetUserId !== user?.id && user?.role !== 'admin') {
      return false;
    }

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !item.read;
    return item.category === selectedFilter;
  });

  const getNoticeIcon = (notice: PlatformNotice) => {
    switch (notice.category) {
      case 'approval':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'rank':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-[#A38BFF]" />;
      case 'order':
      case 'gig':
        return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#3D2FD1]" />;
    }
  };

  const getCategoryBadgeClass = (category: NoticeCategory) => {
    switch (category) {
      case 'approval':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rank':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'announcement':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'order':
      case 'gig':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F2F0FF] text-[#3D2FD1] border border-[#3D2FD1]/20">
              Menu → Notice Center
            </span>
            {unreadNoticesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#3D2FD1] text-white">
                {unreadNoticesCount} unread
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1633] tracking-tight font-display">
            Notices & Platform Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Real-time status updates, seller approvals, leaderboard ranking movements, and system notices
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadNoticesCount > 0 && (
            <button
              onClick={() => markAllNoticesRead()}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAdminNoticeCreator(!showAdminNoticeCreator)}
              className="px-3 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Broadcast Notice Creator Form */}
      {showAdminNoticeCreator && user?.role === 'admin' && (
        <form 
          onSubmit={handleCreateNotice} 
          className="p-5 sm:p-6 bg-slate-900 text-white rounded-3xl border border-white/10 space-y-4 shadow-xl animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#A38BFF]" />
              <h3 className="font-extrabold text-sm text-white">Administrator Notice Broadcast Engine</h3>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
              Live Database Publish
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
              >
                <option value="announcement" className="text-black">Platform Announcement</option>
                <option value="approval" className="text-black">Account Approval</option>
                <option value="rank" className="text-black">Rank & Leaderboard</option>
                <option value="system" className="text-black">System Maintenance</option>
                <option value="order" className="text-black">Escrow / Order Update</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as 'high' | 'normal' | 'low')}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
              >
                <option value="normal" className="text-black">Normal</option>
                <option value="high" className="text-black">High (Highlighted)</option>
                <option value="low" className="text-black">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Target Audience</label>
              <select
                value={targetUser}
                onChange={e => setTargetUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none"
              >
                <option value="all" className="text-black">All Platform Users</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id} className="text-black">
                    {u.name} ({u.userType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Notice Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. 🎉 New Milestone Escrow Protection Feature Available"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#A38BFF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase">Description / Details</label>
            <textarea
              rows={2}
              required
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Provide clean and concise details for this notice..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#A38BFF]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdminNoticeCreator(false)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-[#3D2FD1] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          All Notices ({notices.length})
        </button>

        <button
          onClick={() => setSelectedFilter('unread')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'unread'
              ? 'bg-[#3D2FD1] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <span>Unread</span>
          {unreadNoticesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
              {unreadNoticesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSelectedFilter('approval')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'approval'
              ? 'bg-[#3D2FD1] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Approvals & KYC</span>
        </button>

        <button
          onClick={() => setSelectedFilter('rank')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'rank'
              ? 'bg-[#3D2FD1] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Ranking Updates</span>
        </button>

        <button
          onClick={() => setSelectedFilter('announcement')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'announcement'
              ? 'bg-[#3D2FD1] text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcements</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">No notices in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All clear! You will be notified here when your profile status updates, ranks change, or platform announcements occur.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            return (
              <div
                key={notice.id}
                onClick={() => {
                  if (!notice.read) markNoticeRead(notice.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl transition-all border text-left cursor-pointer group relative ${
                  !notice.read
                    ? 'bg-[#FAF9FF] border-[#3D2FD1]/30 hover:border-[#3D2FD1] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      !notice.read ? 'bg-[#3D2FD1] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getNoticeIcon(notice)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(notice.category)}`}>
                          {notice.category}
                        </span>

                        {notice.priority === 'high' && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
                            Priority
                          </span>
                        )}

                        {!notice.read && (
                          <span className="w-2 h-2 rounded-full bg-[#3D2FD1] animate-pulse" />
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors leading-snug">
                        {notice.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {notice.description}
                      </p>

                      <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{notice.timestamp}</span>
                        </span>

                        {notice.actionUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNoticeRead(notice.id);
                              setActivePage(notice.actionUrl as any);
                            }}
                            className="font-bold text-[#3D2FD1] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                    {!notice.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markNoticeRead(notice.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotice(notice.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Dismiss notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
