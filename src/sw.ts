const CACHE = "study-cache-v1";
const OFFLINE_ASSETS = ["/", "/manifest.json"];

self.addEventListener("install", (e: any) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE_ASSETS)));
});

self.addEventListener("fetch", (e: any) => {
  const req = e.request;
  // Cache-first cho data & manifest
  if (req.url.includes("/data/") || req.url.endsWith("/manifest.json")) {
    e.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
      )
    );
  }
});
