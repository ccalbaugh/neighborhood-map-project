(function(window, Mapster) {

	$.widget( "mapster.mapster", {
      // default options
      options: { },
 
      // the constructor
      _create: function() {
        var element = this.element[0],
        	options = this.options;
        this.map = Mapster.create(element, options);
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
      },
 
      // a public method to change the color to a random value
      // can be called directly via .colorize( "random" )
      addMarker: function( opts ) {
      	var self = this;
      	// if there is a location attr, then geocode is used.  Else, just add the marker by it's original options
      	if (opts.location) {
      		this.map.geocode({
      			address: opts.location,
      			success: function(results) {
      				results.forEach(function(result) {
      					// the lat and lng are being modified here so we don't have to carry out all of the options onto another object
      					opts.lat = result.geometry.location.lat();
      					opts.lng = results.geometry.location.lng();
      					self.map.addMarker(opts);
      				});
      			},
  				error: function(status) {
  					console.error(status);
  				}
      		});
      	} else {
      		this.map.addMarker(opts);
      	}
      },

      findMarkers: function(callback) {
      	return this.map.findBy(callback);
      },

      removeMarkers: function(callback) {
      	this.map.removeBy(callback);
      },

      markers: function() {
      	// markers is just a list so we have to call into items to actually get the items back
      	return this.map.markers.items;
      },

      getCurrentPosition: function(callback) {
      	this.map.getCurrentPosition(callback);
      },

      setPano: function(selector, opts) {
      	// using array notation onthis JQuery obj to get the HTML element
      	var element = $(selector)[0],
      		self = this;
      	$.each(elements, function(key, element) {
      		self.map.setPano(selector, opts);
      	});
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
       
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        this._super( key, value );
      }
    });

}(window, Mapster))