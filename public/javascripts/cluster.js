/* Contains the JS for light-weight markers and location hierarchy clustering */

/* Extend google.maps.LatLng to equal on coordinate equality */
google.maps.LatLng.equals = function(other) {
    return this.lat() == other.lat() && this.lng() == other.lng();
};

var debugOn = false;

var totalClusters = 0;

function debugMsg(msg) {
    if(!debugOn)  { return; }
    alert(msg.toString());
}

// Reverse display priorities
var locationTypePriorities = [
        'interview',
        'return_location',
        'home_location',
        'place_of_birth',
        'deportation_location',
        'forced_labor_location',
        'forced_labor_company',
        'forced_labor_camp'
];

function toggleFilterElement() {
    var filterName = null;
    var names = $w(this.className);
    var i = names.length;
    while(i--) {
        var name = names[i];
        if(locationTypePriorities.indexOf(name) != -1) {
            filterName = name;
            break;
        }
    }
    if(filterName) {
        cedisMap.locationSearch.clusterManager.toggleFilter(filterName);
        this.toggleClassName('map_filter');
        this.toggleClassName('map_filter_off');
    }
}

var ClusterManager = Class.create();
var Location = Class.create();
var Cluster = Class.create();

ClusterManager.prototype = {
    initialize: function(map, options) {
        this.map = map;
        this.locations = [];
        this.markers = [];
        this.info = [];
        this.alerted = false;

        this.filters = [];

        this.activeInfo = null;

        this.shownCluster = null;

        this.freshClusters = [];

        this.minZoomPerLevel = [8, 7, 0];
        this.currentLevel = this.getLevelByZoom(this.map.getZoom());
        cedisMap.locationSearch.mapContainer.addClassName('level-' + this.currentLevel);
        
        google.maps.event.addListener(this.map, 'zoom_changed',  function() { cedisMap.locationSearch.clusterManager.checkForZoomShift(); });


        var defaults = {
            width: 320
        };

        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.width) { this.options.width = defaults.width; }

        this.filterElements = $$('.map_filter');
        var idx = this.filterElements.length;
        var numFilters = idx;
        while(idx--) {
            var el = this.filterElements[idx];
            if(!el.id) {
                el.id = ('map_filter_' + (numFilters - idx));
            }
            Event.observe(el.id, 'click', toggleFilterElement);
        }

        // lat/lng lookup for locations
        if(!cedisMap.mapLocations) {cedisMap.mapLocations = []; }

        if(!cedisMap.clusterLocations) { cedisMap.clusterLocations = []; }
        if(!cedisMap.mapClusters) { cedisMap.mapClusters = []; }

    },

    addLocation: function(id, latLng, htmlText, region, country, divClass, linkURL) {
        var location = new Location(id, latLng, 0, htmlText, divClass, linkURL, true);

        this.addLocationToLevel(location, 0);

        // region
        if(region && region.longitude && region.latitude) {
            // create the region & cluster
            var latLng = new google.maps.LatLng(region.latitude, region.longitude);
            var regionLoc = new Location(region.name, latLng, 1, '', divClass, '', true);

            this.addLocationToLevel(regionLoc, 1);
        }

        // country
        if(country && country.longitude && country.latitude) {
            var latLng = new google.maps.LatLng(country.latitude, country.longitude);
            var countryLoc = new Location(country.name, latLng, 2, '', divClass, '', true);

            this.addLocationToLevel(countryLoc, 2);
        }
    },

    addLocationToLevel: function(location, level) {
        var latLng = location.latLng;
        var cluster = this.locateCluster(latLng, level);

        if(!cluster) {
            if (level != 0) {
                // alert('Creating new level ' + level + ' cluster at ' + latLng + '\nfor location: ' + location.title);
            }
            cluster = new Cluster(latLng, level, (level == this.currentLevel));
        } else {
            if(level != 0) {
                // alert('Adding to level ' + level + ' cluster at ' + latLng + '\nthis location: ' + location.title);
            }
        }
        if(level != 0) {
            debugMsg('adding Location ' + location.title + ' to cluster...');
        }
        cluster.addLocation(location);
        if(level != 0) {
            debugMsg('location added.');
        }
        if(cluster.level == this.currentLevel) {
            // only add clusters on the current level to the draw roster
            this.freshClusters.push(cluster);    
        }
        var debugLocs = ['Berlin', 'Luxemburg', 'Region Skopje'];
        if(debugLocs.indexOf((location.title.sub(/\s+\(.*$/,''))) != -1) {
            // alert('Added location:\n' + location.title + ', at ' + location.latLng + '\nto Level ' + level + '\nto Cluster: ' + cluster.title + ' at ' + cluster.latLng + ' in level ' + cluster.level);
        }
    },

    // bundle cluster rendering together
    renderMarkers: function() {
        // TODO: iterate over mapClusters[this.currentLevel]
        // set rendered to true then draw
        var clusters = this.freshClusters;
        var idx = clusters.length;
        while(idx--) {
           clusters[idx].draw();
        }
        this.freshClusters = [];
    },

    refreshLoadedClusters: function() {
        if((!cedisMap.mapClusters) || (!cedisMap.mapClusters[this.currentLevel])) { return; }
        var clusters = cedisMap.mapClusters[this.currentLevel];
        var latLngs = cedisMap.clusterLocations[this.currentLevel];
        var equator = new google.maps.LatLng(0,0);
        var idx = clusters.length;
        // alert('Refreshing ' + idx + ' Loaded Clusters for level ' + this.currentLevel);
        while(idx--) {
            var cluster = clusters[idx];
            cluster.refresh();
            // if((cluster) && (!latLngs[idx].equals(equator))) {
            //    alert('Refreshing cluster ' + idx + ': ' + cluster.title);
            //    cluster.refresh();
            //}
        }
    },

    composeHtmlText: function(html, klass) {
        return ('<li class="' + (klass || 'interview') + '">' + html + '</li>');
    },

    locateCluster: function(latLng, level) {
        var loc = latLng.toString();
        var clusterLocations = cedisMap.clusterLocations[level];
        var mapClusters = cedisMap.mapClusters[level];
        if(!clusterLocations) { clusterLocations = []; }
        if(!mapClusters) { mapClusters = []; }
        var idx = clusterLocations.length;
        while(idx--) {
            if((idx < 0) || (clusterLocations[idx] == loc)) { break; }
        }
        if(idx > -1) {
            return mapClusters[idx];
        } else {
            return null;
        }
    },

    getLevelByZoom: function(zoom) {
        var level = 0;
        while(level < 3) {
            if(zoom+1 > this.minZoomPerLevel[level]) {
                break;
            }
            level++;
        }
        return level;
    },

    // check to see if a new clustering level needs to be applied
    checkForZoomShift: function() {
        var zoom = this.map.getZoom();
        var level = this.getLevelByZoom(zoom);
        // debugMsg('Check for zoom shift at zoom = ' + zoom + '\nlevel = ' + level);
        if(level != this.currentLevel) {
            this.switchLevel(level);
        }
    },

    zoomOneLevel: function(marker) {
        if(this.currentLevel < 1) { return; }
        var pos = marker.getPosition();
        var zoom = this.map.getZoom();
        this.map.panTo(pos);
        this.map.setZoom(this.minZoomPerLevel[this.currentLevel-1]);
    },

    showInfoBox: function(marker) {
        if(this.activeInfo) {
            this.activeInfo.close();
            this.activeInfo = null;
            this.shownCluster = null;
        }

        var cluster = this.locateCluster(marker.getPosition(), this.currentLevel);
        if(cluster) {
            this.shownCluster = cluster;
            var infoBox = new google.maps.InfoWindow({
                content: cluster.displayInfo(1),
                maxWidth: this.options.width
            });
            infoBox.open(cedisMap.locationSearch.map, marker);
            this.activeInfo = infoBox;
        }
    },

    showClusterPage: function(page) {
        if(this.shownCluster && this.activeInfo) {
            // TODO: is there a way to change the content more gently (fade etc.)?
            this.activeInfo.setContent(this.shownCluster.displayInfo(page));
            // remember the location list's width and set as minimum
            var locationList = $('active_info_locations');
            if(locationList && locationList.offsetWidth > this.shownCluster.width) { this.shownCluster.width = locationList.offsetWidth; }
        }
    },

    toggleFilter: function(filter) {
        var filterStartTime = (new Date).getTime();
        var changedLocs = 0;
        var changedClusters = [];
        if(locationTypePriorities.indexOf(filter) != -1) {
            if(this.filters.indexOf(filter) == -1) {
                this.filters.push(filter);
            } else {
                this.filters = this.filters.select(function(obj) { return obj != filter });
            }
            var filters = this.filters;
            // apply filters to all locations
            var locations = cedisMap.mapLocations[this.currentLevel];
            var index = locations.length;
            while(index--) {
                var loc = locations[index];
                var changed = loc.applyFilters(filters);
                if(changed && changedClusters.indexOf(loc.cluster) == -1) { changedClusters.push(loc.cluster); }
            }
            var idx = changedClusters.length;
            while(idx--) {
                changedClusters[idx].refresh();
            }
            /* cedisMap.mapLocations[this.currentLevel].each(function(loc) {
                var changed = loc.applyFilters(filters);
                if(changed) { changedLocs++ }
            }); */
        }
        var filterStopTime = (new Date).getTime();
        // debugMsg('Optimization 4:\nTime for applying the filter: ' + filter + '\n\n' + (filterStopTime - filterStartTime) + ' ms.\n\n' + changedLocs + ' locations changed of ' + cedisMap.mapLocations[this.currentLevel].length);
    },

    // benchmark test for markers
    toggleAllMarkers: function() {
        var currentLevel = cedisMap.locationSearch.clusterManager.currentLevel;
        this.benchmark(function() {
           var clusters = cedisMap.mapClusters[currentLevel];
           var idx = clusters.length;
           while(idx--) {
               var marker = clusters[idx].marker;
               marker.setVisible(!marker.getVisible());
           }
        }, 'Toggle all Clusters/Markers');
    },

    // benchmark test for locations
    toggleAllLocations: function() {
        var currentLevel = cedisMap.locationSearch.clusterManager.currentLevel;
        this.benchmark(function() {
            var locations = cedisMap.mapLocations[currentLevel];
            var idx = locations.length;
            while(idx--) {
                var location = locations[idx];
                if(location.display) {
                    location.hide();
                } else {
                    location.show();
                }
            }
        },'Toggle all Locations');
    },

    switchLevel: function(level) {
        var currentLevel = cedisMap.locationSearch.clusterManager.currentLevel;
        if(currentLevel == level) { return; }

        var lvl = 3;
        var mapDiv = cedisMap.locationSearch.mapContainer;
        while(lvl--) {
            var lvlClass = 'level-' + lvl;
            if(lvl == level) {
                mapDiv.addClassName(lvlClass);
            } else {
                mapDiv.removeClassName(lvlClass);
            }
        }
        // alert('Attempting to switch from level ' + currentLevel + ' to level ' + level);

        /* this didn't improve cluster artifact issue
        var clevel = 3;
        while(clevel--) {
            var clusters = cedisMap.mapClusters[clevel];
            var idx = clusters.length;
            while(idx--) {
                if(clevel == level) {
                    clusters[idx].show();
                } else {
                    clusters[idx].hide();
                }
            }
        }
        */

        var clustersOut = cedisMap.mapClusters[currentLevel];
        var id1 = clustersOut.length;
        while(id1--) {
           clustersOut[id1].hide();
        }

        cedisMap.locationSearch.clusterManager.currentLevel = level;
        var clustersIn = cedisMap.mapClusters[level];
        var id2 = clustersIn.length;
        while(id2--) {
            clustersIn[id2].show();
        }

    },

    benchmark: function(test, desc) {
        var startTime = (new Date).getTime();
        test.call();
        var endTime = (new Date).getTime();
        debugMsg(desc + '\nTime taken: ' + (endTime - startTime) + ' ms.');
    }
};

