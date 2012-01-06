var InteractiveMap = Class.create();
InteractiveMap.prototype = {
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom }

        // Google Map Initialization
        var mapOptions = {
            zoom: this.options.zoom,
            center: new google.maps.LatLng(this.options.latitude, this.options.longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.map = new google.maps.Map($(id), mapOptions);

        // Event Listeners
        google.maps.event.addListener(this.map, 'dragend', this.searchWithinBounds);
        google.maps.event.addListener(this.map, 'zoom_changed', this.searchWithinBounds);

        return this.map;
    },
    searchWithinBounds: function() {
        var bounds = this.getBounds();
        if(!bounds) { return }
        alert('Map NE = ' + this.getBounds().getNorthEast() + '\n SW  = ' + this.getBounds().getSouthWest());
    }
};

function mapSetup(id) {
    new InteractiveMap(id);
}