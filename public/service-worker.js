const CACHE_NAME = 'embassy-shell-v1';
const SHELL = [
  '/',
  '/index.html'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(res => res || fetch(request).then(net => {
      if (net.ok && request.url.startsWith(self.location.origin)) {
        const clone = net.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
      }
      return net;
    }).catch(() => caches.match('/')))
  );
});
