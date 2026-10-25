import React from 'react';

/**
 * OFFICIAL PERMANENT TALENTIO BRAND LOGO
 * Source provided by User: https://i.ibb.co.com/twGnD56G/New-Project-5-9848897.png
 * Features the solid black background with constellation nodes, 'T' geometry,
 * rendered permanently across the website, mobile PWA, home screen, and web app.
 */
export const TALENTIO_LOGO = 'https://i.ibb.co.com/twGnD56G/New-Project-5-9848897.png';
export const TALENTIO_LOGO_LOCAL = '/assets/talentio-logo.png';
export const TALENTIO_LOGO_URL = 'https://i.ibb.co.com/twGnD56G/New-Project-5-9848897.png';
export const TALENTIO_IBB_LINK = 'https://ibb.co.com/1YgBTxNg';

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
  animated = false
}) => {
  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    custom: customSize || 'w-10 h-10'
  };

  const iconElement = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm ${sizeClasses[size]}`}
      style={{ aspectRatio: '1/1' }}
    >
      <img
        src={TALENTIO_LOGO}
        alt="Talentio Logo"
        className={`talentio-logo w-full h-full object-cover select-none ${
          animated ? 'transition-transform duration-300 hover:scale-105 cursor-pointer' : ''
        }`}
        draggable="false"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback to local copy if remote CDN has network issues
          const target = e.currentTarget;
          if (target.src !== window.location.origin + TALENTIO_LOGO_LOCAL) {
            target.src = TALENTIO_LOGO_LOCAL;
          }
        }}
      />
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
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#3A5A86] text-[#E3EDF9] border border-[#E3EDF9]/30 tracking-wider">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentioLogo;
