// Model

var places = [
	{
		title: 'Cape Royal',
		formatted_address: 'Grand Canyon National Park, Coconino County, AZ',
		latLng: {lat: 36.116909, lng: -111.950005},
		lat: 36.116909,
		lng: -111.950005
	},
	{
		title: 'Half Dome',
		formatted_address: 'Yosemite National Park, Mariposa County, CA',
		latLng: {lat: 37.746020, lng: -119.533457},
		lat: 37.746020,
		lng: -119.533457
	},
	{
		title: 'Denali',
		formatted_address: 'Denali National Park and Preserve, AK',
		latLng: {lat: 63.069547, lng: -151.005775},
		lat: 63.069547,
		lng: -151.005775
	},
	{
		title: 'Grand Teton',
		formatted_address: 'Grand Teton National Park, Teton County, WY',
		latLng: {lat: 43.741010, lng: -110.802350},
		lat: 43.741010,
		lng: -110.802350
	},
	{
		title: 'Mount Rainier',
		formatted_address: 'Mount Rainier National Park, Pierce County, WA',
		latLng: {lat: 46.852395, lng: -121.760237},
		lat: 46.852395,
		lng: -121.760237
	},
	{
		title: 'Cumberland Gap National Historical Park',
		formatted_address: 'Cumberland Gap National Historical Park, Middlesboro, KY',
		latLng: {lat: 36.603718, lng: -83.698440},
		lat: 36.603718,
		lng: -83.698440
	},
	{
		title: 'Chimney Rock',
		formatted_address: 'Chimney Rock National Historic Site, Chimney Rock Trail, Bayard, NE',
		latLng: {lat: 41.702858, lng: -103.348074},
		lat: 41.702858,
		lng: -103.348074
	},
	{
		title: 'Devils Tower National Monument',
		formatted_address: 'Devils Tower National Monument, Wyoming 110, Devils Tower, WY',
		latLng: {lat: 44.590202, lng: -104.714681},
		lat: 44.590202,
		lng: -104.714681
	},
	{
		title: 'Island in the Sky',
		formatted_address: 'Canyonlands National Park, San Juan County, UT',
		latLng: {lat: 38.397340, lng: -109.889610},
		lat: 38.397340,
		lng: -109.889610
	},
	{
		title: 'Bering Land Bridge National Preserve',
		formatted_address: 'Bering Land Bridge National Park and Preserve, Shishmaref, AK',
		latLng: {lat: 65.925871, lng: -164.437852},
		lat: 65.925871,
		lng: -164.437852
	}
];
// Setting this to the global scope so the infowindow will close if a new marker is clicked
var lastInfoWindow = null;

var ViewModel = function() {
	var self = this,
		infoWindow,
		marker,
		center;
	// Thanks to Gregory Bolkenstijn on Stack Overflow for this function
	function calculateCenter() {
	  center = map.getCenter();
	}

	google.maps.event.addDomListener(map, 'idle', function() {
	  calculateCenter();
	});

	google.maps.event.addDomListener(window, 'resize', function() {
	  map.setCenter(center);
	});

	var PlaceMaker = function(data) {
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

	self.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
	};

	self.toggleBounce = function(marker) {
		if (marker.getAnimation() !== null) {
			setTimeout(function() { marker.setAnimation(null); }, 750);
		} else {

			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() { marker.setAnimation(null); }, 750);
			self.setLocation(marker);
		}
	};

	self.allPlaces().forEach(function(place) {
		marker = new google.maps.Marker({
			map: map,
			position: place.latLng,
			title: place.title,
			animation: google.maps.Animation.DROP
		});


		place.marker = marker;

		google.maps.event.addListener(place.marker, 'click', function() {
			place.infoWindow = new google.maps.InfoWindow();
			self.toggleBounce(place.marker);
			map.panTo(place.latLng);

			// Initialize the vars for the Wikipedia API, thanks to Cshields88 on Github for the api layout
			var content,
				urlNames = encodeURI(place.title),
				wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" +
							 urlNames + "&prop=pageimages&limit=1&redirects=return&format=json&pithumbsize=100";

			self.apiTimeout = setTimeout(function() {
				//alert('ERROR: Failed to load data');
			}, 5000);

			$.ajax({
				type: 'GET',
				url: wikiURL,
				dataType: "jsonp",
				prop: 'pageimages',
				success: function(response) {
					clearTimeout(self.apiTimeout);
					var articleList = response[1];
					console.log(response);
					if (articleList.length > 0) {
						for (var i = 0; i < articleList.length; i++) {
							var url = response[3]; // response[3] gives back the wiki URL
							content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
										'<p>' + place.formatted_address + '</p>' +
										'<p>' + response[2] + '</p>' + // response[2] for more modern response
										'<a href="' + url + '" target="_blank">' +
										"View full Wikipedia article" + '</a>' +
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
				}),
			}); // end of ajax call


			if (lastInfoWindow == place.infoWindow) {
				currentLocation = null;
				place.infoWindow.close(map, this);
				lastInfoWindow = null;
			} else if (lastInfoWindow !== null) {
					lastInfoWindow.close(map, this);
			}

			place.infoWindow.open(map, this);
			lastInfoWindow = place.infoWindow;
		});

		return place.infoWindow;
	}); // End of the forEach loop

	// links list to the allPlaces marker info
	self.list = function (place, marker) {
        google.maps.event.trigger(place.marker, 'click');
    };

    // used for Search functionality with local names
	self.userInput = ko.observable('');

	self.searchResults = ko.computed(function() {
		return ko.utils.arrayFilter(self.allPlaces(), function(list) {
			console.log(list);
			var listFilter = list.title.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
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
			center: {lat: 46.879116, lng: -113.996196}, // Missoula, MT
			zoom: 3,
			disableDefaultUI: false,
			scrollwheel: false,
			draggable: true,
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

