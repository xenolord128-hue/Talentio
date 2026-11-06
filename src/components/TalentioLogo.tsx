import React from 'react';
import { useGuide } from '../context/GuideContext';

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
  onClick?: (e: React.MouseEvent) => void;
}

export const TalentioLogo: React.FC<TalentioLogoProps> = ({ onClick }) => {
  const guide = useGuide();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (guide?.setActivePage) {
      guide.setActivePage('brand-story');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a href="https://ibb.co.com/qL4p0XjC" onClick={handleClick}>
      <img 
        src="https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg" 
        alt="Picsart-26-11-06-08-52-47-568" 
        border="0"
      />
    </a>
  );
};

export default TalentioLogo;
