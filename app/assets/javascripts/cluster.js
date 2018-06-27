/* Contains the JS for light-weight markers and location hierarchy clustering */

/* Extend google.maps.LatLng to equal on coordinate equality */


if (typeof google !== 'undefined') {
    google.maps.LatLng.equals = function (other) {
        return this.lat() == other.lat() && this.lng() == other.lng();
    };
}

var debugOn = false;

var clustersOffset = 6;

var filterControls = [];

function debugMsg(msg) {
    if (!debugOn) {
        return;
    }
    alert(msg.toString());
}

function retrieveMapLocations(name, interviewId) {
    var mlocations = cedisMap.mapLocations[0];
    var lidx = mlocations.length;
    var foundlocs = [];
    while (lidx--) {
        var mloc = mlocations[lidx];
        if (mloc.title == name) {
            var add = true;
            if ((interviewId) && (mloc.interviewId != parseInt(interviewId.gsub(/[a-z]+/, '')))) {
                add = false;
            }
            foundlocs.push(mloc);
        }
    }
    return foundlocs;
}

function toggleClusters() {
    $$('.cluster_toggle').each(function (el) {
        el.toggleClassName('clusters-off');
    });
    if (clustersOffset > 0) {
        clustersOffset = 0;
    } else {
        clustersOffset = 6;
    }
    storeMapConfigurationCookie();
    cedisMap.locationSearch.clusterManager.checkForZoomShift();
}

function storeMapConfigurationCookie() {
    var cm = cedisMap.locationSearch.clusterManager;
    var expiry = new Date();
    expiry.setTime((new Date()).getTime() + 3600000 * 24 * 180);
    expiry = expiry.toGMTString();
    var now = new Date(1970).toGMTString();
    // filters
    if ((cm.filters) && (cm.filters.length > 0)) {
        document.cookie = 'zk-f=' + encodeURIComponent(cm.filters.join('+')) + '; expires=' + expiry;
    } else {
        document.cookie = 'zk-f=; expires=' + now;
    }
    // clusters
    if (clustersOffset > 0) {
        document.cookie = 'zk-c=0; expires =' + now;
    } else {
        document.cookie = 'zk-c=1; expires =' + expiry;
    }
    // intro
    document.cookie = 'zk-i=1;';
}

function parseCookieValue(cookieConfig, key) {
    var values = [];
    var cookieKeyRegexp = new RegExp('zk-' + key + '=[^;]+');
    var configValues = cookieConfig.match(cookieKeyRegexp);
    if (configValues) {
        var idx = configValues.length;
        while (idx--) {
            // skip the key + 1 character ('=')
            var cvalues = configValues[idx].substring(key.length + 3).match(/[a-z0-9A-Z_-]+/g);
            if (cvalues) {
                var ldx = cvalues.length;
                while (ldx--) {
                    values.push(cvalues[ldx]);
                }
            }
        }
    }
    return values;
}

function readMapConfigurationCookie() {
    var config = {};
    var storedConfig = decodeURIComponent(document.cookie);
    config.intro = storedConfig.match(/zk-i=[^;]+/);
    // init other parameters only when skipping intro
    if (config.intro) {
        config.filters = parseCookieValue(storedConfig, 'f');
        /*
         config.interviews = parseCookieValue(storedConfig,'i');
         */
        config.clusters = parseCookieValue(storedConfig, 'c');
    }
    return config;
}

// Reverse display priorities
var locationTypePriorities = [
    'interview',
    'return_location',
    'home_location',
    'birth_location',
    'postwar_camp',
    'deportation_location',
    'forced_labor_location',
    'forced_labor_company',
    'forced_labor_camp'
];

function setupFilters(selector) {
    filterControls.push(selector);
    filterControls = filterControls.uniq();
    var filterControlId = 'abcde'[filterControls.length - 1];
    this.filterElements = $$(selector);
    var idx = this.filterElements.length;
    var numFilters = idx;
    while (idx--) {
        var el = this.filterElements[idx];
        if (!el.id) {
            el.id = ('map_filter_' + (numFilters - idx) + '_' + filterControlId);
        }
        Event.observe(el.id, 'click', toggleFilterElement);
    }
}

