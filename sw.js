var CACHE="jornada-v2";
var CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(new URL(e.request.url).origin===location.origin){
        var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)});
      }
      return r;
    }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match("index.html")})})
  );
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){
    return cs.length?cs[0].focus():clients.openWindow("./");
  }));
});
