import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Server, 
  Database, 
  ShieldCheck, 
  CreditCard, 
  HardDrive, 
  Bell 
} from 'lucide-react';
import { SystemServiceStatus } from './types';
import { DEFAULT_SYSTEM_SERVICES } from './mockWidgetData';

interface SystemStatusWidgetProps {
  title?: string;
  subtitle?: string;
  services?: SystemServiceStatus[];
  className?: string;
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({
  title = 'System & Escrow Infrastructure',
  subtitle = 'Continuous health monitoring and SLA verification',
  services = DEFAULT_SYSTEM_SERVICES,
  className = '',
}) => {
  const allOperational = services.every((s) => s.status === 'operational');

  const getServiceIcon = (key: SystemServiceStatus['key']) => {
    switch (key) {
      case 'api':
        return <Server className="w-4 h-4 text-[#3D2FD1]" />;
      case 'database':
        return <Database className="w-4 h-4 text-[#6E5BFF]" />;
      case 'auth':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'payments':
        return <CreditCard className="w-4 h-4 text-[#A38BFF]" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-sky-600" />;
      case 'notifications':
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: SystemServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Degraded
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Outage
          </span>
        );
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1A1633] font-display">
                {title}
              </h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>

          {/* Overall Health Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{allOperational ? 'All Systems 100%' : 'Degraded'}</span>
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((svc) => (
            <div
              key={svc.key}
              className="p-3.5 rounded-2xl bg-white/70 border border-[#A38BFF]/20 flex items-center justify-between gap-3 hover:border-[#A38BFF]/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#F2F0FF] flex items-center justify-center shrink-0">
                  {getServiceIcon(svc.key)}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-[#1A1633] block truncate">
                    {svc.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    {svc.latencyMs && <span>{svc.latencyMs}ms</span>}
                    {svc.uptime && (
                      <>
                        <span>•</span>
                        <span>{svc.uptime} uptime</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>{getStatusBadge(svc.status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-[#A38BFF]/20 flex items-center justify-between text-xs text-slate-500">
        <span>Global Edge Node: Frankfurt & Singapore</span>
        <span className="font-mono font-bold text-[#3D2FD1]">99.99% Guaranteed SLA</span>
      </div>
    </div>
  );
};