function toggleFilterElement() {
    var filterName = null;
    var names = $w(this.className);
    var i = names.length;
    while (i--) {
        var name = names[i];
        if (locationTypePriorities.indexOf(name) != -1) {
            filterName = name;
            break;
        }
    }
    if (filterName) {
        cedisMap.locationSearch.clusterManager.toggleFilter(filterName);
        // store filter values in a cookie
        storeMapConfigurationCookie();
    }
}

function parseArchiveId(archiveId) {
    return (Object.isString(archiveId)) ? parseInt(archiveId.sub(/[^\d]+/, '').sub(/^0+/, '')) : archiveId;
}

var ClusterManager = Class.create({
    initialize: function (map, options) {

        this.map = map;
        this.locations = [];
        this.info = [];
        this.alerted = false;
        this.dynamicBounds = false;
        this.activeInfo = null;

        this.shownCluster = null;

        // lat/lng lookup for locations
        if (!cedisMap.mapLocations) {
            cedisMap.mapLocations = [];
        }
        if (!cedisMap.clusterLocations) {
            cedisMap.clusterLocations = [];
        }
        if (!cedisMap.mapClusters) {
            cedisMap.mapClusters = [];
        }

        if ((options.clusters) && (parseInt(options.clusters)) > 0) {
            clustersOffset = 0;
            $$('.cluster_toggle').each(function (el) {
                el.removeClassName('clusters-off');
            });
        }
        this.minZoomPerLevel = [8, 7, 0];
        this.currentLevel = this.getLevelByZoom(this.map.getZoom());
        cedisMap.locationSearch.mapContainer.addClassName('level-' + this.currentLevel);

        google.maps.event.addListener(this.map, 'zoom_changed', function () {
            cedisMap.locationSearch.clusterManager.checkForZoomShift();
        });


        var defaults = {
            width: 320
        };

        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if (!this.options.width) {
            this.options.width = defaults.width;
        }

        setupFilters('.map_filter_off');

        this.filters = [];
        var initialFilters = options.filters || [];

        var fidx = initialFilters.length;
        while (fidx--) {
            this.toggleFilter(initialFilters[fidx]);
        }

    },

    addLocation: function (registryEntry, interviewId, htmlText, region, country, divClass, linkURL) {
        var locDisplay = this.filters.include(divClass);
        var location = new Location(registryEntry, 0, interviewId, htmlText, divClass, linkURL, locDisplay);
        this.addLocationToLevel(location, 0);

        // region
        if (region && region.longitude && region.latitude) {
            // create the region & cluster
            var regionLoc = new Location(region, 1, interviewId, '', divClass, '', locDisplay);
            this.addLocationToLevel(regionLoc, 1);
        }

        // country
        if (country && country.longitude && country.latitude) {
            var countryLoc = new Location(country, 2, interviewId, '', divClass, '', locDisplay);
            this.addLocationToLevel(countryLoc, 2);
        }
    },

    addLocationToLevel: function (location, level) {
        var latLng = location.latLng;
        var cluster = this.locateCluster(latLng, level);
        if (!cluster) {
            cluster = new Cluster(latLng, level, (level == this.currentLevel));
        }
        cluster.addLocation(location);
    },

    addClustersToMap: function () {
        if (!cedisMap.mapClusters) return;

        // Order locations in clusters.
        cedisMap.mapClusters.each(function (clusterList, level) {
            clusterList.each(function (cluster) {
                cluster.addToMap();
            });
        });
    },

    composeHtmlText: function (html, klass) {
        return ('<li class="' + (klass || 'interview') + '">' + html + '</li>');
    },

    locateCluster: function (latLng, level) {
        var loc = latLng.toString();
        var clusterLocations = cedisMap.clusterLocations[level];
        var mapClusters = cedisMap.mapClusters[level];
        if (!clusterLocations) {
            clusterLocations = [];
        }
        if (!mapClusters) {
            mapClusters = [];
        }
        var idx = clusterLocations.length;
        while (idx--) {
            if ((idx < 0) || (clusterLocations[idx] == loc)) {
                break;
            }
        }
        if (idx > -1) {
            return mapClusters[idx];
        } else {
            return null;
        }
    },

    getLevelByZoom: function (zoom) {
        var level = 0;
        while (level < 3) {
            if (zoom + 1 > (this.minZoomPerLevel[level] - clustersOffset)) {
                break;
            }
            level++;
        }
        return level;
    },

    // check to see if a new clustering level needs to be applied
    checkForZoomShift: function () {
        var zoom = this.map.getZoom();
        var level = this.getLevelByZoom(zoom);
        if ((level == 1) && (clustersOffset > 1)) {
            // don't cluster by region except when using really small offsets
            level = 2;
        }
        if (level != this.currentLevel) {
            this.switchLevel(level);
        }
    },

    zoomOneLevel: function (marker) {
        if (this.currentLevel < 1) {
            return;
        }
        var pos = marker.getPosition();
        var zoom = this.map.getZoom();
        this.map.panTo(pos);
        this.map.setZoom(this.minZoomPerLevel[this.currentLevel - 1] - clustersOffset);
    },

    showInfoBox: function (marker) {
        if (this.activeInfo) {
            this.activeInfo.close();
            this.activeInfo = null;
            this.shownCluster = null;
        }

        var cluster = this.locateCluster(marker.getPosition(), this.currentLevel);
        if (cluster) {
            this.shownCluster = cluster;
            var infoBox = new google.maps.InfoWindow({
                content: cluster.displayInfo(1),
                maxWidth: this.options.width
            });
            infoBox.open(cedisMap.locationSearch.map, marker);
            this.activeInfo = infoBox;
        }
    },

    showClusterPage: function (page) {
        if (this.shownCluster && this.activeInfo) {
            // TODO: Is there a way to change the content more gently (fade etc.)?
            this.activeInfo.setContent(this.shownCluster.displayInfo(page));
            // remember the location list's width and set as minimum
            var locationList = $('active_info_locations');
            if (locationList && locationList.offsetWidth > this.shownCluster.width) {
                this.shownCluster.width = locationList.offsetWidth;
            }
        }
    },

    toggleFilter: function (filter) {
        var changedLocs = 0;
        var changedClusters = [];
        if (locationTypePriorities.indexOf(filter) != -1) {
            if (this.filters.indexOf(filter) == -1) {
                this.filters.push(filter);
            } else {
                this.filters = this.filters.select(function (obj) {
                    return obj != filter
                });
            }
            var filters = this.filters;
            // toggle the filter elements
            var elems = $$('.map_filter.' + filter).concat($$('.map_filter_off.' + filter)).uniq().compact();
            var eidx = elems.length;
            while (eidx--) {
                var elem = elems[eidx];
                if (elem) {
                    elem.toggleClassName('map_filter');
                    elem.toggleClassName('map_filter_off');
                }
            }
            // apply filters to all locations on all levels
            var level = cedisMap.mapLocations.length;
            while (level--) {
                var locations = cedisMap.mapLocations[level];
                var index = locations.length;
                while (index--) {
                    var loc = locations[index];
                    var changed = loc.applyFilters(filters);
                    if (changed && changedClusters.indexOf(loc.cluster) == -1) {
                        changedClusters.push(loc.cluster);
                    }
                }
            }
            var idx = changedClusters.length;
            while (idx--) {
                changedClusters[idx].refresh();
            }
        }
    },

    switchLevel: function (level) {
        var currentLevel = cedisMap.locationSearch.clusterManager.currentLevel;
        if (currentLevel == level) {
            return;
        }

        var lvl = 3;
        var mapDiv = cedisMap.locationSearch.mapContainer;
        while (lvl--) {
            var lvlClass = 'level-' + lvl;
            if (lvl == level) {
                mapDiv.addClassName(lvlClass);
            } else {
                mapDiv.removeClassName(lvlClass);
            }
        }

        var clustersOut = cedisMap.mapClusters[currentLevel];
        var id1 = clustersOut.length;
        while (id1--) {
            clustersOut[id1].hide();
        }

        cedisMap.locationSearch.clusterManager.currentLevel = level;
        var clustersIn = cedisMap.mapClusters[level];
        var id2 = clustersIn.length;
        while (id2--) {
            clustersIn[id2].show();
        }

    },

    benchmark: function (test, desc) {
        var startTime = (new Date).getTime();
        test.call();
        var endTime = (new Date).getTime();
        debugMsg(desc + '\nTime taken: ' + (endTime - startTime) + ' ms.');
    }
});

