/* Contains the JS for light-weight markers and location hierarchy clustering */

/* Extend google.maps.LatLng to equal on coordinate equality */
google.maps.LatLng.equals = function(other) {
    return this.lat() == other.lat() && this.lng() == other.lng();
};

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

        this.activeInfo = null;

        this.shownCluster = null;

        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }

    },
    addLocation: function(id, latLng, htmlText, divClass, linkURL) {

        var location = new Location(id, latLng, htmlText, divClass, linkURL);

        var cluster = this.locateCluster(latLng);

        if(!cluster) {
            cluster = new Cluster(latLng);
            // alert('Created new cluster for LatLng ' + latLng + '\nCluster: ' + cluster);
        }
        cluster.addLocation(location);

        /*
        var marker = null;
        var idx = this.locations.length;
        while (idx--) {
            if(idx == -1 || this.locations[idx].equals(latLng)) {
                break;
            }
        }
        // var idx = this.locations.indexOf(latLng);
        if(idx == -1) {
            // add new marker
            marker = new google.maps.Marker({
                position: latLng,
                title: id,
                flat: true,
                icon: window.locationSearch.options.images[divClass || 'default']
            });
            marker.locationClass = divClass;
            this.locations.push(latLng);
            this.markers.push(marker);
            this.info.push(this.composeHtmlText(htmlText, divClass));
            // this.info[idx] = this.info[idx] + '<li class="' + (divClass || 'interview') + '">' + htmlText + '</li>';
            google.maps.event.addListener(marker, 'click', function() { window.locationSearch.clusterManager.showInfoBox(marker) });
            marker.setMap(this.map);
        } else {
            marker = this.markers[idx];
            // extend the info...
            this.info[idx] = (this.info[idx] || '') + this.composeHtmlText(htmlText, divClass);
            // this.info[idx] = this.info[idx] + '<li class="' + (divClass || 'interview') + '">' + htmlText + '</li>';
        }
        */
    },
    composeHtmlText: function(html, klass) {
        return ('<li class="' + (klass || 'interview') + '">' + html + '</li>');
    },
    locateCluster: function(latLng) {
        var loc = latLng.toString();
        var idx = window.mapLocations.length;
        if(!window.clusterLocations) { window.clusterLocations = []; }
        if(!window.mapClusters) { window.mapClusters = []; }
        while(idx--) {
            if((idx < 0) || (window.clusterLocations[idx] == loc)) { break; }
        }
        // alert('Located cluster #' + idx + ' at location ' + loc);
        if(idx > -1) {
            return window.mapClusters[idx];
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
        // var marker = event.element;
        // NOTE: marker is undefined here - maybe go via the event.element.... ?
        var cluster = this.locateCluster(marker.getPosition());
        // alert('Showing infoBox for cluster: ' + cluster + ' with ' + (cluster == null ? '0' : cluster.locations.length) + ' locations at position ' + marker.getPosition().toString());
        if(cluster) {
            this.shownCluster = cluster;
            // alert('Locations at cluster:\n' + cluster.locations);
            var infoBox = new google.maps.InfoWindow({
                content: cluster.displayInfo(1),
                // content: cluster.locationsInfo(1),
                maxWidth: 320
            });
            infoBox.open(window.locationSearch.map, marker);
            this.activeInfo = infoBox;
        }
        /*
        var idx = this.markers.indexOf(marker);
        if(idx != -1) {
            var infoBox = new google.maps.InfoWindow({
                content: '<ul class="locationReferenceList">' + this.info[idx] + '</ul>',
                maxWidth: 320
            });
            infoBox.open(this.map, marker);
            this.activeInfo = infoBox;
        }
        */
    },
    showClusterPage: function(page) {
        if(this.shownCluster && this.activeInfo) {
            // this.activeInfo.setContent(this.shownCluster.locationsInfo(page));
            this.activeInfo.setContent(this.shownCluster.displayInfo(page));
        }
    }
};

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

Location.prototype = {
    initialize: function(id, latLng, htmlText, divClass, linkURL) {
        this.info = htmlText;
        this.locationType = this.getPriority(divClass);
        this.title = id;
        this.latLng = latLng;
        this.linkURL = linkURL;
        if(!window.mapLocations) { window.mapLocations = []; }
        this.id = window.mapLocations.length;
        window.mapLocations.push(this);
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
        this.icon = window.locationSearch.options.images['default'];
        this.title = '?';
        this.locations = [];
        var marker = new google.maps.Marker({
            position: latLng,
            icon: this.icon,
            flat: true
        });
        this.marker = marker;
        this.marker.setMap(window.locationSearch.map);
        google.maps.event.addListener(marker, 'click',  function() { window.locationSearch.clusterManager.showInfoBox(marker); });

        if(!window.clusterLocations) { window.clusterLocations = []; }
        if(!window.mapClusters) { window.mapClusters = []; }
        window.clusterLocations.push(latLng.toString());
        window.mapClusters.push(this);
    },
    addLocation: function(location) {
        if (this.locations.indexOf(location) == -1) {
            this.locations.push(location);
            this.locations = this.locations.sortBy(function(l){return l.locationType; }).reverse();
            var loc = this.locations.first();
            this.title = loc.title;
            this.icon = window.locationSearch.options.images[loc.getLocationType(loc.locationType)];
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
        this.marker.setMap(window.locationSearch.map);
    },
    // groups the locations by descriptor
    displayLocations: function() {
        var locs = this.locations.toArray();
        var displayLocs = [];
        var descriptors = [];
        var titleIndex = 0;
        locs.each(function(l){
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
      locs.each(function(l){
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
      });
      var totalPages = pages.length;
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
          html = html + '<span>' + dataSetStr + ' von ' + locs.length + '&nbsp;</span><ul class="pagination">';
          var pageIndex = 1;
          while(totalPages > 0) {
              html = html + '<li' + ((page == pageIndex) ? ' class="current"' : '') + ' style="list-style-type: none; float: left; border: 1px solid; cursor: pointer;" onclick="window.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
              // html = html + '<li style="list-style-type: none; float: left; border: 1px solid;"><a href="#" onclick="javascript:window.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');" class="' + (pageIndex == page ? 'current' : '') + '" style="display: block; float: left;">' + (pageIndex++) + '</li>';
              totalPages--;
          }
          html = html + '</ul>';
      }
      html = html + '<ul class="locationReferenceList"' + ((totalLines > 10) ? ' style="height: 290px;"' : '') + '>';
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
                html = html + '<li style="list-style-type: none; float: left; border: 1px solid; cursor: pointer;" onclick="window.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');">' + (pageIndex++) + '</li>';
                // html = html + '<li style="list-style-type: none; float: left; border: 1px solid;"><a href="#" onclick="javascript:window.locationSearch.clusterManager.showClusterPage(' + pageIndex + ');" class="' + (pageIndex == page ? 'current' : '') + '" style="display: block; float: left;">' + (pageIndex++) + '</li>';
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