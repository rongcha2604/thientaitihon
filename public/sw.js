const CACHE_NAME = 'tieu-hoc-quiz-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - cache-first strategy for JSON files
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Cache manifest.json and data/*.json files
  if (
    url.pathname === '/manifest.json' ||
    (url.pathname.startsWith('/data/') && url.pathname.endsWith('.json'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request, { cache: 'force-cache' }).then((response) => {
          // Don't cache if not successful
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response before caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
  }
});