var Location = Class.create({
    initialize: function (registryEntry, level, interviewId, htmlText, divClass, linkURL, locDisplay) {
        this.info = htmlText;
        this.locationType = this.getPriority(divClass);
        this.title = registryEntry.descriptor;
        this.interviewId = parseArchiveId(interviewId);
        this.latLng = new google.maps.LatLng(registryEntry.latitude, registryEntry.longitude);
        this.level = level;
        this.linkURL = linkURL + '/in/' + registryEntry.id.toString() + '?locale=' + I18n.locale;
        this.displayFilter = locDisplay;
        this.displaySelection = true;
        this.cluster = null;
        if (!cedisMap.mapLocations) {
            cedisMap.mapLocations = [];
        }
        if (!cedisMap.mapLocations[level]) {
            cedisMap.mapLocations[level] = [];
        }
        this.id = cedisMap.mapLocations[level].length;
        cedisMap.mapLocations[level].push(this);
    },

    setCluster: function (cluster) {
        this.cluster = cluster;
    },

    display: function () {
        return (this.displayFilter && this.displaySelection);
    },

    hide: function () {
        this.displayFilter = false;
    },

    show: function () {
        this.displayFilter = true;
    },

    applyFilters: function (filters) {
        var changed = false;
        if (filters.indexOf(this.getLocationType()) > -1) {
            if (!this.displayFilter) {
                this.show();
                changed = true;
            }
        } else {
            if (this.displayFilter) {
                this.hide();
                changed = true;
            }
        }
        return changed;
    },

    getPriority: function (type) {
        return locationTypePriorities.indexOf(type) || 0;
    },

    getLocationType: function () {
        return locationTypePriorities[this.locationType] || 'interview';
    },

    displayLines: function () {
        return (this.locationType == 0) ? 1 : 2;
    },

    getHtml: function () {
        return ('<li class="' + this.getLocationType() + '" onclick="window.open(\'' + this.linkURL + '\', \'_blank\');" style="cursor: pointer;">' + this.info + '</li>');
    }
});

