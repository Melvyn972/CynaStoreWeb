const CACHE_NAME = 'cynastore-v1';
const STATIC_CACHE = 'cynastore-static-v1';
const DYNAMIC_CACHE = 'cynastore-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/js/'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.endsWith('/')));
    })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de mise en cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes API et les websockets
  if (url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/_next/webpack-hmr') ||
      request.method !== 'GET') {
    return;
  }

  // Stratégie Cache First pour les assets statiques
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Stratégie Network First pour les pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache seulement les réponses réussies
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback vers le cache si le réseau échoue
        return caches.match(request).then((response) => {
          return response || caches.match('/').then((fallback) => {
            return fallback || new Response('Page non disponible hors ligne', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        });
      })
  );
});

// Gestion des messages pour les mises à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});