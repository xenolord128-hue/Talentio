import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types';
import { triggerDeviceNotification } from '../utils/serviceWorkerRegistration';

class RealtimeService {
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private isConnected: boolean = false;
  private listeners: Map<string, Set<Function>> = new Map();

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
    } catch (err) {
      console.warn('Realtime socket init warning:', err);
    }
  }

  // Connect or re-connect socket
  public connect() {
    if (!this.socket) {
      this.initSocket();
    } else if (!this.socket.connected) {
      this.socket.connect();
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

  // Browser Push / Native Notifications
  public requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  public async showNativeNotification(title: string, body: string, data?: any) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        await triggerDeviceNotification(`Talentio: ${title}`, {
          body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          data: data || { url: '/?page=chat' },
          url: '/?page=chat',
          tag: `talentio-msg-${Date.now()}`
        });
      } catch (err) {
        console.warn('Native notification note:', err);
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