Location.prototype = {
    initialize: function(id, latLng, level, htmlText, divClass, linkURL, display) {
        this.info = htmlText;
        this.locationType = this.getPriority(divClass);
        this.title = id;
        this.latLng = latLng;
        this.level = level;
        this.linkURL = linkURL;
        this.display = display;
        this.cluster = null;
        if(!cedisMap.mapLocations) { cedisMap.mapLocations = []; }
        if(!cedisMap.mapLocations[level]) { cedisMap.mapLocations[level] = []; }
        this.id = cedisMap.mapLocations[level].length;
        cedisMap.mapLocations[level].push(this);
    },

    setCluster: function(cluster) {
        this.cluster = cluster;
    },

    hide: function() {
        this.display = false;
    },

    show: function() {
        this.display = true;
    },

    applyFilters: function(filters) {
        var changed = false;
        if(filters.indexOf(this.getLocationType(this.locationType)) > -1) {
            if(this.display) {
                this.hide();
                changed = true;
            }
        } else {
            if(!this.display) {
                this.show();
                changed = true;
            }
        }
        if(changed && this.cluster) {
            //this.cluster.refresh();
        }
        return changed;
    },

    getPriority: function(type) {
        return locationTypePriorities.indexOf(type) || 0;
    },

    getLocationType: function(priority) {
        return locationTypePriorities[priority] || 'interview';
    },

    displayLines: function() {
        return (this.locationType == 0) ? 1 : 2;
    },
    
    getHtml: function() {
        return ('<li class="' + this.getLocationType(this.locationType) + '" onclick="window.open(\'' + this.linkURL + '\', \'_blank\');" style="cursor: pointer;">' + this.info + '</li>');
    }
};

