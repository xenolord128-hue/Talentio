import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { sendPasswordReset, formatAuthError } from '../lib/firebaseAuth';
import { TalentioLogo } from '../components/TalentioLogo';
import { verifyRecaptchaTokenOnServer } from '../lib/recaptcha';
import { HumanVerificationModal } from '../components/HumanVerificationModal';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setActivePage, showToast } = useGuide();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHumanModalOpen, setIsHumanModalOpen] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const performPasswordReset = async (recaptchaToken: string) => {
    setLoading(true);
    setVerificationError(null);
    try {
      // Authoritative Server-Side verification of reCAPTCHA v2 token
      const recaptchaResult = await verifyRecaptchaTokenOnServer(recaptchaToken);

      if (!recaptchaResult.valid) {
        setVerificationError(recaptchaResult.message || 'Verification failed. Please complete reCAPTCHA again.');
        setIsHumanModalOpen(true);
        setLoading(false);
        return;
      }

      setIsHumanModalOpen(false);
      await sendPasswordReset(email.trim());
      setSubmitted(true);
      showToast('Password reset instructions sent to your email.', 'success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setVerificationError(null);
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsHumanModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#0E0B1F]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-2">
            <TalentioLogo size="md" variant="white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Reset Your Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Enter your account email address and we'll send you secure instructions to reset your password.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#1A1633]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  We have sent password reset instructions to{' '}
                  <strong className="text-emerald-300">{email}</strong>. Follow the link in that email to choose a new password.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  className="w-full h-11 rounded-2xl bg-[#6E5BFF] hover:bg-[#5844e6] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#6E5BFF]/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Didn't receive it? Try another email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-2xl bg-[#6E5BFF] hover:bg-[#5844e6] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#6E5BFF]/30"
              >
                {loading ? (
                  <span>Sending Reset Email...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Password Reset Instructions</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protected by Google reCAPTCHA</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      <HumanVerificationModal
        isOpen={isHumanModalOpen}
        actionTitle="Password Reset Human Verification"
        errorMessage={verificationError}
        onVerifySuccess={(token: string) => {
          performPasswordReset(token);
        }}
        onCancel={() => {
          setIsHumanModalOpen(false);
          setVerificationError(null);
        }}
      />
    </div>
  );
};
export default ForgotPasswordPage;
