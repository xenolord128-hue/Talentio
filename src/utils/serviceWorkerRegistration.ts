/**
 * Registers the Talentio PWA Service Worker for offline capability & mobile asset caching.
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for service worker updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.info('Talentio: New content is available and ready upon reload.');
                } else {
                  console.info('Talentio: Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('Talentio Service Worker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // In development mode, aggressively unregister any service worker to avoid caching stale vite chunks
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
}