/*
 The lifecycle of a cluster is:
 1) Pre-initialization of the cluster (Cluster::initialize()) and its
 corresponding marker without adding the marker to the map yet.
 2) Loading locations into the cluster (Cluster::addLocation()) via Ajax.
 3) Post-initialization of the cluster (Cluster::addToMap()). This will
 initialize all properties of the cluster and its marker that depend
 on the location list, level, etc. Then the marker will be added to
 the map.
 4) Adding the marker to the map will trigger calls to the marker's onAdd()
 and draw() methods. If the cluster is configured to be visible then its
 marker will be displayed now after all locations have been loaded.

 NB: We do not add the marker to the map during pre-initialization as this
 would show a partially initialized marker (w/o title and number) in the map
 during Ajax load process.

 Setting markers initially invisible but adding them immediately to the DOM
 is not an option: When location load finishes, it is not guaranteed that all
 markers have already been added to the DOM as Google Maps seems to add markers
 asynchronously. Trying to update a marker's visibility before it is in the DOM
 would trigger an error. The Google Maps API does not provide an event hook
 that tells us when all markers have been added to the DOM so that we could
 update marker visibility asynchronously.

 Clusters may have to be updated in response to the following events:
 1) display level change (country, region, location): we'll have to
 hide/show the cluster but an update of the displayed locations is not
 necessary. Only show clusters that have at least one displayed location,
 though.
 2) filter/selection change: we have to update the displayed cluster
 locations. If a cluster has no more displayed locations it must be
 hidden, if it was hidden before and now has displayed locations, it
 must be shown.
 */
