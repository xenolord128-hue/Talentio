import React, { useEffect, useRef, useState } from 'react';
import { loadRecaptchaV2Script, RECAPTCHA_SITE_KEY } from '../lib/recaptcha';
import { AlertCircle, RefreshCw } from 'lucide-react';

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

  // Load the Google reCAPTCHA v2 script
  useEffect(() => {
    let mounted = true;

    loadRecaptchaV2Script()
      .then(() => {
        if (mounted) {
          setIsScriptReady(true);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.warn('Failed to load Google reCAPTCHA script:', err);
          setLoadError('Failed to load verification service. Please check your internet connection.');
          onError?.(err);
        }
      });

    return () => {
      mounted = false;
    };
  }, [onError]);

  // Render the widget once script is ready and container exists
  useEffect(() => {
    if (!isScriptReady || !containerRef.current || isRendered) return;

    const renderWidget = () => {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
        setTimeout(renderWidget, 150);
        return;
      }

      try {
        // Clear any previous child elements in container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const id = window.grecaptcha.render(containerRef.current!, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: theme,
          size: 'normal',
          callback: (token: string) => {
            onVerify(token);
          },
          'expired-callback': () => {
            onExpired?.();
          },
          'error-callback': (err: any) => {
            onError?.(err);
          }
        });

        widgetIdRef.current = id;
        setIsRendered(true);
      } catch (err: any) {
        console.warn('Google reCAPTCHA render warning:', err);
      }
    };

    renderWidget();
  }, [isScriptReady, theme, onVerify, onExpired, onError, isRendered]);

  // Handle manual reset trigger
  useEffect(() => {
    if (resetTrigger > 0 && widgetIdRef.current !== null && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (e) {
        console.warn('reCAPTCHA reset warning:', e);
      }
    }
  }, [resetTrigger]);

  const handleRetry = () => {
    setLoadError(null);
    setIsRendered(false);
    loadRecaptchaV2Script()
      .then(() => setIsScriptReady(true))
      .catch(() => setLoadError('Could not load reCAPTCHA. Please check your network.'));
  };

  return (
    <div className={`flex flex-col items-center justify-center my-3 ${className}`}>
      {loadError ? (
        <div className="w-full p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center min-h-[78px]">
          {!isRendered && (
            <div className="w-[304px] h-[78px] rounded-lg border border-slate-700/60 bg-slate-900/40 flex items-center justify-center text-xs text-slate-400 gap-2 animate-pulse">
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading Google reCAPTCHA...</span>
            </div>
          )}
          <div
            ref={containerRef}
            className={`recaptcha-checkbox-container ${!isRendered ? 'hidden' : 'block'}`}
          />
        </div>
      )}
    </div>
  );
};

export default RecaptchaCheckbox;
