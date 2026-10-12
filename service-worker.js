/* 更新缓存时请修改 CACHE_VERSION，例如 v1 -> v2。 */
const CACHE_VERSION = "daozong-workbench-v1";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const APP_SHELL = [
  "./", "./index.html", "./style.css", "./app.js", "./config.js",
  "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.method !== "GET") return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(APP_SHELL_CACHE).then(cache => cache.put("./index.html", copy));
      }
      return response;
    }).catch(() => caches.match("./index.html").then(cached => cached || caches.match("./"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    });
  }));
});
