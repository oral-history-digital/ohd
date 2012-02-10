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
                content: '<ul><li>' + this.info[idx].join('</li><li>') + '</li></ul>',
                maxWidth: 320
            });
            infoBox.open(this.map, marker);
            this.activeInfo = infoBox;
        }
    }
}


/* This is the fast marker / overlay version of the ClusterManager
ClusterManager.prototype = new google.maps.OverlayView();

ClusterManager.prototype.initialize = function(map) {
    this._markers = [];
    this.setMap(map);
    this.alerted = false;
};

ClusterManager.prototype.addLocation = function(id, latLng, htmlText, divClass, zIndex) {
    if(!this.alerted) {
        // alert('Adding location: ' + id + ' at ' + latLng);
        this.alerted = true;
    }
    var loc = {
        _id: id,
        _latLng: latLng,
        _htmlText: htmlText,
        _divClassName: divClass,
        _zIndex: zIndex || 0
    };
    if(this._markers.indexOf(loc) == -1) {
        this._markers.push(loc);
    }
};

ClusterManager.prototype.showClusterInfoBox = function(event) {
    var element = Event.element(event);
    alert('Clicked ' + element + ' (' + element.id + ') in map cluster panel.');
};

ClusterManager.prototype.onAdd = function() {
    this._div = new Element('div', { 'class': 'markerOverlay' });
    var panes = this.getPanes();
    panes.floatPane.appendChild(this._div);
    google.maps.event.addListener(this._div, 'click', window.locationSearch.clusterManager.showClusterInfoBox);
};

ClusterManager.prototype.draw = function() {
    // if already removed, never draw
    if (!this._div) return;

    // Size and position the overlay. We use a southwest and northeast
    // position of the overlay to peg it to the correct position and size.
    // We need to retrieve the projection from this overlay to do this.
    var overlayProjection = this.getProjection();

    // DGF use fastloop http://ajaxian.com/archives/fast-loops-in-js
    // JD Create string with all the markers
    var i = this._markers.length;
    var textArray = [];
    while (i--) {
      var marker = this._markers[i];
      var divPixel = overlayProjection.fromLatLngToDivPixel(marker._latLng);
      textArray.push("<div style='position:absolute; left:" + divPixel.x + 'px;');
      textArray.push("top:" + divPixel.y + 'px;');
      if (marker._zIndex) {
        textArray.push(" z-index:");
        textArray.push(marker._zIndex);
        textArray.push(";");
      }
      textArray.push("'");
      if (marker._divClassName) {
        textArray.push(" class='");
        textArray.push(marker._divClassName);
        textArray.push("'");
      }
      textArray.push(" id='");
      textArray.push(marker._id);
      textArray.push("' >");

      textArray.push(marker._htmlText);

      textArray.push("</div>");
    }

    // alert('Updating Overlay for ' + this._markers.length + ' markers!');

    //Insert the HTML into the overlay
    this._div.innerHTML = textArray.join('');
};

ClusterManager.prototype.onRemove = function() {
    this._div.parentNode.removeChild(this._div);
    this._div = null;
};

ClusterManager.prototype.redraw = function(map) {
    this.setMap(null);
    this.setMap(map);
}
*/