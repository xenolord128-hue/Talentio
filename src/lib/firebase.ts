import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID if configured, and configure auto-fallback settings
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true
    }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true
    });

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