// constructor arguments are: lat/lng and the hierarchical grouping level
Cluster.prototype = {
    initialize: function(latLng, level, visible) {
        var locationSearch = cedisMap.locationSearch;
        this.icon = locationSearch.options.images['default'];
        this.color = locationSearch.options.colors['default'];
        this.title = '?';
        this.locations = [];
        this.rendered = false;
        this.visible = (level == cedisMap.locationSearch.clusterManager.currentLevel);
        this.level = level;
        this.width = 0;
        this.marker = null;
        if(level == 0) {
            var marker = new google.maps.Marker({
                position: latLng,
                icon: this.icon,
                flat: true
            });
            this.marker = marker;
            // this.marker.setMap(locationSearch.map);
            google.maps.event.addListener(marker, 'click',  function() { cedisMap.locationSearch.clusterManager.showInfoBox(marker); });
        } else {
            var marker = new ClusterIcon(this, cedisMap.locationSearch.map, latLng);
            this.marker = marker;
            debugMsg('Created ClusterIcon ' + marker);
            google.maps.event.addListener(marker, 'click',  function() { cedisMap.locationSearch.clusterManager.zoomOneLevel(marker); });
        }
        if(!cedisMap.clusterLocations[this.level]) { cedisMap.clusterLocations[this.level] = []; }
        if(!cedisMap.mapClusters[this.level]) { cedisMap.mapClusters[this.level] = []; }
        cedisMap.clusterLocations[this.level].push(latLng.toString());
        cedisMap.mapClusters[this.level].push(this);

        totalClusters++;

        this.marker.setVisible(visible);
        this.marker.setMap(cedisMap.locationSearch.map);
    },

    setIconByType: function(type) {
        if(this.level == 0) {
            this.icon = cedisMap.locationSearch.options.images[type];
        } else {
            this.color = cedisMap.locationSearch.options.colors[type] || '#990000';
            this.marker.setColor(this.color);
        }
    },
    
    addLocation: function(location) {
        if (this.locations.indexOf(location) == -1) {
            this.locations.push(location);
            location.setCluster(this);
            this.locations = this.locations.sortBy(function(l){return l.locationType; }).reverse();
            var loc = this.locations.first();
            this.title = loc.title;
            this.setIconByType(loc.getLocationType(loc.locationType));
            if(this.locations.length > 1) {
                this.title = this.title.concat(' (+' + (this.locations.length-1) + ')');
            }
            this.marker.setZIndex(loc.locationType * 10 + 100);
            if (this.level > 0) {
                this.marker.setTotal(this.locations.length);
            }
            this.rendered = false;
            // this.redraw();
        }
    },

    draw: function() {
        if(!this.rendered) {
            this.redraw();
        }
    },

    redraw: function() {
        if(!this.visible) { return; }
        if(this.level == 0) {
            this.marker.setIcon(this.icon);
            this.marker.setTitle(this.title);
        } else {
            // alert('Redraw of ClusterIcon for ' + this.title);
            this.marker.draw();
        }
        this.rendered = true;
    },

    show: function() {
        this.visible = true;
        this.marker.rendered = false;
        this.marker.setVisible(true);
        // this.marker.setMap(cedisMap.locationSearch.map);
        this.redraw();
    },

    hide: function() {
        this.visible = false;
        this.marker.setVisible(false);
        // this.marker.setMap(null);
    },

    refresh: function() {
        if(this.level != 0) {
            this.marker.setTotal(this.locations.length);
        }
        var locs = this.displayLocations();
        // alert('Refresh of ' + this.title + ' (visible: ' + this.visible + ') with locations: ' + locs);
        if(locs.length != 0) {
            var dLoc = locs.first();
            var loc = dLoc[1].first();
            // debugMsg(locs.length + ' locations still at "' + this.title + '\n loc = ' + loc);
            // redraw with new title & icon
            this.title = loc.title;
            this.setIconByType(loc.getLocationType(loc.locationType));
            if(this.level > 0) {
                var num = 0;
                var idx = locs.length;
                while(idx--) {
                    num = num + locs[idx][1].length;
                }
                this.marker.setTotal(num);
            }
            if(this.visible) { this.marker.setVisible(true); }
            this.redraw();
        } else {
            // no more locations shown - hide
            this.visible = false;
            this.marker.setVisible(false);
        }
    },

    // groups the locations by descriptor [['descriptor', [array,of,locations], #number_of_locations]]
    displayLocations: function() {
        var locs = this.locations.toArray();
        var displayLocs = [];
        var descriptors = [];
        var titleIndex = 0;
        var index = locs.length;
        while(index--) {
            var l = locs[index];
            if(l.display) {
                var idx = descriptors.indexOf(l.title);
                if(idx == -1) {
                    descriptors.push(l.title);
                    displayLocs.push([l.title, [l], 1 + l.displayLines()]);
                } else {
                    var existingLoc = displayLocs[idx];
                    // check if existingLoc is added to front or back...
                    var descriptorLocs = existingLoc[1];
                    var newLocs = [];
                    var dli = descriptorLocs.length;
                    var added = false;
                    while(dli--) {
                        var el = descriptorLocs[dli];
                        if((el.locationType > l.locationType) && !(added)) {
                            newLocs.push(l);
                            added = true;
                        }
                        newLocs.push(el);
                    }
                    if(!added) {
                        newLocs.push(l);
                    }
                    existingLoc[1] = newLocs.reverse();
                    existingLoc[2] = existingLoc[2] + l.displayLines();
                }
            }
        }
        return displayLocs;
    },

    displayInfo: function(page) {
      if(!page) { page = 1; }
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
      while(index--) {
          var l = locs[index];
          if(lines > 10) {
             pageIdx++;
             pages[pageIdx] = [];
             lines = 0;
         }
         pages[pageIdx].push(l);
         lines = lines + l[2] +1;
         totalLines = totalLines + l[2] +1;
         if(pageIdx+1 == page) {
             var idx = locs.indexOf(l);
             bis = idx+1;
             if(von == 0) {
                 von = idx+1;
             }
         }
      }
      var totalPages = pages.length;
      // reverse the numbering again
      von = locNumber - von + 1;
      bis = locNumber - bis + 1;
      /*
      var msg = '';
      pages.each(function(p) {
         msg = msg + '\n\n' + p.collect(function(l){
             return l[1].id;
         }).join('|');
      });
      debugMsg(this.locations.length + ' locations shown in ' + locs.length + ' groups:\npage = ' + page + '\n' + pages.length + ' pages total\nvon = ' + von + '\nbis = ' + bis + '\ntotalPages = ' + totalPages + '\ntotalLines = ' + totalLines + '\n' + msg);
      */
      if(totalPages > 1) {
          var dataSetStr = (von == bis) ? ('Ort ' + von) : ('Orte ' + von + '-' + bis);
          html = html +'<ul class="pagination">';
          var pageIndex = 1;
          while(totalPages > 0) {
              html = html + '<li' + ((page == pageIndex) ? ' class="active"' : '') + ' onclick="cedisMap.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
              totalPages--;
          }
          html = html + '</ul><span class="pages">' + dataSetStr + ' von ' + locs.length + '</span>';
      }
      var style = '';
      if(this.width > 0) { style = ' width: ' + this.width + 'px;'}
      if(totalLines > 10) { style = style + ' height: 290px;'}
      html = html + '<ul id="active_info_locations" class="locationReferenceList" style="' + style + '">';
      var locInfo = pages[page-1].collect(function(l) {
            return ('<li><h3>' + l[0] + '</h3><ul>' + l[1].collect(function(l1){ return l1.getHtml(); }).join('') + '</ul></li>');
      }).join('');
      html = html + locInfo +  '</ul>';
      return html;
    },

    locationsInfo: function(page) {
        if(!page) { page = 1; }
        var html = '';
        var totalPages = this.locations.length / 4;
        if(totalPages > 1) {
            var von = ((page-1)*4) +1;
            var bis = (page*4 > this.locations.length) ? this.locations.length : page*4;
            var dataSetStr = (von == bis) ? ('Ort ' + von) : ('Orte ' + von + '-' + bis);
            html = html + '<span>' + dataSetStr + ' von ' + this.locations.length + '&nbsp;</span><ul class="pagination">';
            var pageIndex = 1;
            while(totalPages > 0) {
                html = html + '<li style="list-style-type: none; float: left; border: 1px solid; cursor: pointer;" onclick="cedisMap.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
                // html = html + '<li style="list-style-type: none; float: left; border: 1px solid;"><a href="#" onclick="javascript:cedisMap.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');" class="' + (pageIndex == page ? 'current' : '') + '" style="display: block; float: left;">' + (pageIndex++) + '</li>';
                totalPages--;
            }
            html = html + '</ul>';
        }
        html = html + '<ul class="locationReferenceList"' + ((this.locations.length > 4) ? ' style="height: 290px;"' : '') + '>';
        var displayIndices = [1,2,3,4].collect(function(n){ return 4*(page-1) + n - 1; });
        var clusterLocations = this.locations;
        var locInfo = this.locations.collect(function(l) {
            if(displayIndices.indexOf(clusterLocations.indexOf(l)) != -1) {
                return l.getHtml();
            } else {
                return null;
            }
        }).compact().join('');
        html = html + locInfo +  '</ul>';
        return html;
    }
};


