/**
 * Talentio PWA Service Worker & Web Push Notifications Registration
 */

// Helper to convert base64 VAPID public key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function registerServiceWorker(onUpdate?: (registration: ServiceWorkerRegistration) => void) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Register service worker when window loads
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for service worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.info('Talentio: New version is available and ready upon reload.');
                onUpdate?.(registration);
              } else {
                console.info('Talentio: App shell cached for offline PWA operation.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('Talentio Service Worker registration note:', error);
      });
  });
}

export interface DeviceNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  tag?: string;
  actions?: { action: string; title: string; icon?: string }[];
  data?: any;
}

/**
 * Triggers an immediate device notification with vibration, sound, and interactive action buttons.
 * Uses ServiceWorkerRegistration.showNotification() which is mandatory for Mobile Chrome & Android.
 */
export async function triggerDeviceNotification(title: string, options?: DeviceNotificationOptions): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    const granted = await Notification.requestPermission();
    if (granted !== 'granted') return false;
  }

  const defaultIcon = '/icons/icon-192.png';
  const defaultBadge = '/icons/icon-192.png';

  // Determine intelligent actions based on notification context
  let actions = options?.actions;
  if (!actions || actions.length === 0) {
    if (options?.url && options.url.includes('chat')) {
      actions = [
        { action: 'open_chat', title: '💬 OPEN CHAT' },
        { action: 'mark_read', title: '✓ MARK AS READ' }
      ];
    } else {
      actions = [
        { action: 'open_link', title: '🌐 OPEN LINK' },
        { action: 'mark_read', title: '✓ MARK AS READ' }
      ];
    }
  }

  const notifOptions: any = {
    body: options?.body || '',
    icon: options?.icon || defaultIcon,
    badge: options?.badge || defaultBadge,
    image: options?.image || undefined,
    tag: options?.tag || `talentio-${Date.now()}`,
    data: options?.data || { url: options?.url || '/?page=chat' },
    actions,
    vibrate: [250, 100, 250, 100, 250],
    renotify: true,
    requireInteraction: true
  };

  // 1. Mobile & PWA standard: ServiceWorkerRegistration.showNotification
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notifOptions);
        return true;
      }
    } catch (err) {
      console.warn('Service worker notification note:', err);
    }
  }

  // 2. Desktop fallback: new Notification()
  try {
    new Notification(title, notifOptions);
    return true;
  } catch (err) {
    console.warn('Notification construct note:', err);
    return false;
  }
}

/**
 * Triggers a Rich Chat Message Notification (matching Android shade in screenshot)
 */
export async function triggerRichChatNotification(
  senderName: string,
  messageText: string,
  avatar?: string,
  conversationId?: string
): Promise<boolean> {
  return triggerDeviceNotification(`💬 ${senderName} • Talentio Chat`, {
    body: messageText,
    icon: avatar || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: `chat-${conversationId || 'general'}`,
    url: conversationId ? `/?page=chat&convId=${conversationId}` : '/?page=chat',
    actions: [
      { action: 'open_chat', title: '💬 OPEN CHAT' },
      { action: 'mark_read', title: '✓ MARK AS READ' }
    ],
    data: {
      type: 'message',
      conversationId,
      url: conversationId ? `/?page=chat&convId=${conversationId}` : '/?page=chat'
    }
  });
}

/**
 * Triggers a Rich Admin Notice / Broadcast Notification (with Talentio branding & link)
 */
export async function triggerRichAdminNoticeNotification(
  title: string,
  description: string,
  actionUrl?: string,
  noticeId?: string
): Promise<boolean> {
  const targetUrl = actionUrl ? (actionUrl.startsWith('/') ? actionUrl : `/?page=${actionUrl}`) : '/?page=notices';
  return triggerDeviceNotification(`📢 Talentio: ${title}`, {
    body: description,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: `notice-${noticeId || Date.now()}`,
    url: targetUrl,
    actions: [
      { action: 'open_link', title: '🌐 OPEN LINK' },
      { action: 'mark_read', title: '✓ MARK AS READ' }
    ],
    data: {
      type: 'notice',
      noticeId,
      url: targetUrl
    }
  });
}

/**
 * Sets the notification badge counter on the mobile app home screen icon (PWA Badging API)
 */
export function updateAppBadge(count: number) {
  if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
    try {
      if (count > 0) {
        // @ts-ignore
        navigator.setAppBadge(count).catch(() => {});
      } else {
        // @ts-ignore
        navigator.clearAppBadge().catch(() => {});
      }
    } catch {
      // Ignored if not supported
    }
  }
}

/**
 * Subscribes current user device to Web Push Notifications
 */
export async function subscribeUserToPush(userId: string): Promise<PushSubscription | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Web Push is not supported in this browser environment.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.info('Notification permission was not granted:', permission);
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    // 1. Attempt to fetch server VAPID public key
    let res: Response;
    try {
      res = await fetch('/api/push/vapid-public-key');
    } catch (fetchErr) {
      console.info('Backend push endpoint not reachable on current host (e.g. Netlify static mode). Local device notifications active.');
      return null;
    }

    if (!res.ok) {
      console.info(`Push server endpoint responded with ${res.statusText}. Local device notifications remain active.`);
      return null;
    }

    const { publicKey } = await res.json();
    if (!publicKey) {
      return null;
    }

    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // 2. Subscribe via PushManager
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
    }

    // 3. Register subscription with server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription,
        userAgent: navigator.userAgent
      })
    });

    return subscription;
  } catch (err) {
    console.warn('Web Push registration note (device notifications remain operational):', err);
    return null;
  }
}

/**
 * Unsubscribes current user device from Web Push Notifications
 */
export async function unsubscribeUserFromPush(userId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          endpoint: subscription.endpoint
        })
      });
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Error unsubscribing from push:', err);
    return false;
  }
}

/**
 * Check current push subscription status
 */
export async function getPushSubscriptionStatus(): Promise<{
  supported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return {
      supported: false,
      permission: 'denied',
      isSubscribed: false
    };
  }

  const permission = Notification.permission;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return {
      supported: true,
      permission,
      isSubscribed: !!subscription
    };
  } catch {
    return {
      supported: true,
      permission,
      isSubscribed: false
    };
  }
}

