/* Contains the JS for light-weight markers and location hierarchy clustering */

/* Extend google.maps.LatLng to equal on coordinate equality */
google.maps.LatLng.equals = function(other) {
    return this.lat() == other.lat() && this.lng() == other.lng();
};

var ClusterManager = Class.create();

ClusterManager.prototype = {
    initialize: function(map, options) {
        this.map = map;
        this.locations = [];
        this.markers = [];
        this.info = [];
        this.alerted = false;

        this.activeInfo = null;

        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }

    },
    addLocation: function(id, latLng, htmlText, divClass, zIndex) {
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
            this.info.push([htmlText]);
            google.maps.event.addListener(marker, 'click', function() { window.locationSearch.clusterManager.showInfoBox(marker) });
            marker.setMap(this.map);
        } else {
            marker = this.markers[idx];
            // extend the info...
            this.info[idx].push(htmlText);
        }
    },
    showInfoBox: function(marker) {
        if(this.activeInfo) {
            this.activeInfo.close();
            this.activeInfo = null;
        }
        var idx = this.markers.indexOf(marker);
        if(idx != -1) {
            var infoBox = new google.maps.InfoWindow({
                content: '<ul class="locationReferenceList"><li class="' + marker.locationClass + '">' + this.info[idx].uniq().join('</li><li>') + '</li></ul>',
                maxWidth: 320
            });
            infoBox.open(this.map, marker);
            this.activeInfo = infoBox;
        }
    }
};

var Cluster = Class.create();

Cluster.prototype = {
    initialize: function(latLng, level, component, options) {

    },
    addLocation: function() {

    },
    showInfoBox: function() {
        
    }
};