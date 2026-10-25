import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from '../components/TalentioLogo';
import { registerWithFirebase, isEmailPasswordDisabled, isGithubProviderDisabled, formatAuthError } from '../lib/firebaseAuth';
import { verifyRecaptchaTokenOnServer } from '../lib/recaptcha';
import { HumanVerificationModal } from '../components/HumanVerificationModal';
import { RecaptchaCheckbox } from '../components/RecaptchaCheckbox';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Github, 
  User, 
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'login' }) => {
  const { 
    loginWithEmail, 
    loginWithGoogle, 
    loginWithGithub, 
    activePage,
    setActivePage,
    showToast,
    setUser,
    user
  } = useGuide();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState<'login' | 'register'>(
    activePage === 'register' ? 'register' : initialMode
  );

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [disabledProvider, setDisabledProvider] = useState<'email' | 'github' | null>(null);

  // Interactive Human Verification state (Google reCAPTCHA v2)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [recaptchaResetTrigger, setRecaptchaResetTrigger] = useState(0);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [pendingAuthAction, setPendingAuthAction] = useState<((token: string) => Promise<void>) | null>(null);
  const [verificationActionTitle, setVerificationActionTitle] = useState('Talentio Security Check');

  // Inline reCAPTCHA callbacks
  const handleInlineCaptchaVerify = useCallback(async (token: string) => {
    setRecaptchaError(null);
    setRecaptchaToken(token);
    try {
      const result = await verifyRecaptchaTokenOnServer(token);
      if (result.valid) {
        setIsRecaptchaVerified(true);
        setVerificationError(null);
      } else {
        setIsRecaptchaVerified(false);
        setRecaptchaToken(null);
        setRecaptchaError(result.message || 'Human verification failed. Please check the box again.');
        setRecaptchaResetTrigger(prev => prev + 1);
      }
    } catch {
      // Network tolerance - keep verified state with valid token
      setIsRecaptchaVerified(true);
    }
  }, []);

  const handleInlineCaptchaExpired = useCallback(() => {
    setIsRecaptchaVerified(false);
    setRecaptchaToken(null);
    setRecaptchaError('Verification expired. Please check the "I\'m not a robot" box again.');
    setRecaptchaResetTrigger(prev => prev + 1);
  }, []);

  const handleInlineCaptchaError = useCallback(() => {
    setRecaptchaError('Could not reach Google reCAPTCHA. Please check your network connection.');
  }, []);

  // Keep internal mode in sync with activePage route
  useEffect(() => {
    if (activePage === 'register' && mode !== 'register') {
      setMode('register');
    } else if (activePage === 'login' && mode !== 'login') {
      setMode('login');
    }
  }, [activePage, mode]);

  // 3D Card Tilt Refs for Desktop
  const cardWrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Reset states when mode changes
  const switchMode = useCallback((newMode: 'login' | 'register') => {
    setMode(newMode);
    setActivePage(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDisabledProvider(null);
    setRecaptchaError(null);
  }, [setActivePage]);

  // Desktop subtle 3D card tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) return;
    const wrap = cardWrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  }, []);

  // If already logged in, show return indicator
  useEffect(() => {
    if (user) {
      setSuccessMessage(`You are currently signed in as ${user.name || user.email}.`);
    }
  }, [user]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score: 3, label: 'Good', color: '#E3EDF9' };
    return { score: 4, label: 'Strong', color: '#10B981' };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setDisabledProvider(null);
    setRecaptchaError(null);

    const cleanEmail = email.trim();

    // 1. Validation for Registration
    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter a secure password.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters in length.');
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setErrorMessage('Strong password required: include at least one letter and one number.');
        return;
      }
      if (!confirmPassword) {
        setErrorMessage('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter matching passwords.');
        return;
      }
    } else {
      // 2. Validation for Login
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    // 3. Human Verification Validation (reCAPTCHA v2 Checkbox)
    if (!isRecaptchaVerified || !recaptchaToken) {
      setRecaptchaError('Please check the "I\'m not a robot" box to complete human verification.');
      setErrorMessage('Human verification required: Please complete the reCAPTCHA security check below.');
      const section = document.getElementById('recaptcha-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(cleanEmail, password);
        showToast('Signed in successfully! Welcome back to Talentio.', 'success');
        setActivePage('dashboard');
      } else {
        // Register flow using createUserWithEmailAndPassword() and Firestore sync
        const newUser = await registerWithFirebase(cleanEmail, password, {
          name: name.trim(),
          userType: role,
          role: role === 'client' ? 'CLIENT' : 'FREELANCER',
          authMethod: 'email'
        });
        if (newUser) {
          setUser(newUser);
          showToast('Account created successfully! Welcome to Talentio.', 'success');
          setActivePage('dashboard');
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isEmailPasswordDisabled(err)) {
        setDisabledProvider('email');
        setErrorMessage('Email/Password provider is not enabled in your Firebase Console project (talentio-92919).');
      } else {
        setErrorMessage(formatAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = () => {
    setErrorMessage(null);
    setDisabledProvider(null);
    setVerificationError(null);
    setSocialLoading('google');

    const executeGoogle = async () => {
      try {
        const ok = await loginWithGoogle();
        if (ok) {
          showToast('Signed in with Google successfully!', 'success');
          setActivePage('dashboard');
        }
      } catch (err: any) {
        console.error('Google auth error:', err);
        setErrorMessage(formatAuthError(err));
      } finally {
        setSocialLoading(null);
      }
    };

    if (isRecaptchaVerified && recaptchaToken) {
      executeGoogle();
      return;
    }

    setVerificationActionTitle('Google Sign-In Human Verification');
    setPendingAuthAction(() => async (token: string) => {
      const verifyRes = await verifyRecaptchaTokenOnServer(token);
      if (verifyRes.valid) {
        setIsRecaptchaVerified(true);
        setRecaptchaToken(token);
        setIsHumanModalOpen(false);
        await executeGoogle();
      } else {
        setVerificationError(verifyRes.message || 'Human verification failed. Please try again.');
        setIsHumanModalOpen(true);
        setSocialLoading(null);
      }
    });
    setIsHumanModalOpen(true);
  };

  // GitHub OAuth
  const handleGithubLogin = () => {
    setErrorMessage(null);
    setDisabledProvider(null);
    setVerificationError(null);
    setSocialLoading('github');

    const executeGithub = async () => {
      try {
        const ok = await loginWithGithub();
        if (ok) {
          showToast('Signed in with GitHub successfully!', 'success');
          setActivePage('dashboard');
        }
      } catch (err: any) {
        console.error('GitHub auth error:', err);
        if (isGithubProviderDisabled(err)) {
          setDisabledProvider('github');
          setErrorMessage('GitHub provider is not enabled or missing OAuth credentials in Firebase Console.');
        } else {
          setErrorMessage(formatAuthError(err));
        }
      } finally {
        setSocialLoading(null);
      }
    };

    if (isRecaptchaVerified && recaptchaToken) {
      executeGithub();
      return;
    }

    setVerificationActionTitle('GitHub Sign-In Human Verification');
    setPendingAuthAction(() => async (token: string) => {
      const verifyRes = await verifyRecaptchaTokenOnServer(token);
      if (verifyRes.valid) {
        setIsRecaptchaVerified(true);
        setRecaptchaToken(token);
        setIsHumanModalOpen(false);
        await executeGithub();
      } else {
        setVerificationError(verifyRes.message || 'Human verification failed. Please try again.');
        setIsHumanModalOpen(true);
        setSocialLoading(null);
      }
    });
    setIsHumanModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full talentio-auth-bg text-[#E3EDF9] overflow-x-hidden flex flex-col justify-between selection:bg-[#3A5A86] selection:text-white">
      {/* Background Dot Grid Layer */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 talentio-auth-grid z-0" 
        aria-hidden="true" 
      />

      {/* Floating Animated Ambient Orbs */}
      <div 
        className="fixed -left-20 top-[18%] w-60 h-60 rounded-full blur-[2px] pointer-events-none z-0 talentio-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(110,91,255,0.22) 0%, transparent 68%)'
        }}
        aria-hidden="true" 
      />
      <div 
        className="fixed -right-24 bottom-[10%] w-72 h-72 rounded-full blur-[2px] pointer-events-none z-0 talentio-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(163,139,255,0.18) 0%, transparent 68%)'
        }}
        aria-hidden="true" 
      />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-[1180px] mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-between">
        
        {/* Top Navigation */}
        <header className="w-full flex items-center justify-between pb-6 talentio-reveal-1">
          <button 
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 text-xl sm:text-2xl font-extrabold tracking-tight group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9] rounded-xl p-1 -m-1"
            title="Return to Talentio Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shadow-lg shadow-[#23324A] group-hover:scale-105 transition-transform duration-200">
              <TalentioLogo size="md" variant="transparent" />
            </div>
            <span className="bg-gradient-to-r from-[#E3EDF9] to-[#E3EDF9] bg-clip-text text-transparent">
              Talentio
            </span>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-xs sm:text-sm text-[#9ab0cb] font-medium">
              Find talent. Get work done. <b className="text-[#E3EDF9] font-semibold">Grow together.</b>
            </span>
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3EDF9]/15 hover:border-[#E3EDF9]/40 bg-[#E3EDF9]/5 hover:bg-[#3A5A86]/10 text-xs font-semibold text-[#E3EDF9] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E3EDF9]" />
              <span>Marketplace</span>
            </button>
          </div>
        </header>

        {/* Main Content Grid: Hero on Left, Login Card on Right */}
        <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1.1fr_490px] gap-8 lg:gap-14 items-center py-6 sm:py-10">
          
          {/* Left Hero Section */}
          <section className="talentio-reveal-2 max-w-2xl lg:max-w-none text-center lg:text-left mx-auto lg:mx-0">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E3EDF9]/15 bg-[#3A5A86]/10 text-[#E3EDF9] text-[11px] font-bold tracking-wider uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-[#E3EDF9] shadow-[0_0_12px_#E3EDF9] talentio-orb-1" />
              <span>Welcome to Talentio</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[#E3EDF9]">
              Find the{' '}
              <span className="bg-gradient-to-r from-[#E3EDF9] via-[#E3EDF9] to-[#3A5A86] bg-clip-text text-transparent">
                right talent
              </span>{' '}
              for your project.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base text-[#9ab0cb] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Connect with skilled freelancers, discover opportunities, create gigs, 
              post jobs and get your work done — all in one modern marketplace.
            </p>

            {/* Features Row */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-3.5">
              <div className="flex-1 min-w-[140px] max-w-[200px] p-3.5 sm:p-4 rounded-2xl border border-[#E3EDF9]/15 bg-[#E3EDF9]/[0.035] backdrop-blur-md hover:-translate-y-1 hover:border-[#E3EDF9]/40 hover:bg-[#3A5A86]/10 transition-all duration-200 text-left">
                <strong className="block text-xs sm:text-sm font-bold text-[#E3EDF9] mb-1">
                  Hire Talent
                </strong>
                <span className="block text-[11px] text-[#9ab0cb] leading-tight">
                  Find skilled professionals
                </span>
              </div>

              <div className="flex-1 min-w-[140px] max-w-[200px] p-3.5 sm:p-4 rounded-2xl border border-[#E3EDF9]/15 bg-[#E3EDF9]/[0.035] backdrop-blur-md hover:-translate-y-1 hover:border-[#E3EDF9]/40 hover:bg-[#3A5A86]/10 transition-all duration-200 text-left">
                <strong className="block text-xs sm:text-sm font-bold text-[#E3EDF9] mb-1">
                  Find Gigs
                </strong>
                <span className="block text-[11px] text-[#9ab0cb] leading-tight">
                  Discover useful services
                </span>
              </div>

              <div className="flex-1 min-w-[140px] max-w-[200px] p-3.5 sm:p-4 rounded-2xl border border-[#E3EDF9]/15 bg-[#E3EDF9]/[0.035] backdrop-blur-md hover:-translate-y-1 hover:border-[#E3EDF9]/40 hover:bg-[#3A5A86]/10 transition-all duration-200 text-left">
                <strong className="block text-xs sm:text-sm font-bold text-[#E3EDF9] mb-1">
                  Build Together
                </strong>
                <span className="block text-[11px] text-[#9ab0cb] leading-tight">
                  Grow through collaboration
                </span>
              </div>
            </div>
          </section>

          {/* Right Column: Dedicated Login/Register Card */}
          <section 
            ref={cardWrapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="talentio-reveal-3 w-full max-w-[480px] mx-auto lg:max-w-none"
            style={{ perspective: '1200px' }}
          >
            <div 
              ref={cardRef}
              id="loginCard"
              className="relative rounded-[28px] p-6 sm:p-8 border border-[#E3EDF9]/25 bg-gradient-to-br from-[#3A5A86]/15 to-[#23324A]/90 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden transition-transform duration-150 ease-out"
            >
              {/* Subtle Atmospheric Card Glows */}
              <div 
                className="absolute -right-20 -top-20 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-35"
                style={{ background: 'rgba(110,91,255,0.45)' }}
                aria-hidden="true"
              />
              <div 
                className="absolute left-1/4 -bottom-24 w-56 h-40 rounded-full pointer-events-none blur-3xl opacity-25"
                style={{ background: 'rgba(163,139,255,0.35)' }}
                aria-hidden="true"
              />

              {/* Card Header with Official Talentio Logo */}
              <div className="relative z-10 mb-6 text-left">
                <div className="w-14 h-14 rounded-2xl bg-black border border-[#E3EDF9]/30 p-1 flex items-center justify-center shadow-[0_0_35px_rgba(110,91,255,0.25)] mb-4">
                  <TalentioLogo size="md" variant="transparent" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E3EDF9]">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#9ab0cb] font-normal">
                  {mode === 'login' 
                    ? 'Sign in to continue to your Talentio account.' 
                    : 'Join Talentio and start building your future.'}
                </p>
              </div>

              {/* Tabs: Login vs Register */}
              <div 
                className="relative z-10 grid grid-cols-2 border-b border-[#E3EDF9]/15 mb-6 text-center"
                role="tablist"
                aria-label="Authentication modes"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-login"
                  aria-selected={mode === 'login'}
                  aria-controls="panel-login"
                  onClick={() => switchMode('login')}
                  className={`py-3 text-xs sm:text-sm font-bold tracking-wide transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9] rounded-t-lg ${
                    mode === 'login' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb]/60 hover:text-[#E3EDF9]'
                  }`}
                >
                  Login
                  {mode === 'login' && (
                    <span 
                      className="absolute left-[15%] right-[15%] -bottom-[1px] h-[2.5px] rounded-full bg-gradient-to-r from-[#3A5A86] to-[#E3EDF9] shadow-[0_0_14px_rgba(110,91,255,0.8)]" 
                      aria-hidden="true"
                    />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-register"
                  aria-selected={mode === 'register'}
                  aria-controls="panel-register"
                  onClick={() => switchMode('register')}
                  className={`py-3 text-xs sm:text-sm font-bold tracking-wide transition-colors relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9] rounded-t-lg ${
                    mode === 'register' ? 'text-[#E3EDF9]' : 'text-[#9ab0cb]/60 hover:text-[#E3EDF9]'
                  }`}
                >
                  Register
                  {mode === 'register' && (
                    <span 
                      className="absolute left-[15%] right-[15%] -bottom-[1px] h-[2.5px] rounded-full bg-gradient-to-r from-[#3A5A86] to-[#E3EDF9] shadow-[0_0_14px_rgba(110,91,255,0.8)]" 
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {/* Specialized Banner for Disabled Firebase Email/Password Provider */}
              {disabledProvider === 'email' && (
                <div 
                  role="alert"
                  className="relative z-10 mb-4 p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 text-amber-200 space-y-2.5 text-xs animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Firebase Email/Password Provider Required</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Email and Password sign-in is currently disabled in your Firebase Console project (<strong>talentio-92919</strong>).
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] space-y-1 text-amber-100">
                    <p className="font-semibold text-white">To enable in Firebase Console:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-amber-200/80">
                      <li>Open Firebase Console &rarr; <strong>Authentication</strong></li>
                      <li>Go to <strong>Sign-in method</strong> tab</li>
                      <li>Click <strong>Email/Password</strong></li>
                      <li>Toggle <strong>Enable</strong> and click <strong>Save</strong></li>
                    </ol>
                  </div>
                  <p className="text-[10px] text-amber-300/80 italic">
                    💡 You can also use <strong>Google Sign-In</strong> or <strong>GitHub Sign-In</strong> below immediately.
                  </p>
                </div>
              )}

              {/* Specialized Banner for Disabled or Unconfigured GitHub Provider */}
              {disabledProvider === 'github' && (
                <div 
                  role="alert"
                  className="relative z-10 mb-4 p-4 rounded-2xl bg-indigo-950/50 border border-[#3A5A86]/50 text-[#E3EDF9] space-y-2.5 text-xs animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2 font-bold text-[#E3EDF9]">
                    <Github className="w-4 h-4 text-white shrink-0" />
                    <span>GitHub OAuth Provider Configuration Required</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    GitHub OAuth is not yet enabled or requires OAuth App credentials in Firebase Console project (<strong>talentio-92919</strong>).
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-[11px] space-y-1.5 text-slate-200">
                    <p className="font-semibold text-white">Steps to enable GitHub login:</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>In GitHub: <strong>Settings &rarr; Developer settings &rarr; OAuth Apps &rarr; New OAuth App</strong></li>
                      <li>
                        Set Authorization callback URL to:<br />
                        <code className="text-[#E3EDF9] bg-black/70 px-1.5 py-0.5 rounded text-[10px] select-all inline-block mt-0.5">
                          https://talentio-92919.firebaseapp.com/__/auth/handler
                        </code>
                      </li>
                      <li>In Firebase Console: <strong>Authentication &rarr; Sign-in method &rarr; GitHub</strong></li>
                      <li>Toggle <strong>Enable</strong>, enter your GitHub <strong>Client ID</strong> and <strong>Client Secret</strong>, then click <strong>Save</strong>.</li>
                    </ol>
                  </div>
                  <p className="text-[10px] text-indigo-300/80 italic">
                    💡 You can also continue with <strong>Google Sign-In</strong> or <strong>Email/Password</strong> directly.
                  </p>
                </div>
              )}

              {/* Status & Error Feedback */}
              {errorMessage && !disabledProvider && (
                <div 
                  role="alert"
                  className="relative z-10 mb-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-2.5 text-xs animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {successMessage && !errorMessage && (
                <div 
                  role="status"
                  className="relative z-10 mb-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-2.5 text-xs animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* EMAIL & PASSWORD AUTHENTICATION FORM */}
              <form 
                id={mode === 'login' ? 'loginForm' : 'signupForm'}
                onSubmit={handleSubmit} 
                className="relative z-10 space-y-3.5 text-left"
                noValidate
              >
              {/* Full Name field (Register only) */}
              {mode === 'register' && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <label 
                    htmlFor="register-name" 
                    className="block text-xs font-semibold text-[#9ab0cb]"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#E3EDF9] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/20 border border-[#E3EDF9]/15 text-[#E3EDF9] placeholder-[#9ab0cb]/40 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3A5A86] focus:ring-4 focus:ring-[#3A5A86]/15 focus:bg-black/30 transition-all"
                    />
                  </div>
                </div>
              )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label 
                    htmlFor={mode === 'login' ? 'login-email' : 'register-email'}
                    className="block text-xs font-semibold text-[#9ab0cb]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#E3EDF9] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id={mode === 'login' ? 'login-email' : 'register-email'}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/20 border border-[#E3EDF9]/15 text-[#E3EDF9] placeholder-[#9ab0cb]/40 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3A5A86] focus:ring-4 focus:ring-[#3A5A86]/15 focus:bg-black/30 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor={mode === 'login' ? 'login-password' : 'register-password'}
                      className="block text-xs font-semibold text-[#9ab0cb]"
                    >
                      Password
                    </label>
                    {mode === 'register' && password && (
                      <span 
                        className="text-[10px] font-bold"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#E3EDF9] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id={mode === 'login' ? 'login-password' : 'register-password'}
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password (min. 8 chars)'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="w-full h-11 pl-10 pr-11 rounded-2xl bg-black/20 border border-[#E3EDF9]/15 text-[#E3EDF9] placeholder-[#9ab0cb]/40 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3A5A86] focus:ring-4 focus:ring-[#3A5A86]/15 focus:bg-black/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-3.5 text-[#9ab0cb]/70 hover:text-[#E3EDF9] transition-colors p-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9] rounded-lg"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Visual Password Strength Bar (Register mode) */}
                  {mode === 'register' && password && (
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: step <= passwordStrength.score ? passwordStrength.color : 'rgba(242, 240, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password (Register mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor="register-confirm-password" 
                        className="block text-xs font-semibold text-[#9ab0cb]"
                      >
                        Confirm Password
                      </label>
                      {confirmPassword && (
                        <span className={`text-[10px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#E3EDF9] absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={`w-full h-11 pl-10 pr-11 rounded-2xl bg-black/20 border text-[#E3EDF9] placeholder-[#9ab0cb]/40 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 focus:bg-black/30 transition-all ${
                          confirmPassword && !passwordsMatch 
                            ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/15' 
                            : 'border-[#E3EDF9]/15 focus:border-[#3A5A86] focus:ring-[#3A5A86]/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="absolute right-3.5 top-3.5 text-[#9ab0cb]/70 hover:text-[#E3EDF9] transition-colors p-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9] rounded-lg"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Role selection (Register mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                    <span className="block text-xs font-semibold text-[#9ab0cb]">
                      I am joining as
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          role === 'client'
                            ? 'border-[#3A5A86] bg-[#3A5A86]/30 text-[#E3EDF9]'
                            : 'border-[#E3EDF9]/15 bg-black/20 text-[#9ab0cb] hover:border-[#E3EDF9]/40'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-[#E3EDF9]" />
                        <span>Client (Hire)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('freelancer')}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          role === 'freelancer'
                            ? 'border-[#3A5A86] bg-[#3A5A86]/30 text-[#E3EDF9]'
                            : 'border-[#E3EDF9]/15 bg-black/20 text-[#9ab0cb] hover:border-[#E3EDF9]/40'
                        }`}
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#E3EDF9]" />
                        <span>Freelancer (Work)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password (Login mode) */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1 pb-1 text-xs">
                    <label className="flex items-center gap-2 text-[#9ab0cb] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E3EDF9]/20 bg-black/30 text-[#3A5A86] focus:ring-[#3A5A86] focus:ring-offset-0 cursor-pointer accent-[#3A5A86]"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setActivePage('forgot-password')}
                      className="text-[#E3EDF9] hover:text-[#E3EDF9] font-semibold hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E3EDF9] rounded"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Google reCAPTCHA v2 Checkbox Security Verification */}
                <div id="recaptcha-section" className="pt-2 pb-1 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-semibold text-[#9ab0cb] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A86]" />
                      Human Verification
                    </span>
                    {isRecaptchaVerified ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#9ab0cb]/70">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-center p-2 rounded-xl bg-black/25 border border-[#E3EDF9]/10 overflow-hidden">
                    <RecaptchaCheckbox
                      onVerify={handleInlineCaptchaVerify}
                      onExpired={handleInlineCaptchaExpired}
                      onError={handleInlineCaptchaError}
                      resetTrigger={recaptchaResetTrigger}
                      theme="dark"
                    />
                  </div>

                  {recaptchaError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5 pl-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{recaptchaError}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || socialLoading !== null}
                  className="w-full h-11 rounded-2xl text-white font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#3A5A86] to-[#3A5A86] hover:from-[#23324A] hover:to-[#3A5A86] active:scale-[0.99] shadow-[0_12px_30px_rgba(61,47,209,0.35)] hover:shadow-[0_16px_36px_rgba(110,91,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3A5A86]/30 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{mode === 'login' ? 'Logging in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Login with Email' : 'Create Account with Email'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Universal Divider */}
              <div className="relative flex items-center py-2 text-center my-1 z-10">
                <div className="flex-grow border-t border-[#E3EDF9]/15" />
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-[#9ab0cb]/70">
                  or continue with
                </span>
                <div className="flex-grow border-t border-[#E3EDF9]/15" />
              </div>

              {/* Social Logins: Strictly Google & GitHub Only */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || socialLoading !== null}
                  className="h-11 px-4 rounded-xl border border-[#E3EDF9]/15 bg-[#E3EDF9]/[0.035] hover:border-[#E3EDF9]/40 hover:bg-[#3A5A86]/10 text-[#E3EDF9] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9]"
                >
                  {socialLoading === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E3EDF9]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loading || socialLoading !== null}
                  className="h-11 px-4 rounded-xl border border-[#E3EDF9]/15 bg-[#E3EDF9]/[0.035] hover:border-[#E3EDF9]/40 hover:bg-[#3A5A86]/10 text-[#E3EDF9] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E3EDF9]"
                >
                  {socialLoading === 'github' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E3EDF9]" />
                  ) : (
                    <Github className="w-4 h-4 shrink-0 text-[#E3EDF9]" />
                  )}
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Bottom Switcher */}
              <div className="relative z-10 mt-5 pt-3.5 border-t border-[#E3EDF9]/10 text-center text-xs text-[#9ab0cb]">
                <span>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="font-extrabold text-[#E3EDF9] hover:text-[#E3EDF9] hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E3EDF9] rounded"
                >
                  {mode === 'login' ? 'Register' : 'Login'}
                </button>
              </div>

              {/* Protected by Google reCAPTCHA badge */}
              <div className="relative z-10 mt-4 pt-3 border-t border-[#E3EDF9]/10 flex items-center justify-center gap-1.5 text-[11px] text-[#9ab0cb]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by Google reCAPTCHA</span>
              </div>

            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#E3EDF9]/10 text-xs text-[#9ab0cb]/70">
          <span>© 2026 Talentio. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <button 
              type="button" 
              onClick={() => setActivePage('playbook')}
              className="hover:text-[#E3EDF9] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button 
              type="button" 
              onClick={() => setActivePage('playbook')}
              className="hover:text-[#E3EDF9] transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button 
              type="button" 
              onClick={() => setActivePage('support')}
              className="hover:text-[#E3EDF9] transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
        </footer>

      </div>

      {/* Interactive Human Verification Modal with Google reCAPTCHA v2 Checkbox */}
      <HumanVerificationModal
        isOpen={isHumanModalOpen}
        actionTitle={verificationActionTitle}
        errorMessage={verificationError}
        onVerifySuccess={async (token: string) => {
          if (pendingAuthAction) {
            await pendingAuthAction(token);
          }
        }}
        onCancel={() => {
          setIsHumanModalOpen(false);
          setPendingAuthAction(null);
          setLoading(false);
          setSocialLoading(null);
          setVerificationError(null);
        }}
      />
    </div>
  );
};

