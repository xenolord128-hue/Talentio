import React from 'react';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipText?: string;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'sm',
  showTooltip = true,
  tooltipText = 'Talentio Verified Specialist (Admin Audited)',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 text-[8px]',
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[11px]',
    lg: 'w-6 h-6 text-xs'
  };

  const iconSizes = {
    xs: 'w-2 h-2 stroke-[3.5]',
    sm: 'w-2.5 h-2.5 stroke-[3]',
    md: 'w-3 h-3 stroke-[3]',
    lg: 'w-3.5 h-3.5 stroke-[3]'
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full bg-gradient-to-tr from-[#3D2FD1] to-[#6E5BFF] text-white shadow-xs select-none ${sizeClasses[size]} ${className}`}
      title={showTooltip ? tooltipText : undefined}
      aria-label="Verified Freelancer"
    >
      <Check className={`${iconSizes[size]} text-white`} />
    </span>
  );
};
