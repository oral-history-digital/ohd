var InteractiveMap = Class.create();
InteractiveMap.prototype = {
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5,
            searchURL: '/webservice/ortssuche.json'
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom }
        if(!this.options.searchURL) { this.options.searchURL = defaults.searchURL }

        // Google Map Initialization
        var mapOptions = {
            zoom: this.options.zoom,
            center: new google.maps.LatLng(this.options.latitude, this.options.longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.map = new google.maps.Map($(id), mapOptions);
        this.map.component = this;

        // Event Listeners
        google.maps.event.addListener(this.map, 'dragend', this.searchWithinBounds);
        google.maps.event.addListener(this.map, 'zoom_changed', this.searchWithinBounds);

        return this.map;
    },
    searchWithinBounds: function() {
        var bounds = this.getBounds();
        if(!bounds) { return }
        var lat1 = bounds.getSouthWest().lat();
        var lng1 = bounds.getSouthWest().lng();
        var lat2 = bounds.getNorthEast().lat();
        var lng2 = bounds.getNorthEast().lng();
        // window.imapBounds = '(' + Math.floor(lat1*100)/100 + ',' + Math.floor(lng1*100)/100 + ') to (' + Math.floor(lat2*100)/100 + ',' + Math.floor(lng2*100)/100 + ')';
        new Ajax.Request(this.component.options.searchURL, {
            parameters: {
                latitude: lat1,
                longitude: lng1,
                latitude2: lat2,
                longitude2: lng2
            },
            method: 'GET',
            onSuccess: this.component.addLocations
        });
        // alert('Map NE = ' + this.getBounds().getNorthEast() + '\n SW  = ' + this.getBounds().getSouthWest());
    },
    addLocations: function(response) {
        if(response.responseJSON.results) {
            this.locations = [];
            var str = '';
            // str = str + window.imapBounds + '\n';
            // str = str + '(' + window.imapBounds.getSouthWest().lat() + ',' + window.imapBounds.getSouthWest().lng() + ')';
            // str = str + '(' + window.imapBounds.getNorthWest().lat() + ',' + window.imapBounds.getNorthWest().lng() + ')\n';
            response.responseJSON.results.each(function(location){
                this.locations[this.locations.length] = location;
                str = str + location.location + '\n';
            });
            alert('Updated locations for bounds: '+ str);
            // alert('Received JSON results:\n' + response.responseJSON.results);
            // this.addLocations();
        }
        //var str = '';
        //locations.each(function(loc){
        //    str = str + loc.location + '\n';
        //});
        //alert('Locations:\n' + str);
    }
};

function mapSetup(id) {
    window.map = new InteractiveMap(id);
}

function searchWithinBounds() {
    window.map.searchWithinBounds();
}