(function(global, google, List) {

	var Mapster = (function() {
		function Mapster(element, opts) {
			this.gMap = new google.maps.Map(element, opts);
			// this instantiates a new List constructor obj
			this.markers = List.create();

			if (opts.geocoder) {
				this.geocoder = new google.maps.Geocoder();
			}			
		}

		Mapster.prototype = {
			zoom: function(level) {
				if (level) {
					this.gMap.setZoom(level)
				} else {
					return this.gMap.getZoom();
				}
			},

			_on: function(opts) {
				var self = this;
				google.maps.event.addListener(opts.obj, opts.event, function(e) {
					opts.callback.call(self, e, opts.obj);
				});
			},
//////////////  For Geocode functionality
			// geocode: function(opts) {
			// 	geocoder.geocode({
			// 		address: opts.address
			// 	}, function(results, status) {
			// 		// this checks if the passed status matches an OK status within an Enum in the google maps nambespace
			// 		if (status === google.maps.GeocoderStatus.OK) {
			// 			opts.success.call(this, results, status);
			// 		} else {
			// 			opts.error.call(this, status);
			// 		}
			// 	});
			// },

			getCurrentPosition: function(callback) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						callback.call(this, position);
					});
				}
			},
//////////////  For Future functionality with the StreetView Panorama
			// setPano: function(element, opts) {
			// 	var panorama = new google.maps.StreetViewPanorama(element, opts);
			// 	if (opts.events) {
			// 		this._attachEvents(panorama, opts.events);
			// 	}
				
			// 	this.gMap.setStreetView(panorama);
			// },
			
			// all other Marker options are created in app.js where the markers are actually instantiatied
			addMarker: function(opts) {
				// marker is added here due to hoisting
				var marker,
					self = this;
				opts.position = {
					lat: opts.lat,
					lng: opts.lng,
				}

				marker = this._createMarker(opts);
				// The add function is from List.js
				this.markers.add(marker);

				if (opts.events) {
					this._attachEvents(marker, opts.events);
				}

				if (opts.content) {
					this._on({
						obj: marker,
						event: 'click',
						callback: selectMarker(place, marker, place.infoWindow)

					//  callback: function() {
					// 		var infoWindow = new google.maps.infoWindow({
					// 			content: opts.content
					// 		});

					// 		infoWindow.open(this.gMap, marker);
					// 	}
					});
				}

				return marker;
			},

			_attachEvents: function(obj, events) {
				var self = this;
				events.forEach(function(event) {
					self._on({
						obj: obj,
						event: opts.event.name,
						callback: opts.event.callback
					});
				});
			},

			_addMarker: function(marker) {
				this.markers.add(marker);
			},

			findBy: function(callback) {
				this.markers.find(callback);
			},

			removeBy: function(callback) {
				this.markers.find(callback, function(markers) {
					markers.forEach(function(marker) {
						marker.setMap(null);
					});
				});
			},

			_createMarker: function(opts) {
				opts.map = this.gMap;
				return new google.maps.Marker(opts);
			},
		};

		return Mapster;
	}());

	Mapster.create = function(element, opts) {
		return new Mapster(element, opts);
	};

	window.Mapster = Mapster;

}(this, this.google, this.List))