var Cluster = Class.create({
    // Pre-initialization of the cluster.
    // Constructor arguments are: lat/lng and the hierarchical grouping level.
    initialize: function (latLng, level, visible) {
        var locationSearch = cedisMap.locationSearch;
        this.icon = locationSearch.options.images['default'];
        this.color = locationSearch.options.colors['default'];
        this.title = '?';
        this.locations = [];
        this.visible = visible;
        this.level = level;
        this.width = 0;
        this.numberShown = 0;
        if (level == 0) {
            var marker = new google.maps.Marker({
                position: latLng,
                icon: this.icon,
                flat: true,
                visible: false
            });
            google.maps.event.addListener(marker, 'click', function () {
                cedisMap.locationSearch.clusterManager.showInfoBox(marker);
            });
        } else {
            var marker = new ClusterIcon(this, cedisMap.locationSearch.map, latLng);
            google.maps.event.addListener(marker, 'click', function () {
                cedisMap.locationSearch.clusterManager.zoomOneLevel(marker);
            });
        }
        this.marker = marker;

        if (!cedisMap.clusterLocations[this.level]) {
            cedisMap.clusterLocations[this.level] = [];
        }
        if (!cedisMap.mapClusters[this.level]) {
            cedisMap.mapClusters[this.level] = [];
        }
        cedisMap.clusterLocations[this.level].push(latLng.toString());
        cedisMap.mapClusters[this.level].push(this);
    },

    // Location loading (after pre-initialization and before post-initialization).
    addLocation: function (location) {
        if (this.locations.indexOf(location) == -1) {
            this.locations.push(location);
            location.setCluster(this);
        }
    },

    // Post-initialization (requires full location load).
    addToMap: function () {
        // Post-initialization of the cluster after location load.
        this.locations = this.locations.sortBy(function (l) {
            return l.locationType;
        }).reverse();
        this.updateDisplayedLocations();

        // Only add the marker to the map after it has been fully initialized.
        this.marker.setMap(cedisMap.locationSearch.map);
    },

    // The following methods may only be called after calling addToMap() first
    // *and* letting the Google Maps API load all locations. Calling them
    // immediately after addToMap() will give an error (see class-level comment).
    show: function () {
        this.visible = true;
        this.marker.setVisible(this.isVisible());
    },

    hide: function () {
        this.visible = false;
        this.marker.setVisible(false);
    },

    refresh: function () {
        this.updateDisplayedLocations();
        if (this.numberShown > 0 && this.level > 0) {
            this.marker.draw();
        }
    },

    updateDisplayedLocations: function () {
        // Reapply the location filter.
        var displayedLocs = this.locations.select(function (l) {
            return l.display();
        });
        this.numberShown = displayedLocs.length;

        if (this.numberShown > 0) {
            // Update location-filter dependent attributes.
            var loc = displayedLocs.first();

            // Title.
            this.title = loc.title;
            if (this.level == 0) {
                if (displayedLocs.length > 1) this.title = this.title.concat(' (+' + (displayedLocs.length - 1) + ')');
                this.marker.setTitle(this.title);
            }

            // Icon and color.
            locType = loc.getLocationType();
            if (this.level == 0) {
                this.icon = cedisMap.locationSearch.options.images[locType];
                this.marker.setIcon(this.icon);
            } else {
                this.color = cedisMap.locationSearch.options.colors[locType] || 'red';
            }

            // Display priority.
            this.marker.setZIndex(loc.locationType * 10 + 100);
        }

        // Update visibility.
        this.marker.setVisible(this.isVisible());
    },

    isVisible: function () {
        return (this.visible && (this.numberShown > 0));
    },

    getPosition: function () {
        if (this.level == 0) {
            return this.marker.position;
        } else {
            return this.marker.center_;
        }
    },

    // groups the locations by descriptor [['descriptor', [array,of,locations], #number of lines]]
    displayLocations: function () {
        var locs = this.locations.toArray();
        var displayLocs = [];
        var descriptors = [];
        var titleIndex = 0;
        var index = locs.length;
        while (index--) {
            var l = locs[index];
            if (l.display()) {
                var idx = descriptors.indexOf(l.title);
                if (idx == -1) {
                    descriptors.push(l.title);
                    displayLocs.push([l.title, [l], 1 + l.displayLines()]);
                } else {
                    var existingLoc = displayLocs[idx];
                    // check if existingLoc is added to front or back...
                    var descriptorLocs = existingLoc[1];
                    var newLocs = [];
                    var dli = descriptorLocs.length;
                    var added = false;
                    while (dli--) {
                        var el = descriptorLocs[dli];
                        if ((el.locationType > l.locationType) && !(added)) {
                            newLocs.push(l);
                            added = true;
                        }
                        newLocs.push(el);
                    }
                    if (!added) {
                        newLocs.push(l);
                    }
                    existingLoc[1] = newLocs.reverse();
                    existingLoc[2] = existingLoc[2] + l.displayLines();
                }
            }
        }
        return displayLocs;
    },

    displayInfo: function (page) {
        if (!page) {
            page = 1;
        }
        var html = '';
        var locs = this.displayLocations();
        var totalLines = 0;
        // collect the locations organized per page
        var pages = [[]];
        var pageIdx = 0;
        var lines = 0;
        var von = 0;
        var bis = 0;
        var locNumber = locs.length;
        var index = locNumber;
        while (index--) {
            var l = locs[index];
            if (lines > 10) {
                pageIdx++;
                pages[pageIdx] = [];
                lines = 0;
            }
            pages[pageIdx].push(l);
            lines = lines + l[2] + 1;
            totalLines = totalLines + l[2] + 1;
            if (pageIdx + 1 == page) {
                var idx = locs.indexOf(l);
                bis = idx + 1;
                if (von == 0) {
                    von = idx + 1;
                }
            }
        }
        var totalPages = pages.length;
        // reverse the numbering again
        von = locNumber - von + 1;
        bis = locNumber - bis + 1;
        if (totalPages > 1) {
            var dataSetStr = (von == bis) ? (I18n.t('map.pagination.place') + ' ' + von) : (I18n.t('map.pagination.places') + ' ' + von + '-' + bis);
            html += '<ul class="pagination">';
            var pageIndex = 1;
            while (totalPages > 0) {
                html += '<li' + ((page == pageIndex) ? ' class="active"' : '') + ' onclick="cedisMap.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
                totalPages--;
            }
            html += '</ul><span class="pages">' + dataSetStr + ' ' + I18n.t('map.pagination.of') + ' ' + locs.length + '</span>';
        }
        var style = '';
        if (this.width > 0) {
            style = ' width: ' + this.width + 'px;'
        }
        if (totalLines > 10) {
            style += ' height: 290px;'
        }
        html += '<ul id="active_info_locations" class="locationReferenceList" style="' + style + '">';
        var locInfo = pages[page - 1].collect(function (l) {
            return ('<li><h3>' + l[0] + '</h3><ul>' + l[1].collect(function (l1) {
                return l1.getHtml();
            }).join('') + '</ul></li>');
        }).join('');
        html += locInfo + '</ul>';
        return html;
    },

    locationsInfo: function (page) {
        if (!page) {
            page = 1;
        }
        var html = '';
        var totalPages = this.locations.length / 4;
        if (totalPages > 1) {
            var von = ((page - 1) * 4) + 1;
            var bis = (page * 4 > this.locations.length) ? this.locations.length : page * 4;
            var dataSetStr = (von == bis) ? (I18n.t('map.pagination.place') + ' ' + von) : (I18n.t('map.pagination.places') + ' ' + von + '-' + bis);
            html = html + '<span>' + dataSetStr + ' ' + I18n.t('map.pagination.of') + ' ' + this.locations.length + '&nbsp;</span><ul class="pagination">';
            var pageIndex = 1;
            while (totalPages > 0) {
                html = html + '<li style="list-style-type: none; float: left; border: 1px solid; cursor: pointer;" onclick="cedisMap.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
                totalPages--;
            }
            html = html + '</ul>';
        }
        html = html + '<ul class="locationReferenceList"' + ((this.locations.length > 4) ? ' style="height: 290px;"' : '') + '>';
        var displayIndices = [1, 2, 3, 4].collect(function (n) {
            return 4 * (page - 1) + n - 1;
        });
        var clusterLocations = this.locations;
        var locInfo = this.locations.collect(function (l) {
            if (displayIndices.indexOf(clusterLocations.indexOf(l)) != -1) {
                return l.getHtml();
            } else {
                return null;
            }
        }).compact().join('');
        html = html + locInfo + '</ul>';
        return html;
    }
});

