// Cache first, updated behind it (Phase 12): the page opens from the cache at once, even on a weak signal, and what
// the network brings replaces the cached copy for next time. The page itself asks version.json (never cached) whether
// it is the newest build, and offers "A new version is ready · Reload".
// Nothing cached yet: the network, as before; offline with nothing cached: the cached start page.
const CACHE = 'kettle-bar-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

async function refresh(req) {
  const res = await fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }); // past the browser's own cache
  if (res.ok) await (await caches.open(CACHE)).put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('/version.json')) return; // version.json: always the network
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    const fresh = refresh(e.request);
    if (cached) { e.waitUntil(fresh.catch(() => {})); return cached; }
    return fresh.catch(async () => (await caches.match('./')) || (await caches.match('index.html')) || Response.error());
  })());
});
