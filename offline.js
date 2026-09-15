// offline cache

const VERSION = "1";

self.addEventListener("fetch", (event) => {
  event.respondWith((async() => {
    try {
      const networkResponse = await fetch(event.request);
      if (event.request.method === "GET" && networkResponse.status === 200) {
        const cache = await caches.open(VERSION);
        await cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  })());
});
