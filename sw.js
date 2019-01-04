var CACHE_NAME = 'tictactoe-v3';
var urlsToCache = [
    '/',
    '/index.html',
    'favicons/android-chrome-144x144.png ',
    'favicons/android-chrome-192x192.png ',
    'favicons/android-chrome-256x256.png ',
    'favicons/android-chrome-36x36.png ',
    'favicons/android-chrome-384x384.png ',
    'favicons/android-chrome-48x48.png ',
    'favicons/android-chrome-512x512.png ',
    'favicons/android-chrome-72x72.png ',
    'favicons/android-chrome-96x96.png ',
    'favicons/apple-touch-icon-114x114.png ',
    'favicons/apple-touch-icon-120x120.png ',
    'favicons/apple-touch-icon-144x144.png ',
    'favicons/apple-touch-icon-152x152.png ',
    'favicons/apple-touch-icon-180x180.png ',
    'favicons/apple-touch-icon-57x57.png ',
    'favicons/apple-touch-icon-60x60.png ',
    'favicons/apple-touch-icon-72x72.png ',
    'favicons/apple-touch-icon-76x76.png ',
    'favicons/apple-touch-icon.png ',
    'favicons/favicon-16x16.png ',
    'favicons/favicon-194x194.png ',
    'favicons/favicon-32x32.png ',
    'favicons/favicon.ico ',
    'favicons/mstile-144x144.png ',
    'favicons/mstile-150x150.png ',
    'favicons/mstile-310x150.png ',
    'favicons/mstile-310x310.png ',
    'favicons/mstile-70x70.png ',
    'favicons/safari-pinned-tab.svg ',
    'js/bootstrap.min.js',
    'js/jquery.min.js',
    'js/main.js',
    'js/tether.min.js',
    'css/bootstrap.css',    
    'css/style.css'
];


self.addEventListener('install', function (event) {
    console.log("ServiceWorker Installing...");
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('ServiceWorker Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log("ServiceWorker Activating...");
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log("ServiceWorker deleting Cache : " + cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log("ServiceWorker Fetching...");
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                console.log("ServiceWorker Opening Cache...")
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
