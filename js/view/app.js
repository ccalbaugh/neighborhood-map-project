(function(global, mapster, $) {

	var places = [
		{
			title: 'The Englert Theater',
			id: 'ChIJSyeNzu9B5IcRQzciSCOPPuk',  // A Google Places ID.
			formatted_address: '221 E Washington St, Iowa City, IA 52240',
			// latLng: {lat: 41.659794, lng: -91.532322},
			marker: "",
			lat: 41.659794,
			lng: -91.532322
		},
		{
			title: 'Basta Pizzeria Ristorante',
			id: 'ChIJn6fO2fFB5IcR6jVX9EN9K6A',  // A Google Places id.
			formatted_address: '121 Iowa Ave, Iowa City, IA 52240',
			// latLng: {lat: 41.661022, lng: -91.533625},
			lat: 41.661022,
			lng: -91.533625
		},
		{
			title: 'Donnellys Irish Pub',
			id: 'ChIJgxklQ-5B5IcRjdC81k4t4ug',  // A Google Places id.
			formatted_address: '110 E College St, Iowa City, IA 52240',
			// latLng: {lat: 41.659075, lng: -91.534083},
			lat: 41.659794,
			lng: -91.532322
		}, 
		{
			title: 'Shorts Burger & Shine',
			id: 'ChIJEactIO5B5IcRJ6QdjEyd_UI',  // A Google Places id.
			formatted_address: '18 S Clinton St, Iowa City, IA 52240',
			// latLng: {lat: 41.660629, lng: -91.534355},
			lat: 41.659794,
			lng: -91.532322
		}, 
		{
			title: 'FilmScene',
			id: 'ChIJ9WOyRe5B5IcRgFg8TDssBz8',  // A Google Places id.
			formatted_address: '118 E College St, Iowa City, IA 52240',
			// latLng: {lat: 41.659283, lng: -91.533779},
			lat: 41.659794,
			lng: -91.532322
		},
		{
			title: 'Blue Moose Inc',
			id: 'ChIJMWk1KPBB5IcRXC6hLJYE0Uo',  // A Google Places id.
			formatted_address: '211 Iowa Ave, Iowa City, IA 52240',
			// latLng: {lat: 41.661003, lng: -91.532341},
			lat: 41.661003,
			lng: -91.533541
		},
		{
			title: 'The Mill Restaurant',
			id: 'ChIJUQ219u5B5IcRBOsWmmNQJnk',  // A Google Places id.
			formatted_address: '120 E Burlington St, Iowa City, IA 52240',
			// latLng: {lat: 41.658244, lng: -91.533651},
			lat: 41.658244,
			lng: -91.533651
		},
	];

	var Place = function(data) {
		this.address = ko.observable(data.address);
		this.latLng = ko.observable(data.latLng);
		this.title = ko.observable(data.title);
		this.marker = ko.observable(0);
	};

	

	var ViewModel = function() {
		var self = this;

		self.userInput = ko.observable();
		self.currentLocation = ko.observable();
		self.allPlaces = [];
		self.visiblePlaces = ko.observableArray([]);

		places.forEach(function(place) {
			self.visiblePlaces().push(place);
		});

		places.forEach(function(place) {
			self.allPlaces.push(place);
		});

		// animates the correct marker
		self.markerClick = function(place) {
			google.maps.event.trigger(place.marker, 'click');
		};
		
		self.setLocation = function(clickedLocation) {
			self.currentLocation(clickedLocation);
		};

		function drop() {
			for (var i = 0; i < self.visiblePlaces().length; i++) {
				addMarkerWithTimeout(self.visiblePlaces()[i], i * 400);
			}	
		}

////////// JQuery Map Widget Code
		// var $mapster = $('#map-canvas').mapster(Mapster.MAP_OPTIONS),
		// 	geocoder = new google.maps.Geocoder();



		// $mapster.mapster('getCurrentPosition', function(position) {
		// 	$mapster.mapster('addMarker', {
		// 		lat: position.coords.latitude,
		// 		lng: position.coords.longitude
		// 	});
		// });	

		// var matches = $mapster.mapster('findMarkers', function(marker) {
		// 	return marker.id === 'ChIJUQ219u5B5IcRBOsWmmNQJnk';
		// });

		// $mapster.mapster('addMarker', {

		// });

		// $mapster.mapster('removeMarkers', function(marker) {
		// 	return marker.id === 'ChIJMWk1KPBB5IcRXC6hLJYE0Uo';
		// });

		// $mapster.mapster('setPano', '#pip-pano', {
		// 	position: {

		// 	},
			// pov: {
			// 	heading: 0,
			// 	pitch: 0
			// },
		// 	events: [{
		// 		name: 'position_changed',
		// 		callback: function() {
		// 			alert('changed');
		// 		}
		// 	}, {
		// 		name: 'links_changed',
		// 		callback: function(e, panorama) {
		// 			console.log(panorama.getLinks());
		// 		}
		// 	}]
		// });

////////// This used HTML 5 Geolocation, which returns a currentLocation obj that provides a lat and lng,
		// First thing to do is check the navigator obj for HTML 5 Geolocation
		// if (navigator.geolocation) {
		// 	navigator.geolocation.getCurrentPosition(function(position) {
		// 		$mapster.mapster('addMarker', {
		// 			lat: position.coords.latitude,
		// 			lng: position.coords.longitude
		// 		});
		// 	});
		// }

////////// this is an asynchronous method so we have to provide a callback for any success or error
		// geocode({
		// 	address: 'Golden Gate Bridge, San Fransisco, CA',
		// 	success: function(resulkts) {
		// 		$mapster.mapster('addMarker', {
		// 			lat: result.geometry.location.lat(),
		// 			lng: result.geometry.location.lng()
		// 		})
		// 	},
		// 	error: function(status) {
		// 		console.error(status);
		// 	}
		// })

		function addMarkerWithTimeout(place, timeout) {
			setTimeout(function() {
				var marker = map.addMarker({
					lat: place.lat,
					lng: place.lng,
					events: [{
						name: 'click',
						callback: selectMarker(place, marker, place.infoWindow)
					}],
				 content: '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
		         			'Place ID: ' + place.id + '<br>' +
		         			place.formatted_address + '</div>',
					icon: 'https://mapicons.mapsmarker.com/wp-content/uploads/mapicons/shape-default/color-128e4d/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/tree.png'
				});

//////////////////  OLD CODE
				// place.marker = new google.maps.Marker({
				// 	position: {
				// 		lat: place.lat,
				// 		lng: place.lng
				// 	},
				// 	map: map,
				// 	icon: 'https://mapicons.mapsmarker.com/wp-content/uploads/mapicons/shape-default/color-128e4d/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/tree.png',
				// 	animation: google.maps.Animation.DROP,
				// 	title: place.title
				// });	

				place.infoWindow = new google.maps.InfoWindow({
					content: '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
		          				'Place ID: ' + place.id + '<br>' +
		          				place.formatted_address + '</div>'
				});			

				google.maps.event.addListener(place.marker, 'click', selectMarker(place, place.marker, place.infoWindow));

			}, timeout);
		}

		// run drop() after the map is idle, which should signifiy that it is fully loaded
		google.maps.event.addListenerOnce(map, 'idle', drop);

		
	  	var lastInfoWindow = null;

		function selectMarker(place, marker, infoWindow) {
			function toggleBounce(marker) {
				if (marker.getAnimation() !== null) {
					setTimeout(function() { marker.setAnimation(null); }, 750);
				} else {
					// Sets the marker to bounce twice and then stop, thanks to Simon Steinberger on stackoverflow for the solution
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() { marker.setAnimation(null); }, 750);
					self.setLocation(marker);
				}
			};
			// this function will 
			return function() {

				if (lastInfoWindow === infoWindow) {
					toggleBounce(marker);
					currentLocation = null;
					infoWindow.close(map, this);
					lastInfoWindow = null;
				} else {

					if (lastInfoWindow !== null) {
						lastInfoWindow.close(map, this);
						toggleBounce(marker);
					}

				toggleBounce(marker);	
		        infoWindow.open(map.gMap, this);
				lastInfoWindow = infoWindow;

				map.panTo(place.latLng);
				}
			}
		}

		self.filterMarkers = function() {
			var searchInput = self.userInput().toLowerCase();
			// clears the observable array so the list can be repopulated with matching results
			self.visiblePlaces.removeAll();
			// visiblePlaces is used for the list of names, and allPlaces is used for the markers
			self.allPlaces.forEach(function(place) {
				place.marker.setVisible(false);

				if (place.title.toLowerCase().indexOf(searchInput) !== -1) {
					self.visiblePlaces.push(place);
				}
			});

			self.visiblePlaces().forEach(function(place) {
				place.marker.setVisible(true);
			});
		};
	};

	// creates an alert if the Google Maps API can't be reached
	function googleError() { alert("Sorry! Google Maps cannot be loaded"); }

}(this., this..Mapster || (this..Mapster = {}), this..jQuery));

