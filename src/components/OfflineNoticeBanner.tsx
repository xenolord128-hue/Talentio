import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineNoticeBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setWasOffline(true);
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !wasOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2 transition-all duration-300 pointer-events-none">
      {isOffline ? (
        <div className="pointer-events-auto bg-amber-500/95 backdrop-blur-md text-slate-950 font-medium text-xs px-4 py-2 rounded-full shadow-lg border border-amber-400 flex items-center gap-2 animate-bounce">
          <WifiOff className="w-3.5 h-3.5 text-slate-950" />
          <span>You are currently offline. Cached content and app shell remain available.</span>
        </div>
      ) : wasOffline ? (
        <div className="pointer-events-auto bg-emerald-600/95 backdrop-blur-md text-white font-medium text-xs px-4 py-2 rounded-full shadow-lg border border-emerald-400 flex items-center gap-2 animate-fade-in">
          <Wifi className="w-3.5 h-3.5 text-white" />
          <span>Connection restored. Syncing live data...</span>
        </div>
      ) : null}
    </div>
  );
};
