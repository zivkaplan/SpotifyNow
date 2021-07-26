const cacheName = 'v1';

self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');

    // e.waitUntil(
    //     caches
    //         .open(cacheName)
    //         .then((cache) => {
    //             console.log('Service Worker: Caching');
    //             cache.addAll(cacheAssets);
    //         })
    //         .then(() => self.skipWaiting())
    // );
});

self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    //remove unwanted caches
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache) => {
                    if (cache !== cacheName) {
                        console.log(`Service Worker: Clearing Old Cache`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                const resClone = res.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(e.request, resClone);
                });
                return res;
            })
            .catch((err) => {
                caches.match(e.request).then((res) => {
                    return res;
                });
            })
    );
});
