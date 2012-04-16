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

    },

    addLocation: function(id, latLng, htmlText, divClass, linkURL) {
        var location = new Location(id, latLng, htmlText, divClass, linkURL, true);

        var cluster = this.locateCluster(latLng);

        if(!cluster) {
            cluster = new Cluster(latLng);
        }
        cluster.addLocation(location);
    },

    composeHtmlText: function(html, klass) {
        return ('<li class="' + (klass || 'interview') + '">' + html + '</li>');
    },

    locateCluster: function(latLng) {
        var loc = latLng.toString();
        var idx = cedisMap.mapLocations.length;
        var clusterLocations = cedisMap.clusterLocations;
        var mapClusters = cedisMap.mapClusters;
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

    showInfoBox: function(marker) {
        if(this.activeInfo) {
            this.activeInfo.close();
            this.activeInfo = null;
            this.shownCluster = null;
        }

        var cluster = this.locateCluster(marker.getPosition());
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
            var locations = cedisMap.mapLocations;
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
            /* cedisMap.mapLocations.each(function(loc) {
                var changed = loc.applyFilters(filters);
                if(changed) { changedLocs++ }
            }); */
        }
        var filterStopTime = (new Date).getTime();
        // alert('Optimization 4:\nTime for applying the filter: ' + filter + '\n\n' + (filterStopTime - filterStartTime) + ' ms.\n\n' + changedLocs + ' locations changed of ' + cedisMap.mapLocations.length);
    },

    // benchmark test for markers
    toggleAllMarkers: function() {
        this.benchmark(function() {
           var clusters = cedisMap.mapClusters;
           var idx = clusters.length;
           while(idx--) {
               var marker = clusters[idx].marker;
               marker.setVisible(!marker.getVisible());
           }
        }, 'Toggle all Clusters/Markers');
    },

    // benchmark test for locations
    toggleAllLocations: function() {
        this.benchmark(function() {
            var locations = cedisMap.mapLocations;
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

    benchmark: function(test, desc) {
        var startTime = (new Date).getTime();
        test.call();
        var endTime = (new Date).getTime();
        alert(desc + '\nTime taken: ' + (endTime - startTime) + ' ms.');
    }
};

Location.prototype = {
    initialize: function(id, latLng, htmlText, divClass, linkURL, display) {
        this.info = htmlText;
        this.locationType = this.getPriority(divClass);
        this.title = id;
        this.latLng = latLng;
        this.linkURL = linkURL;
        this.display = display;
        this.cluster = null;
        if(!cedisMap.mapLocations) { cedisMap.mapLocations = []; }
        this.id = cedisMap.mapLocations.length;
        cedisMap.mapLocations.push(this);
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

Cluster.prototype = {
    initialize: function(latLng) {
        var locationSearch = cedisMap.locationSearch;
        this.icon = locationSearch.options.images['default'];
        this.title = '?';
        this.locations = [];
        var marker = new google.maps.Marker({
            position: latLng,
            icon: this.icon,
            flat: true
        });
        this.width = 0;
        this.marker = marker;
        this.marker.setMap(locationSearch.map);
        google.maps.event.addListener(marker, 'click',  function() { cedisMap.locationSearch.clusterManager.showInfoBox(marker); });

        if(!cedisMap.clusterLocations) { cedisMap.clusterLocations = []; }
        if(!cedisMap.mapClusters) { cedisMap.mapClusters = []; }
        cedisMap.clusterLocations.push(latLng.toString());
        cedisMap.mapClusters.push(this);
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
            this.redraw();
        }
    },

    redraw: function() {
        this.marker.setIcon(this.icon);
        this.marker.setTitle(this.title);
        this.marker.setMap(cedisMap.locationSearch.map);
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
                    // if(existingLoc[2] + l.displayLines() > 12) {
                        // start a new location with '2,3'
                    // } else {
                        existingLoc[1].push(l);
                        existingLoc[2] = existingLoc[2] + l.displayLines();
                    // }
                }
            }
        }
        /*
        locs.select(function(lo){ return lo.display }).each(function(l){
            var idx = descriptors.indexOf(l.title);
            if(idx == -1) {
                descriptors.push(l.title);
                displayLocs.push([l.title, [l], 1 + l.displayLines()]);
            } else {
                var existingLoc = displayLocs[idx];
                // if(existingLoc[2] + l.displayLines() > 12) {
                    // start a new location with '2,3'
                // } else {
                    existingLoc[1].push(l);
                    existingLoc[2] = existingLoc[2] + l.displayLines();
                // }
            }
        });
        */
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