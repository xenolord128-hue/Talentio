import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { CountrySelector } from './CountrySelector';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { COUNTRIES_DATA } from '../data/countriesData';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Building2, 
  Briefcase, 
  Layers, 
  Eye, 
  EyeOff,
  AlertCircle,
  Zap,
  Gift,
  Check
} from 'lucide-react';

export const AuthGateway: React.FC = () => {
  const { 
    isAuthenticated, 
    loginWithEmail, 
    loginWithPhone,
    registerFullAccount, 
    switchDemoAccount 
  } = useGuide();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register multi-step state
  const [regStep, setRegStep] = useState<1 | 2>(1);
  
  // Step 1: Basic Information
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState(COUNTRIES_DATA[1]); // USA default
  const [regCurrency, setRegCurrency] = useState('USD');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  // Step 2: Professional Information
  const [regAccountType, setRegAccountType] = useState<'client' | 'freelancer' | 'agency'>('freelancer');
  const [regTitle, setRegTitle] = useState('');
  const [regSkillsInput, setRegSkillsInput] = useState('React, TypeScript, UI/UX Design, Node.js');
  const [regExperience, setRegExperience] = useState<'beginner' | 'intermediate' | 'expert' | 'lead'>('expert');
  const [regBio, setRegBio] = useState('');
  const [regLanguages, setRegLanguages] = useState('English (Fluent), Spanish');
  const [regHourlyRate, setRegHourlyRate] = useState<number>(45);

  if (isAuthenticated) return null;

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (loginMethod === 'email') {
      if (!loginEmail || !loginPassword) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
      const success = loginWithEmail(loginEmail, loginPassword);
      if (!success) {
        setErrorMessage('Invalid credentials. You can use instant demo accounts or register below.');
      }
    } else {
      if (!loginPhone) {
        setErrorMessage('Please enter a valid phone number.');
        return;
      }
      loginWithPhone(`${phoneCountryCode}${loginPhone}`, otpCode || '123456');
    }
  };

  // Handle Register step 1 -> step 2
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!regUsername.trim()) {
      setErrorMessage('Username is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setRegStep(2);
  };

  // Complete Registration
  const handleCompleteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const skillsArray = regSkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const languagesArray = regLanguages
      .split(',')
      .map(l => l.trim())
      .filter(Boolean);

    let completion = 70;
    if (regTitle.trim()) completion += 15;
    if (skillsArray.length > 0) completion += 15;

    registerFullAccount({
      name: regFullName,
      handle: regUsername.startsWith('@') ? regUsername : `@${regUsername}`,
      email: regEmail,
      phone: `${regCountry.callingCode} ${regPhone}`,
      countryCode: regCountry.code,
      countryFlag: regCountry.flag,
      location: `${regCountry.name}`,
      preferredCurrency: regCurrency,
      avatar: regAvatar,
      userType: regAccountType,
      title: regTitle || (regAccountType === 'client' ? 'Client Hiring Manager' : 'Professional Specialist'),
      skills: skillsArray.length > 0 ? skillsArray : ['Communication', 'Project Delivery'],
      experienceLevel: regExperience,
      hourlyRate: regHourlyRate,
      bio: regBio || 'Talentio member building high-quality deliverables with escrow protection.',
      languages: languagesArray.length > 0 ? languagesArray : ['English'],
      profileCompletionScore: completion,
      onboardingCompleted: completion >= 100,
      accountStatus: regAccountType === 'freelancer' || regAccountType === 'agency' ? 'pending' : 'approved',
      isApprovedSeller: false
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0F0D1C] text-white flex flex-col justify-between selection:bg-[#3D2FD1] selection:text-white">
      
      {/* Top Brand Bar */}
      <header className="w-full border-b border-white/10 bg-[#16122E]/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TalentioLogo size="sm" variant="gradient" animated />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-display">TALENTIO</span>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#3D2FD1] text-[#F2F0FF] border border-[#A38BFF]/30">
                ESCROW PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Secure 256-Bit SSL Encrypted</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Full-Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        
        {/* Left Hero Column: Platform Value, Dual Welcome Gifts */}
        <div className="w-full lg:w-1/2 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3D2FD1]/30 border border-[#A38BFF]/40 text-xs font-bold text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>International Freelancer & Escrow Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display leading-tight">
            Work with Verified Talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A38BFF] to-white">
              Protected by Milestone Escrow.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
            Talentio provides institutional-grade escrow protection, multi-currency payouts, 
            and verified skill vetting for global clients and creative professionals.
          </p>

          {/* Dual Welcome Gifts Card Banner */}
          <div className="p-5 rounded-2xl bg-[#1A1633] border border-amber-500/30 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Included Upon Registration (2 Guaranteed Gifts)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <span className="text-xl">🎁</span>
                <div>
                  <div className="text-xs font-extrabold text-white">$50 Escrow Credit</div>
                  <div className="text-[10px] text-slate-300">Instant checkout voucher</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="text-xs font-extrabold text-white">0% Platform Fee</div>
                  <div className="text-[10px] text-slate-300">Keep 100% on first 3 orders</div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>150+ Global Currencies</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Escrow Milestone Release</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live Audio & Chat Workstation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Risk Dispute Arbitration</span>
            </div>
          </div>

        </div>

        {/* Right Form Column: Clean Full Card */}
        <div className="w-full lg:w-1/2 max-w-lg">
          <div className="bg-[#171330] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Mode Switcher Pills */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); setRegStep(1); }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* -------------------- LOGIN SECTION -------------------- */}
            {mode === 'login' && (
              <div className="space-y-4">
                
                {/* Method selector */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      loginMethod === 'email' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      loginMethod === 'phone' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Phone OTP
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginMethod === 'email' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="e.g. alexander@enterprise.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
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
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number</label>
                        <div className="flex gap-2">
                          <CountrySelector
                            value={phoneCountryCode}
                            onChange={(c) => setPhoneCountryCode(c.callingCode)}
                            variant="phone-prefix"
                            className="shrink-0"
                          />
                          <input
                            type="tel"
                            required
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            placeholder="555-0199"
                            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                          />
                        </div>
                      </div>

                      {otpSent && (
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Enter 6-Digit OTP Code</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full text-center tracking-widest font-mono text-base font-bold py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#6E5BFF]"
                          />
                        </div>
                      )}

                      {!otpSent && (
                        <button
                          type="button"
                          onClick={() => setOtpSent(true)}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          Send Verification Code
                        </button>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </button>
                </form>

                {/* Instant Evaluator Demo Accounts */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-[#A38BFF]" />
                    <span>Instant Demo Accounts</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => switchDemoAccount('client')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white truncate">Alexander V.</div>
                      <div className="text-[9px] text-[#A38BFF]">Client Buyer</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoAccount('freelancer')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white truncate">Sofia Chen</div>
                      <div className="text-[9px] text-emerald-400">Freelancer</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoAccount('agency')}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white truncate">Nova Studios</div>
                      <div className="text-[9px] text-amber-300">Agency</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoAccount('admin')}
                      className="p-2.5 rounded-xl bg-[#3D2FD1]/40 hover:bg-[#3D2FD1]/70 border border-[#A38BFF]/40 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-white truncate">Admin Desk</div>
                      <div className="text-[9px] text-[#A38BFF]">Super Admin</div>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* -------------------- REGISTER SECTION -------------------- */}
            {mode === 'register' && (
              <div className="space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#3D2FD1] text-[11px] font-bold flex items-center justify-center text-white">
                      {regStep}
                    </span>
                    <span className="font-bold text-slate-200">
                      {regStep === 1 ? 'Step 1: Account Credentials' : 'Step 2: Role & Professional Profile'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A38BFF]">
                    {regStep === 1 ? 'Step 1 of 2' : 'Final Step'}
                  </span>
                </div>

                {regStep === 1 ? (
                  <form onSubmit={handleNextStep} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Username *</label>
                        <input
                          type="text"
                          required
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="@johndoe"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="555-0123"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Country *</label>
                        <CountrySelector
                          value={regCountry.code}
                          onChange={(c) => {
                            setRegCountry(c);
                            setRegCurrency(c.currencyCode);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Currency *</label>
                        <select
                          value={regCurrency}
                          onChange={(e) => setRegCurrency(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#6E5BFF]"
                        >
                          {CURRENCIES_DATA.map(c => (
                            <option key={c.code} value={c.code} className="bg-[#171330] text-white">
                              {c.flag} {c.code} ({c.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password *</label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <span>Continue to Profile Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCompleteRegister} className="space-y-3.5">
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Purpose *</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRegAccountType('client')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            regAccountType === 'client'
                              ? 'bg-[#3D2FD1] border-[#A38BFF] text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Building2 className="w-4 h-4 mx-auto mb-1 text-[#A38BFF]" />
                          <div className="text-[11px] font-bold">Client / Buyer</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegAccountType('freelancer')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            regAccountType === 'freelancer'
                              ? 'bg-[#3D2FD1] border-[#A38BFF] text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <User className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                          <div className="text-[11px] font-bold">Freelancer</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegAccountType('agency')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            regAccountType === 'agency'
                              ? 'bg-[#3D2FD1] border-[#A38BFF] text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <Layers className="w-4 h-4 mx-auto mb-1 text-amber-300" />
                          <div className="text-[11px] font-bold">Agency</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={regTitle}
                        onChange={(e) => setRegTitle(e.target.value)}
                        placeholder="e.g. Senior Full-Stack Engineer / UI Designer"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Core Skills (comma separated)</label>
                      <input
                        type="text"
                        value={regSkillsInput}
                        onChange={(e) => setRegSkillsInput(e.target.value)}
                        placeholder="React, TypeScript, Node.js, UI/UX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Complete Registration & Claim Gifts</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

          </div>
        </div>

      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t border-white/10 bg-[#16122E]/80 backdrop-blur-xl px-4 sm:px-8 py-3 text-center text-xs text-slate-400">
        <span>© 2026 Talentio Global Marketplace Inc. All rights reserved.</span>
      </footer>

    </div>
  );
};
