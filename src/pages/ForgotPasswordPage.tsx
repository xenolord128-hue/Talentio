import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { sendPasswordReset } from '../lib/firebaseAuth';
import { TalentioLogo } from '../components/TalentioLogo';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setActivePage, showToast } = useGuide();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSubmitted(true);
      showToast('Password reset instructions sent to your email.', 'success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else {
        setErrorMessage(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#0E0B1F]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex justify-center mb-2">
            <TalentioLogo size="md" variant="white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Enter your registered account email to receive secure recovery instructions
          </p>
        </div>

        <div className="bg-[#171330] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
          {submitted ? (
            <div className="text-center space-y-4 py-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                We've sent a password reset link to <span className="text-white font-mono font-bold">{email}</span>. Please check your inbox and follow the link to establish new credentials.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActivePage('login')}
                  className="w-full py-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

              <div className="pt-2 text-center">
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
    </div>
  );
};
