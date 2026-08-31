import React from 'react';
import { DeviceAvailability, DifficultyLevel } from '../types';
import { CheckCircle2, AlertTriangle, Monitor, AlertCircle, Sparkles } from 'lucide-react';

interface DeviceBadgeProps {
  status: DeviceAvailability;
  showText?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const DeviceBadge: React.FC<DeviceBadgeProps> = ({ 
  status, 
  showText = true, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 12 : 14;

  switch (status) {
    case 'available':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 ${sizeClasses} ${className}`}
          title="Available smoothly on Mobile, Tablet, and Desktop"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <CheckCircle2 size={iconSize} className="text-emerald-600 dark:text-emerald-400" />
          {showText && <span>Available Everywhere</span>}
        </span>
      );
    case 'limited':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 ${sizeClasses} ${className}`}
          title="Limited functionality or compressed formatting on mobile"
        >
          <AlertTriangle size={iconSize} className="text-amber-600 dark:text-amber-400" />
          {showText && <span>Limited on Mobile</span>}
        </span>
      );
    case 'desktop_recommended':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 ${sizeClasses} ${className}`}
          title="Can be viewed on mobile, but Desktop is vastly superior"
        >
          <Monitor size={iconSize} className="text-blue-600 dark:text-blue-400" />
          {showText && <span>Desktop Recommended</span>}
        </span>
      );
    case 'desktop_required':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 ${sizeClasses} ${className}`}
          title="Cannot be performed in standard mobile app; strictly requires Desktop"
        >
          <AlertCircle size={iconSize} className="text-rose-600 dark:text-rose-400" />
          {showText && <span>Desktop Required</span>}
        </span>
      );
    default:
      return null;
  }
};

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  switch (difficulty) {
    case 'beginner':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 ${className}`}>
          <Sparkles size={11} />
          Beginner
        </span>
      );
    case 'intermediate':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 ${className}`}>
          Intermediate
        </span>
      );
    case 'advanced':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 ${className}`}>
          Advanced
        </span>
      );
    default:
      return null;
  }
};
