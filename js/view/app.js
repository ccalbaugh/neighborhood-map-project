// TODO
//
// Build for responsiveness
//
// Display map markers and use google maps API
//
// Filter Both the list view and map markers
//
// Create a JSON Object with the places of interest in the neighborhood
//
//


/*-----Model-----*/ 
var Model = function() {
	var locations = [
		{
			'Englert' : '41.659794, -91.532322',
			'Basta' : '41.661022, -91.533625',
			'Donnellys' : '41.659075, -91.534083',
			'Shorts' : '41.660629, -91.534355',
			'Film Scene' : '41.659283, -91.533779'
		}
	];
};

/*-----View-----*/
var View = function() {

};



/*-----ViewModel-----*/
var ViewModel = function() {
	var self = this;
	var map;
	var infoWindow;
	var markers = [];
	
	this.place = ko.observable();
	self.placeList = ko.observableArray([]);

	var createListItem = function(place) {
		var listItem = '<li>' + place.name + '</li>';
		self.placeList().push(listItem);
		return self.placeList();
	};

	function initialize() {
	  var englert = new google.maps.LatLng(41.659794, -91.532322);


	  map = new google.maps.Map(document.getElementById('map'), {
	    center: englert,
	    zoom: 15
	  });

	  infowindow = new google.maps.InfoWindow();
	  var service = new google.maps.places.PlacesService(map);

	  document.getElementById('submit').addEventListener('click', function() {
	    placeDetailsByPlaceId(service, map, infowindow);
	  });

	  // Specify location, radius and place types for your Places API search.
	  service.nearbySearch({
	    location: englert,
	    radius: '500',
	    types: ['restaurant', 'store']
	  }, locationIterator);

		var request = {
		 placeId: document.getElementById('place-id').value
		};
	}

	function locationIterator(results, status) {
		var resultsArr = [];
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarkerWithTimeout(results[i]);
				createListItem(results[i]);
				
			}
			console.log(self.placeList());
		}
	}

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

		function toggleBounce() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}
	}	

	function clearMarkers() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}

	function drop() {
		clearMarkers();
		for (var i = 0; i < markers.length; i++) {
			createMarkerWithTimeout(markers[i], i * 200);
		}
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



	// Run the initialize function when the window has finished loading.
	google.maps.event.addDomListener(window, 'load', initialize);
};

ko.applyBindings(new ViewModel());

