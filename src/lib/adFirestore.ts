import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Advertisement, AdSettings } from '../types';
import { INITIAL_ADSTERRA_ADS, DEFAULT_AD_SETTINGS } from '../data/defaultAds';
import { handleFirestoreError, OperationType } from './firestore';

const ADS_COLLECTION = 'advertisements';
const SETTINGS_DOC = 'advertisements'; // stored in platform_settings/advertisements
const LOCAL_STORAGE_ADS_KEY = 'talentio_ads_cache_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'talentio_ad_settings_cache_v1';

/**
 * Filter out intrusive popup / direct-link / social bar script tags
 */
export function sanitizeAndFilterAds(ads: Advertisement[]): Advertisement[] {
  if (!Array.isArray(ads)) return [];
  return ads.filter(ad => {
    if (!ad) return false;
    if (ad.id === 'ad-1-adsterra-script') return false;
    if (ad.format === 'script') return false;
    if (ad.width === 1 && ad.height === 1) return false;
    if (ad.code && (
      ad.code.includes('1822920cd10687d189b60424e04ba451') ||
      ad.code.includes('profitableratecpmnetwork.com/18/22/92')
    )) {
      return false;
    }
    return true;
  });
}

/**
 * Load cached ads from LocalStorage for instantaneous initial render
 */
export function getLocalCachedAds(): Advertisement[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ADS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = sanitizeAndFilterAds(parsed);
        setLocalCachedAds(clean);
        return clean;
      }
    }
  } catch {
    // Ignore local parse errors
  }
  return INITIAL_ADSTERRA_ADS;
}

/**
 * Save ads to LocalStorage cache
 */
export function setLocalCachedAds(ads: Advertisement[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ADS_KEY, JSON.stringify(ads));
  } catch {
    // Ignore local write errors
  }
}

/**
 * Load cached ad settings from LocalStorage
 */
export function getLocalCachedSettings(): AdSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore
  }
  return DEFAULT_AD_SETTINGS;
}

export function setLocalCachedSettings(settings: AdSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

/**
 * Fetch all advertisements from Firestore (falling back to local cache/defaults)
 */
export async function fetchAdvertisementsFromFirestore(): Promise<Advertisement[]> {
  try {
    // Delete legacy popup ad from Firestore if present
    try {
      await deleteDoc(doc(db, ADS_COLLECTION, 'ad-1-adsterra-script'));
    } catch {}

    const snapshot = await getDocs(collection(db, ADS_COLLECTION));
    if (snapshot.empty) {
      return getLocalCachedAds();
    }
    const rawAds: Advertisement[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Advertisement));
    const ads = sanitizeAndFilterAds(rawAds);
    setLocalCachedAds(ads);
    return ads;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ADS_COLLECTION);
    return getLocalCachedAds();
  }
}

/**
 * Real-time subscription to advertisements collection
 */
export function subscribeToAdvertisements(
  callback: (ads: Advertisement[]) => void,
  onError?: (error: unknown) => void
) {
  try {
    return onSnapshot(
      collection(db, ADS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const rawAds: Advertisement[] = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          } as Advertisement));
          const ads = sanitizeAndFilterAds(rawAds);
          setLocalCachedAds(ads);
          callback(ads);
        } else {
          // If Firestore collection is empty, trigger seed or return defaults
          callback(getLocalCachedAds());
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, ADS_COLLECTION);
        if (onError) onError(error);
        callback(getLocalCachedAds());
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ADS_COLLECTION);
    callback(getLocalCachedAds());
    return () => {};
  }
}

/**
 * Save (create or update) an advertisement
 */
export async function saveAdvertisementToFirestore(ad: Advertisement): Promise<void> {
  const path = `${ADS_COLLECTION}/${ad.id}`;
  try {
    const ref = doc(db, ADS_COLLECTION, ad.id);
    const payload = {
      ...ad,
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, {
      ...payload,
      _serverTimestamp: serverTimestamp()
    }, { merge: true });

    // Update local cache
    const current = getLocalCachedAds();
    const index = current.findIndex(a => a.id === ad.id);
    const updated = index >= 0 
      ? current.map(a => a.id === ad.id ? payload : a)
      : [...current, payload];
    setLocalCachedAds(updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    // Even if Firestore fails (e.g., permission or offline), persist in local cache for immediate feedback
    const current = getLocalCachedAds();
    const index = current.findIndex(a => a.id === ad.id);
    const updated = index >= 0 
      ? current.map(a => a.id === ad.id ? ad : a)
      : [...current, ad];
    setLocalCachedAds(updated);
    throw error;
  }
}

/**
 * Delete an advertisement
 */
export async function deleteAdvertisementFromFirestore(adId: string): Promise<void> {
  const path = `${ADS_COLLECTION}/${adId}`;
  try {
    const ref = doc(db, ADS_COLLECTION, adId);
    await deleteDoc(ref);

    // Update local cache
    const current = getLocalCachedAds();
    const updated = current.filter(a => a.id !== adId);
    setLocalCachedAds(updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    const current = getLocalCachedAds();
    const updated = current.filter(a => a.id !== adId);
    setLocalCachedAds(updated);
    throw error;
  }
}

/**
 * Subscribe to global ad settings
 */
export function subscribeToAdSettings(
  callback: (settings: AdSettings) => void
) {
  const path = `platform_settings/${SETTINGS_DOC}`;
  try {
    return onSnapshot(
      doc(db, 'platform_settings', SETTINGS_DOC),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AdSettings;
          setLocalCachedSettings(data);
          callback(data);
        } else {
          callback(getLocalCachedSettings());
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        callback(getLocalCachedSettings());
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    callback(getLocalCachedSettings());
    return () => {};
  }
}

/**
 * Update global ad settings
 */
export async function saveAdSettingsToFirestore(settings: AdSettings): Promise<void> {
  const path = `platform_settings/${SETTINGS_DOC}`;
  try {
    const ref = doc(db, 'platform_settings', SETTINGS_DOC);
    await setDoc(ref, {
      ...settings,
      updatedAt: new Date().toISOString(),
      _serverTimestamp: serverTimestamp()
    }, { merge: true });
    setLocalCachedSettings(settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    setLocalCachedSettings(settings);
    throw error;
  }
}

/**
 * Seed initial 6 Adsterra advertisements into Firestore if empty
 */
export async function seedDefaultAdsToFirestore(force = false): Promise<void> {
  try {
    // Delete any legacy popup script ad
    try {
      await deleteDoc(doc(db, ADS_COLLECTION, 'ad-1-adsterra-script'));
    } catch {}

    if (typeof document !== 'undefined') {
      document.querySelectorAll('script[src*="profitableratecpmnetwork.com/18/22/92"], script[src*="1822920cd10687d189b60424e04ba451"], [id*="talentio-ad-script"]').forEach(el => el.remove());
    }

    const snapshot = await getDocs(collection(db, ADS_COLLECTION));
    if (snapshot.empty || force) {
      for (const ad of INITIAL_ADSTERRA_ADS) {
        const ref = doc(db, ADS_COLLECTION, ad.id);
        await setDoc(ref, {
          ...ad,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _serverTimestamp: serverTimestamp()
        }, { merge: true });
      }
      setLocalCachedAds(INITIAL_ADSTERRA_ADS);
      await saveAdSettingsToFirestore(DEFAULT_AD_SETTINGS);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, ADS_COLLECTION);
    // If permission or network prevents seeding, keep defaults locally
    setLocalCachedAds(INITIAL_ADSTERRA_ADS);
  }
}
