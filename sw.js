const CACHE = 'cuaderno-mates-v4';
const ASSETS = ['./', './index.html', './styles.css', './data.js', './sketch.js', './anim.js', './lengua.js', './biologia.js', './ciencia.js', './catalog.js', './sync.js', './app.js', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  // La API de sincronización siempre va a la red.
  if (event.request.method !== 'GET' || new URL(event.request.url).pathname.startsWith('/api/')) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
