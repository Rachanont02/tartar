// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      document.getElementById('status').textContent = 'พร้อมใช้งาน ✅';
      console.log('SW registered:', reg.scope);
    }).catch(err => {
      document.getElementById('status').textContent = 'ลงทะเบียน Service Worker ไม่สำเร็จ ❌';
      console.error(err);
    });
  });
} else {
  document.getElementById('status').textContent = 'เบราว์เซอร์นี้ไม่รองรับ Service Worker';
}

document.getElementById('cache-btn').addEventListener('click', async () => {
  await fetch('sw-message', {method:'POST'}).catch(()=>null);
  alert('ขอให้ SW ทำ precache แล้ว (ถ้ารองรับ). ลองรีเฟรช/ออฟไลน์ดูได้เลย');
});

document.getElementById('clear-cache-btn').addEventListener('click', async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  alert('ล้าง cache แล้ว');
});
