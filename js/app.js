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

var ViewModel = function() {
	var self = this,
		marker,
		center,
		infoWindow = new google.maps.InfoWindow();
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
			setTimeout(function() { marker.setAnimation(null); }, 1400);
		} else {

			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() { marker.setAnimation(null); }, 1400);
			self.setLocation(marker);
		}
	};
	// instantiate this variable to make sure the map is set w/in specific NE and SW points
	var bounds = new google.maps.LatLngBounds();

	self.allPlaces().forEach(function(place) {
		marker = new google.maps.Marker({
			map: map,
			title: place.title,
			position: place.latLng,
			animation: google.maps.Animation.DROP
		});

		place.marker = marker;
		// This code sets the bounds for the map

		bounds.extend(marker.position); // just add every marker and let the API sort it out



		google.maps.event.addListener(place.marker, 'click', function() {
			self.toggleBounce(place.marker);
			map.panTo(place.latLng);

			// Initialize the vars for the Wikipedia API, thanks to Cshields88 on Github for the api layout
			var content,
				urlNames = encodeURI(place.title),
				wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" +
							 urlNames + "&prop=pageimages&limit=1&redirects=return&format=json&pithumbsize=100";

			function ajax() {
				return $.ajax({
					type: 'GET',
					url: wikiURL,
					dataType: "jsonp",
					prop: 'pageimages'
				});
			}

			ajax().done(function(response) {
				var articleList = response[1];
				console.log(response);
				if (articleList.length > 0) {
					for (var i = 0; i < articleList.length; i++) {
						var url = response[3]; // response[3] gives back the wiki URL
						content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
									'<p>' + place.formatted_address + '</p>' +
									'<p>' + response[2] + '</p>' + // response[2] for more modern response
									'<a href="' + url + '" target="_blank" class="infowindow_link">' +
									"View full Wikipedia article" + '</a>' +
						'</div>';
						// $(".infowindow_link").live('click', function() {
						// 	window.location.href = this.href;
						// });
						infoWindow.setContent(content);
					}
				} else {
					content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
									'<p>' + place.formatted_address + '</p>' +
									'<p>' + "Sorry, No articles were found on Wikipedia" + '</p>' +
					'</div>';
					infoWindow.setContent(content);
				}
			}).fail(function(jqXHR, error) {
				content = '<div class="infoWindow"><strong>' + place.title + '</strong><br>' +
								'<p>' + place.formatted_address + '</p>' +
								'<p>' + "Failed to reach Wikipedia Servers, please try again..." + '</p>' +
				'</div>';
				infoWindow.setContent(content);
				alert(error);
			}); // end of ajax call

			var lastInfoWindow = null;

			if (lastInfoWindow == infoWindow) {
				currentLocation = null;
				infoWindow.close(map, this);
				lastInfoWindow = null;
			} else if (lastInfoWindow !== null) {
					lastInfoWindow.close(map, this);
			} else {
				infoWindow.open(map, this);
				lastInfoWindow = infoWindow;
			}
		});
	}); // End of the forEach loop
	map.fitBounds(bounds);

	window.onresize = function() {
		map.fitBounds(bounds);
	}


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

	var toggle = document.querySelector('.drawer-toggle-label');
	var drawer = document.querySelector('.drawer');

	toggle.addEventListener('click', function(e) {
		drawer.classList.toggle('open');
		e.stopPropagation();
	});
};

// Where the google Map is created
function initMap() {
	options = {
			center: {lat: 46.879116, lng: -113.996196}, // Missoula, MT
			zoom: 6,
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

