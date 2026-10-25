import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { formatAuthError } from '../lib/firebaseAuth';
import { verifyRecaptchaTokenOnServer } from '../lib/recaptcha';
import { HumanVerificationModal } from './HumanVerificationModal';
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

  // Human Verification Modal state (Google reCAPTCHA v2 Checkbox)
  const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [pendingAuthAction, setPendingAuthAction] = useState<((token: string) => Promise<void>) | null>(null);
  const [verificationActionTitle, setVerificationActionTitle] = useState('Talentio Security Check');

  // If closed or user is already on a dedicated auth page, do not render
  if (!isAuthModalOpen || activePage === 'login' || activePage === 'register' || activePage === 'forgot-password') {
    return null;
  }

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
    setModalError(null);
    setIsHumanModalOpen(false);
    setPendingAuthAction(null);
    setVerificationError(null);
  };

  const handleSocialGoogle = () => {
    setModalError(null);
    setVerificationError(null);
    setSocialLoading('google');

    const executeGoogle = async (token: string) => {
      try {
        const verifyRes = await verifyRecaptchaTokenOnServer(token);
        if (!verifyRes.valid) {
          setVerificationError(verifyRes.message || 'reCAPTCHA verification failed. Please try again.');
          setIsHumanModalOpen(true);
          setSocialLoading(null);
          return;
        }

        setIsHumanModalOpen(false);
        await loginWithGoogle();
        setIsAuthModalOpen(false);
      } catch (err: any) {
        setModalError(err?.message || 'Google sign in failed. Please try again.');
      } finally {
        setSocialLoading(null);
      }
    };

    setVerificationActionTitle('Google Sign-In Human Verification');
    setPendingAuthAction(() => executeGoogle);
    setIsHumanModalOpen(true);
  };

  const handleSocialGithub = () => {
    setModalError(null);
    setVerificationError(null);
    setSocialLoading('github');

    const executeGithub = async (token: string) => {
      try {
        const verifyRes = await verifyRecaptchaTokenOnServer(token);
        if (!verifyRes.valid) {
          setVerificationError(verifyRes.message || 'reCAPTCHA verification failed. Please try again.');
          setIsHumanModalOpen(true);
          setSocialLoading(null);
          return;
        }

        setIsHumanModalOpen(false);
        await loginWithGithub();
        setIsAuthModalOpen(false);
      } catch (err: any) {
        setModalError(formatAuthError(err));
      } finally {
        setSocialLoading(null);
      }
    };

    setVerificationActionTitle('GitHub Sign-In Human Verification');
    setPendingAuthAction(() => executeGithub);
    setIsHumanModalOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setVerificationError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setModalError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setModalError('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        setModalError('Please enter your full name.');
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

    const executeEmail = async (token: string) => {
      try {
        const verifyRes = await verifyRecaptchaTokenOnServer(token);
        if (!verifyRes.valid) {
          setVerificationError(verifyRes.message || 'reCAPTCHA verification failed. Please check the box again.');
          setIsHumanModalOpen(true);
          setIsSubmitting(false);
          return;
        }

        setIsHumanModalOpen(false);
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

    setVerificationActionTitle(authMode === 'login' ? 'Sign In Human Verification' : 'Registration Human Verification');
    setPendingAuthAction(() => executeEmail);
    setIsHumanModalOpen(true);
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

        {/* Modal-wide error message */}
        {modalError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-start gap-2.5 text-rose-200 text-xs animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{modalError}</span>
          </div>
        )}

        {/* Tab 1: Email / Password Flow */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-11 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#3527b8] hover:to-[#5844e6] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Google Sign-in */}
        {activeTab === 'google' && (
          <div className="space-y-4 text-center py-3">
            <p className="text-xs text-slate-300">
              Continue using your verified Google Account with instant profile onboarding.
            </p>
            <button
              type="button"
              onClick={handleSocialGoogle}
              disabled={socialLoading !== null}
              className="w-full h-12 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{socialLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: GitHub Sign-in */}
        {activeTab === 'github' && (
          <div className="space-y-4 text-center py-3">
            <p className="text-xs text-slate-300">
              Sign in with your developer GitHub identity for code collaboration.
            </p>
            <button
              type="button"
              onClick={handleSocialGithub}
              disabled={socialLoading !== null}
              className="w-full h-12 rounded-2xl bg-[#24292e] hover:bg-[#1b1f23] border border-white/20 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
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
          <span>Protected by Google reCAPTCHA</span>
        </div>

      </div>

      {/* Interactive Visual Human Verification Modal with Google reCAPTCHA v2 Checkbox */}
      <HumanVerificationModal
        isOpen={isHumanModalOpen}
        actionTitle={verificationActionTitle}
        errorMessage={verificationError}
        onVerifySuccess={(token: string) => {
          if (pendingAuthAction) {
            const action = pendingAuthAction;
            setPendingAuthAction(null);
            action(token);
          }
        }}
        onCancel={() => {
          setIsHumanModalOpen(false);
          setPendingAuthAction(null);
          setIsSubmitting(false);
          setSocialLoading(null);
          setVerificationError(null);
        }}
      />
    </div>
  );
};

export default AuthModal;