if (typeof google !== 'undefined') {
// Wrap Google's OverlayView so that we can inherit from it.
    var OverlayView = Class.create();
    OverlayView.prototype = new google.maps.OverlayView();

    var ClusterIcon = Class.create(OverlayView, {
        initialize: function (cluster, map, center) {
            this.cluster = cluster;
            this.map_ = map;
            this.center_ = center;
            this.visible_ = false;

            this.div_ = null;
            this.circle_ = null;
            this.zIndex_ = 0;

            this.initialized_ = false;
        },

        zoomIntoCluster: function () {
            cedisMap.locationSearch.clusterManager.zoomOneLevel(this);
        },

        getImagePath: function (color) {
            return cedisMap.locationSearch.options.urlRoot + '/images/circle_' + color + '.png';
        },

        // Initial instantiation of the marker - called only once.
        onAdd: function () {
            var panes = this.getPanes();
            if (!this.div_) {
                this.div_ = new Element('div', {
                    id: this.cluster.title,
                    title: this.cluster.title,
                    style: 'display: ' + (this.cluster.isVisible() ? 'inline-block' : 'none')
                });
                this.div_.className = ('cluster-icon level-' + this.cluster.level);
                this.div_.innerHTML = '&nbsp;';
                panes.overlayMouseTarget.appendChild(this.div_);

                // add interaction
                var that = this;
                google.maps.event.addDomListener(this.div_, 'click', function () {
                    that.zoomIntoCluster();
                });
            }
            if (!this.circle_) {
                // create an image circle
                this.circle_ = new Element('img', {
                    src: this.getImagePath(this.cluster.color),
                    id: this.cluster.title + '_circle',
                    style: 'display: ' + (this.cluster.isVisible() ? 'block' : 'none')
                });
                this.circle_.className = ('cluster-circle level-' + this.cluster.level);
                panes.overlayMouseTarget.appendChild(this.circle_);
            }
            this.initialized_ = true;
        },

        // Updating the marker - called whenever the marker changes.
        draw: function () {
            if (this.visible_) {
                var pos = this.getPosFromLatLng(this.center_);

                this.circle_.src = this.getImagePath(this.cluster.color);
                var radius = this.imgRadius(this.cluster.numberShown);
                this.circle_.style.top = (pos.y - (radius / 2) - 1) + 'px';
                this.circle_.style.left = (pos.x - (radius / 2) - 1) + 'px';
                this.circle_.style.width = radius + 'px';
                this.circle_.style.height = radius + 'px';

                this.div_.style.top = (pos.y - 20) + 'px';
                this.div_.style.left = (pos.x - 20) + 'px';
                this.div_.innerHTML = this.cluster.numberShown.toString();
                this.div_.title = this.cluster.title;
                this.div_.style.zIndex = this.zIndex_;

                this.div_.style.display = 'inline-block';
                this.circle_.style.display = 'block';
            } else {
                this.div_.style.display = 'none';
                this.circle_.style.display = 'none';
            }
        },

        onRemove: function () {
            if (this.div_ && this.div_.parentNode) {
                this.circle_.setVisible(false);
                this.div_.stopObserving('click');
                Element.remove(this.div_);
            }
        },

        getPosFromLatLng: function (latLng) {
            var pos = this.getProjection().fromLatLngToDivPixel(latLng);
            pos.x = pos.x.toFixed();
            pos.y = pos.y.toFixed();
            return pos;
        },

        getPosition: function () {
            return this.center_;
        },

        setZIndex: function (z) {
            this.zIndex_ = z;
        },

        setVisible: function (display) {
            if (display == this.visible_) return;
            this.visible_ = display;
            if (this.initialized_) this.draw();
        },

        imgRadius: function (totals) {
            var log = Math.log(totals + 3);
            var zoom = cedisMap.locationSearch.map.getZoom();
            var radius = Math.floor(25.0 + (zoom / 6) * (log * log * 0.5 * zoom + (zoom * totals / 100.0)));
            return radius;
        }
    });
}
