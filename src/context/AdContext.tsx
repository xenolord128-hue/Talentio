import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Advertisement, AdSettings, AdPlacementLocation, AdDeviceTarget } from '../types';
import { 
  getLocalCachedAds, 
  getLocalCachedSettings, 
  subscribeToAdvertisements, 
  subscribeToAdSettings, 
  saveAdvertisementToFirestore, 
  deleteAdvertisementFromFirestore, 
  saveAdSettingsToFirestore,
  seedDefaultAdsToFirestore 
} from '../lib/adFirestore';
import { INITIAL_ADSTERRA_ADS, SENSITIVE_PRIVATE_PAGES } from '../data/defaultAds';
import { useGuide } from './GuideContext';

interface AdContextType {
  ads: Advertisement[];
  globalAdsEnabled: boolean;
  loading: boolean;
  toggleAd: (adId: string, enabled?: boolean) => Promise<void>;
  saveAd: (ad: Advertisement) => Promise<void>;
  deleteAd: (adId: string) => Promise<void>;
  duplicateAd: (adId: string) => Promise<void>;
  setGlobalAdsEnabled: (enabled: boolean) => Promise<void>;
  resetToDefaultAds: () => Promise<void>;
  getAdsForPlacement: (
    placement: AdPlacementLocation, 
    page?: string, 
    forcedDevice?: 'desktop' | 'tablet' | 'mobile'
  ) => Advertisement[];
  currentDevice: 'desktop' | 'tablet' | 'mobile';
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePage } = useGuide();
  const [ads, setAds] = useState<Advertisement[]>(getLocalCachedAds());
  const [settings, setSettings] = useState<AdSettings>(getLocalCachedSettings());
  const [loading, setLoading] = useState<boolean>(true);

  // Responsive device tracking
  const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentDevice('mobile');
      } else if (width < 1024) {
        setCurrentDevice('tablet');
      } else {
        setCurrentDevice('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Subscribe to real-time advertisements and global settings from Firestore
  useEffect(() => {
    let isMounted = true;

    // Seed defaults in background if first run
    seedDefaultAdsToFirestore(false).catch(() => {});

    const unsubscribeAds = subscribeToAdvertisements((incomingAds) => {
      if (!isMounted) return;
      if (incomingAds && incomingAds.length > 0) {
        setAds(incomingAds);
      }
      setLoading(false);
    });

    const unsubscribeSettings = subscribeToAdSettings((incomingSettings) => {
      if (!isMounted) return;
      if (incomingSettings) {
        setSettings(incomingSettings);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAds();
      unsubscribeSettings();
    };
  }, []);

  // Save/Update an ad
  const saveAd = useCallback(async (ad: Advertisement) => {
    // Optimistic local state update
    setAds(prev => {
      const idx = prev.findIndex(a => a.id === ad.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ad;
        return next;
      }
      return [...prev, ad];
    });

    await saveAdvertisementToFirestore(ad);
  }, []);

  // Toggle single ad enabled/disabled
  const toggleAd = useCallback(async (adId: string, forcedState?: boolean) => {
    const target = ads.find(a => a.id === adId);
    if (!target) return;
    const newState = forcedState !== undefined ? forcedState : !target.enabled;
    const updatedAd: Advertisement = {
      ...target,
      enabled: newState,
      updatedAt: new Date().toISOString()
    };
    await saveAd(updatedAd);
  }, [ads, saveAd]);

  // Delete an ad
  const deleteAd = useCallback(async (adId: string) => {
    setAds(prev => prev.filter(a => a.id !== adId));
    await deleteAdvertisementFromFirestore(adId);
  }, []);

  // Duplicate an ad
  const duplicateAd = useCallback(async (adId: string) => {
    const original = ads.find(a => a.id === adId);
    if (!original) return;

    const cloned: Advertisement = {
      ...original,
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${original.name} (Copy)`,
      enabled: false, // Start duplicate as disabled for safety
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveAd(cloned);
  }, [ads, saveAd]);

  // Master Global toggle
  const setGlobalAdsEnabled = useCallback(async (enabled: boolean) => {
    const nextSettings: AdSettings = {
      ...settings,
      globalAdsEnabled: enabled,
      updatedAt: new Date().toISOString()
    };
    setSettings(nextSettings);
    await saveAdSettingsToFirestore(nextSettings);
  }, [settings]);

  // Restore factory Adsterra configuration
  const resetToDefaultAds = useCallback(async () => {
    setAds(INITIAL_ADSTERRA_ADS);
    await seedDefaultAdsToFirestore(true);
  }, []);

  // Filter ads for a specific placement, page, and device
  const getAdsForPlacement = useCallback((
    placement: AdPlacementLocation, 
    page?: string, 
    forcedDevice?: 'desktop' | 'tablet' | 'mobile'
  ): Advertisement[] => {
    if (!settings.globalAdsEnabled) {
      return [];
    }

    const checkPage = (page || activePage || 'home').toLowerCase();
    const checkDevice = forcedDevice || currentDevice;

    // Check if current page is private/sensitive
    const isPrivatePage = SENSITIVE_PRIVATE_PAGES.some(p => checkPage.includes(p));

    return ads
      .filter(ad => {
        // 0. Eradicate any popup or intrusive push script tag
        if (ad.id === 'ad-1-adsterra-script' || ad.format === 'script') return false;
        if (ad.code && ad.code.includes('1822920cd10687d189b60424e04ba451')) return false;

        // 1. Must be enabled
        if (!ad.enabled) return false;

        // 2. Placement must match
        if (ad.placement !== placement) return false;

        // 3. Sensitive page boundary enforcement
        if (isPrivatePage && !ad.allowOnPrivatePages) {
          return false;
        }

        // 4. Page targeting check
        if (ad.targetPages && ad.targetPages.length > 0) {
          const isTargeted = ad.targetPages.some(tp => {
            if (tp === 'all') return true;
            // Match main route aliases (e.g., 'services' vs 'marketplace', 'freelancers' vs 'talent')
            if (tp === 'home' && (checkPage === 'home' || checkPage === 'explore')) return true;
            if (tp === 'services' && (checkPage === 'services' || checkPage === 'marketplace' || checkPage === 'catalog')) return true;
            if (tp === 'freelancers' && (checkPage === 'freelancers' || checkPage === 'talent')) return true;
            if (tp === 'jobs' && checkPage === 'jobs') return true;
            return checkPage.includes(tp);
          });
          if (!isTargeted) return false;
        }

        // 5. Device target check
        if (ad.devices !== 'all') {
          if (ad.devices === 'desktop' && checkDevice !== 'desktop') return false;
          if (ad.devices === 'mobile' && checkDevice !== 'mobile') return false;
          if (ad.devices === 'tablet' && checkDevice === 'mobile') return false;
        }

        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [ads, settings.globalAdsEnabled, activePage, currentDevice]);

  const value = useMemo(() => ({
    ads,
    globalAdsEnabled: settings.globalAdsEnabled,
    loading,
    toggleAd,
    saveAd,
    deleteAd,
    duplicateAd,
    setGlobalAdsEnabled,
    resetToDefaultAds,
    getAdsForPlacement,
    currentDevice
  }), [
    ads, 
    settings.globalAdsEnabled, 
    loading, 
    toggleAd, 
    saveAd, 
    deleteAd, 
    duplicateAd, 
    setGlobalAdsEnabled, 
    resetToDefaultAds, 
    getAdsForPlacement, 
    currentDevice
  ]);

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = (): AdContextType => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
