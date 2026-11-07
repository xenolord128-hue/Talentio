// Talentio PWA Service Worker (talentio-pwa-v8-notification-fix)
const CACHE_NAME = 'talentio-pwa-v8-notification-fix';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json?v=20261107',
  '/assets/talentio-logo.png?v=20261107',
  '/icons/notification-icon.png?v=20261107',
  '/icons/notification-badge.png?v=20261107',
  '/notification-icon.png',
  '/notification-badge.png',
  '/icons/icon-192.png?v=20261107',
  '/icons/icon-512.png?v=20261107',
  '/icons/icon-maskable-512.png?v=20261107',
  '/icons/apple-touch-icon.png?v=20261107'
];

// Install Event: Pre-cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clean up outdated caches and claim active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Cache strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests, chrome-extension, and Firebase / Cloud API endpoints, plus Vite dev server scripts
  if (
    request.method !== 'GET' ||
    url.protocol.startsWith('chrome-extension') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.search.includes('v=') ||
    url.search.includes('t=')
  ) {
    return;
  }

  // 1. Navigation / HTML Page Requests -> Network first, fallback to cached index.html for SPA
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
          return new Response('Offline - Talentio App Shell is ready when connection is restored.', {
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, SVGs, Fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ============================================================================
// REAL WEB PUSH NOTIFICATIONS IN SERVICE WORKER
// ============================================================================

// 1. Push Event Listener: Triggers when backend pushes a Web Push payload
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch (err) {
    payload = {
      title: 'Talentio Notification',
      body: event.data.text()
    };
  }

  const title = payload.title || 'Talentio';
  const type = payload.type || 'general';

  // Customize actions for messages vs notices (as requested by user screenshot)
  let actions = payload.actions || [];
  if (!actions || actions.length === 0) {
    if (type === 'message' || (payload.url && payload.url.includes('chat'))) {
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

  // Resolve absolute URLs for icon and badge to avoid Android background/closed service worker resolution failure
  const origin = self.location.origin;
  const toAbsoluteUrl = (path, fallback) => {
    try {
      const target = path || fallback;
      if (!target) return undefined;
      if (target.startsWith('http://') || target.startsWith('https://')) {
        return target;
      }
      return new URL(target, origin).href;
    } catch (e) {
      return path || fallback;
    }
  };

  // Dedicated official Talentio notification assets (192x192 icon & 96x96 transparent monochrome badge)
  const defaultIcon = toAbsoluteUrl('/icons/notification-icon.png');
  const defaultBadge = toAbsoluteUrl('/icons/notification-badge.png');

  let resolvedIcon = toAbsoluteUrl(payload.icon, defaultIcon);
  let resolvedBadge = toAbsoluteUrl(payload.badge, defaultBadge);

  // If payload sent outdated or broken relative paths like '/icon-192.png', map to dedicated assets
  if (!resolvedIcon || resolvedIcon.includes('icon-192.png')) {
    resolvedIcon = defaultIcon;
  }
  if (!resolvedBadge || resolvedBadge.includes('icon-192.png')) {
    resolvedBadge = defaultBadge;
  }

  const options = {
    body: payload.body || '',
    icon: resolvedIcon,
    badge: resolvedBadge,
    image: payload.image ? toAbsoluteUrl(payload.image) : undefined,
    tag: payload.tag || `talentio-${Date.now()}`,
    data: {
      url: payload.url || (payload.conversationId ? `/?page=chat&convId=${payload.conversationId}` : '/?page=chat'),
      type: payload.type,
      conversationId: payload.conversationId,
      noticeId: payload.noticeId,
      timestamp: Date.now()
    },
    actions,
    requireInteraction: true,
    renotify: true,
    vibrate: [250, 100, 250, 100, 250],
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 2. Notification Click Listener: Handles clicking notification or actions
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const notifData = event.notification.data || {};
  let targetUrl = notifData.url || '/?page=chat';

  if (action === 'open_chat' && notifData.conversationId) {
    targetUrl = `/?page=chat&convId=${notifData.conversationId}`;
  } else if (action === 'open_link' && notifData.url) {
    targetUrl = notifData.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If user clicked 'MARK AS READ', notify open clients
      if (action === 'mark_read') {
        for (const client of clientList) {
          client.postMessage({
            type: 'TALENTIO_MARK_READ',
            data: notifData
          });
        }
        return;
      }

      // If a tab is already open, focus it and post a navigation message
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'TALENTIO_NOTIFICATION_CLICK',
            action,
            data: notifData,
            url: targetUrl
          });
          if (client.navigate) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // If no tab is open, open a new window with the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

