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
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

// System authorized administrator emails
export const AUTHORIZED_ADMIN_EMAIL = 'xenolord128@gmail.com';
export const AUTHORIZED_ADMIN_EMAILS = [
  'xenolord128@gmail.com',
  'lord79915@gmail.com'
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
    authMethod: (docData?.authMethod as any) || (firebaseUser.providerData?.[0]?.providerId.includes('google') ? 'google' : (firebaseUser.providerData?.[0]?.providerId.includes('github') ? 'github' : 'email')),
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
  const email = firebaseUser.email || additionalData.email || '';
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const determinedRole = normalizeAccountRole(additionalData.role, additionalData.userType as any, email);
  const isSpecialAdmin = determinedRole === 'ADMIN';

  // Base fallback profile constructed directly from authenticated user
  const fallbackProfile: UserProfile = {
    id: firebaseUser.uid,
    userId: firebaseUser.uid,
    name: additionalData.name || firebaseUser.displayName || 'Talentio Member',
    displayName: additionalData.name || firebaseUser.displayName || 'Talentio Member',
    fullName: additionalData.fullName || additionalData.name || firebaseUser.displayName || '',
    handle: additionalData.handle || `@${(additionalData.name || firebaseUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}_${firebaseUser.uid.slice(0, 4)}`,
    email,
    phone: additionalData.phone || firebaseUser.phoneNumber || '',
    avatar: additionalData.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authMethod: additionalData.authMethod || (firebaseUser.providerData?.[0]?.providerId.includes('google') ? 'google' : (firebaseUser.providerData?.[0]?.providerId.includes('github') ? 'github' : 'email')),
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

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...fallbackProfile,
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

      return fallbackProfile;
    } else {
      const existingData = userSnap.data();
      const isAdmin = isAuthorizedAdminEmail(email);

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
      delete (safeData as any).password;
      delete (safeData as any).confirmPassword;
      delete (safeData as any).pass;

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
  } catch (firestoreError: any) {
    console.warn('Firestore sync note (proceeding with authenticated session):', firestoreError?.message || firestoreError);
    return fallbackProfile;
  }
}

/**
 * Checks if a Firebase error indicates that GitHub provider is disabled or missing OAuth credentials in Firebase Console
 */
export function isGithubProviderDisabled(err: any): boolean {
  if (!err) return false;
  const code = err?.code || '';
  const msg = String(err?.message || err?.originalMessage || err || '');

  // If the user simply closed the popup or popup was blocked, it's NOT disabled
  if (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/popup-blocked' ||
    code === 'auth/cancelled-popup-request' ||
    msg.includes('popup-closed-by-user') ||
    msg.includes('popup-blocked')
  ) {
    return false;
  }

  return (
    code === 'auth/operation-not-allowed' ||
    code === 'auth/configuration-not-found' ||
    msg.includes('operation-not-allowed') ||
    msg.includes('CONFIGURATION_NOT_FOUND') ||
    msg.includes('CONFIGURATION_EXPIRED') ||
    msg.includes('auth/configuration-not-found')
  );
}

/**
 * Checks if a Firebase error indicates that Email/Password provider is disabled in Firebase Console
 */
export function isEmailPasswordDisabled(err: any): boolean {
  if (!err) return false;
  if (err?.isGithub || err?.attemptedProvider === 'github' || err?.providerId === 'github.com') return false;
  const code = err?.code || '';
  const msg = String(err?.message || err?.originalMessage || err || '');
  return (
    code === 'auth/operation-not-allowed' ||
    msg.includes('operation-not-allowed') ||
    msg.includes('PASSWORD_LOGIN_DISABLED') ||
    msg.includes('Password sign-in is disabled') ||
    msg.includes('CONFIGURATION_NOT_FOUND')
  );
}

/**
 * Formats Firebase Auth errors into clear, actionable, user-friendly messages.
 */
