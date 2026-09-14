import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  GoogleAuthProvider, 
  GithubAuthProvider,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, AccountRole } from '../types';

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// System authorized administrator emails
export const AUTHORIZED_ADMIN_EMAIL = 'lord79915@gmail.com';
export const AUTHORIZED_ADMIN_EMAILS = [
  'lord79915@gmail.com',
  'xenolord128@gmail.com'
];

/**
 * Checks if an email is the authorized administrator
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

/**
 * Normalizes role to AccountRole ('CLIENT' | 'FREELANCER' | 'ADMIN')
 */
export function normalizeAccountRole(role?: string, userType?: string, email?: string): AccountRole {
  if (isAuthorizedAdminEmail(email)) return 'ADMIN';
  if (role === 'ADMIN' || role === 'admin') {
    return isAuthorizedAdminEmail(email) ? 'ADMIN' : 'CLIENT';
  }
  if (role === 'FREELANCER' || userType === 'freelancer') return 'FREELANCER';
  return 'CLIENT';
}

/**
 * Maps a Firestore document and Firebase user to Talentio's UserProfile interface
 */
export function formatUserProfile(firebaseUser: FirebaseUser, docData?: any): UserProfile {
  const email = firebaseUser.email || docData?.email || '';
  const calculatedRole = normalizeAccountRole(docData?.role, docData?.userType, email);
  const isSpecialAdmin = calculatedRole === 'ADMIN';

  // Subscription calculation (default to 30 days trial if newly created)
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const subStatus = docData?.subscriptionStatus || 'trial';
  const subStart = docData?.subscriptionStartDate || now.toISOString();
  const subEnd = docData?.subscriptionEndDate || thirtyDaysLater.toISOString();

  return {
    id: firebaseUser.uid,
    userId: firebaseUser.uid,
    name: docData?.name || docData?.displayName || firebaseUser.displayName || 'Talentio Member',
    displayName: docData?.displayName || docData?.name || firebaseUser.displayName || 'Talentio Member',
    fullName: docData?.fullName || docData?.name || firebaseUser.displayName || '',
    handle: docData?.handle || `@${(docData?.name || firebaseUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}_${firebaseUser.uid.slice(0, 4)}`,
    email,
    phone: docData?.phone || firebaseUser.phoneNumber || '',
    avatar: docData?.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authMethod: (docData?.authMethod as any) || (firebaseUser.providerData?.[0]?.providerId.includes('github') ? 'github' : 'email'),
    role: calculatedRole,
    userType: calculatedRole === 'ADMIN' ? 'admin' : (calculatedRole === 'FREELANCER' ? 'freelancer' : 'client'),
    providerType: docData?.providerType || 'individual',
    accountStatus: isSpecialAdmin ? 'approved' : (docData?.accountStatus || (calculatedRole === 'CLIENT' ? 'approved' : 'pending')),
    subscriptionStatus: subStatus,
    subscriptionStartDate: subStart,
    subscriptionEndDate: subEnd,
    subscriptionPlan: docData?.subscriptionPlan || 'one_month_free_trial',
    platformFeePercent: docData?.platformFeePercent ?? (subStatus === 'trial' ? 0 : 10),
    trialPeriodDays: docData?.trialPeriodDays ?? 30,
    isApprovedSeller: isSpecialAdmin ? true : (docData?.isApprovedSeller ?? (calculatedRole === 'CLIENT' ? true : false)),
    title: docData?.title || '',
    category: docData?.category || 'web-dev',
    subcategory: docData?.subcategory || '',
    skills: Array.isArray(docData?.skills) ? docData.skills : [],
    companyName: docData?.companyName || '',
    industry: docData?.industry || '',
    location: docData?.location || 'International',
    countryFlag: docData?.countryFlag || '🌐',
    countryCode: docData?.countryCode || 'INT',
    bio: docData?.bio || '',
    languages: Array.isArray(docData?.languages) ? docData.languages : ['English (Fluent)'],
    hourlyRate: docData?.hourlyRate ?? 50,
    startingPrice: docData?.startingPrice ?? 150,
    verifiedBadge: docData?.verifiedBadge ?? true,
    escrowTier: isSpecialAdmin ? 3 : 1,
    onboardingCompleted: docData?.onboardingCompleted ?? true,
    onboardingStep: docData?.onboardingStep ?? 6,
    profileCompletionScore: docData?.profileCompletionScore ?? 100,
    balanceAvailable: docData?.balanceAvailable ?? (calculatedRole === 'CLIENT' ? 2500 : 0),
    balanceInEscrow: docData?.balanceInEscrow ?? 0,
    portfolio: Array.isArray(docData?.portfolio) ? docData.portfolio : [],
    createdAt: docData?.createdAt || now.toISOString(),
    updatedAt: docData?.updatedAt || now.toISOString()
  };
}

