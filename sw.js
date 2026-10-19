/* Таза Аба — service worker: офлайн-оболочка приложения.
 * Файлы приложения: сначала сеть, при отсутствии сети — кэш (обновления приходят сразу).
 * Данные о воздухе, погода, новости и тайлы карты НЕ кэшируются — всегда живые, без подмены цифр. */
const CACHE = "taza-aba-v15";
const SHELL = ["./", "index.html", "styles.css", "theme.css", "ethno.css", "dark.css", "i18n.js", "data.js", "kg-places.js", "extra.js", "i18n_tr.js", "quick.js", "quick.css", "config.js", "sources.js", "app.js", "maarif.js", "maarif-world.js", "maarif.css", "layout.css", "mobile.css", "search.js", "history.js", "history.css", "icons/maarif-emblem.png", "icons/maarif-logo.png",
  "vendor/leaflet/leaflet.js", "vendor/leaflet/leaflet.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;   // внешние API — напрямую в сеть
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("index.html"))));
});
