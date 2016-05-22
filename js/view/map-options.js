(function(window, google, mapster) {

	var styles = [{
		featureType: 'all',
		elementType: 'labels',
		stylers: [
		// setting visibility to off removes all labels of all types from the map, which shows that we can set global styles when setting feature type to all
			{ visibility: 'off' }
		]
	}, {
		featureType: 'water',
		elementType: 'geometry',
		stylers: [
			{ color: '#3498db' }
		]

	}, {
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [
			{ color: '#27ae60' }
		]
	}, {
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
			{ color: '#27ae60' }
		]
	}, {
		featureType: 'transit',
		elementType: 'geometry',
		stylers: [
			{ color: '#27ae60' }
		]
	}, {
		featureType: 'road.highway',
		elementType: 'geometry',
		stylers: [
			{ color: '#34495e' }
		]
	}, {
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [
			{ color: '#ecf0f1' }
		]
	}];

	mapster.MAP_OPTIONS = {
			center: {lat: 41.659794, lng: -91.532322},
			disableDefaultUI: true,
			scrollwheel: false,
			draggable: false,
			mapTypeId: google.maps.MapTpyeId.ROADMAP,
			geocoder: true,
			styles: styles
	};

}(window, google, window.Mapster || (window.Mapster = {})))