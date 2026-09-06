import { io, Socket } from 'socket.io-client';
import { ChatMessage, CallSessionState } from '../types';

export interface WebRTCSignalData {
  fromUserId: string;
  callId: string;
  signal: {
    type: 'offer' | 'answer' | 'candidate';
    sdp?: any;
    candidate?: any;
  };
}

export interface IncomingCallEvent {
  callId: string;
  conversationId?: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  type: 'audio' | 'video';
}

class RealtimeService {
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private isConnected: boolean = false;
  private listeners: Map<string, Set<Function>> = new Map();

  // WebRTC Peer Connection
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    if (typeof window === 'undefined') return;

    try {
      this.socket = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        if (this.currentUserId) {
          this.socket?.emit('join_user', this.currentUserId);
        }
        this.emitLocal('connected', true);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.emitLocal('connected', false);
      });

      this.socket.on('message_received', (data: { conversationId: string; message: ChatMessage }) => {
        this.emitLocal('message_received', data);
        this.showNativeNotification(data.message.senderName, data.message.text || 'Sent an attachment');
      });

      this.socket.on('message_delivered', (data: { conversationId: string; messageId: string; deliveredAt: string }) => {
        this.emitLocal('message_delivered', data);
      });

      this.socket.on('message_seen', (data: { conversationId: string; messageIds: string[]; seenBy: string; seenAt: string }) => {
        this.emitLocal('message_seen', data);
        this.emitLocal('messages_seen', data);
      });

      this.socket.on('message_delivered', (data: { conversationId: string; messageId: string }) => {
        this.emitLocal('message_delivered', data);
        this.emitLocal('messages_delivered', { conversationId: data.conversationId, messageIds: [data.messageId] });
      });

      this.socket.on('user_typing_start', (data: { conversationId: string; userId: string; userName: string }) => {
        this.emitLocal('user_typing_start', data);
        this.emitLocal('typing', { conversationId: data.conversationId, userId: data.userId, isTyping: true });
      });

      this.socket.on('user_typing_stop', (data: { conversationId: string; userId: string }) => {
        this.emitLocal('user_typing_stop', data);
        this.emitLocal('typing', { conversationId: data.conversationId, userId: data.userId, isTyping: false });
      });

      this.socket.on('presence_change', (data: { userId: string; online: boolean; lastSeen: string }) => {
        this.emitLocal('presence_change', data);
        this.emitLocal('presence', data);
      });

      this.socket.on('call_incoming', (data: IncomingCallEvent) => {
        this.emitLocal('call_incoming', data);
        this.emitLocal('incoming_call', data);
        this.showNativeNotification(`Incoming ${data.type} call`, `${data.callerName} is calling you...`);
      });

      this.socket.on('call_accepted', (data: { callId: string; callerId: string; receiverId: string }) => {
        this.emitLocal('call_accepted', data);
      });

      this.socket.on('call_declined', (data: { callId: string; callerId: string; receiverId: string; reason?: string }) => {
        this.emitLocal('call_declined', data);
      });

      this.socket.on('call_ended', (data: { callId: string; otherUserId: string }) => {
        this.cleanUpCall();
        this.emitLocal('call_ended', data);
      });

      this.socket.on('webrtc_signal', async (data: WebRTCSignalData) => {
        await this.handleIncomingWebRTCSignal(data);
        this.emitLocal('webrtc_signal', data);
      });
    } catch (err) {
      console.warn('Realtime socket init warning:', err);
    }
  }

  // Register current user session
  public setUser(userId: string) {
    this.currentUserId = userId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_user', userId);
    }
  }

  public getUserId(): string | null {
    return this.currentUserId;
  }

  // Message events
  public sendMessage(conversationId: string, message: ChatMessage) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message_send', { conversationId, message });
    }
  }

  public notifyDelivered(conversationId: string, messageId: string, senderId: string, receiverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message_delivered', { conversationId, messageId, senderId, receiverId });
    }
  }

  public notifySeen(conversationId: string, messageIds: string[], senderId: string, receiverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message_seen', { conversationId, messageIds, senderId, receiverId });
    }
  }

  // Typing indicators
  public startTyping(conversationId: string, senderId: string, senderName: string, receiverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_start', { conversationId, senderId, senderName, receiverId });
    }
  }

  public stopTyping(conversationId: string, senderId: string, receiverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing_stop', { conversationId, senderId, receiverId });
    }
  }

  public sendTyping(conversationId: string, receiverId: string, isTyping: boolean, senderName: string = 'User') {
    if (isTyping) {
      this.startTyping(conversationId, this.currentUserId || 'me', senderName, receiverId);
    } else {
      this.stopTyping(conversationId, this.currentUserId || 'me', receiverId);
    }
  }

  public markMessagesAsSeen(conversationId: string, receiverId: string, messageIds: string[]) {
    this.notifySeen(conversationId, messageIds, this.currentUserId || 'me', receiverId);
  }

  // Voice & Video Call Signaling
  public initiateCall(callData: IncomingCallEvent) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_initiate', callData);
    }
  }

  public acceptCall(callId: string, callerId: string, receiverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_accept', { callId, callerId, receiverId });
    }
  }

  public declineCall(callId: string, callerId: string, receiverId: string, reason?: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_decline', { callId, callerId, receiverId, reason });
    }
  }

  public endCall(callId: string, otherUserId: string, durationSeconds: number = 0) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('call_end', { callId, otherUserId, durationSeconds });
    }
    this.cleanUpCall();
  }

  // WebRTC Media & PeerConnection Implementation
  public async setupPeerConnection(
    toUserId: string,
    callId: string,
    isVideo: boolean,
    isCaller: boolean
  ): Promise<{ localStream: MediaStream; remoteStream: MediaStream }> {
    this.cleanUpCall();

    // 1. Request actual user media
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false
      });
    } catch (err) {
      console.warn('Microphone/Camera permission not available:', err);
      // Create silent/empty media tracks as fallback
      this.localStream = new MediaStream();
    }

    this.remoteStream = new MediaStream();
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    // 2. Add local tracks to connection
    this.localStream.getTracks().forEach(track => {
      if (this.peerConnection && this.localStream) {
        this.peerConnection.addTrack(track, this.localStream);
      }
    });

    // 3. Handle remote incoming tracks
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        this.remoteStream?.addTrack(track);
      });
      this.emitLocal('remote_stream_updated', this.remoteStream);
    };

    // 4. Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentUserId) {
        this.socket?.emit('webrtc_signal', {
          toUserId,
          fromUserId: this.currentUserId,
          callId,
          signal: {
            type: 'candidate',
            candidate: event.candidate.toJSON()
          }
        });
      }
    };

    // 5. If caller, create SDP Offer
    if (isCaller) {
      try {
        const offer = await this.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: isVideo
        });
        await this.peerConnection.setLocalDescription(offer);

        if (this.currentUserId) {
          this.socket?.emit('webrtc_signal', {
            toUserId,
            fromUserId: this.currentUserId,
            callId,
            signal: {
              type: 'offer',
              sdp: offer
            }
          });
        }
      } catch (err) {
        console.error('Error creating WebRTC offer:', err);
      }
    }

    return { localStream: this.localStream, remoteStream: this.remoteStream };
  }

  private async handleIncomingWebRTCSignal(data: WebRTCSignalData) {
    if (!this.peerConnection) return;

    try {
      if (data.signal.type === 'offer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        if (this.currentUserId) {
          this.socket?.emit('webrtc_signal', {
            toUserId: data.fromUserId,
            fromUserId: this.currentUserId,
            callId: data.callId,
            signal: {
              type: 'answer',
              sdp: answer
            }
          });
        }
      } else if (data.signal.type === 'answer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));
      } else if (data.signal.type === 'candidate' && data.signal.candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
      }
    } catch (err) {
      console.warn('Error handling WebRTC signal:', err);
    }
  }

  public setMicrophoneMuted(muted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(t => {
        t.enabled = !muted;
      });
    }
  }

  public setCameraDisabled(disabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(t => {
        t.enabled = !disabled;
      });
    }
  }

  public cleanUpCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
  }

  // Browser Push / Native Notifications
  public requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  public showNativeNotification(title: string, body: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted' && document.hidden) {
      try {
        new Notification(`Talentio: ${title}`, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } catch {
        // Ignored
      }
    }
  }

  // Event Bus
  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: Function) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  private emitLocal(event: string, ...args: any[]) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach(cb => {
        try {
          cb(...args);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}

export const realtimeService = new RealtimeService();