var iconType = 'img';

var ClusterIcon = Class.create();
ClusterIcon.prototype = google.maps.OverlayView.prototype;

ClusterIcon.prototype.initialize = function(cluster, map, center) {
    this.styles_ = '';
    this.padding_ = 2;
    //
    this.cluster = cluster;
    this.center_ = center;
    this.map_ = map;
    this.div_ = null;
    this.totals = 0;
    // visibility is toggled just by search/filter state
    this.visible_ = true;
    // this.setMap(this.map_);
    this.circle = null;
    this.color = this.cluster.color;
    this.name = this.cluster.title.sub(/\s\(\.*$/,'');
    debugMsg('Going to call setMap for ClusterIcon at ' + center);
};

ClusterIcon.prototype.zoomIntoCluster = function() {
    cedisMap.locationSearch.clusterManager.zoomOneLevel(this);
};

ClusterIcon.prototype.onAdd = function() {
    this.createDiv();
};

ClusterIcon.prototype.createDiv = function() {
    var name = this.cluster.title.sub(/\s\(\.*$/,'');
    this.div_ = new Element('div', { 'class': ('cluster-icon level-' + this.cluster.level), 'id': name, 'title': name, 'style': 'display: hidden' });
    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);

    debugMsg('Trying to add ClusterIcon for cluster at ' + this.center_ + '\n\ncluster: ' + this.cluster);
    if (this.visible_) {
        // var pos = this.getPosFromLatLng(this.center_);
        // this.div.style.cssText = this.createCss(pos);
        this.div_.innerHTML = this.totals.toString();
    }

    debugMsg('add stage 1 completed');

    var that = this;
    google.maps.event.addDomListener(this.div_, 'click', function() {
        that.zoomIntoCluster();
    });

    if(iconType == 'img'){
        // create an image circle
        this.circle = new Element('img', { 'class': ('cluster-circle level-' + this.cluster.level), 'src': '/images/circle_red.png', 'id': name + '_circle', 'style': 'position: absolute; display: none;'});
        panes.overlayMouseTarget.appendChild(this.circle);
    } else {
        // create the circle
        if (this.visible_) {
            this.circle = new google.maps.Circle({center: this.center_, radius: this.getCircleRadius(), fillColor: this.getColor(), map: this.map_, strokeWeight: 0, fillOpacity: 0.8});
        }
    }

    debugMsg('add stage 2 completed');
};

ClusterIcon.prototype.drawCircle = function() {
    if(iconType != 'img') {
        this.circle = new google.maps.Circle({center: this.center_, radius: this.getCircleRadius(), fillColor: this.getColor(), map: this.map_, strokeWeight: 0, fillOpacity: 0.8});   
    }
};

ClusterIcon.prototype.getCircleRadius = function() {
    var log = Math.log(this.totals+1);
    var unit = (this.cluster.level == 1) ? 2000 : 8000;
    return 2.5 * unit * log^2 * (this.totals+1) + unit;
};

ClusterIcon.prototype.getColor = function() {
    return this.color;
};

ClusterIcon.prototype.setColor = function(color) {
    this.color = color;
    if((iconType != 'img') && (this.circle)) {
        this.circle.setOptions({ color: color });
    }
};

ClusterIcon.prototype.draw = function() {
    // alert('Drawing Icon for Cluster: ' + this.cluster.title + '\n\nVisible? ' + (this.visible_ ? 'yes' : 'no'));
    debugMsg('Drawing ClusterIcon...');
    if (this.visible_) {
        var pos = this.getPosFromLatLng(this.center_);
        // alert('Cluster-Pos: ' + pos + '\nfor Cluster: ' + this.cluster.title + '\nat: ' + this.center_ + '\nVisible? ' + (this.visible_ ? 'yes' : 'no'));
        if(pos) {
            // this.setVisible(true);
            if(!this.div_) {
                this.createDiv();
            }
            // alert('Drawn DIV for ' + this.cluster.title);

            if(iconType != 'img') {
                if (this.circle) {
                    if(this.totals < 1) {
                        alert('Drawing zero item circle for ' + this.cluster.title);
                        this.circle.setVisible(false)
                    } else {
                        this.circle.setRadius(this.getCircleRadius());
                        this.circle.setOptions({radius: this.getCircleRadius(), color: this.getColor()});
                    }
                }
            } else {
                if(this.circle) {
                    var radius = imgRadius(this.totals);
                    if((this.name == 'Frankreich') || (this.name == 'Deutschland') || (this.name == 'Polen')) {
                        alert('Radius for ' + this.name + '\nwith a total of ' + this.totals + '\nis set to ' + radius);
                    }
                    this.circle.style.top = (pos.y - (radius/2) -1) + 'px';
                    this.circle.style.left = (pos.x - (radius/2) -1) + 'px';
                    this.circle.style.width = radius + 'px';
                    this.circle.style.height = radius + 'px';
                    this.circle.style.display = 'block';
                }
            }

            // alert('Done with circle for ' + this.cluster.title + '\ncircle = ' + this.circle);
            
            this.div_.style.top = (pos.y - 20) + 'px';
            this.div_.style.left = (pos.x - 20) + 'px';
            this.div_.innerHTML = this.totals.toString();
        } else {
            // just don't draw it, but don't set it to invisible!
            this.setVisible(false);

            // TODO: Remove it? Set it to invisible? Maybe we *should* do that!
        }
    }
    debugMsg('Drawn:\n div = ' + this.div_ + '\n\nhtml: ' + this.div_.innerHTML);
};

ClusterIcon.prototype.onRemove = function() {
    if (this.div_ && this.div_.parentNode) {
        // NO! this.visible_ = false;
        this.circle.setVisible(false);
        this.div_.stopObserving('click');
        // this.div_.parentNode.removeChild(this.div_);
        Element.remove(this.div_);
        
        this.div_ = null;
    }
};

ClusterIcon.prototype.getPosFromLatLng = function(latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
    debugMsg('Calculated position...');
    // var mapDiv = this.map_.getDiv();
    // var width = mapDiv.offsetWidth;
    // var height = mapDiv.offsetHeight;
    // alert('Map dimensions (pixel) = ' + width + ' x ' + height + ' \non Projection = ' + this.getProjection() + '\n\npos for ' + this.cluster.title + ' at ' + this.center_ + '\nis: ' + pos.x + ',' + pos.y);
    pos.x = pos.x.toFixed();
    pos.y = pos.y.toFixed();
    return pos;
};

ClusterIcon.prototype.getPosition = function() {
    return this.center_;
};

ClusterIcon.prototype.setTotal = function(sum) {
    this.totals = sum;

};

ClusterIcon.prototype.setZIndex = function(z) {
    if(this.div_) {
        this.div_.style.zIndex = z;
    }
};

ClusterIcon.prototype.setVisible = function(display) {
    this.visible_ = display;
    if(this.div_) {
        if(this.visible_) {
            this.rendered = false;
            this.div_.style.display = 'inline-block';
        } else {
            this.div_.style.display = 'none';
        }
    }
    if((iconType != 'img') && (this.circle)) {
        if(this.visible_ && (this.totals > 0)) {
            this.circle.setVisible(true);
        } else {
            this.circle.setVisible(false);
            //this.circle.setMap(null);
            //this.circle = null;
        }
    } else {
        if(this.visible_) {
            this.drawCircle();
        }
    }

    if(iconType == 'img') {
        if(this.circle) {
            if(this.visible_) {
                this.circle.style.display = 'block';
            } else {
                this.circle.style.display = 'none';
            }
        }
    }
};

function imgRadius(totals) {
    var log = Math.log(totals+3);
    var radius = Math.floor(25.0 + log * log * 2.5 + (totals/20.0));
    return radius;
}