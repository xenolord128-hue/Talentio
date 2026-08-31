import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  UserProfile, 
  TalentioService, 
  ProjectJob, 
  UserProposal, 
  EscrowContract, 
  ChatMessage, 
  AdminAction,
  Freelancer,
  PlatformNotice
} from '../types';

// ============================================================================
// ERROR HANDLING (FIRESTORE ERROR SPECIFICATION)
// ============================================================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context:', JSON.stringify(errInfo));
  return errInfo;
}

// ============================================================================
// USERS & TALENT PROFILES
// ============================================================================

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToUsers(callback: (users: UserProfile[]) => void) {
  const path = 'users';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function updateUserRecord(userId: string, data: Partial<UserProfile>): Promise<void> {
  const path = `users/${userId}`;
  try {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ============================================================================
// SERVICES & GIGS
// ============================================================================

export async function fetchAllServices(): Promise<TalentioService[]> {
  const path = 'gigs';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TalentioService));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToServices(callback: (services: TalentioService[]) => void) {
  const path = 'gigs';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TalentioService));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function createGigDocument(gig: TalentioService): Promise<string> {
  const path = `gigs/${gig.id}`;
  try {
    const gigRef = doc(db, 'gigs', gig.id);
    await setDoc(gigRef, {
      ...gig,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return gig.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return gig.id;
  }
}

export async function updateGigDocument(gigId: string, data: Partial<TalentioService>): Promise<void> {
  const path = `gigs/${gigId}`;
  try {
    const ref = doc(db, 'gigs', gigId);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteGigDocument(gigId: string): Promise<void> {
  const path = `gigs/${gigId}`;
  try {
    await deleteDoc(doc(db, 'gigs', gigId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// JOBS & PROJECTS
// ============================================================================

export async function fetchAllJobs(): Promise<ProjectJob[]> {
  const path = 'jobs';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProjectJob));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToJobs(callback: (jobs: ProjectJob[]) => void) {
  const path = 'jobs';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProjectJob));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function createJobDocument(job: ProjectJob): Promise<string> {
  const path = `jobs/${job.id}`;
  try {
    const ref = doc(db, 'jobs', job.id);
    await setDoc(ref, {
      ...job,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return job.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return job.id;
  }
}

// ============================================================================
// PROPOSALS
// ============================================================================

export async function fetchProposals(): Promise<UserProposal[]> {
  const path = 'proposals';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProposal));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToProposals(callback: (proposals: UserProposal[]) => void) {
  const path = 'proposals';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProposal));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function createProposalDocument(proposal: UserProposal): Promise<string> {
  const path = `proposals/${proposal.id}`;
  try {
    const ref = doc(db, 'proposals', proposal.id);
    await setDoc(ref, {
      ...proposal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return proposal.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return proposal.id;
  }
}

// ============================================================================
// ORDERS & ESCROW CONTRACTS
// ============================================================================

export async function fetchEscrowOrders(): Promise<EscrowContract[]> {
  const path = 'orders';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EscrowContract));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToOrders(callback: (orders: EscrowContract[]) => void) {
  const path = 'orders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EscrowContract));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function createEscrowOrderDocument(order: EscrowContract): Promise<string> {
  const path = `orders/${order.id}`;
  try {
    const ref = doc(db, 'orders', order.id);
    await setDoc(ref, {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return order.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return order.id;
  }
}

export async function updateEscrowOrderDocument(orderId: string, data: Partial<EscrowContract>): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ============================================================================
// CHAT CONVERSATIONS & MESSAGES
// ============================================================================

export function subscribeToConversations(userId: string, callback: (conversations: any[]) => void) {
  const path = 'conversations';
  try {
    const convsRef = collection(db, 'conversations');
    const q = query(convsRef, orderBy('updatedAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        callback(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveConversationDocument(conv: any): Promise<void> {
  const path = `conversations/${conv.id}`;
  try {
    const ref = doc(db, 'conversations', conv.id);
    await setDoc(ref, {
      ...conv,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToChatMessages(conversationId: string, callback: (msgs: ChatMessage[]) => void) {
  const path = `conversations/${conversationId}/messages`;
  try {
    const msgsRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(msgsRef, orderBy('createdAt', 'asc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(d => {
          const data = d.data();
          const currentUid = auth.currentUser?.uid;
          const isMe = data.senderId === currentUid || data.sender_id === currentUid || data.sender === 'me';
          return {
            id: d.id,
            conversationId: conversationId,
            conversation_id: conversationId,
            sender: (isMe ? 'me' : (data.sender || 'freelancer')) as ChatMessage['sender'],
            senderId: data.senderId || data.sender_id,
            sender_id: data.sender_id || data.senderId,
            receiverId: data.receiverId || data.receiver_id,
            receiver_id: data.receiver_id || data.receiverId,
            senderName: data.senderName || 'Member',
            senderAvatar: data.senderAvatar,
            text: data.text || data.message || '',
            message: data.message || data.text || '',
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isoDate: data.isoDate || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.isoDate,
            created_at: data.created_at || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.isoDate),
            status: data.status || data.read_status || 'sent',
            read_status: data.read_status || data.status || 'sent',
            voiceNote: data.voiceNote,
            attachments: data.attachments || (data.attachment ? [data.attachment] : undefined),
            replyTo: data.replyTo,
            reactions: data.reactions,
            isOffer: data.isOffer,
            offerDetails: data.offerDetails,
            isOrderRequest: data.isOrderRequest,
            orderRequestDetails: data.orderRequestDetails
          } as ChatMessage;
        });
        callback(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

export async function sendChatMessageDocument(conversationId: string, msg: ChatMessage): Promise<string> {
  const path = `conversations/${conversationId}/messages`;
  try {
    const msgsRef = collection(db, 'conversations', conversationId, 'messages');
    
    // Exact standard fields for database storage (Requirement 5)
    const payload = {
      ...msg,
      sender_id: msg.senderId || msg.sender_id || auth.currentUser?.uid || 'user-me',
      senderId: msg.senderId || msg.sender_id || auth.currentUser?.uid || 'user-me',
      receiver_id: msg.receiverId || msg.receiver_id || '',
      receiverId: msg.receiverId || msg.receiver_id || '',
      conversation_id: conversationId,
      conversationId: conversationId,
      message: msg.text || msg.message || '',
      text: msg.text || msg.message || '',
      created_at: msg.isoDate || new Date().toISOString(),
      read_status: msg.status || msg.read_status || 'sent',
      status: msg.status || msg.read_status || 'sent',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(msgsRef, payload);

    // Also update parent conversation document in real-time
    const convRef = doc(db, 'conversations', conversationId);
    await setDoc(convRef, {
      id: conversationId,
      lastMessage: {
        text: msg.text || msg.message || '',
        message: msg.text || msg.message || '',
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: payload.sender_id,
        sender_id: payload.sender_id,
        receiver_id: payload.receiver_id,
        status: payload.read_status,
        read_status: payload.read_status,
        isVoice: !!msg.voiceNote,
        hasAttachment: !!(msg.attachments && msg.attachments.length > 0),
        isOffer: !!msg.isOffer,
        isOrderRequest: !!msg.isOrderRequest
      },
      updatedAt: serverTimestamp()
    }, { merge: true });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return msg.id;
  }
}

// ============================================================================
// ADMIN LOGS
// ============================================================================

export async function logAdminAction(action: AdminAction): Promise<void> {
  const path = `adminLogs/${action.id}`;
  try {
    const ref = doc(db, 'adminLogs', action.id);
    await setDoc(ref, {
      ...action,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeToAdminLogs(callback: (actions: AdminAction[]) => void) {
  const path = 'adminLogs';
  const q = query(collection(db, 'adminLogs'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AdminAction));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

// ============================================================================
// DYNAMIC NOTICES & ANNOUNCEMENTS
// ============================================================================

export async function createNoticeDocument(notice: PlatformNotice): Promise<string> {
  const path = `notices/${notice.id}`;
  try {
    const ref = doc(db, 'notices', notice.id);
    await setDoc(ref, {
      ...notice,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return notice.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return notice.id;
  }
}

export function subscribeToNotices(callback: (notices: PlatformNotice[]) => void) {
  const path = 'notices';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PlatformNotice));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function markNoticeAsRead(noticeId: string): Promise<void> {
  const path = `notices/${noticeId}`;
  try {
    const ref = doc(db, 'notices', noticeId);
    await updateDoc(ref, {
      read: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

