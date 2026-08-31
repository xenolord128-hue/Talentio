import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a profile avatar to Firebase Storage under users/{uid}/profile/avatar-{timestamp}
 */
export async function uploadUserAvatar(uid: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const storagePath = `users/${uid}/profile/avatar-${Date.now()}.${ext}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytesResumable(fileRef, file, {
    contentType: file.type,
    customMetadata: {
      ownerUid: uid,
      uploadedAt: new Date().toISOString()
    }
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads a Gig cover or gallery image to Firebase Storage under gigs/{gigId}/images/{filename}
 */
export async function uploadGigImage(gigId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const storagePath = `gigs/${gigId}/images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytesResumable(fileRef, file, {
    contentType: file.type
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads an authoritative recorded voice note to Firebase Storage under chat/{conversationId}/voice/{messageId}.webm
 */
export async function uploadChatVoiceNote(conversationId: string, messageId: string, audioBlob: Blob): Promise<string> {
  const ext = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('ogg') ? 'ogg' : 'webm';
  const storagePath = `chat/${conversationId}/voice/${messageId}.${ext}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytesResumable(fileRef, audioBlob, {
    contentType: audioBlob.type || 'audio/webm',
    customMetadata: {
      conversationId,
      messageId
    }
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Uploads a chat attachment to Firebase Storage under chat/{conversationId}/attachments/{messageId}/{filename}
 */
export async function uploadChatAttachment(conversationId: string, messageId: string, file: File): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `chat/${conversationId}/attachments/${messageId}/${cleanName}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytesResumable(fileRef, file, {
    contentType: file.type
  });

  return await getDownloadURL(snapshot.ref);
}
