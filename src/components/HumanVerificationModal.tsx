import React, { useState } from 'react';
import { RecaptchaCheckbox } from './RecaptchaCheckbox';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';

interface HumanVerificationModalProps {
  isOpen: boolean;
  actionTitle?: string;
  onVerifySuccess: (token: string) => void;
  onCancel: () => void;
  errorMessage?: string | null;
}

export const HumanVerificationModal: React.FC<HumanVerificationModalProps> = ({
  isOpen,
  actionTitle = 'Human Verification Required',
  onVerifySuccess,
  onCancel,
  errorMessage = null
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [resetCount, setResetCount] = useState<number>(0);

  if (!isOpen) return null;

  const handleVerify = (token: string) => {
    setInternalError(null);
    onVerifySuccess(token);
  };

  const handleExpired = () => {
    setInternalError('Verification expired. Please check the "I\'m not a robot" box again.');
  };

  const handleError = () => {
    setInternalError('reCAPTCHA encountered a problem. Please try again.');
  };

  const displayError = errorMessage || internalError;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="recaptcha-modal-title"
        className="w-full max-w-[360px] rounded-3xl bg-[#1D2636] border border-[#3A5A86]/60 shadow-[0_25px_80px_rgba(0,0,0,0.85)] text-[#E3EDF9] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#24334C] p-4 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3A5A86] flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 id="recaptcha-modal-title" className="text-sm font-bold text-white tracking-tight">
                  {actionTitle}
                </h3>
                <p className="text-[11px] text-[#9ab0cb]">
                  Google reCAPTCHA Security Check
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center justify-center">
          <p className="text-xs text-center text-[#9ab0cb] mb-4">
            Please check the box below to confirm you are human before proceeding with authentication.
          </p>

          {displayError && (
            <div className="w-full mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          {/* Official Google reCAPTCHA v2 Checkbox Widget */}
          <div className="flex justify-center w-full py-1">
            <RecaptchaCheckbox
              onVerify={handleVerify}
              onExpired={handleExpired}
              onError={handleError}
              theme="dark"
              resetTrigger={resetCount}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#17202e] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400">
            Protected by Google reCAPTCHA
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanVerificationModal;
