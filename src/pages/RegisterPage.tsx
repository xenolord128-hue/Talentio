import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from '../components/TalentioLogo';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Briefcase, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerFullAccount, setActivePage, showToast } = useGuide();

  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    if (!agreed) {
      showToast('Please accept the escrow terms of service.', 'warning');
      return;
    }
    setLoading(true);
    try {
      await registerFullAccount({
        name,
        email,
        role,
        title: headline || (role === 'client' ? 'Project Director & Client' : 'Senior Full-Stack Specialist'),
        avatar: role === 'client' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviewsCount: 1,
        completedProjects: 0,
        skills: role === 'freelancer' ? ['Figma', 'React', 'TypeScript', 'Escrow'] : ['Product Strategy', 'Hiring'],
        escrowBalance: role === 'client' ? 1200 : 0
      });
      setActivePage('dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Branding & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-2">
            <TalentioLogo size="md" variant="black" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1633] tracking-tight font-display">
            Join the Premier Escrow Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Create an account to hire top vetted talent or offer professional services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* Role Switcher Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              I Want To
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'client'
                    ? 'border-[#3D2FD1] bg-[#F2F0FF] text-[#3D2FD1] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm">Hire Talent</span>
                  {role === 'client' && <CheckCircle2 className="w-4 h-4 text-[#3D2FD1]" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Order gigs with smart escrow milestones</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'freelancer'
                    ? 'border-[#3D2FD1] bg-[#F2F0FF] text-[#3D2FD1] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm">Work as Freelancer</span>
                  {role === 'freelancer' && <CheckCircle2 className="w-4 h-4 text-[#3D2FD1]" />}
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Offer gigs & get paid securely</p>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alexander Vance"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#3D2FD1] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#3D2FD1] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {role === 'client' ? 'Company / Project Focus (Optional)' : 'Professional Headline'}
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder={role === 'client' ? 'e.g. Fintech SaaS Startup' : 'e.g. Senior Full-Stack & AI Engineer'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#3D2FD1] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#3D2FD1] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms-agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-4 h-4 text-[#3D2FD1] rounded-sm border-slate-300 focus:ring-[#3D2FD1]"
            />
            <label htmlFor="terms-agree" className="text-xs font-medium text-slate-600 select-none cursor-pointer">
              I agree to Talentio's Escrow Terms, Fee Schedules & Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#3D2FD1]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating your profile...</span>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <button
            onClick={() => setActivePage('login')}
            className="font-bold text-[#3D2FD1] hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>

      </div>
    </div>
  );
};
