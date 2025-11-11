// Service Worker for PWA with Auto Cache Busting
// Version được tự động update mỗi khi build (injected by build script)
const APP_VERSION = '{{APP_VERSION}}'; // Sẽ được thay thế bằng timestamp hoặc git hash khi build
const CACHE_NAME = `thien-tai-dat-viet-${APP_VERSION}`;
const STATIC_CACHE = `static-${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${APP_VERSION}`;

// Assets to cache on install (chỉ cache assets không thay đổi)
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Critical assets để preload (load ngay khi service worker install)
const CRITICAL_ASSETS = [
  // Có thể thêm critical JS/CSS nếu cần
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version:', APP_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - Clean old caches (XÓA TẤT CẢ cache cũ)
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version:', APP_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // XÓA TẤT CẢ cache không phải version hiện tại
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages
});

// Fetch event - Network-first strategy để luôn có version mới nhất
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Smart caching strategy: Khác nhau cho từng loại resource
  const urlPath = url.pathname;
  
  // Strategy 1: HTML - Network-first (luôn fetch mới)
  if (request.destination === 'document' || urlPath === '/' || urlPath.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // HTML không cache, luôn fetch mới
          return networkResponse;
        })
        .catch(() => {
          // Offline: Fallback to cached HTML
          return caches.match('/index.html');
        })
    );
    return;
  }
  
  // Strategy 2: JS/CSS với hash - Cache-first (vì hash đảm bảo version mới)
  if (request.destination === 'script' || request.destination === 'style' || urlPath.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Có cache → Return ngay (nhanh hơn)
          // Background fetch để update cache
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
          }).catch(() => {}); // Ignore errors trong background fetch
          
          return cachedResponse;
        }
        
        // Không có cache → Fetch từ network
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // Strategy 3: Images - Cache-first với stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Background fetch để update cache
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
        }).catch(() => {}); // Ignore errors
        
        // Return cache ngay nếu có, nếu không thì fetch
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetchPromise.then(() => fetch(request));
      })
    );
    return;
  }
  
  // Strategy 4: Fonts và assets khác - Cache-first
  if (request.destination === 'font' || request.destination === 'manifest') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // Strategy 5: Data files (JSON) - Network-first với cache fallback
  if (urlPath.endsWith('.json') || urlPath.includes('/data/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            // Cache data files với TTL ngắn (có thể expire sau 1 giờ)
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline: Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }
  
  // Default: Network-first
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

