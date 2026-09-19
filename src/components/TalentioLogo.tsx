import React, { useState } from 'react';

/**
 * OFFICIAL TALENTIO BRAND LOGO
 * Official Source: https://i.ibb.co.com/twGnD56G/New-Project-5-9848897.png
 * Local Reliable Path: /assets/talentio-logo.png
 */
export const TALENTIO_LOGO = 'https://i.ibb.co.com/twGnD56G/New-Project-5-9848897.png';
export const TALENTIO_LOGO_LOCAL = '/assets/talentio-logo.png';
export const TALENTIO_LOGO_URL = TALENTIO_LOGO;

export interface TalentioLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: string;
  withText?: boolean;
  withBadge?: boolean;
  badgeText?: string;
  variant?: 'dark' | 'gradient' | 'black' | 'transparent' | 'white';
  animated?: boolean;
}

export const TalentioLogo: React.FC<TalentioLogoProps> = ({
  className = '',
  size = 'md',
  customSize,
  withText = false,
  withBadge = false,
  badgeText = 'ESCROW',
  variant = 'transparent',
  animated = false
}) => {
  const [useFallback, setUseFallback] = useState(false);

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    custom: customSize || 'w-10 h-10'
  };

  const getContainerBg = () => {
    switch (variant) {
      case 'black':
        return 'bg-black/80 border border-white/10 shadow-sm';
      case 'dark':
        return 'bg-[#1A1633] border border-[#6E5BFF]/30 shadow-sm';
      case 'gradient':
        return 'bg-gradient-to-br from-[#3D2FD1]/30 via-[#6E5BFF]/20 to-[#A38BFF]/20 border border-[#A38BFF]/30 shadow-md shadow-[#3D2FD1]/20';
      case 'white':
        return 'bg-white/10 border border-white/15';
      case 'transparent':
      default:
        return 'bg-transparent';
    }
  };

  const logoImg = (
    <img
      src={useFallback ? TALENTIO_LOGO : TALENTIO_LOGO_LOCAL}
      alt="Talentio Logo"
      className={`talentio-logo object-contain ${animated ? 'transition-transform duration-300 hover:scale-105' : ''}`}
      draggable="false"
      referrerPolicy="no-referrer"
      onError={() => {
        if (!useFallback) {
          setUseFallback(true);
        }
      }}
    />
  );

  // If size is given and not an unrestricted standalone image, enclose neatly in responsive aspect box
  const iconElement = (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden p-1 ${sizeClasses[size]} ${getContainerBg()}`}
    >
      {logoImg}
    </div>
  );

  if (!withText) {
    return <div className={`inline-flex items-center shrink-0 ${className}`}>{iconElement}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {iconElement}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg font-black tracking-tight text-white font-display">TALENTIO</span>
          {withBadge && (
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#3D2FD1] text-[#F2F0FF] border border-[#A38BFF]/30 tracking-wider">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentioLogo;
