import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from '../components/TalentioLogo';
import { registerWithFirebase } from '../lib/firebaseAuth';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Briefcase, 
  CheckCircle2,
  AlertCircle,
  Github
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { 
    setUser,
    loginWithGoogle, 
    loginWithGithub, 
    setActivePage, 
    showToast 
  } = useGuide();

  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [headline, setHeadline] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill out all required fields.');
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your password.');
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (!agreed) {
      setErrorMessage('Please accept the escrow terms of service to continue.');
      showToast('Please accept the escrow terms of service.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const isClientRole = role === 'client';
      const createdUser = await registerWithFirebase(email.trim(), password, {
        name: name.trim(),
        displayName: name.trim(),
        email: email.trim(),
        role: isClientRole ? 'CLIENT' : 'FREELANCER',
        userType: isClientRole ? 'client' : 'freelancer',
        title: headline.trim() || (isClientRole ? 'Project Director & Client' : 'Senior Full-Stack Specialist'),
        avatar: isClientRole
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        skills: isClientRole ? ['Product Strategy', 'Hiring'] : ['Full-Stack', 'UI/UX', 'Smart Escrow'],
        verifiedBadge: false,
        escrowTier: 1,
        balanceAvailable: isClientRole ? 2500 : 0,
        balanceInEscrow: 0,
        onboardingCompleted: true,
        onboardingStep: 6,
        profileCompletionScore: 100
      });

      setUser(createdUser);
      localStorage.setItem('talentio_user_profile', JSON.stringify(createdUser));
      showToast(`Welcome to Talentio, ${createdUser.name}! Account created with One Month 0% Platform Fee.`, 'success');
      setActivePage('dashboard');
    } catch (err: any) {
      console.warn('Registration error:', err);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        setActivePage('dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubRegister = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const ok = await loginWithGithub();
      if (ok) {
        setActivePage('dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'GitHub registration failed.');
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
            Create Your Talentio Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Join the premier escrow marketplace to hire verified talent or offer professional services
          </p>

          {/* Benefit Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F2F0FF] to-emerald-50 border border-emerald-200/80 text-left">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                One Month 0% Platform Fee
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Your first month is completely free with 0% platform fee. Safe escrow contract protection included.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Switcher */}
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
                Email Address
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

            {/* Password */}
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
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#3D2FD1] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                <span>Creating your account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth Options (Google & GitHub only) */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Or register with</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubRegister}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Github className="w-4 h-4 text-slate-800" />
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>

        </div>

        {/* Link to Login */}
        <div className="text-center text-xs text-slate-600">
          <span>Already have a Talentio account? </span>
          <button
            onClick={() => setActivePage('login')}
            className="font-bold text-[#3D2FD1] hover:underline cursor-pointer"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  );
};
