var cedisMap = {};

var InteractiveMap = Class.create({
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5,
            indexURL: '/orte.json',
            dataURL: '/orte/satz',
            dateStamp: '20121027'
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude; }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude; }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom; }
        if(!this.options.indexURL) { this.options.indexURL = defaults.indexURL; }
        if(!this.options.dataURL) { this.options.dataURL = defaults.dataURL; }
        if(!this.options.dateStamp) { this.options.dateStamp = defaults.dateStamp; }

        this.currentLoadPage = 0;
        this.loadPageNumber = 0;
        this.loading = true;

        // URL root
        this.options.urlRoot = window.location.pathname.split('/')[1] == 'archiv' ? '/archiv' : '';
        this.options.dataURL = this.options.urlRoot + '/webservice/' + this.options.dateStamp + this.options.dataURL;
        this.options.indexURL = this.options.urlRoot + '/webservice/' + this.options.dateStamp + this.options.indexURL;

        cedisMap.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['interview', 'place_of_birth', 'deportation_location', 'forced_labor_location', 'forced_labor_camp', 'forced_labor_company', 'return_location', 'postwar_camp', 'home_location'].each(function(icon){
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
            this.options.colors['postwar_camp'] = 'blue';
            this.options.colors['deportation_location'] = 'red';
            this.options.colors['forced_labor_location'] = 'red';
            this.options.colors['forced_labor_camp_location'] = 'red';
            this.options.colors['forced_labor_company_location'] = 'red';
        }

        this.boundsPerParameters = (this.options.mapBounds) ? true : false;
        var center = (this.boundsPerParameters) ? this.options.mapBounds.getCenter() : new google.maps.LatLng(this.options.latitude, this.options.longitude);

        // Google Map Initialization
        var mapOptions = {
            zoom: this.options.zoom,
            center: center,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControlOptions: { position: google.maps.ControlPosition.TOP_LEFT},
            streetViewControl: false
        };
        this.mapContainer = $(id);
        this.map = new google.maps.Map(this.mapContainer, mapOptions);
        if(this.boundsPerParameters) {
            this.map.fitBounds(this.options.mapBounds);
        }

        this.progress = new progressBar({colorBar: '#990000', background: '#B2AFA1' });
        $(id).appendChild(this.progress.getDiv());
        this.progress.getDiv().style.bottom = '60px';

        var clusterOptions = this.options.cluster || {};
        this.clusterManager = new ClusterManager(this.map, clusterOptions);

        this.loadAllLocations();

        return this.map;
    },

    setMapBounds: function(bounds) {
        // auto-reset only if parameters for bounds weren't provided!
        if((!this.boundsPerParameters) && (bounds.intersects)) {
            this.map.fitBounds(bounds);
        }
    },

    loadAllLocations: function() {
        new Ajax.Request(this.options.indexURL, {
            method: 'GET',
            onSuccess: this.initializeProgressBar.bind(this)
        });
    },

    initializeProgressBar: function(response) {
        this.loadPageNumber = response.responseJSON.pages;
        this.progress.start(this.loadPageNumber);
        this.currentLoadPage = 0;
        this.loading = true;
        this.retrieveLocationsBatch();
    },

    retrieveLocationsBatch: function() {
        this.currentLoadPage = this.currentLoadPage + 1;
        if (this.currentLoadPage < (this.loadPageNumber + 1)) {
            var that = this;
            new Ajax.Request((this.options.dataURL + '.' + this.currentLoadPage + '.json'), {
                method: 'GET',
                onSuccess: function(response) {
                    that.loadLocationsBatch(response.responseJSON.locations.toArray())
                }
            });
        } else {
            this.loading = false;
            this.progress.updateBar(1);
            this.progress.hide();
            this.clusterManager.addClustersToMap();
            this.checkForIntro();
        }
    },

    loadLocationsBatch: function(remainingLocations) {
        if(remainingLocations) {
            // Load locations in batches to avoid blocking the browser
            // event loop for too long and risking a script timeout.
            var numLoaded = 0, locationToLoad;
            while (remainingLocations.length > 0 && numLoaded < 500) {
                numLoaded++;
                locationToLoad = remainingLocations.pop();

                // Skip invalid locations.
                if(isNaN(locationToLoad.latitude) || isNaN(locationToLoad.longitude)
                    || Number(locationToLoad.latitude) == 0 || Number(locationToLoad.longitude) == 0) {
                    continue;
                }

                // Load valid locations.
                var locationInfo = this.locationInfo(locationToLoad);
                var referenceClass = this.locationReference(locationToLoad.referenceType, locationToLoad.locationType);
                var interviewURL = this.options.urlRoot + '/interviews/' + locationToLoad.interviewId;
                this.clusterManager.addLocation(
                    locationToLoad.location,
                    new google.maps.LatLng(locationToLoad.latitude, locationToLoad.longitude),
                    locationToLoad.interviewId, locationInfo,
                    locationToLoad.region, locationToLoad.country,
                    referenceClass, interviewURL);
            }
        }

        if (remainingLocations && remainingLocations.length > 0) {
            // We got more locations to load in the current batch: Let the
            // browser catch up then go on.
            setTimeout((function() { this.loadLocationsBatch(remainingLocations) }).bind(this), 0);
        } else {
            // We loaded all locations in the current batch: Try to load a new
            // batch from the web service.
            this.progress.updateBar(1);

            // IE does not correctly unblock on async Ajax requests, so wrap
            // in in a timeout, too.
            setTimeout(this.retrieveLocationsBatch.bind(this), 0);
        }
    },

    // presents an infoWindow for the marker and location at index position
    locationInfo: function(location) {
      var reference = this.translate(location.referenceType);
      var info = '';
      info += '<p class="interviewReference">' + reference + '&nbsp;' + location.interviewee + ' (' + location.interviewId + ')</p>';
      info += '<p class="referenceDetails">';
      info += location.interviewType.capitalize() + ', ' + location.language + (location.translated ? ' (übersetzt)' : '') + '</p>';
      return info;
    },

    locationReference: function(refStr, type) {
        if(['Camp','Lager'].indexOf(type) > -1) {
                if(refStr == 'forced_labor_location') {
                    return 'forced_labor_camp';
                }
                if(refStr == 'return_location') {
                    return 'postwar_camp';
                }
            } else if(['Company','Firma'].indexOf(type) > -1) {
                if(refStr == 'forced_labor_location') {
                    return 'forced_labor_company';
                }
            }
        return refStr;
    },

    translate: function(str) {
        if(str.startsWith('forced_labor')) { return 'Zwangsarbeit -'; }
        if(str == 'deportation_location') { return 'Deportation -'; }
        if(str == 'place_of_birth') { return 'Geburtsort -'; }
        if(str == 'home_location') { return 'Lebensmittelpunkt -'; }
        if(str == 'return_location') { return 'Wohnort nach 1945 -'; }
        if(str == 'postwar_camp') { return 'Lager nach 1945 -'; }
        if(str == 'interview') { return 'Erwähnung bei'; }
        return str;
    },

    checkForIntro: function() {
      if(this.options.introId && this.options.introURL && (!readMapConfigurationCookie().intro)) {
          this.showTutorial();
      }
    },

    showTutorial: function() {
      var _this = cedisMap.locationSearch;
      var introTab = $(_this.options.introId);
      new Ajax.Updater( _this.options.introId,
                        _this.options.introURL,
                        {
                            method: 'GET',
                            evalScripts: true,
                            onComplete: (function(){ _this.initTutorial(); })
                        }
      );
    },

    initTutorial: function() {
        var _this = cedisMap.locationSearch;
        new Effect.Appear(_this.options.introId);
        setupFilters('#' + _this.options.introId + ' .map_filter_off');
    }
});

