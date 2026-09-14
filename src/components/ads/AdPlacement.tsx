import React from 'react';
import { AdPlacementLocation, AdSpacing } from '../../types';
import { useAds } from '../../context/AdContext';
import { AdRenderer } from './AdRenderer';

interface AdPlacementProps {
  placement: AdPlacementLocation;
  className?: string;
  maxAds?: number;
  spacingOverride?: AdSpacing;
  showLabel?: boolean;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  placement,
  className = '',
  maxAds = 1,
  spacingOverride,
  showLabel = true
}) => {
  const { getAdsForPlacement, globalAdsEnabled } = useAds();

  if (!globalAdsEnabled) {
    return null;
  }

  const matchingAds = getAdsForPlacement(placement);

  if (!matchingAds || matchingAds.length === 0) {
    return null;
  }

  const adsToDisplay = matchingAds.slice(0, maxAds);

  return (
    <div 
      className={`talentio-ad-placement-zone w-full flex flex-col items-center justify-center ${className}`}
      data-placement-zone={placement}
    >
      {adsToDisplay.map((ad) => {
        const spacing = spacingOverride || ad.spacing || 'standard';

        let spacingClasses = '';
        if (ad.format !== 'script') {
          switch (spacing) {
            case 'compact':
              spacingClasses = 'my-2 sm:my-3';
              break;
            case 'standard':
              spacingClasses = 'my-4 sm:my-6';
              break;
            case 'relaxed':
              spacingClasses = 'my-6 sm:my-10';
              break;
            case 'none':
            default:
              spacingClasses = 'my-0';
              break;
          }
        }

        return (
          <div 
            key={ad.id} 
            className={`w-full flex justify-center ${spacingClasses}`}
          >
            <AdRenderer ad={ad} showLabel={showLabel && ad.format !== 'script'} />
          </div>
        );
      })}
    </div>
  );
};
