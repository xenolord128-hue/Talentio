import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  X, 
  Mail, 
  Phone, 
  Github, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  UserCheck,
  Building2,
  Briefcase,
  Layers,
  Globe
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authPromptReason, 
    setAuthPromptReason,
    loginWithEmail,
    loginWithPhone,
    loginWithGoogle,
    loginWithGithub,
    registerAccount,
    switchDemoAccount,
    user
  } = useGuide();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'google' | 'github'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Phone form states
  const [countryCode, setCountryCode] = useState('+880');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthPromptReason(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerAccount('email', email, name, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 6) return;
    setOtpSent(true);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithPhone(`${countryCode}${phoneNumber}`, otpCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl ios-glass-dark text-white rounded-[28px] border border-[#A38BFF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.6)] p-6 sm:p-8 overflow-hidden my-auto">
        
        {/* Ambient Top Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#6E5BFF]/30 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-3 min-w-[48px] min-h-[48px] rounded-2xl bg-white/10 hover:bg-white/20 border border-[#A38BFF]/30 text-slate-300 hover:text-white transition-colors cursor-pointer z-10 flex items-center justify-center"
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
            Global Escrow-Protected Marketplace & Cloud Database
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-3 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`py-3 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`py-3 px-2 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
        </div>

        {/* Tab 1: Email Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                  placeholder="e.g. Tanvir Ahmed"
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
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                />
              </div>
            </div>

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
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <Globe className="w-6 h-6 text-[#A38BFF]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Google One-Click Auth</h4>
                  <p className="text-xs text-slate-400">Sign in securely using your verified Google Account</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Instantly syncs profile image, verified email identity, and initializes your Firestore database records.
              </p>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-4 min-h-[48px] rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Globe className="w-5 h-5 text-[#3D2FD1]" />
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Tab 3: GitHub OAuth */}
        {activeTab === 'github' && (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Talentio Developer OAuth</h4>
                  <p className="text-xs text-slate-400">Instantly import your public repositories & verified badges</p>
                </div>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
                <li>Instant 1-Click Firebase Authentication</li>
                <li>Showcase GitHub identity on your profile</li>
                <li>Fast-track developer escrow tier verification</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={loginWithGithub}
              className="w-full py-4 min-h-[48px] rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-sm border border-white/20 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub OAuth</span>
            </button>
          </div>
        )}

        {/* Tab 4: Phone OTP Form */}
        {activeTab === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#6E5BFF]"
                >
                  <option value="+880" className="bg-[#1A1633] text-white">🇧🇩 +880 (BD)</option>
                  <option value="+1" className="bg-[#1A1633] text-white">🇺🇸 +1 (USA/CA)</option>
                  <option value="+44" className="bg-[#1A1633] text-white">🇬🇧 +44 (UK)</option>
                  <option value="+91" className="bg-[#1A1633] text-white">🇮🇳 +91 (IN)</option>
                  <option value="+971" className="bg-[#1A1633] text-white">🇦🇪 +971 (UAE)</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="1711234567"
                    className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] focus:ring-2 focus:ring-[#6E5BFF]/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:opacity-95 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Send 6-Digit Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Enter 6-Digit OTP
                    </label>
                    <span className="text-[11px] font-mono text-[#A38BFF]">
                      Code sent: 123456 (Demo)
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3.5 min-h-[48px] rounded-xl bg-white/10 border border-[#6E5BFF] text-white text-base tracking-widest font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] text-white font-bold text-sm shadow-lg shadow-[#3D2FD1]/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Sign In</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* Toggle Mode */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-xs text-slate-300 hover:text-white transition-colors py-2"
          >
            {authMode === 'login' ? (
              <span>Don't have an account? <strong className="text-[#A38BFF] font-bold underline">Create one now</strong></span>
            ) : (
              <span>Already registered? <strong className="text-[#A38BFF] font-bold underline">Sign in to account</strong></span>
            )}
          </button>
        </div>

        {/* Demo Fast Switcher Section */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ⚡ Instant Test Accounts (1-Click Switch)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3D2FD1]/30 text-[#A38BFF] font-semibold">
              Dev Sandbox
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => switchDemoAccount('client')}
              className="p-3 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#A38BFF]/30 hover:border-[#A38BFF] text-left transition-all group cursor-pointer flex flex-col justify-center"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <UserCheck className="w-3.5 h-3.5 text-[#6E5BFF]" />
                <span>Client</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Alexander (Buyer)</p>
            </button>

            <button
              type="button"
              onClick={() => switchDemoAccount('freelancer')}
              className="p-3 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#A38BFF]/30 hover:border-[#A38BFF] text-left transition-all group cursor-pointer flex flex-col justify-center"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Briefcase className="w-3.5 h-3.5 text-[#A38BFF]" />
                <span>Freelancer</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Sofia Chen (UI/UX)</p>
            </button>

            <button
              type="button"
              onClick={() => switchDemoAccount('agency')}
              className="p-3 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#A38BFF]/30 hover:border-[#A38BFF] text-left transition-all group cursor-pointer flex flex-col justify-center"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                <span>Agency</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Nova Studios (Dev)</p>
            </button>

            <button
              type="button"
              onClick={() => switchDemoAccount('admin')}
              className="p-3 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#A38BFF]/30 hover:border-[#A38BFF] text-left transition-all group cursor-pointer flex flex-col justify-center"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-0.5">
                <span>Super Admin</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">Admin Governance</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
