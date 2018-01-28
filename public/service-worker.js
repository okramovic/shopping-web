const shellName = "shopmem_v0.0",
     shellFiles = [
  "/index.html"
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


self.addEventListener('fetch', e =>{

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