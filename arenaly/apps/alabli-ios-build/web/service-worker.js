
const CACHE_NAME = 'ly.alabli.app-v1.0.0';
const ASSETS = [
  "./assets/coach-card.png",
  "./assets/gym-card.png",
  "./assets/hero.png",
  "./assets/icon.png",
  "./assets/padel-court.png",
  "./assets/ref-checkout-field.png",
  "./assets/ref-detail-field.png",
  "./assets/ref-football-card.png",
  "./assets/ref-icon-coach.png",
  "./assets/ref-icon-football.png",
  "./assets/ref-icon-gym.png",
  "./assets/ref-icon-jersey.png",
  "./assets/ref-icon-padbol.png",
  "./assets/ref-icon-padel.png",
  "./assets/ref-icon-players.png",
  "./assets/ref-icon-trophy.png",
  "./assets/ref-padel-one.png",
  "./assets/ref-qr.png",
  "./assets/reference-first.png",
  "./assets/venue-football.png",
  "./index.html",
  "./main.js",
  "./style.css",
  "./manifest.json"
];

// Install Event: Cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache First Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request); // Network fallback
      })
  );
});
