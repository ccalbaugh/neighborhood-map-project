var places = [
	{
		title: 'The Englert Theater',
		place_id: 'ChIJSyeNzu9B5IcRQzciSCOPPuk',  // A Google Places ID.
		formatted_address: '221 E Washington St, Iowa City, IA 52240',
		latLng: {lat: 41.659794, lng: -91.532322},
		marker: ""
		// lat: "41.659794",
		// lng: "-91.532322"
	},
	{
		title: 'Basta Pizzeria Ristorante',
		place_id: 'ChIJn6fO2fFB5IcR6jVX9EN9K6A',  // A Google Places place_id.
		formatted_address: '121 Iowa Ave, Iowa City, IA 52240',
		latLng: {lat: 41.661022, lng: -91.533625},
		// lat: "41.661022",
		// lng: "-91.533625"
	},
	{
		title: 'Donnellys Irish Pub',
		place_id: 'ChIJgxklQ-5B5IcRjdC81k4t4ug',  // A Google Places place_id.
		formatted_address: '110 E College St, Iowa City, IA 52240',
		latLng: {lat: 41.659075, lng: -91.534083},
		// lat: "41.659794",
		// lng: "-91.532322"
	}, 
	{
		title: 'Shorts Burger & Shine',
		place_id: 'ChIJEactIO5B5IcRJ6QdjEyd_UI',  // A Google Places place_id.
		formatted_address: '18 S Clinton St, Iowa City, IA 52240',
		latLng: {lat: 41.660629, lng: -91.534355},
		// lat: "41.659794",
		// lng: "-91.532322"
	}, 
	{
		title: 'FilmScene',
		place_id: 'ChIJ9WOyRe5B5IcRgFg8TDssBz8',  // A Google Places place_id.
		formatted_address: '118 E College St, Iowa City, IA 52240',
		latLng: {lat: 41.659283, lng: -91.533779},
		// lat: "41.659794",
		// lng: "-91.532322"
	},
	{
		title: 'Blue Moose Inc',
		place_id: '',  // A Google Places place_id.
		formatted_address: '211 Iowa Ave, Iowa City, IA 52240',
		latLng: {lat: 41.661003, lng: -91.532341}
	},
	{
		title: 'The Mill Restaurant',
		place_id: '',  // A Google Places place_id.
		formatted_address: '120 E Burlington St, Iowa City, IA 52240',
		latLng: {lat: 41.658244, lng: -91.533651}
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
	
	self.currentLocation = ko.observable();
		self.setLocation = function(clickedLocation) {
			self.currentLocation(clickedLocation);
		};

	function initMap() {

		map = new google.maps.Map(document.querySelector('#map'), {
			center: {lat: 41.659794, lng: -91.532322},
			zoom: 16
		});

		function drop() {
			for (var i = 0; i < self.visiblePlaces().length; i++) {
				addMarkerWithTimeout(self.visiblePlaces()[i], i * 300);
			}	
		}

		function addMarkerWithTimeout(place, timeout) {
			setTimeout(function() {
				place.marker = new google.maps.Marker({
					address: place.address,
					position: place.latLng,
					animation: google.maps.Animation.DROP,
					map: map,
					title: place.title
				});	

				place.infoWindow = new google.maps.InfoWindow({});

				place.infoWindow.setContent('<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
		          'Place ID: ' + place.place_id + '<br>' +
		          place.formatted_address + '</div>');				

				google.maps.event.addListener(place.marker, 'click', selectMarker(place, place.marker, place.infoWindow));

			}, timeout);
		}

		drop();
	}
	
	var service = new google.maps.places.PlacesService(map);

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
	        infoWindow.open(map, this);
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

	// Run the initMap function when the window has finished loading.
	google.maps.event.addDomListener(window, 'load', initMap);
};

ko.applyBindings( new ViewModel() );