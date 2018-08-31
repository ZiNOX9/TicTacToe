var CACHE = 'pwabuilder-precache';
var precacheFiles = ['/','index.html','js/bootstrap.min.js','js/jquery.min.js','js/main.js',
  'js/tether.min.js','css/bootstrap.css','css/font-awesome.min.css','css/style.css',
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function () {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[PWA Builder] Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  console.log('[PWA Builder] The service worker is serving the asset.' + evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request) {
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function (response) { return response });
}




// var doCache = true;

// var CACHE_NAME = 'my-pwa-cache';

// self.addEventListener("activate", event => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then(keyList =>
//         Promise.all(keyList.map(key => {
//           if (!cacheWhitelist.includes(key)) {
//             console.log('Deleting cache: ' + key)
//             return caches.delete(key);
//           }
//         }))
//       )
//   );
// });

// self.addEventListener('install', function(event) {
//   if (doCache) {
//     event.waitUntil(
//       caches.open(CACHE_NAME).then(function(cache) {
//           fetch("asset-manifest.json").then(response => {
//               response.json()
//             }).then(assets => {
//               cache.addAll([
//                    '/',
//                    'index.html',
//                    'js/bootstrap.min.js',
//                    'js/jquery.min.js',
//                    'js/main.js',
//                    'js/tether.min.js',
//                    'css/bootstrap.css',
//                    'css/font-awesome.min.css',
//                    'css/style.css',
//                ])
//               console.log('cached');
//             })
//         })
//     );
//   }
// });

// self.addEventListener('fetch', function(event) {
//     if (doCache) {
//       event.respondWith(
//           caches.match(event.request).then(function(response) {
//               return response || fetch(event.request);
//           })
//       );
//     }
// });
