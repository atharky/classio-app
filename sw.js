// __BUILD__ lo sustituye por un hash de los ficheros publicados scripts/stamp-sw.mjs al desplegar (ver CI).
const CACHE = 'cuaderno-__BUILD__';
const ASSETS = ['./', './index.html', './styles.css', './data.js', './sketch.js', './anim.js', './lengua.js', './biologia.js', './ciencia.js', './tierra.js', './catalog.js', './sync.js', './main.js', './state.js', './net.js', './ui.js', './update.js', './quiz.js', './question.js', './player.js', './exam.js', './views/home.js', './views/module.js', './views/level.js', './views/privacy.js', './views/sync.js', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
// La versión nueva espera a que el alumno pulse «Recargar» en el aviso de la página.
self.addEventListener('message', event => { if (event.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  // La API de sincronización siempre va a la red.
  if (event.request.method !== 'GET' || new URL(event.request.url).pathname.startsWith('/api/')) return;
  // Stale-while-revalidate: responde al instante desde la caché y la refresca en segundo plano.
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request);
    const fresh = fetch(event.request).then(res => { if (res.ok && new URL(event.request.url).origin === location.origin) cache.put(event.request, res.clone()); return res; }).catch(() => cached);
    return cached || fresh;
  }));
});