function mapSetup(id, options) {
    /* TODO: read the cookie from ClusterManager and ignore interview stuff */
    var storedConfig = readMapConfigurationCookie();
    var parameters = location.search.parseQuery([separator = '&']);

    // interview selections
    var selectionOfInterviews = parameters.interviews || [];
    if(selectionOfInterviews.length > 0) {
        selectionOfInterviews = selectionOfInterviews.split(/\s*,\s*/);
    }

    var filterSettings = location.search.parseQuery([separator = '&']).filters;
    var filterOptions = [];
    if(filterSettings) {
        filterSettings.scan(/[_a-z]+/, function(filter) { filterOptions.push(filter) });
    } else {
        filterOptions = storedConfig.filters || [];
    }

    // cluster filtering
    var clusterOption = storedConfig.clusters || 0;

    // map bounds
    var bounds = null;
    var sw = parseGeoLocParameter(parameters.swcorner);
    var ne = parseGeoLocParameter(parameters.necorner);
    if(sw && ne) {
        bounds = new google.maps.LatLngBounds(sw,ne);
    }

    if(options == null) { options = {}; }
    if(!options.mapBounds) { options.mapBound = bounds; }
    if(!options.cluster) { options.cluster = {
            filters: filterOptions.flatten(),
            clusters: clusterOption,
            interviewRange: [selectionOfInterviews].flatten()
    };}

    new InteractiveMap(id, options);
}

function parseGeoLocParameter(param) {
    var latLng = null;
    if(param && param.length > 0) {
        var ll = param.split(/\s*,\s*/);
        var lat = ll[0];
        var lng = ll[1];
        latLng = (lat && lng) ? new google.maps.LatLng(lat,lng) : null;
    }
    return latLng;
}