/**
 * Creates or updates the user profile record in Firestore
 */
export async function syncUserProfileDocument(firebaseUser: FirebaseUser, additionalData: Partial<UserProfile> = {}): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  const email = firebaseUser.email || additionalData.email || '';
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (!userSnap.exists()) {
    const determinedRole = normalizeAccountRole(additionalData.role, additionalData.userType as any, email);
    const isSpecialAdmin = determinedRole === 'ADMIN';

    const initialProfile: UserProfile = {
      id: firebaseUser.uid,
      userId: firebaseUser.uid,
      name: additionalData.name || firebaseUser.displayName || 'Talentio Member',
      displayName: additionalData.name || firebaseUser.displayName || 'Talentio Member',
      fullName: additionalData.fullName || additionalData.name || firebaseUser.displayName || '',
      handle: additionalData.handle || `@${(additionalData.name || firebaseUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}_${firebaseUser.uid.slice(0, 4)}`,
      email,
      phone: additionalData.phone || firebaseUser.phoneNumber || '',
      avatar: additionalData.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authMethod: additionalData.authMethod || 'email',
      role: determinedRole,
      userType: determinedRole === 'ADMIN' ? 'admin' : (determinedRole === 'FREELANCER' ? 'freelancer' : 'client'),
      providerType: additionalData.providerType || 'individual',
      accountStatus: isSpecialAdmin ? 'approved' : (determinedRole === 'CLIENT' ? 'approved' : 'pending'),
      subscriptionStatus: 'trial',
      subscriptionStartDate: now.toISOString(),
      subscriptionEndDate: thirtyDaysLater.toISOString(),
      subscriptionPlan: 'one_month_free_trial',
      platformFeePercent: 0,
      trialPeriodDays: 30,
      isApprovedSeller: isSpecialAdmin ? true : (determinedRole === 'CLIENT' ? true : false),
      title: additionalData.title || '',
      category: additionalData.category || 'web-dev',
      skills: additionalData.skills || [],
      location: additionalData.location || 'International',
      countryFlag: additionalData.countryFlag || '🌐',
      countryCode: additionalData.countryCode || 'INT',
      bio: additionalData.bio || '',
      languages: additionalData.languages || ['English (Fluent)'],
      hourlyRate: additionalData.hourlyRate ?? 50,
      startingPrice: additionalData.startingPrice ?? 150,
      verifiedBadge: true,
      escrowTier: isSpecialAdmin ? 3 : 1,
      onboardingCompleted: true,
      onboardingStep: 6,
      profileCompletionScore: 100,
      balanceAvailable: isSpecialAdmin ? 10000 : (determinedRole === 'CLIENT' ? 2500 : 0),
      balanceInEscrow: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await setDoc(userRef, {
      ...initialProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });

    // If admin, record in /admins collection as well for database verification
    if (isSpecialAdmin) {
      try {
        await setDoc(doc(db, 'admins', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email,
          role: 'ADMIN',
          grantedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Admin collection write note:', e);
      }
    }

    return initialProfile;
  } else {
    const existingData = userSnap.data();
    const isAdmin = isAuthorizedAdminEmail(email);

    // If user's email matches admin email, elevate role to ADMIN
    let updatedRole = existingData.role;
    if (isAdmin && updatedRole !== 'ADMIN') {
      updatedRole = 'ADMIN';
      await updateDoc(userRef, {
        role: 'ADMIN',
        userType: 'admin',
        accountStatus: 'approved',
        updatedAt: serverTimestamp()
      });
      try {
        await setDoc(doc(db, 'admins', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email,
          role: 'ADMIN',
          grantedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {}
    }

    // Sanitize additionalData so user cannot alter role, accountStatus, or subscription without admin rights
    const safeData = { ...additionalData };
    if (!isAdmin) {
      delete safeData.role;
      delete safeData.userType;
      delete safeData.accountStatus;
      delete safeData.subscriptionStatus;
      delete safeData.subscriptionEndDate;
      delete safeData.platformFeePercent;
    }

    if (Object.keys(safeData).length > 0) {
      await updateDoc(userRef, {
        ...safeData,
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
      return formatUserProfile(firebaseUser, { ...existingData, ...safeData, role: updatedRole });
    } else {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
      return formatUserProfile(firebaseUser, { ...existingData, role: updatedRole });
    }
  }
}

/**
 * Formats Firebase Auth errors into clear, actionable, user-friendly messages.
 * Specifically detects when Email/Password is disabled (auth/operation-not-allowed)
 * and directs users to Google Sign-In or Firebase Console.
 */
export function formatAuthError(err: any): string {
  const code = err?.code || '';
  const msg = err?.message || String(err || '');

  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return "Email/Password sign-in is not enabled in this Firebase project. Please use 'Continue with Google' to sign in instantly, or enable Email/Password under Firebase Console -> Authentication -> Sign-in method.";
  }
  if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
    return 'No registered account found with this email. Please create an account or sign in with Google.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || msg.includes('invalid-credential') || msg.includes('wrong-password')) {
    return 'Incorrect email or password. Please re-enter your credentials or use Forgot Password.';
  }
  if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
    return 'An account already exists with this email address. Please sign in or use Google.';
  }
  if (code === 'auth/weak-password' || msg.includes('weak-password')) {
    return 'Password must be at least 6 characters in length.';
  }
  if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
    return 'Please provide a valid email address.';
  }
  if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
    return 'Authentication popup was closed before completing. Please try again.';
  }
  if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
    return 'Authentication popup was blocked by the browser. Please allow popups for this site.';
  }
  if (code === 'auth/network-request-failed' || msg.includes('network-request-failed')) {
    return 'Network connection problem. Please verify your internet connection.';
  }

  // Strip raw Firebase boilerplate prefixes if present
  return msg.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^)]+\)\.?$/i, '') || 'Authentication error occurred.';
}

