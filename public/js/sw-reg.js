console.log('registering sw')

if ('serviceWorker' in navigator){
     console.log('registering sw 2')

     navigator.serviceWorker
          .register('service-worker.js')
          .then(function(reg){
               console.log('Service Worker registered')
     }) 
} else {
     //console.log("storing this app offline isn't going to be possible");
}