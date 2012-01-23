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

        // URL root
        this.options.urlRoot = window.location.pathname.split('/')[1] == '/archiv' ? 'archiv' : '';
        this.options.searchURL = this.options.urlRoot + this.options.searchURL;

        window.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['place_of_birth', 'deportation_location', 'forced_labor_location', 'return_location', 'home_location'].each(function(icon){
               window.locationSearch.options.images[icon] = new google.maps.MarkerImage(window.locationSearch.options.urlRoot + '/images/test_markers/' + icon + '_marker.png');
            });
        }

        // Google Map Initialization
        var mapOptions = {
            zoom: this.options.zoom,
            center: new google.maps.LatLng(this.options.latitude, this.options.longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.map = new google.maps.Map($(id), mapOptions);
        this.markers = [];

        // Event Listeners
        //google.maps.event.addListener(this.map, 'dragend', this.searchWithinBounds);
        //google.maps.event.addListener(this.map, 'zoom_changed', this.searchWithinBounds);
        google.maps.event.addListener(this.map, 'tilesloaded', this.searchWithinBounds);

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
        new Ajax.Request(window.locationSearch.options.searchURL, {
            parameters: {
                latitude: lat1,
                longitude: lng1,
                latitude2: lat2,
                longitude2: lng2
            },
            method: 'GET',
            onSuccess: window.locationSearch.addLocations
        });
        // alert('Map NE = ' + this.getBounds().getNorthEast() + '\n SW  = ' + this.getBounds().getSouthWest());
    },
    addLocations: function(response) {
        if(response.responseJSON.results) {
            // window.locationSearch.locations = [];

            var str = '';
            // str = str + window.imapBounds + '\n';
            // str = str + '(' + window.imapBounds.getSouthWest().lat() + ',' + window.imapBounds.getSouthWest().lng() + ')';
            // str = str + '(' + window.imapBounds.getNorthWest().lat() + ',' + window.imapBounds.getNorthWest().lng() + ')\n';
            response.responseJSON.results.each(function(location){
                // window.locationSearch.locations.push(location);
                // str = str + location.location + '\n';
                var markerIcon = window.locationSearch.options.images[location.referenceType];
                if(!markerIcon) { markerIcon = window.locationSearch.options.images['default']; }
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.latitude, location.longitude),
                    map: window.locationSearch.map,
                    title: location.interviewee + ' in ' + location.location,
                    icon: markerIcon
                });
                marker.location = location;
                if (window.locationSearch.markers.indexOf(marker) == -1) {
                    window.locationSearch.markers.push(marker);
                }
                google.maps.event.addListener(marker, 'click', window.locationSearch.showInfo);

            });
            // alert('Updated locations for bounds: '+ str);
            // alert('Received JSON results:\n' + response.responseJSON.results);
            // this.addLocations();
        }
        //var str = '';
        //locations.each(function(loc){
        //    str = str + loc.location + '\n';
        //});
        //alert('Locations:\n' + str);
    },
    // presents an infoWindow for the marker and location at index position
    showInfo: function() {
      var index = window.locationSearch.markers.indexOf(this);
      var marker = window.locationSearch.markers[index];
      var location = marker.location;
      var reference = window.locationSearch.translate(location.referenceType);
      var info = '<h3>' + location.locationType + ' ' + location.location + '</h3>';
      info = info + '<p style="font-weight: bold;">' + reference + '&nbsp;<a href="' + window.locationSearch.options.urlRoot + '/interviews/' + location.interviewId + '" target="_blank">' + location.interviewee + ' (' + location.interviewId + ')<br/><small>&raquo;zum Interview</small></a></p>';
      info = info + '<p style="font-size: 85%">' + location.experienceGroup + '<br/>';
      info = info + location.interviewType.capitalize() + ', ' + location.language + (location.translated ? ' (übersetzt)' : '') + '</p>';
      var infoWindow = new google.maps.InfoWindow({content: info, maxWidth: 320 });
      infoWindow.open(window.locationSearch.map, marker);
    },
    translate: function(str) {
        if(str == 'forced_labor_location') { return 'Zwangsarbeit -'; }
        if(str == 'deportation_location') { return 'Deportation -'; }
        if(str == 'place_of_birth') { return 'Geburtsort -'; }
        if(str == 'home_location') { return 'Wohnort nach 1945 -'; }
        if(str == 'return_location') { return 'Rückkehr -'; }
        if(str == 'interview') { return 'Erwähnung bei'; }
        return str;
    }
};

function mapSetup(id) {
    new InteractiveMap(id);
}

function searchWithinBounds() {
    window.locationSearch.searchWithinBounds();
}