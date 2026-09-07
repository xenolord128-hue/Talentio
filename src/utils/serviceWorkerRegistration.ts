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

    // 1. Fetch server VAPID public key
    const res = await fetch('/api/push/vapid-public-key');
    if (!res.ok) {
      throw new Error(`Failed to fetch VAPID key: ${res.statusText}`);
    }
    const { publicKey } = await res.json();
    if (!publicKey) {
      throw new Error('VAPID public key was empty');
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
    console.warn('Error subscribing to Web Push notifications:', err);
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

