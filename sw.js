const CACHE_NAME = 'tartar-v2';
const PRECACHE = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json?v=2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './api.js'
];


self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async () => {
    try {
      const net = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, net.clone());
      return net;
    } catch (e) {
      const cached = await caches.match(req);
      if (cached) return cached;
      // Fallback to app shell
      return caches.match('index.html');
    }
  })());
});

// Trigger precache refresh via POST /sw-message
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && new URL(event.request.url).pathname.endsWith('/sw-message')) {
    event.respondWith(new Response('ok'));
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE);
    })());
  }
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // ถ้าเป็น Apps Script API → network-first ไม่จับแคช
  if (url.host.includes('script.google.com')) return;

  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
      return res;
    }).catch(() => caches.match(event.request).then(m => m || caches.match('./index.html')))
  );
});
