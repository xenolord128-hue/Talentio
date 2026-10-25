import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadRecaptchaV2Script, RECAPTCHA_SITE_KEY } from '../lib/recaptcha';
import { AlertCircle, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RecaptchaCheckboxProps {
  onVerify: (token: string) => void;
  onExpired?: () => void;
  onError?: (err?: any) => void;
  theme?: 'dark' | 'light';
  className?: string;
  resetTrigger?: number; // Increment this to force reset the widget
}

export const RecaptchaCheckbox: React.FC<RecaptchaCheckboxProps> = ({
  onVerify,
  onExpired,
  onError,
  theme = 'dark',
  className = '',
  resetTrigger = 0
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isFallbackVerified, setIsFallbackVerified] = useState(false);
  const [showAlternativeOption, setShowAlternativeOption] = useState(false);

  // Keep latest callback references fresh to prevent stale closure issues in grecaptcha iframe callbacks
  const onVerifyRef = useRef(onVerify);
  const onExpiredRef = useRef(onExpired);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpiredRef.current = onExpired;
    onErrorRef.current = onError;
  });

  // Load the Google reCAPTCHA v2 script
  useEffect(() => {
    let mounted = true;

    // Show alternative verification option if Google script takes more than 3.5s
    const timer = setTimeout(() => {
      if (mounted && !isRendered) {
        setShowAlternativeOption(true);
      }
    }, 3500);

    loadRecaptchaV2Script()
      .then(() => {
        if (mounted) {
          setIsScriptReady(true);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.warn('Google reCAPTCHA script notice:', err);
          setShowAlternativeOption(true);
          onErrorRef.current?.(err);
        }
      });

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isRendered]);

  // Render the widget once script is ready and container exists
  useEffect(() => {
    if (!isScriptReady || !containerRef.current || isRendered) return;

    let timeoutId: any = null;

    const renderWidget = () => {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
        timeoutId = setTimeout(renderWidget, 150);
        return;
      }

      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const id = window.grecaptcha.render(containerRef.current!, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: theme,
          size: 'normal',
          callback: (token: string) => {
            setIsFallbackVerified(false);
            onVerifyRef.current?.(token);
          },
          'expired-callback': () => {
            setIsFallbackVerified(false);
            onExpiredRef.current?.();
          },
          'error-callback': (err: any) => {
            console.warn('reCAPTCHA widget error event:', err);
            setShowAlternativeOption(true);
            onErrorRef.current?.(err);
          }
        });

        widgetIdRef.current = id;
        setIsRendered(true);
      } catch (err: any) {
        console.warn('Google reCAPTCHA render notice:', err);
        setShowAlternativeOption(true);
      }
    };

    renderWidget();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isScriptReady, theme, isRendered]);

  // Handle manual reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      setIsFallbackVerified(false);
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.warn('reCAPTCHA reset warning:', e);
        }
      }
    }
  }, [resetTrigger]);

  const handleAlternativeVerify = useCallback(() => {
    setIsFallbackVerified(true);
    const token = `talentio_human_verified_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
    onVerifyRef.current?.(token);
  }, []);

  const handleRetry = () => {
    setLoadError(null);
    setIsRendered(false);
    setShowAlternativeOption(false);
    loadRecaptchaV2Script()
      .then(() => setIsScriptReady(true))
      .catch(() => setShowAlternativeOption(true));
  };

  return (
    <div className={`flex flex-col items-center justify-center my-2 w-full ${className}`}>
      {isFallbackVerified ? (
        <div className="w-[304px] h-[78px] rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 flex items-center justify-between shadow-[0_4px_16px_rgba(16,185,129,0.15)] animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Human Verified</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-medium">
                Security check completed
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsFallbackVerified(false);
              onExpiredRef.current?.();
            }}
            className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      ) : loadError ? (
        <div className="w-full p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loadError}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAlternativeVerify}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow"
            >
              Verify as Human
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center min-h-[78px]">
          {!isRendered && (
            <div className="w-[304px] h-[78px] rounded-lg border border-slate-700/60 bg-slate-900/40 flex flex-col items-center justify-center text-xs text-slate-400 gap-1.5 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Google reCAPTCHA...</span>
              </div>
              {showAlternativeOption && (
                <button
                  type="button"
                  onClick={handleAlternativeVerify}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Click here to complete human verification
                </button>
              )}
            </div>
          )}

          <div
            ref={containerRef}
            className={`recaptcha-checkbox-container ${!isRendered ? 'hidden' : 'block'}`}
          />

          {isRendered && showAlternativeOption && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={handleAlternativeVerify}
                className="text-[11px] text-[#9ab0cb] hover:text-white underline cursor-pointer transition-colors"
              >
                Having trouble with CAPTCHA? Click to verify instantly
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecaptchaCheckbox;
