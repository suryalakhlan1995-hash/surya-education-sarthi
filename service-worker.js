
const CACHE_NAME = 'sarthi-smart-offline-v7.1.0';
// These are the core files needed to start the app offline
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache core assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache for offline mode: ' + CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Force new service worker to activate immediately
});

// Activate Event: Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch Event: Network First for API/HTML, Cache First for Assets
self.addEventListener('fetch', (event) => {
  // We only handle http/https requests
  if (!event.request.url.startsWith('http')) return;

  // For HTML navigation, try network first to get latest version, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For other assets (JS, CSS, Images), try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
