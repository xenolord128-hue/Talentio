import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { CountrySelector } from './CountrySelector';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Briefcase, 
  Layers,
  DollarSign
} from 'lucide-react';

export const ProfileCompletionBarrier: React.FC = () => {
  const { user, updateUserProfile, completeOnboarding } = useGuide();

  // If no user or profile is already complete, do not show barrier
  if (!user || user.onboardingCompleted || (user.profileCompletionScore || 0) >= 100) {
    return null;
  }

  // Local state for missing fields
  const [name, setName] = useState(user.name || '');
  const [title, setTitle] = useState(user.title || '');
  const [skillsInput, setSkillsInput] = useState(user.skills?.join(', ') || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || '');
  const [bio, setBio] = useState(user.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user.hourlyRate || 50);

  const calculateScore = () => {
    let score = 30; // base account
    if (name.trim()) score += 15;
    if (title.trim()) score += 15;
    if (skillsInput.trim()) score += 15;
    if (phone.trim()) score += 10;
    if (location.trim()) score += 5;
    if (bio.trim().length > 15) score += 10;
    return Math.min(100, score);
  };

  const currentScore = calculateScore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const isFullyComplete = currentScore >= 100;

    completeOnboarding({
      name,
      title,
      skills: skills.length > 0 ? skills : ['Communication', 'Development'],
      phone,
      location,
      bio,
      hourlyRate,
      profileCompletionScore: currentScore,
      onboardingCompleted: isFullyComplete
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0E0B1A]/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#1A1633] text-white rounded-[32px] border border-[#A38BFF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden p-6 sm:p-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="text-center mb-5 shrink-0">
          <div className="flex justify-center mb-2">
            <TalentioLogo size="sm" variant="gradient" animated />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Complete Your Profile
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Your account setup is incomplete. Complete all mandatory fields to unlock full access to the Talentio marketplace.
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A38BFF]" />
              <span className="text-xs font-bold text-slate-200">Profile Completion:</span>
            </div>
            <span className={`text-xs font-extrabold font-mono ${currentScore >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentScore}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                currentScore >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF]'
              }`}
              style={{ width: `${currentScore}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Fill out required fields to achieve 100% completion</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Legal / Business Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Vance"
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Professional Title / Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer & Escrow Architect"
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Key Professional Skills (comma separated) *</label>
            <input
              type="text"
              required
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, UI/UX Design, Python"
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location / Country *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Professional Bio / About (Min 15 chars) *</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your professional experience, past milestones delivered, and services provided..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={currentScore < 100}
            className="w-full py-3.5 min-h-[48px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-[#3D2FD1]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-3"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentScore >= 100 ? 'Save & Enter Marketplace' : `Complete Remaining Fields (${currentScore}%)`}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
