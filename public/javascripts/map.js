var cedisMap = {};

var InteractiveMap = Class.create({
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5,
            dateStamp: '20121027',
            locale: 'de'
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude; }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude; }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom; }
        if(!this.options.dateStamp) { this.options.dateStamp = defaults.dateStamp; }

        this.currentLoadPage = 0;
        this.loadPageNumber = 0;
        this.loading = true;

        // URL root
        this.options.urlRoot = window.location.pathname.split('/')[1] == 'archiv' ? '/archiv' : '';
        var baseUrl = this.options.urlRoot + '/' + this.options.locale + '/webservice/locations/' + this.options.dateStamp
        this.options.indexURL = baseUrl + '.json';
        this.options.dataURL = baseUrl + '/page';

        cedisMap.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['interview', 'birth_location', 'deportation_location', 'forced_labor_location', 'forced_labor_camp', 'forced_labor_company', 'return_location', 'postwar_camp', 'home_location'].each(function(icon){
               cedisMap.locationSearch.options.images[icon] = new google.maps.MarkerImage(cedisMap.locationSearch.options.urlRoot + '/images/test_markers/' + icon + '_marker.png');
            });
        }

        if(!this.options.colors) {
            this.options.colors = new Hash();
            this.options.colors['default'] = 'red';
            this.options.colors['interview'] = 'green';
            this.options.colors['birth_location'] = 'blue';
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

        this.loadAllRegistryReferences();

        return this.map;
    },

    setMapBounds: function(bounds) {
        // auto-reset only if parameters for bounds weren't provided!
        if((!this.boundsPerParameters) && (bounds.intersects)) {
            this.map.fitBounds(bounds);
        }
    },

    loadAllRegistryReferences: function() {
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
        this.retrieveRegistryReferencesBatch();
    },

    retrieveRegistryReferencesBatch: function() {
        this.currentLoadPage = this.currentLoadPage + 1;
        if (this.currentLoadPage <= this.loadPageNumber) {
            var that = this;
            new Ajax.Request((this.options.dataURL + '.' + this.currentLoadPage + '.json'), {
                method: 'GET',
                onSuccess: function(response) {
                    that.loadRegistryReferenceBatch(response.responseJSON)
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

    loadRegistryReferenceBatch: function(registryReferenceData) {
        remainingRegistryReferences = registryReferenceData.registryReferences
        if(remainingRegistryReferences) {
            // Load locations in batches to avoid blocking the browser
            // event loop for too long and risking a script timeout.
            var numLoaded = 0, registryReferenceToLoad;
            while (remainingRegistryReferences.length > 0 && numLoaded < 500) {
                numLoaded++;
                registryReferenceToLoad = remainingRegistryReferences.pop();
                var registryEntry = registryReferenceData.registryEntries[registryReferenceToLoad.registryEntryId]
                var interview = registryReferenceData.interviews[registryReferenceToLoad.interviewId]

                // Skip and log invalid locations.
                if(registryEntry === undefined || interview === undefined
                        || isNaN(registryEntry.latitude) || isNaN(registryEntry.longitude)
                        || Number(registryEntry.latitude) == 0 || Number(registryEntry.longitude) == 0) {
                    console.log('Invalid registry reference: ', registryReferenceToLoad, registryEntry, interview)
                    continue;
                }

                // Load valid locations.
                var referenceType = this.registryReferenceType(registryReferenceToLoad.referenceType, registryEntry.mainRegisters);
                var referenceInfo = this.referenceInfo(referenceType, interview);
                var interviewURL = this.options.urlRoot + '/interviews/' + interview.archiveId;
                var region, country;
                if (registryEntry.region !== undefined) {
                    region = registryReferenceData.registryEntries[registryEntry.region]
                }
                if (registryEntry.country !== undefined) {
                    country = registryReferenceData.registryEntries[registryEntry.country]
                }
                this.clusterManager.addLocation(
                    registryEntry, interview.archiveId, referenceInfo,
                    region, country, referenceType, interviewURL);
            }
        }

        if (remainingRegistryReferences && remainingRegistryReferences.length > 0) {
            // We got more locations to load in the current batch: Let the
            // browser catch up then go on.
            setTimeout((function() { this.loadRegistryReferenceBatch(remainingRegistryReferences) }).bind(this), 0);
        } else {
            // We loaded all locations in the current batch: Try to load a new
            // batch from the web service.
            this.progress.updateBar(1);

            // IE does not correctly unblock on async Ajax requests, so wrap
            // in in a timeout, too.
            setTimeout(this.retrieveRegistryReferencesBatch.bind(this), 0);
        }
    },

    // presents an infoWindow for the marker and location at index position
    referenceInfo: function(referenceType, interview) {
        var reference = this.translate(referenceType);
        var info = '';
        info += '<p class="interviewReference">' + reference + '&nbsp;' + interview.interviewee + ' (' + interview.archiveId + ')</p>';
        info += '<p class="referenceDetails">';
        info += interview.interviewType.capitalize() + ', ' + interview.language + (interview.translated ? ', ' + I18n.t('status.translated') : '') + '</p>';
        return info;
    },

    registryReferenceType: function(refStr, registers) {
        if (refStr === '') return 'interview'

        if (refStr === 'forced_labor_location' || refStr === 'return_location') {
            registers = registers.split(';')
            if (registers.indexOf('Lager') > -1) {
                switch (refStr) {
                    case 'forced_labor_location':
                        return 'forced_labor_camp';
                    case 'return_location':
                        return 'postwar_camp';
                }
            } else if (registers.indexOf('Firma') > -1) {
                if (refStr === 'forced_labor_location') return 'forced_labor_company';
            }
        }

        return refStr;
    },

    translate: function(str) {
        translation_map = {
            forced_labor_location: I18n.t('locations.types.forced_labor_location') + ' -',
            forced_labor_camp: I18n.t('locations.types.forced_labor_camp') + ' -',
            forced_labor_company: I18n.t('locations.types.forced_labor_company') + ' -',
            deportation_location: I18n.t('locations.types.deportation_location') + ' -',
            birth_location: I18n.t('locations.types.birth_location') + ' -',
            home_location: I18n.t('locations.types.home_location_in_map') + ' -',
            return_location: I18n.t('locations.types.return_location') + ' -',
            postwar_camp: I18n.t('locations.types.postwar_camp') + ' -',
            interview: I18n.t('locations.types.interview_in_map')
        };
        return translation_map[str];
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
            clusters: clusterOption
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

