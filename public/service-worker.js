const shellName = "shopmem_v0.0.0",
     shellFiles = [
  "/index.html",
  "/dist/52e6306f9e66fd5a4b1fc7a3c41213b5.css",
  "/dist/e6abc6390b18e55608b4011e95c4e1e9.js",
  "/sw-reg.js",
       
  "/vendor/vue2.5.13.js",
  "/vendor/dexie.2.0.1.js"
]

self.addEventListener('install', e =>{
     console.log('[ServiceWorker] Install');

     e.waitUntil(
               caches.open(shellName)
               .then(cache => {
                    console.log('[ServiceWorker] installation: Caching app shell', cache);

                    return cache.addAll(shellFiles);
               })
               .then(()=>{
                    console.log('[install] All required resources have been cached');
                    return self.skipWaiting();
               })
     );
});
self.addEventListener('activate', e =>{

     console.log('[SW activate]');
     console.log('Cache newest version:', shellName);

     // deleting old caches
     e.waitUntil(
          caches.keys().then( cacheNames =>{
               return Promise.all(
                    cacheNames.map( cacheName => {
                              console.log("activate: cache filtering:", cacheName);
                         
                              if (cacheName !== shellName) {
                                   console.log('deleting cache:', cacheName)
                                   return caches.delete(cacheName);
                              }
                    })
               );
          })
     );
})
//   https://stackoverflow.com/questions/46284872/service-worker-install-event-vs-activate-event

self.addEventListener('fetch', e =>{

     if (e.request.url.match('^.*(\/API\/).*$')) {
        console.log('API request?')
        return false;
     }
  
     // from   https://stackoverflow.com/questions/47070258/service-worker-spreading

     e.respondWith(
               fromNetwork(e.request.url, 2000)
               .catch(() => fromCache(e.request))
     );
  
  
     function fromNetwork(request, timeout) {
          return new Promise((resolve, reject)=>{

               const timeoutId = setTimeout(reject, timeout);
                
               fetch(request)
               .then(response => {
                    clearTimeout(timeoutId);
                    resolve(response);
               }, reject);
          });
     }
  
     function fromCache(request) {
          return caches.open(shellName)
               .then( cache =>{
                    return cache.match(request)
                              .then(matching => {
                                   return matching || Promise.reject('no-match');
                              });
          });
     }     
});