//Sets up event listner for successful installation of service worker, identify which files to cache
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open('cache-init').then(function(cache){
			return cache.addAll([
			 './'
		])
		}).then(function(){console.log('Static caches added!')})
	)
})

//Removes old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//Fetches content from cache-init when network is no longer available
self.addEventListener('fetch', function(event){
	console.log('Loading content');
	event.respondWith(
		caches.open('cache-init').then(function(cache){
			return cache.match(event.request).then(function(response){
				if(response) {
					console.log('found in cache-init!')
					return response}
				return fetch(event.request).then(function(fetchResponse){
					console.log('new fetch!')
					console.log(event.request.url)
					if(!event.request.url.startsWith('chrome'))
					{cache.put(event.request, fetchResponse.clone())};
					return fetchResponse;
				})
			})
		}))
})
