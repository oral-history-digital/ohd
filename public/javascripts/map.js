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

        window.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['interview', 'place_of_birth', 'deportation_location', 'forced_labor_location', 'forced_labor_camp', 'forced_labor_company', 'return_location', 'home_location'].each(function(icon){
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

        this.progress = new progressBar({colorBar: '#990000', background: '#B2AFA1' });
        $(id).appendChild(this.progress.getDiv());
        this.progress.getDiv().setStyle({bottom: '60px'});

        this.clusterManager = new ClusterManager(this.map,{});

        searchWithinBounds();

        return this.map;
    },
    searchWithinBounds: function() {
        new Ajax.Request(window.locationSearch.options.indexURL, {
            method: 'GET',
            onSuccess: window.locationSearch.initializeProgressBar
        });
    },
    initializeProgressBar: function(response) {
        window.locationSearch.loadPageNumber = response.responseJSON.pages;
        window.locationSearch.progress.start(window.locationSearch.loadPageNumber);
        window.locationSearch.currentLoadPage = 0;
        window.locationSearch.loading = true;
        window.locationSearch.retrieveDataPage();
    },
    retrieveDataPage: function() {
       this.currentLoadPage = this.currentLoadPage + 1;
        if (this.currentLoadPage < (this.loadPageNumber + 1)) {
            new Ajax.Request((this.options.dataURL + '.' + this.currentLoadPage + '.json'), {
                method: 'GET',
                onSuccess: window.locationSearch.initializeDataPage
            });
        } else {
            this.loading = false;
            this.progress.updateBar(1);
            this.progress.hide();
        }
    },
    initializeDataPage: function(response) {
        if(response.responseJSON.locations) {
          response.responseJSON.locations.each(function(location){
                var locationInfo = window.locationSearch.locationInfo(location);
                var referenceClass = window.locationSearch.locationReference(location.referenceType, location.locationType);
                var interviewURL = window.locationSearch.options.urlRoot + '/interviews/' + location.interviewId;
                window.locationSearch.clusterManager.addLocation(location.location, new google.maps.LatLng(location.latitude, location.longitude), locationInfo, referenceClass, interviewURL);
            });

        }
        window.locationSearch.progress.updateBar(1);

        window.locationSearch.retrieveDataPage();

    },
    // presents an infoWindow for the marker and location at index position
    locationInfo: function(location) {
      var reference = window.locationSearch.translate(location.referenceType);
      var info = '<h3>' + location.locationType + ' ' + location.location + '</h3>';
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
        if(str == 'forced_labor_location') { return 'Zwangsarbeit -'; }
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
    window.locationSearch.searchWithinBounds();
}