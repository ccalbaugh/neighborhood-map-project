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

var locations = [
		{}
	];
/*-----Model-----*/ 
var Model = function() {

};

/*-----View-----*/
var View = function() {

};

/*-----ViewModel-----*/
var ViewModel = function() {
	var self = this;

	this.nameList = ko.observableArray([]);
	// Stat on this list array

	var map;
	var infoWindow;

	function initialize() {
	  var englert = new google.maps.LatLng(41.659794, -91.532322);

	  map = new google.maps.Map(document.getElementById('map'), {
	    center: englert,
	    zoom: 15
	  });

	  var marker = new google.maps.Marker({
	    map: map,
	    position: englert,
	    title: 'Hello World!'
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
	    types: ['store']
	  }, locationIterator);

		// var request = {
		//  placeId: document.getElementById('place-id').value
		// };
	}

	function locationIterator(results, status) {
		var resultsArr = [];
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
				createListItem(results[i]);
				resultsArr.push(results[i]);
			}
			console.log(resultsArr.length);
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: placeLoc
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}

	function createListItem(place) {
		var nameArr = [];
		var nameList = document.getElementById('name-list');
		nameList.innerHTML = '<li>' + place.name + '</li>';
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

