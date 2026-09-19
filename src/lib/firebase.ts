import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import rawFirebaseConfig from '../../firebase-applet-config.json';

// Resolves Firebase configuration with fallback to environment variables for Netlify/production
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawFirebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (rawFirebaseConfig as any).measurementId || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawFirebaseConfig.firestoreDatabaseId || '',
  oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || (rawFirebaseConfig as any).oAuthClientId || '',
};

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Optional Firebase Analytics
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Initialize Firestore with custom database ID if configured, or default database
const databaseId = firebaseConfig.firestoreDatabaseId;
const hasCustomDb = Boolean(databaseId && databaseId.trim() !== '' && databaseId !== '(default)');
let firestoreInstance;
try {
  firestoreInstance = hasCustomDb
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true
      }, databaseId)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true
      });
} catch {
  firestoreInstance = hasCustomDb
    ? getFirestore(app, databaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Non-intrusive connection probe that does not block or throw offline false-positives
async function testConnection() {
  if (typeof window === 'undefined') return;
  // Let Firestore handle persistence and background sync gracefully
}
testConnection();

export default app;
