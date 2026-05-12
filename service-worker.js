self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("pwa-cache").then(cache => {
      return cache.addAll([
        "/",              // page d’accueil
        "/index.html",    // ton HTML principal
        "/manifest.json", // le manifest
        "/style.css",     // ton CSS
        "/script.js"      // ton JS
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
