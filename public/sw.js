const CACHE_NAME = "asu-portal-cache-v2";

// Core static assets to cache immediately upon installation
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/asu-medicine-logo.webp",
  "/icons.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass cache completely for:
  // 1. API routes (/api/*)
  // 2. Clerk auth domains (*.clerk.accounts.dev or any clerk endpoint)
  // 3. Vercel speed insights and analytics (/_vercel/*)
  // 4. Non-GET requests (e.g. POST, PUT, DELETE)
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_vercel/") ||
    url.hostname.includes("clerk")
  ) {
    return; // Let the browser handle the request normally
  }

  // Navigation requests (HTML pages) -> Network-First, fallback to cached index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid, cache it for offline use and return
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve index.html from cache
          return caches.match("/index.html") || caches.match("/");
        })
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn("Fetch failed for asset:", event.request.url, err);
      });

      // Return cached response if exists, otherwise wait for network fetch
      return cachedResponse || fetchPromise;
    })
  );
});
