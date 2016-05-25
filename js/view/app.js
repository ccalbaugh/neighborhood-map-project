// Model

var places = [
	{
		title: 'The Englert Theater',
		id: 'ChIJSyeNzu9B5IcRQzciSCOPPuk',  // A Google Places ID.
		formatted_address: '221 E Washington St, Iowa City, IA 52240',
		latLng: {lat: 41.659794, lng: -91.532322},
		marker: "",
		lat: 41.659794,
		lng: -91.532322,
		url: ""
	},
	{
		title: 'Basta Pizzeria Ristorante',
		id: 'ChIJn6fO2fFB5IcR6jVX9EN9K6A',  // A Google Places id.
		formatted_address: '121 Iowa Ave, Iowa City, IA 52240',
		latLng: {lat: 41.661022, lng: -91.533625},
		lat: 41.661022,
		lng: -91.533625,
		url: ""
	},
	{
		title: 'Donnellys Irish Pub',
		id: 'ChIJgxklQ-5B5IcRjdC81k4t4ug',  // A Google Places id.
		formatted_address: '110 E College St, Iowa City, IA 52240',
		latLng: {lat: 41.659075, lng: -91.534083},
		lat: 41.659794,
		lng: -91.532322,
		url: ""
	}, 
	{
		title: 'Shorts Burger & Shine',
		id: 'ChIJEactIO5B5IcRJ6QdjEyd_UI',  // A Google Places id.
		formatted_address: '18 S Clinton St, Iowa City, IA 52240',
		latLng: {lat: 41.660629, lng: -91.534355},
		lat: 41.659794,
		lng: -91.532322,
		url: ""
	}, 
	{
		title: 'FilmScene',
		id: 'ChIJ9WOyRe5B5IcRgFg8TDssBz8',  // A Google Places id.
		formatted_address: '118 E College St, Iowa City, IA 52240',
		latLng: {lat: 41.659283, lng: -91.533779},
		lat: 41.659794,
		lng: -91.532322,
		url: ""
	},
	{
		title: 'Blue Moose Inc',
		id: 'ChIJMWk1KPBB5IcRXC6hLJYE0Uo',  // A Google Places id.
		formatted_address: '211 Iowa Ave, Iowa City, IA 52240',
		latLng: {lat: 41.661003, lng: -91.532341},
		lat: 41.661003,
		lng: -91.533541,
		url: ""
	},
	{
		title: 'The Mill Restaurant',
		id: 'ChIJUQ219u5B5IcRBOsWmmNQJnk',  // A Google Places id.
		formatted_address: '120 E Burlington St, Iowa City, IA 52240',
		latLng: {lat: 41.658244, lng: -91.533651},
		lat: 41.658244,
		lng: -91.533651,
		url: ""
	},
];


var ViewModel = function() {
	var self = this;

	var placeInfo = function(data) {
		self.title = ko.observable(data.title);
		self.address = ko.observable(data.address);
		self.lat = ko.observable(data.lat);
		self.lng = ko.observable(data.lng);
		self.latLng = ko.computed(function () {
			return self.lat() + self.lng();
		});
	};


	self.currentLocation = ko.observable();
	self.allPlaces = ko.observableArray(places);

	places.forEach(function(place) {
		self.allPlaces().push(place);
	});

	console.log(self.allPlaces);
	console.log('***' + self.allPlaces());

	self.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};

	// function drop() {
	// 	for (var i = 0; i < self.allPlaces().length; i++) {
	// 		addMarker(self.allPlaces()[i], i * 400);
	// 	}	
	// }

	self.allPlaces().forEach(function(place) {
		place.marker = new google.maps.Marker({
			map: map,
			position: place.latLng,
			title: place.title,
			animation: google.maps.Animation.DROP
		});	

		place.marker.addListener('click', toggleBounce);

		function toggleBounce(marker) {
			if (marker.getAnimation() !== null) {
				setTimeout(function() { marker.setAnimation(null); }, 1500);
			} else {
				// Sets the marker to bounce twice and then stop, thanks to Simon Steinberger on stackoverflow for the solution
				marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() { marker.setAnimation(null); }, 1500);
				self.setLocation(marker);
			}
		}

		google.maps.event.addListener(place.marker, 'click', function() {
			if (!place.infoWindow) {
				place.infoWindow = new google.maps.InfoWindow();
			}

			// Initialize the vars for the Wikipedia API, thanks to Cshields88 on Github for the api layout
			var content,
				urlNames = encodeURI(place.title),
				wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" +
							 urlNames + "&limit=1&redirects=return&format=json";

			self.apiTimeout = setTimeout(function() {
				//alert('ERROR: Failed to load data');
			}, 5000);

			$.ajax({
				url: wikiURL,
				dataType: "jsonp",
				success: function(response) {
					clearTimeout(self.apiTimeout);
					var articleList = response[1];
					console.log(response);
					if (articleList.length > 0) {
						for (var i = 0; i < articleList.length; i++) {
							var articleStr = articleList[i];
							var url = 'http://en.wikipedia.org/wiki/' + articleStr;
							content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
										'<p>' + place.formatted_address + '</p>' +
										'<p>' + response[2] + '</p>' + // response[2] for more modern response
										'<a href="' + place.url + '" target="_blank">' +
										place.url + '</a>' + 
							'</div>';
							place.infoWindow.setContent(content);
						}
					} else {
						content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
										'<p>' + place.formatted_address + '</p>' +
										'<p>' + "Sorry, No articles were found on Wikipedia" + '</p>' + 
						'</div>';
						place.infoWindow.setContent(content);
					}
				},
				error: (function () {
					content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
									'<p>' + place.formatted_address + '</p>' +
									'<p>' + "Failed to reach Wikipedia Servers, please try again..." + '</p>' + 
					'</div>';
					place.infoWindow.setContent(content);
				})
			}); // end of ajax call		
		});
		
		google.maps.event.addListener(place.marker, 'click', function() {
			var lastInfoWindow = null;

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
			};
		});
	}); // End of the forEach loop

	// // run drop() after the map is idle, which should signifiy that it is fully loaded
	// google.maps.event.addListenerOnce(map, 'idle', drop);

	// animates the correct marker
	self.list = function (place, marker) {
        google.maps.event.trigger(place.marker, 'click'); 
    };
    // used for Search functionality with local names
	self.userInput = ko.observable('');

	self.searchResults = ko.computed(function() {
		return ko.utils.arrayFilter(self.allPlaces(), function(list) {
			var listFilter = list.title.toLowerCase().indexOf(self.userInput().toLowerCase()) !== -1;
			if (listFilter) {
				list.marker.setVisible(true);
			} else {
				list.marker.setVisible(false);
			}

			return listFilter;
		});
	});	
};

// Where the google Map is created
function initMap() {
	options = {
			center: {lat: 41.659794, lng: -91.532322},
			zoom: 16,
			disableDefaultUI: false,
			scrollwheel: false,
			draggable: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	element = document.querySelector('#map-canvas');
	map = new google.maps.Map(element, options);

	ko.applyBindings( new ViewModel() );
}

// creates an alert if the Google Maps API can't be reached
function googleError(e) { 
	alert("Sorry! Google Maps cannot be loaded at this time");
	console.log(e);
}

