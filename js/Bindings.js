ko.bindingHandlers.map = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
		var marker = new google.maps.Marker({
			map: allBindingsAccessor().map,
			position: position,
			title: name
		});
		viewModel._mapMarker = marker;
	},

	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var latlng = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
		viewModel._mapMarker.setPosition(latlng);
	}
}