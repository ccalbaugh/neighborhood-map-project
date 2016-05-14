var locations = [
	{
		title: 'The Englert Theater',
		id: 'ChIJSyeNzu9B5IcRQzciSCOPPuk',  // A Google Places ID.
		address: '221 E Washington St, Iowa City, IA',
		latLng: {lat: 41.659794, lng: -91.532322},
		// lat: "41.659794",
		// lng: "-91.532322"
	},
	{
		title: 'Basta Pizzeria Ristorante',
		id: 'ChIJn6fO2fFB5IcR6jVX9EN9K6A',  // A Google Places ID.
		address: '121 Iowa Ave, Iowa City, IA',
		latLng: {lat: 41.661022, lng: -91.533625},
		// lat: "41.661022",
		// lng: "-91.533625"
	},
	{
		title: 'Donnellys Irish Pub',
		id: 'ChIJgxklQ-5B5IcRjdC81k4t4ug',  // A Google Places ID.
		address: '110 E College St, Iowa City, IA',
		latLng: {lat: 41.659075, lng: -91.534083},
		// lat: "41.659794",
		// lng: "-91.532322"
	}, 
	{
		title: 'Shorts Burger & Shine',
		id: 'ChIJEactIO5B5IcRJ6QdjEyd_UI',  // A Google Places ID.
		address: '18 S Clinton St, Iowa City, IA',
		latLng: {lat: 41.660629, lng: -91.534355},
		// lat: "41.659794",
		// lng: "-91.532322"
	}, 
	{
		title: 'FilmScene',
		id: 'ChIJ9WOyRe5B5IcRgFg8TDssBz8',  // A Google Places ID.
		address: '118 E College St, Iowa City, IA',
		latLng: {lat: 41.659283, lng: -91.533779},
		// lat: "41.659794",
		// lng: "-91.532322"
	}
];

var LocationModel = function(data) {
	this.address = ko.observable(data.address);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.title = ko.observable(data.title);
	this.marker = ko.observable(0);

	// this.locationMarker = function(data) {
	// 	var marker = new google.maps.Marker({
	// 		position: LatLng,
	// 		map: map
	// 	});
	// 	data.marker(marker);
	// 	console.log(position);
	// };

	// var removeMarker = function(address) {
	// 	if (address != null) {
	// 		address.marker().setMap(null);
	// 	}
	// };
};

var ViewModel = function() {
	var self = this;

	self.userInput = ko.observable('');
	self.allPlaces = [];
	self.visiblePlaces = ko.observableArray();

	// creates new LocationModel objects for each location in locations
	locations.forEach(function(location) {
		self.allPlaces.push( new LocationModel(location) );
	});

	map = new google.maps.Map(document.querySelector('#map'), {
		center: {lat: 41.659794, lng: -91.532322},
		zoom: 17,
		disableDefaultUI: true
	});

	self.initialize = function() {
		self.createListItem = function(location) {
			var listItem = '<li>' + location.name + '</li>';
			self.visiblePlaces.push(listItem);
			return self.visiblePlaces;
		};
	};
	//-------------------From Codepen-----------------------
	self.allPlaces.forEach(function(place) {
		var markerOptions = {
			map: self.googleMap,
			position: place.latLng
		};

		place.marker = new google.maps.Marker(markerOptions);
	});

	self.allPlaces.forEach(function(place) {
		self.visiblePlaces.push(place);
	});
	
  	var service = new google.maps.places.PlacesService(map);

  	// document.getElementById('submit').addEventListener('click', function() {
	  //   placeDetailsByPlaceId(service, map, infowindow);
	  // });

	function markerFunction(marker, infoWindow) {

		self.clearMarkers = function() {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers = [];
		};

		self.drop = function() {
			clearMarkers();
			for (var i = 0; i < markers.length; i++) {
				createMarkerWithTimeout(markers[i], i * 200);
			}
		};

		self.toggleBounce = function() {
			if (marker.getAnimation() !== null) {
				setTimeout(function() { marker.setAnimation(null); }, 1000);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
			setLocation(marker);
			drop(marker);
		};		
	}

	locations.forEach(function(place) {
		var marker = new google.maps.Marker({
			address: place.address,
			position: place.latLng,
			map: map,
			title: place.title
		});

		infowindow = new google.maps.InfoWindow({
			content: place.title
		});

		google.maps.event.addListener(marker, 'click', markerFunction(marker, infowindow));
		self.visiblePlaces.push(marker);
	});

	self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();

		self.visiblePlaces().removeAll();

		self.allPlaces.forEach(function(place) {
			place.marker.setVisible(false);

			if (place.title.toLowerCase().indexOf(searchInput) !== -1) {
				self.visiblePlaces().push(place);
			}
		});

		self.visiblePlaces().forEach(function(place) {
			place.marker.setVisible(true);
		});
	};

	for (var i = 0; i < locations.length; i++) {
		var latLng = new google.maps.LatLng(locations[i].lat, locations[i].lng);
		var marker = new google.maps.Marker({
			address: locations[i].address,
			position: locations[i].latLng,
			map: map,
			title: locations[i].title,
		});
		console.log("hello");
		infoWindow = new google.maps.InfoWindow({
		    content: locations[i].title
		});

		google.maps.event.addListener(marker, 'click', markerFunction(marker, infoWindow));
		self.allPlaces.push(marker);
	}

	this.currentLocation = ko.observable();
	this.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};

	function createMarkerWithTimeout(place, timeout) {
		window.setTimeout(function() {
			var placeLoc = place.geometry.location;
			marker = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				position: placeLoc
			});
		}, timeout);

		google.maps.event.addListener(Marker, 'click', function() {
			toggleBounce();
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}	
	
	function placeDetailsByPlaceId(service, map, infowindow) {
	  // Create and send the request to obtain details for a specific place,
	  // using its Place ID.
	  

	  service.getDetails(request, function (place, status) {
	    if (status === google.maps.places.PlacesServiceStatus.OK) {
	      // If the request succeeds, draw the place location on the map
	      // as a marker, and register an event to handle a click on the marker.
	      console.log("Success");
	      var marker = new google.maps.Marker({
	        map: map,
	        position: place.geometry.location
	      });

	      google.maps.event.addListener(marker, 'click', function() {
	        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	          'Place ID: ' + place.place_id + '<br>' +
	          place.formatted_address + '</div>');
	        infowindow.open(map, this);
	      });

	      map.panTo(place.geometry.location);
	    }
	  });
	}

	function locationIterator(results, status) {
		var resultsArr = [];
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarkerWithTimeout(results[i]);
				createListItem(results[i]);
			}
			console.log(self.allPlaces);
		}
	}
	
	// Run the initialize function when the window has finished loading.
	//google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings( new ViewModel() );