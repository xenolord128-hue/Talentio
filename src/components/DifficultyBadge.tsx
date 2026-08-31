import React from 'react';
import { DifficultyLevel } from '../types';
import { Sparkles, Zap, Flame } from 'lucide-react';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ 
  difficulty, 
  className = '',
  size = 'md' 
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  switch (difficulty) {
    case 'beginner':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 ${sizeClass} ${className}`}>
          <Sparkles size={size === 'sm' ? 10 : 12} className="text-emerald-500" />
          Beginner
        </span>
      );
    case 'intermediate':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 ${sizeClass} ${className}`}>
          <Zap size={size === 'sm' ? 10 : 12} className="text-indigo-500" />
          Intermediate
        </span>
      );
    case 'advanced':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 ${sizeClass} ${className}`}>
          <Flame size={size === 'sm' ? 10 : 12} className="text-purple-500" />
          Advanced
        </span>
      );
    default:
      return null;
  }
};
