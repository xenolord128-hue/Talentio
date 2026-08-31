import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { formatPrice } from '../utils/currency';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Award, 
  Star, 
  Clock, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Briefcase, 
  Wallet,
  Sparkles,
  ArrowRight,
  DollarSign
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, currency, updateUserProfile, showToast, setActivePage } = useGuide();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alexander Vance');
  const [title, setTitle] = useState(user?.title || 'VP of Engineering & Product Lead');
  const [skills, setSkills] = useState<string[]>(user?.skills || ['React', 'TypeScript', 'Escrow Management', 'UI/UX']);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      title,
      skills
    });
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 pb-24">
      
      {/* Header Banner & Profile Strip */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1A1633] via-[#2D216B] to-[#1A1633] p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={user?.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
                  {user?.name || 'Alexander Vance'}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-[#3D2FD1] text-white border border-white/20">
                  {user?.role || 'Client'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Identity</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {user?.title || 'VP of Engineering & Product Lead'}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>{user?.email || 'alexander@vance.io'}</span>
                <span>•</span>
                <span>Member since Oct 2023</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Details & Edit (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-black text-[#1A1633] font-display">Edit Profile Information</h2>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3D2FD1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3D2FD1]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Skills & Specialties</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g. Next.js)..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#3D2FD1]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-[#3D2FD1] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skills.map(s => (
                    <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-[#3D2FD1]/20"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-[#1A1633] font-display">Specialties & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span
                    key={s}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F2F0FF] text-[#3D2FD1] font-semibold text-xs border border-[#A38BFF]/20"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-black text-[#1A1633] block">100%</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Escrow Release Rate</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-black text-[#1A1633] block">5.0 ★</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Client Feedback</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl font-black text-[#1A1633] block">12</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Completed Orders</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActivePage('orders')}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#3D2FD1] transition-all cursor-pointer space-y-2 shadow-xs"
            >
              <Briefcase className="w-6 h-6 text-[#3D2FD1]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">Active Contracts & Escrow</h3>
              <p className="text-xs text-slate-500">View your active milestone workstation and deliverable approvals.</p>
            </div>

            <div
              onClick={() => setActivePage('chat')}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#3D2FD1] transition-all cursor-pointer space-y-2 shadow-xs"
            >
              <Mail className="w-6 h-6 text-[#3D2FD1]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#1A1633]">Direct Messaging</h3>
              <p className="text-xs text-slate-500">Real-time chat with freelancers, milestone attachments, and offers.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Escrow Wallet (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#3D2FD1]/30 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Active Escrow Vault
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Balance</span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A1633]">
                {formatPrice(user?.escrowBalance || 1850, currency)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Locked in Milestone Escrow</span>
                <span className="font-bold text-slate-800">{formatPrice(850, currency)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Pending Withdrawal</span>
                <span className="font-bold text-slate-800">{formatPrice(0, currency)}</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('orders')}
              className="w-full py-3.5 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#3D2FD1]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Manage Escrow Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
