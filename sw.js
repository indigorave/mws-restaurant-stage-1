self.addEventListener('install', function(event){
	console.log('installing...');
	event.waitUntil(
		caches.open('cache-1').then(function(cache){
			return cache.addAll([
				'./'])
		}).then(function(){console.log('added static caches!')})
	)
})


self.addEventListener('fetch', function(event){
	console.log('fetching...');
	event.respondWith(
		caches.open('cache-1').then(function(cache){
			return cache.match(event.request).then(function(response){
				if(response) {
					console.log('found in cache-1!')
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
