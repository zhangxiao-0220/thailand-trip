/* 泰国行程 PWA：离线缓存 */
const CACHE='thai-trip-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./images/icon-192.png','./images/icon-512.png','./images/icon-maskable-512.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{ caches.open(CACHE).then(c=>c.put('./index.html', r.clone())); return r; }).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.origin===location.origin){
    e.respondWith(caches.match(req).then(hit=> hit || fetch(req).then(r=>{ caches.open(CACHE).then(c=>c.put(req, r.clone())); return r; }).catch(()=>hit)));
  }
});
