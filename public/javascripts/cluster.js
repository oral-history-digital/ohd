/* Contains the JS for light-weight markers and location hierarchy clustering */

/* Extend google.maps.LatLng to equal on coordinate equality */
google.maps.LatLng.equals = function(other) {
    return this.lat() == other.lat() && this.lng() == other.lng();
};

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
            cluster = new Cluster(latLng, level);
        }
        cluster.addLocation(location);
        if(cluster.level == this.currentLevel) {
            // only add clusters on the current level to the draw roster
            this.freshClusters.push(cluster);    
        }
    },

    // bundle cluster rendering together
    renderMarkers: function() {
        var clusters = this.freshClusters;
        var idx = clusters.length;
        while(idx--) {
           clusters[idx].draw();
        }
        this.freshClusters = [];
    },

    composeHtmlText: function(html, klass) {
        return ('<li class="' + (klass || 'interview') + '">' + html + '</li>');
    },

    locateCluster: function(latLng, level) {
        var loc = latLng.toString();
        var idx = cedisMap.mapLocations[level].length;
        var clusterLocations = cedisMap.clusterLocations[level];
        var mapClusters = cedisMap.mapClusters[level];
        if(!clusterLocations) { clusterLocations = []; }
        if(!mapClusters) { mapClusters = []; }
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
        // alert('Check for zoom shift at zoom = ' + zoom + '\nlevel = ' + level);
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
        // alert('Optimization 4:\nTime for applying the filter: ' + filter + '\n\n' + (filterStopTime - filterStartTime) + ' ms.\n\n' + changedLocs + ' locations changed of ' + cedisMap.mapLocations[this.currentLevel].length);
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

        var clustersOut = cedisMap.mapClusters[currentLevel];
        var id1 = clustersOut.length;
        while(id1--) {
           clustersOut[id1].marker.setVisible(false);
        }

        cedisMap.locationSearch.clusterManager.currentLevel = level;
        var clustersIn = cedisMap.mapClusters[level];
        var id2 = clustersIn.length;
        while(id2--) {
           clustersIn[id2].marker.setVisible(true);
           clustersIn[id2].redraw();
        }

    },

    benchmark: function(test, desc) {
        var startTime = (new Date).getTime();
        test.call();
        var endTime = (new Date).getTime();
        alert(desc + '\nTime taken: ' + (endTime - startTime) + ' ms.');
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
    initialize: function(latLng, level) {
        var locationSearch = cedisMap.locationSearch;
        this.icon = locationSearch.options.images['default'];
        this.title = '?';
        this.locations = [];
        this.rendered = false;
        this.level = level;
        var marker = new google.maps.Marker({
            position: latLng,
            icon: this.icon,
            flat: true
        });
        this.width = 0;
        this.marker = marker;
        this.marker.setMap(locationSearch.map);
        if(level == 0) {
            google.maps.event.addListener(marker, 'click',  function() { cedisMap.locationSearch.clusterManager.showInfoBox(marker); });
        } else {
            google.maps.event.addListener(marker, 'click',  function() { cedisMap.locationSearch.clusterManager.zoomOneLevel(marker); });
        }
        if(!cedisMap.clusterLocations[this.level]) { cedisMap.clusterLocations[this.level] = []; }
        if(!cedisMap.mapClusters[this.level]) { cedisMap.mapClusters[this.level] = []; }
        cedisMap.clusterLocations[this.level].push(latLng.toString());
        cedisMap.mapClusters[this.level].push(this);
    },

    setIconByType: function(type) {
        this.icon = cedisMap.locationSearch.options.images[type];
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
        this.marker.setMap(cedisMap.locationSearch.map);
        this.marker.setTitle(this.title);
        this.marker.setIcon(this.icon);
        this.rendered = true;
    },

    refresh: function() {
        var locs = this.displayLocations();
        if(locs.length != 0) {
            var dLoc = locs.first();
            var loc = dLoc[1].first();
            // alert(locs.length + ' locations still at "' + this.title + '\n loc = ' + loc);
            // redraw with new title & icon
            this.title = loc.title;
            this.setIconByType(loc.getLocationType(loc.locationType));
            this.marker.setVisible(true);
            this.redraw();
        } else {
            // no more locations shown - hide
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
      alert(this.locations.length + ' locations shown in ' + locs.length + ' groups:\npage = ' + page + '\n' + pages.length + ' pages total\nvon = ' + von + '\nbis = ' + bis + '\ntotalPages = ' + totalPages + '\ntotalLines = ' + totalLines + '\n' + msg);
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


/* Below is the icon render code from MarkerClusterer - for reference */
/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  this.center_ = null;
  this.map_ = cluster.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(this.map_);
}


/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function() {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

  if (markerClusterer.isZoomOnClick()) {
    // Zoom into the cluster.
    this.map_.fitBounds(this.cluster_.getBounds());
  }
};


/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function() {
  this.div_ = document.createElement('DIV');
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  google.maps.event.addDomListener(this.div_, 'click', function() {
    that.triggerClusterClick();
  });
};


/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= parseInt(this.width_ / 2, 10);
  pos.y -= parseInt(this.height_ / 2, 10);
  return pos;
};


/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function() {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};


/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};


/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function() {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};


/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function() {
  this.setMap(null);
};


/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function() {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};


/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function(sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};


/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function() {
  var index = Math.max(0, this.sums_.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style['url'];
  this.height_ = style['height'];
  this.width_ = style['width'];
  this.textColor_ = style['textColor'];
  this.anchor_ = style['anchor'];
  this.textSize_ = style['textSize'];
  this.backgroundPosition_ = style['backgroundPosition'];
};


/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function(center) {
  this.center_ = center;
};


/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function(pos) {
  var style = [];
  style.push('background-image:url(' + this.url_ + ');');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (typeof this.anchor_ === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
        this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) +
          'px; padding-top:' + this.anchor_[0] + 'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
          'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
        this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) +
          'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' +
        this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
      pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
      txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};

/* Calls to ClusterIcon: */
/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  this.minClusterSize_ = markerClusterer.getMinClusterSize();
  this.averageCenter_ = markerClusterer.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(),
      markerClusterer.getGridSize());
}

/* ... */
/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function() {
  var zoom = this.map_.getZoom();
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz && zoom > mz) {
    // The zoom is greater than our max zoom so show all the markers in cluster.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
      marker.setMap(this.map_);
    }
    return;
  }

  if (this.markers_.length < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.setSums(sums);
  this.clusterIcon_.show();
};