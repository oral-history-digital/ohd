var cedisMap = {};

var InteractiveMap = Class.create();
InteractiveMap.prototype = {
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5,
            indexURL: '/webservice/orte.json',
            dataURL: '/webservice/orte/satz'
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom }
        if(!this.options.indexURL) { this.options.indexURL = defaults.indexURL }
        if(!this.options.dataURL) { this.options.dataURL = defaults.dataURL }

        this.currentLoadPage = 0;
        this.loadPageNumber = 0;
        this.loading = true;

        // URL root
        this.options.urlRoot = window.location.pathname.split('/')[1] == 'archiv' ? '/archiv' : '';
        this.options.dataURL = this.options.urlRoot + this.options.dataURL;
        this.options.indexURL = this.options.urlRoot + this.options.indexURL;

        cedisMap.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['interview', 'place_of_birth', 'deportation_location', 'forced_labor_location', 'forced_labor_camp', 'forced_labor_company', 'return_location', 'home_location'].each(function(icon){
               cedisMap.locationSearch.options.images[icon] = new google.maps.MarkerImage(cedisMap.locationSearch.options.urlRoot + '/images/test_markers/' + icon + '_marker.png');
            });
        }

        if(!this.options.colors) {
            this.options.colors = new Hash();
            this.options.colors['default'] = 'red';
            this.options.colors['interview'] = 'green';
            this.options.colors['place_of_birth'] = 'blue';
            this.options.colors['home_location'] = 'blue';
            this.options.colors['return_location'] = 'blue';
            this.options.colors['deportation_location'] = 'red';
            this.options.colors['forced_labor_location'] = 'red';
            this.options.colors['forced_labor_camp_location'] = 'red';
            this.options.colors['forced_labor_company_location'] = 'red';
        }

        // Google Map Initialization
        var mapOptions = {
            zoom: this.options.zoom,
            center: new google.maps.LatLng(this.options.latitude, this.options.longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.mapContainer = $(id);
        this.map = new google.maps.Map(this.mapContainer, mapOptions);

        this.progress = new progressBar({colorBar: '#990000', background: '#B2AFA1' });
        $(id).appendChild(this.progress.getDiv());
        this.progress.getDiv().setStyle({bottom: '60px'});

        this.clusterManager = new ClusterManager(this.map,{});

        searchWithinBounds();

        return this.map;
    },
    searchWithinBounds: function() {
        new Ajax.Request(cedisMap.locationSearch.options.indexURL, {
            method: 'GET',
            onSuccess: cedisMap.locationSearch.initializeProgressBar
        });
    },
    initializeProgressBar: function(response) {
        cedisMap.locationSearch.loadPageNumber = response.responseJSON.pages;
        cedisMap.locationSearch.progress.start(cedisMap.locationSearch.loadPageNumber);
        cedisMap.locationSearch.currentLoadPage = 0;
        cedisMap.locationSearch.loading = true;
        cedisMap.locationSearch.retrieveDataPage();
    },
    retrieveDataPage: function() {
       this.currentLoadPage = this.currentLoadPage + 1;
        if (this.currentLoadPage < (this.loadPageNumber + 1)) {
            new Ajax.Request((this.options.dataURL + '.' + this.currentLoadPage + '.json'), {
                method: 'GET',
                onSuccess: cedisMap.locationSearch.initializeDataPage
            });
        } else {
            this.loading = false;
            this.progress.updateBar(1);
            // WHY DOES THE REFRESH NOT FINISH??
            // cedisMap.locationSearch.clusterManager.refreshLoadedClusters();
            // cedisMap.locationSearch.clusterManager.renderMarkers();
            this.progress.hide();
            cedisMap.locationSearch.clusterManager.refreshLoadedClusters();
        }
    },
    initializeDataPage: function(response) {
        if(response.responseJSON.locations) {
          response.responseJSON.locations.each(function(location){
                var locationInfo = cedisMap.locationSearch.locationInfo(location);
                var referenceClass = cedisMap.locationSearch.locationReference(location.referenceType, location.locationType);
                var interviewURL = cedisMap.locationSearch.options.urlRoot + '/interviews/' + location.interviewId;
                var skip = false;
                if(isNaN(location.latitude) || isNaN(location.longitude)) {
                    skip = true;
                } else if((Number(location.latitude) == 0) || (Number(location.longitude) == 0)) {
                    skip = true;
                }
                if(!skip) {
                    cedisMap.locationSearch.clusterManager.addLocation(location.location, new google.maps.LatLng(location.latitude, location.longitude), location.interviewId, locationInfo, location.region, location.country, referenceClass, interviewURL);   
                } else {
                    // alert('Skipping ' + location.location + ' at Lat/Lng: ' + location.latitude + ',' + location.longitude);
                }
            });

        }
        // postpone this until all are loaded:
        // cedisMap.locationSearch.clusterManager.renderMarkers();
        // cedisMap.locationSearch.clusterManager.refreshLoadedClusters();
        cedisMap.locationSearch.progress.updateBar(1);

        cedisMap.locationSearch.retrieveDataPage();

    },
    // presents an infoWindow for the marker and location at index position
    locationInfo: function(location) {
      var reference = cedisMap.locationSearch.translate(location.referenceType);
      var info = ''; // '<h3>' + location.locationType + ' ' + location.location + '</h3>';
      info = info + '<p class="interviewReference">' + reference + '&nbsp;' + location.interviewee + ' (' + location.interviewId + ')</p>';
      info = info + '<p class="referenceDetails">';
      info = info + location.interviewType.capitalize() + ', ' + location.language + (location.translated ? ' (übersetzt)' : '') + '</p>';
      return info;
    },
    locationReference: function(refStr, type) {
        if(['Camp','Lager'].indexOf(type) > -1) {
            return 'forced_labor_camp';
        } else if(['Company','Firma'].indexOf(type) > -1) {
            return 'forced_labor_company';
        }
        return refStr;
    },
    translate: function(str) {
        if(str.startsWith('forced_labor')) { return 'Zwangsarbeit -'; }
        if(str == 'deportation_location') { return 'Deportation -'; }
        if(str == 'place_of_birth') { return 'Geburtsort -'; }
        if(str == 'home_location') { return 'Lebensmittelpunkt -'; }
        if(str == 'return_location') { return 'Wohnort nach 1945 -'; }
        if(str == 'interview') { return 'Erwähnung bei'; }
        return str;
    }
};

function mapSetup(id) {
    new InteractiveMap(id);
}

function searchWithinBounds() {
    cedisMap.locationSearch.searchWithinBounds();
}