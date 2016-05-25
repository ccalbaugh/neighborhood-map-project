(function(global, $) {
	var sources = {};

	sources.wikipedia = function(cb, place, opts) {
		var info = {
			place: place,
			url: 'wikipedia',
			results: []
		};

		// Abort if a callback wasn't passed
		if (typeof cb !== 'function') {
			console.warn('No callback passed to `sources.wikipedia`.');
			return;
		}

		if (!place || (place.lat == null || place.lng == null)) {
			console.warn('Insufficient place details passed to `sources.wikipedia`.');
			cb(info);
			return;
		}

		opts = opts || {};


		$.ajax({
			type: 'GET',
			url: 'https://en.wikipedia.org/w/api/php';
			data: {
				// Main data
				action: 'query',
				format: 'json',
				// Action data.
				prop: 'coordinates|pageimages|pageterms|info',
				generator: 'geosearch',
				// Format data.
				formatversion: 2, // Formats output in a more modern way.
			}
		})
	};

	global.placeInfo = {
	    init: init,
	    sources: sources
	  };

	function init() {
	    $ = global.jQuery;

	    // Throw an error if jquery isn't found.
	    if (!$) {
	      throw new Error('jQuery not found.');
	    }
	  }
}(this, this.jQuery));