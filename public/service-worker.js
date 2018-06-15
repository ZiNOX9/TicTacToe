var doCache = true;

var CACHE_NAME = 'my-pwa-cache';

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('Deleting cache: ' + key)
            return caches.delete(key);
          }
        }))
      )
  );
});

self.addEventListener('install', function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
          fetch("asset-manifest.json").then(response => {
              response.json()
            }).then(assets => {
              cache.addAll([
                   '/',
                   'index.html',
                   'js/bootstrap.min.js',
                   'js/jquery.min.js',
                   'js/main.js',
                   'js/tether.min.js',
                   'css/bootstrap.css',
                   'css/font-awesome.min.css',
                   'css/style.css',
               ])
              console.log('cached');
            })
        })
    );
  }
});

self.addEventListener('fetch', function(event) {
    if (doCache) {
      event.respondWith(
          caches.match(event.request).then(function(response) {
              return response || fetch(event.request);
          })
      );
    }
});
