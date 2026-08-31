import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
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
import { UserProfile } from '../types';

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

/**
 * Maps a Firestore document and Firebase user to Talentio's UserProfile interface
 */
export function formatUserProfile(firebaseUser: FirebaseUser, docData?: any): UserProfile {
  return {
    id: firebaseUser.uid,
    name: docData?.name || firebaseUser.displayName || 'Talentio Member',
    handle: docData?.handle || `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '_')}_${firebaseUser.uid.slice(0, 4)}`,
    email: firebaseUser.email || docData?.email || '',
    phone: docData?.phone || firebaseUser.phoneNumber || '',
    avatar: docData?.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authMethod: (docData?.authMethod as any) || (firebaseUser.providerData?.[0]?.providerId.includes('github') ? 'github' : 'email'),
    userType: docData?.userType || 'freelancer',
    providerType: docData?.providerType || 'individual',
    accountStatus: docData?.accountStatus || (docData?.role === 'admin' ? 'approved' : 'pending'),
    isApprovedSeller: docData?.isApprovedSeller ?? (docData?.userType === 'freelancer' ? false : true),
    role: docData?.role || (docData?.email === 'admin@talentio.com' ? 'admin' : 'user'),
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
    escrowTier: docData?.escrowTier ?? 1,
    onboardingCompleted: docData?.onboardingCompleted ?? false,
    onboardingStep: docData?.onboardingStep ?? 1,
    profileCompletionScore: docData?.profileCompletionScore ?? 60,
    balanceAvailable: docData?.balanceAvailable ?? 0,
    balanceInEscrow: docData?.balanceInEscrow ?? 0,
    portfolio: Array.isArray(docData?.portfolio) ? docData.portfolio : []
  };
}

/**
 * Creates or updates the user profile record in Firestore
 */
export async function syncUserProfileDocument(firebaseUser: FirebaseUser, additionalData: Partial<UserProfile> = {}): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const isSpecialAdmin = firebaseUser.email === 'admin@talentio.com';
    const initialProfile: UserProfile = {
      id: firebaseUser.uid,
      name: additionalData.name || firebaseUser.displayName || 'Talentio Member',
      handle: additionalData.handle || `@${(additionalData.name || firebaseUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}_${firebaseUser.uid.slice(0, 4)}`,
      email: firebaseUser.email || additionalData.email || '',
      phone: additionalData.phone || firebaseUser.phoneNumber || '',
      avatar: additionalData.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      authMethod: additionalData.authMethod || 'email',
      userType: additionalData.userType || 'freelancer',
      providerType: additionalData.providerType || 'individual',
      accountStatus: isSpecialAdmin ? 'approved' : (additionalData.accountStatus || 'pending'),
      isApprovedSeller: isSpecialAdmin ? true : (additionalData.userType === 'client'),
      role: isSpecialAdmin ? 'admin' : (additionalData.role || 'user'),
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
      onboardingCompleted: additionalData.onboardingCompleted ?? false,
      onboardingStep: additionalData.onboardingStep ?? 1,
      profileCompletionScore: additionalData.profileCompletionScore ?? 50,
      balanceAvailable: additionalData.balanceAvailable ?? 0,
      balanceInEscrow: additionalData.balanceInEscrow ?? 0
    };

    await setDoc(userRef, {
      ...initialProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });

    return initialProfile;
  } else {
    const existingData = userSnap.data();
    if (Object.keys(additionalData).length > 0) {
      await updateDoc(userRef, {
        ...additionalData,
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
      return formatUserProfile(firebaseUser, { ...existingData, ...additionalData });
    } else {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
      return formatUserProfile(firebaseUser, existingData);
    }
  }
}

/**
 * Register a new user with Email and Password
 */
export async function registerWithFirebase(email: string, pass: string, profileData: Partial<UserProfile> = {}): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (profileData.name) {
    await updateProfile(cred.user, { displayName: profileData.name });
  }
  return await syncUserProfileDocument(cred.user, profileData);
}

/**
 * Login with Email and Password
 */
export async function loginWithFirebase(email: string, pass: string): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return await syncUserProfileDocument(cred.user);
}

/**
 * Login with Google OAuth Popup
 */
export async function loginWithGooglePopup(): Promise<UserProfile> {
  const cred = await signInWithPopup(auth, googleProvider);
  return await syncUserProfileDocument(cred.user);
}

/**
 * Login with GitHub OAuth Popup
 */
export async function loginWithGithubPopup(): Promise<UserProfile> {
  const cred = await signInWithPopup(auth, githubProvider);
  return await syncUserProfileDocument(cred.user, { authMethod: 'github' });
}

/**
 * Sign Out
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}
