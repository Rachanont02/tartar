// sw.js (clean)
const VERSION = 'v5';
const CACHE_NAME = `tartar-${VERSION}`;

// ใช้พาธแบบ relative เพื่อรองรับ /tartar/
const PRECACHE = [
  './',                    // เผื่อโหลดแบบ directory index
  './index.html',
  './style.css',
  './app.js',
  './api.js',
  './manifest.json?v=2',   // ให้ตรงกับที่อ้างใน index.html
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'   // ใช้เป็น apple-touch-icon ก็ได้
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) ไม่แคช Google Apps Script API (เพื่อหลีกเลี่ยงข้อมูลค้าง)
  if (url.host.includes('script.google.com')) {
    event.respondWith(fetch(req));
    return;
  }

  // 2) ไฟล์ที่อยู่ใน PRECACHE → cache-first (เร็วและทำงานออฟไลน์)
  const isPrecached = PRECACHE.some((p) => {
    // เทียบแบบง่าย ๆ ให้ครอบคลุมทั้ง ./index.html และ /tartar/index.html
    const clean = p.replace('./', '');
    return url.pathname.endsWith(clean);
  });

  if (isPrecached) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        });
      })
    );
    return;
  }

  // 3) คำขออื่น ๆ → network-first แล้วค่อย fallback ไป cache / index.html
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then((m) => m || caches.match('./index.html'))
      )
  );
});
