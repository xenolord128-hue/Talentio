import React, { useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGuide();

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 flex flex-col gap-2 max-w-[calc(100vw-24px)] sm:max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl text-white border shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-md ${
              isError
                ? 'bg-rose-950/95 border-rose-500/40 text-rose-100 shadow-rose-900/30'
                : isWarning
                  ? 'bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-900/30'
                  : isInfo
                    ? 'bg-[#1A1633]/95 border-[#A38BFF]/40 text-slate-100 shadow-[#3D2FD1]/30'
                    : 'bg-[#120F24]/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/30'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : isInfo ? (
                <Info className="w-4 h-4 text-[#A38BFF] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <p className="text-xs font-semibold leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
