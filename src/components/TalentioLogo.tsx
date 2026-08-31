import React, { useState } from 'react';

export const TALENTIO_LOGO_URL = 'https://i.ibb.co.com/4hfRh4X/New-Project-5-9848897.png';

interface TalentioLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: string;
  withText?: boolean;
  withBadge?: boolean;
  badgeText?: string;
  variant?: 'dark' | 'gradient' | 'black' | 'transparent';
  animated?: boolean;
}

export const TalentioLogo: React.FC<TalentioLogoProps> = ({
  className = '',
  size = 'md',
  customSize,
  withText = false,
  withBadge = false,
  badgeText = 'ESCROW',
  variant = 'gradient',
  animated = false
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    custom: customSize || 'w-10 h-10'
  };

  const getContainerBg = () => {
    switch (variant) {
      case 'black':
        return 'bg-black border border-white/15';
      case 'dark':
        return 'bg-[#1A1633] border border-[#6E5BFF]/30';
      case 'transparent':
        return 'bg-transparent';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] p-[2px] shadow-md shadow-[#3D2FD1]/30';
    }
  };

  const iconElement = (
    <div 
      className={`relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${sizeClasses[size]} ${getContainerBg()} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
    >
      <div className={`w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden ${variant === 'gradient' ? 'bg-[#000000]' : ''}`}>
        {!imgError ? (
          <img
            src={TALENTIO_LOGO_URL}
            alt="Talentio Logo"
            className="w-full h-full object-contain p-0.5"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg 
            viewBox="0 0 500 500" 
            className="w-full h-full p-1"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Network Connecting Lines */}
            <g stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
              <line x1="160" y1="115" x2="193" y2="195" />
              <line x1="193" y1="195" x2="272" y2="175" />
              <line x1="193" y1="195" x2="102" y2="250" />
              <line x1="193" y1="195" x2="212" y2="285" />
              <line x1="102" y1="250" x2="212" y2="285" />
              <line x1="102" y1="250" x2="156" y2="385" />
              <line x1="212" y1="285" x2="156" y2="385" />
              <line x1="212" y1="285" x2="277" y2="326" />
              <line x1="156" y1="385" x2="332" y2="382" />
              <line x1="277" y1="326" x2="332" y2="382" strokeWidth="15" />
              <line x1="277" y1="326" x2="338" y2="335" strokeWidth="13" />
            </g>

            {/* Letter T Solid Shape */}
            <path 
              d="M 188 102 L 420 102 L 420 160 L 338 160 L 338 335 L 272 335 L 272 160 L 188 160 Z" 
              fill="#FFFFFF" 
            />

            {/* Constellation Nodes */}
            <g fill="#FFFFFF">
              <circle cx="160" cy="115" r="26" />
              <circle cx="193" cy="195" r="20" />
              <circle cx="102" cy="250" r="22" />
              <circle cx="212" cy="285" r="21" />
              <circle cx="156" cy="385" r="22" />
              <circle cx="277" cy="326" r="20" />
              <circle cx="332" cy="382" r="28" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );

  if (!withText) {
    return <div className={`inline-flex items-center ${className}`}>{iconElement}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
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