/**
 * Register a new user with Email and Password
 */
export async function registerWithFirebase(
  email: string, 
  pass: string, 
  profileData: Partial<UserProfile> = {}
): Promise<UserProfile> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (profileData.name) {
      try {
        await updateProfile(cred.user, { displayName: profileData.name });
      } catch (e) {}
    }
    return await syncUserProfileDocument(cred.user, profileData);
  } catch (err: any) {
    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Login with Email and Password
 */
export async function loginWithFirebase(email: string, pass: string): Promise<UserProfile> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return await syncUserProfileDocument(cred.user);
  } catch (err: any) {
    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Login with Google OAuth Popup
 */
export async function loginWithGooglePopup(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return await syncUserProfileDocument(cred.user);
  } catch (err: any) {
    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Login with GitHub OAuth Popup
 */
export async function loginWithGithubPopup(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, githubProvider);
    return await syncUserProfileDocument(cred.user, { authMethod: 'github' });
  } catch (err: any) {
    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Trigger Password Reset Email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Sign Out
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Retrieve current user Firebase ID token for secure API requests
 */
export async function getCurrentUserIdToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken(false);
  } catch (e) {
    return null;
  }
}

/**
 * Verify administrator authorization server-side
 */
export async function verifyServerAdminAccess(): Promise<boolean> {
  const token = await getCurrentUserIdToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.authorized === true;
  } catch {
    return false;
  }
}


