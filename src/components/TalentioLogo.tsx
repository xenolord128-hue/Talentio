import React from 'react';

/**
 * OFFICIAL PERMANENT TALENTIO BRAND LOGO
 * Source provided by User: https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg
 * Link: https://ibb.co.com/qL4p0XjC
 */
export const TALENTIO_LOGO = 'https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg';
export const TALENTIO_LOGO_URL = 'https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg';
export const TALENTIO_LOGO_LOCAL = '/assets/talentio-logo.png';
export const TALENTIO_IBB_LINK = 'https://ibb.co.com/qL4p0XjC';

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

export const TalentioLogo: React.FC<TalentioLogoProps> = () => {
  return (
    <a href="https://ibb.co.com/qL4p0XjC">
      <img 
        src="https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg" 
        alt="Picsart-26-11-06-08-52-47-568" 
        border="0"
      />
    </a>
  );
};

export default TalentioLogo;
