import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID if configured, and force long polling for reliable iframe connectivity
let firestoreInstance;
try {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true
      }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true
      });
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Test connection to Firestore backend as mandated by Firebase specification
async function testConnection() {
  if (typeof window === 'undefined') return;
  try {
    const { doc, getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: client operating in offline mode.");
    }
  }
}
testConnection();

export default app;
