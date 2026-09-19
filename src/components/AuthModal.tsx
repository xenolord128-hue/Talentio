import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { formatAuthError } from '../lib/firebaseAuth';
import { executeRecaptcha, verifyRecaptchaToken } from '../lib/recaptchaEnterprise';
import { 
  X, 
  Mail, 
  Github, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Globe, 
  Eye, 
  EyeOff, 
  Loader2 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authPromptReason, 
    setAuthPromptReason,
    loginWithEmail,
    loginWithGoogle,
    loginWithGithub,
    registerAccount,
    activePage
  } = useGuide();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'email' | 'google' | 'github'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // If closed or user is already on a dedicated auth page, do not render
  if (!isAuthModalOpen || activePage === 'login' || activePage === 'register' || activePage === 'forgot-password') {
    return null;
  }

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    setModalError(null);
  };

  const handleSocialGoogle = async () => {
    setModalError(null);
    setSocialLoading('google');
    try {
      // Execute reCAPTCHA Enterprise verification
      const recaptchaToken = await executeRecaptcha('LOGIN');
      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'LOGIN');
      if (!recaptchaResult.valid) {
        setModalError('Security verification failed. Please try again.');
        setSocialLoading(null);
        return;
      }

      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setModalError(err?.message || 'Google sign in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSocialGithub = async () => {
    setModalError(null);
    setSocialLoading('github');
    try {
      // Execute reCAPTCHA Enterprise verification
      const recaptchaToken = await executeRecaptcha('LOGIN');
      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'LOGIN');
      if (!recaptchaResult.valid) {
        setModalError('Security verification failed. Please try again.');
        setSocialLoading(null);
        return;
      }

      await loginWithGithub();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setModalError(formatAuthError(err));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const cleanEmail = email.trim();
    if (authMode === 'register') {
      if (!name.trim()) {
        setModalError('Please enter your full name.');
        return;
      }
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setModalError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setModalError('Password must be at least 8 characters in length.');
        return;
      }
      if (!confirmPassword) {
        setModalError('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setModalError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Execute reCAPTCHA Enterprise verification
      const actionName = authMode === 'login' ? 'LOGIN' : 'SIGNUP';
      const recaptchaToken = await executeRecaptcha(actionName);
      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, actionName);
      if (!recaptchaResult.valid) {
        setModalError('Security verification failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (authMode === 'login') {
        await loginWithEmail(cleanEmail, password);
      } else {
        await registerAccount('email', cleanEmail, name.trim(), password);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setModalError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg ios-glass-dark text-white rounded-[28px] border border-[#A38BFF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8 overflow-hidden my-auto">
        
        {/* Ambient Top Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#6E5BFF]/30 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-3 min-w-[44px] min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/20 border border-[#A38BFF]/30 text-slate-300 hover:text-white transition-colors cursor-pointer z-10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Reason Banner if triggered by a protected action */}
        {authPromptReason && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 backdrop-blur-md border border-amber-500/30 flex items-start gap-3 text-amber-200 animate-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-100 mb-0.5">Authentication Required</p>
              <p className="opacity-90">{authPromptReason}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] p-0.5 shadow-lg shadow-[#3D2FD1]/40 mb-3">
            <div className="w-full h-full bg-[#1A1633] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#A38BFF]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            {authMode === 'login' ? 'Welcome Back to Talentio' : 'Create Your Talentio Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Global Escrow-Protected Marketplace & Freelance Platform
          </p>
        </div>

        {/* Auth Method Tabs: Email, Google, GitHub */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-2.5 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`py-2.5 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-2.5 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Github className="w-4 h-4 shrink-0" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Tab 1: Email Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full px-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@example.com"
                  className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#3D2FD1]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Talentio' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Google OAuth */}
        {activeTab === 'google' && (
          <div className="space-y-4 text-center py-2">
            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <Globe className="w-6 h-6 text-[#A38BFF]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google One-Click Sign In</h3>
                  <p className="text-xs text-slate-400">Instantly sign in with your verified Google account</p>
                </div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside mt-3">
                <li>Instant escrow wallet creation</li>
                <li>Automatic profile verification</li>
                <li>Zero password to remember</li>
              </ul>
            </div>

            <button
              type="button"
              disabled={socialLoading !== null || isSubmitting}
              onClick={handleSocialGoogle}
              className="w-full py-4 min-h-[48px] rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#3D2FD1]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{socialLoading === 'google' ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: GitHub OAuth */}
        {activeTab === 'github' && (
          <div className="space-y-4 text-center py-2">
            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <Github className="w-6 h-6 text-[#A38BFF]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">GitHub Developer Sign In</h3>
                  <p className="text-xs text-slate-400">Sign in with your verified GitHub profile</p>
                </div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside mt-3">
                <li>Automatic repo and portfolio import ready</li>
                <li>Instant verified developer badge</li>
                <li>Fast-track escrow tier verification</li>
              </ul>
            </div>

            <button
              type="button"
              disabled={socialLoading !== null || isSubmitting}
              onClick={handleSocialGithub}
              className="w-full py-4 min-h-[48px] rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-sm border border-white/20 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {socialLoading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#A38BFF]" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span>{socialLoading === 'github' ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
            </button>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-xs text-slate-300 hover:text-white transition-colors py-2 cursor-pointer"
          >
            {authMode === 'login' ? (
              <span>Don't have an account? <strong className="text-[#A38BFF] font-bold underline">Create one now</strong></span>
            ) : (
              <span>Already registered? <strong className="text-[#A38BFF] font-bold underline">Sign in to account</strong></span>
            )}
          </button>
        </div>

        {/* reCAPTCHA Security Badge */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected by Google reCAPTCHA Enterprise</span>
        </div>

      </div>
    </div>
  );
};
