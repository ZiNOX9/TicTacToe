//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
    './',
    '/',
    'index.html',
    'js/bootstrap.min.js',
    'js/jquery.min.js',
    'js/main.js',
    'js/tether.min.js',
    'css/bootstrap.css',
    'css/font-awesome.min.css',
    'css/style.css',
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




// /**
//  * Cache version, change name to force reload
//  */
// var CACHE_VERSION = 'v1';


// /**
//  * Stuff to put in the cache at install
//  */
// var CACHE_FILES  = [
//     './',
//     '/',
//     'index.html',
//     'js/bootstrap.min.js',
//     'js/jquery.min.js',
//     'js/main.js',
//     'js/tether.min.js',
//     'css/bootstrap.css',
//     'css/font-awesome.min.css',
//     'css/style.css',
// ];


// /**
//  * Service worker 'install' event.
//  * If all the files are successfully cached, then the service worker will be installed.
//  * If any of the files fail to download, then the install step will fail.
//  */
// this.addEventListener('install', function(event) {
//    event.waitUntil(
//         caches.open(CACHE_VERSION).then(function(cache) {
//             console.log('Installing...');
//             return cache.addAll(CACHE_FILES);
//         }).catch(function(a) {
//             console.log(a);
//         })
//     ); // waitUntil
// });


// /**
//  * After a service worker is installed and the user navigates to a different page or refreshes,
//  * the service worker will begin to receive fetch events.
//  *
//  * Network-first approach: if online, request is fetched from network and not from cache
//  */
// this.addEventListener('fetch', function(event) {
//     event.respondWith(function() {
        
//         var res = returnFromServer(event);
//         if (res) {return res;}

//         caches.match(event.request).then(function(res){
//             // Cache hit - return response
//             if(res){
//                 return res;
//             }

//             // no response
//             return null;
//         })

//     }());
// });


/**
 * If we don't have a matching response, we return the result of a call to fetch,
 * which will make a network request and return the data if anything can be retrieved from the network. 
 */
function returnFromServer(event){
    
    // IMPORTANT: Clone the request. A request is a stream and
    // can only be consumed once. Since we are consuming this
    // once by cache and once by the browser for fetch, we need
    // to clone the response.
    var fetchRequest = event.request.clone();

    var url = event.request.clone();
    
    return fetch(fetchRequest).then(
        function(response) {
            
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
                  return null;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_VERSION)
                .then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

            return response;
        }
    ); // return.fetch().then()

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
            //   cache.addAll([
            //        '/',
            //        'index.html',
            //        'js/bootstrap.min.js',
            //        'js/jquery.min.js',
            //        'js/main.js',
            //        'js/tether.min.js',
            //        'css/bootstrap.css',
            //        'css/font-awesome.min.css',
            //        'css/style.css',
            //    ])
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