export function formatAuthError(err: any): string {
  const code = err?.code || '';
  const msg = err?.message || String(err || '');
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';

  if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
    return 'Sign-in popup was closed before completing authentication. Please click the button to try again.';
  }
  if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
    return `Sign-in popup was blocked by your browser. Please allow popups for ${currentHostname} and try again.`;
  }
  if (code === 'auth/cancelled-popup-request' || msg.includes('cancelled-popup-request')) {
    return 'Authentication is already in progress. Please check the open popup window.';
  }
  if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
    return `Production Domain Unauthorized: "${currentHostname}" is not listed in your Firebase project's Authorized Domains. To resolve: open Firebase Console (project talentio-92919) -> Authentication -> Settings -> Authorized Domains and add "${currentHostname}".`;
  }
  if (isGithubProviderDisabled(err)) {
    return "Firebase GitHub Provider Not Enabled: GitHub authentication is not enabled or OAuth credentials (Client ID/Secret) are missing in your Firebase Console project (talentio-92919). To enable: Go to Firebase Console -> Authentication -> Sign-in method -> GitHub -> Enable, enter your GitHub OAuth App Client ID & Secret, and configure the Authorization callback URL.";
  }
  if (isEmailPasswordDisabled(err)) {
    return "Firebase Email/Password Provider Not Enabled: Email & Password authentication is not enabled in your Firebase Console project (talentio-92919). To enable: Go to Firebase Console -> Authentication -> Sign-in method -> Email/Password -> Enable -> Save.";
  }
  if (code === 'auth/account-exists-with-different-credential' || msg.includes('account-exists-with-different-credential')) {
    return 'An account already exists with this email using a different sign-in provider. Please sign in using your existing provider.';
  }
  if (code === 'auth/cancelled-popup-request' || msg.includes('cancelled-popup-request')) {
    return 'Authentication is already in progress. Please check the open popup window.';
  }
  if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
    return 'No registered account found with this email. Please check your spelling or register a new account.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || msg.includes('invalid-credential') || msg.includes('wrong-password')) {
    return 'Incorrect email or password. Please verify your credentials or use Forgot Password.';
  }
  if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
    return 'An account already exists with this email address. Please sign in instead or use Forgot Password.';
  }
  if (code === 'auth/weak-password' || msg.includes('weak-password')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
  }
  if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  if (code === 'auth/network-request-failed' || msg.includes('network-request-failed')) {
    return 'Network connection problem. Please verify your internet connection.';
  }
  if (code === 'auth/invalid-phone-number' || msg.includes('invalid-phone-number')) {
    return 'The phone number entered is invalid. Please include the full country code (e.g. +880 or +1).';
  }
  if (code === 'auth/invalid-verification-code' || msg.includes('invalid-verification-code')) {
    return 'Invalid SMS verification code. Please check the 6-digit OTP code and try again.';
  }
  if (code === 'auth/code-expired' || msg.includes('code-expired')) {
    return 'The verification code has expired. Please request a new SMS verification code.';
  }
  if (code === 'auth/captcha-check-failed' || msg.includes('captcha-check-failed')) {
    return 'reCAPTCHA verification failed. Please try again or refresh the page.';
  }
  if (code === 'auth/too-many-requests' || msg.includes('too-many-requests')) {
    return 'Too many failed attempts. Access temporarily restricted. Please try again in a few minutes or reset your password.';
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
 * Includes automatic secure server fallback for designated administrator account
 */
export async function loginWithFirebase(email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Dedicated check for designated administrator account (xenolord128@gmail.com / lord79915@gmail.com)
  if (
    isAuthorizedAdminEmail(cleanEmail) ||
    cleanEmail === 'xenolord128@gmail.com' ||
    cleanEmail === 'lord79915@gmail.com'
  ) {
    try {
      const res = await fetch('/api/admin/login-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authorized && data.user) {
          if (data.token) {
            localStorage.setItem('talentio_admin_token', data.token);
          }
          return data.user as UserProfile;
        }
      }
    } catch (directErr) {
      console.warn('Direct admin login bridge notice:', directErr);
    }
  }

  // 2. Standard Firebase Auth flow
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return await syncUserProfileDocument(cred.user);
  } catch (err: any) {
    // If Firebase reports password login disabled, retry admin direct verification
    if (
      err?.code === 'auth/operation-not-allowed' || 
      String(err?.message).includes('operation-not-allowed') ||
      String(err?.message).includes('PASSWORD_LOGIN_DISABLED')
    ) {
      try {
        const res = await fetch('/api/admin/login-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: pass })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authorized && data.user) {
            if (data.token) {
              localStorage.setItem('talentio_admin_token', data.token);
            }
            return data.user as UserProfile;
          }
        }
      } catch {}
    }

    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Login with Google OAuth Popup
 * Includes redirect fallback if popup is blocked on mobile
 */
export async function loginWithGooglePopup(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return await syncUserProfileDocument(cred.user, { authMethod: 'google' });
  } catch (err: any) {
    // Check if popup was blocked and browser supports top-level redirect
    if (
      (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) &&
      typeof window !== 'undefined' &&
      window.self === window.top
    ) {
      try {
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, googleProvider);
        return new Promise(() => {});
      } catch (redirectErr) {
        console.warn('Google redirect fallback notice:', redirectErr);
      }
    }

    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.originalMessage = err?.message;
    throw errorObj;
  }
}

/**
 * Login with GitHub OAuth Popup
 * Includes redirect fallback if popup is blocked on mobile
 */
export async function loginWithGithubPopup(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, githubProvider);
    const additionalData: Partial<UserProfile> = { 
      authMethod: 'github',
      verifiedBadge: true
    };
    
    // Extract GitHub handle/screenName if available from reloadUserInfo
    const screenName = (cred.user as any).reloadUserInfo?.screenName;
    if (screenName) {
      additionalData.handle = `@${String(screenName).toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
    }
    
    return await syncUserProfileDocument(cred.user, additionalData);
  } catch (err: any) {
    err.isGithub = true;
    err.attemptedProvider = 'github';

    if (
      (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) &&
      typeof window !== 'undefined' &&
      window.self === window.top
    ) {
      try {
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, githubProvider);
        return new Promise(() => {});
      } catch (redirectErr) {
        console.warn('GitHub redirect fallback notice:', redirectErr);
      }
    }

    const friendly = formatAuthError(err);
    const errorObj: any = new Error(friendly);
    errorObj.code = err?.code || 'auth/unknown';
    errorObj.isGithub = true;
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
  try {
    localStorage.removeItem('talentio_admin_token');
    localStorage.removeItem('talentio_admin_session');
  } catch {}
  await signOut(auth);
}

/**
 * Retrieve current user Firebase ID token or active admin session token
 */
export async function getCurrentUserIdToken(): Promise<string | null> {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(false);
      if (token) return token;
    } catch (e) {}
  }
  try {
    const adminToken = localStorage.getItem('talentio_admin_token');
    if (adminToken) return adminToken;
  } catch (e) {}
  return null;
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


