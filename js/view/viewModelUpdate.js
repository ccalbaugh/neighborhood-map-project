var LocationModel = function(data) {
	var self = this;

	self.marker = ko.observable(null);
	self.address = ko.observable(data.address);
	self.location = ko.observable(data.location);
	self.title = ko.observable(data.title)

	var locationMarker = function(address, value) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
		value().marker(marker);
	};

	var removeMarker = function(address) {
		if (address != null) {
			address.marker().setMap(null);
		}
	};
};


var locations = {
	markers: [
		{
			title: 'The Englert Theater',
			id: 'ChIJSyeNzu9B5IcRQzciSCOPPuk',  // A Google Places ID.
			address: '221 E Washington St, Iowa City, IA',
			location: {
				lat: 41.659794,
				lng: -91.532322
			}
		},
		{
			title: 'Basta Pizzeria Ristorante',
			id: 'ChIJn6fO2fFB5IcR6jVX9EN9K6A',  // A Google Places ID.
			address: '121 Iowa Ave, Iowa City, IA',
			location: {
				lat: 41.661022,
				lng: -91.533625
			}
		},
		{
			title: 'Donnellys Irish Pub',
			id: 'ChIJgxklQ-5B5IcRjdC81k4t4ug',  // A Google Places ID.
			address: '110 E College St, Iowa City, IA',
			location: {
				lat: 41.659075,
				lng: -91.534083
			}
			
		}, 
		{
			title: 'Shorts Burger & Shine',
			id: 'ChIJEactIO5B5IcRJ6QdjEyd_UI',  // A Google Places ID.
			address: '18 S Clinton St, Iowa City, IA',
			location: {
				lat: 41.660629,
				lng: -91.534355
			}
			
		}, 
		{
			title: 'FilmScene',
			id: 'ChIJ9WOyRe5B5IcRgFg8TDssBz8',  // A Google Places ID.
			address: '118 E College St, Iowa City, IA',
			location: {
				lat: 41.659283,
				lng: -91.533779
			}
		}
	]
};

var ViewModel = function() {
	var self = this;
	var map;
	var infoWindow;
	var markers = [];

	self.userInput = ko.observable('');
	self.locationList = ko.observableArray([]);
	self.visibleLocations = ko.observableArray([]);

	locations.forEach(function(location) {
		self.locationList().push( new AddressModel(location) );
	});

	self.createListItem = function(location) {
		var listItem = '<li>' + location.name + '</li>';
		self.visibleLocations().push(listItem);
		return self.visibleLocations();
	};

	self.initialize = function() {
		var englert = new google.maps.LatLng(41.659794, -91.532322);

		map = new google.maps.Map(document.querySelector('#map'), {
			center: englert,
			zoom: 10,
			disableDefaultUI: true
		});

		infowindow = new google.maps.InfoWindow();
	  	var service = new google.maps.places.PlacesService(map);

	  	// document.getElementById('submit').addEventListener('click', function() {
		  //   placeDetailsByPlaceId(service, map, infowindow);
		  // });

		self.locationList.forEach(function(place) {
			var markerOptions = {
				map: map,
				position: place.location
			};

			place.marker = new google.maps.Marker(markerOptions);
		});

		self.locationList.forEach(function(place) {
			self.visibleLocations.push(place);
		});
	};

	self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();
		self.visibleLocations.removeAll();

		self.locationList.forEach(function(place) {
			place.marker.setVisible(false);

			if (place.title.toLowerCase().indexOf(searchInput !== -1) {
				self.visibleLocations.push(place);
			});
		});
	};

	// function createMarkerWithTimeout(place, timeout) {
	// 	window.setTimeout(function() {
	// 		var placeLoc = place.geometry.location;
	// 		marker = new google.maps.Marker({
	// 			map: map,
	// 			animation: google.maps.Animation.DROP,
	// 			position: placeLoc
	// 		});
	// 	}, timeout);

	// 	google.maps.event.addListener(Marker, 'click', function() {
	// 		toggleBounce();
	// 		infowindow.setContent(place.name);
	// 		infowindow.open(map, this);
	// 	});

	// 	function toggleBounce() {
	// 		if (marker.getAnimation() !== null) {
	// 			marker.setAnimation(null);
	// 		} else {
	// 			marker.setAnimation(google.maps.Animation.BOUNCE);
	// 		}
	// 	}
	// }	

	// function clearMarkers() {
	// 	for (var i = 0; i < markers.length; i++) {
	// 		markers[i].setMap(null);
	// 	}
	// 	markers = [];
	// }

	// function drop() {
	// 	clearMarkers();
	// 	for (var i = 0; i < markers.length; i++) {
	// 		createMarkerWithTimeout(markers[i], i * 200);
	// 	}
	// }

	

	
	// function placeDetailsByPlaceId(service, map, infowindow) {
	//   // Create and send the request to obtain details for a specific place,
	//   // using its Place ID.
	  

	//   service.getDetails(request, function (place, status) {
	//     if (status === google.maps.places.PlacesServiceStatus.OK) {
	//       // If the request succeeds, draw the place location on the map
	//       // as a marker, and register an event to handle a click on the marker.
	//       console.log("Success");
	//       var marker = new google.maps.Marker({
	//         map: map,
	//         position: place.geometry.location
	//       });

	//       google.maps.event.addListener(marker, 'click', function() {
	//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	//           'Place ID: ' + place.place_id + '<br>' +
	//           place.formatted_address + '</div>');
	//         infowindow.open(map, this);
	//       });

	//       map.panTo(place.geometry.location);
	//     }
	//   });
	// }

	// function locationIterator(results, status) {
	// 	var resultsArr = [];
	// 	if (status === google.maps.places.PlacesServiceStatus.OK) {
	// 		for (var i = 0; i < results.length; i++) {
	// 			createMarkerWithTimeout(results[i]);
	// 			createListItem(results[i]);
				
	// 		}
	// 		console.log(self.placeList());
	// 	}
	// }
	


	// Run the initialize function when the window has finished loading.
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new ViewModel());