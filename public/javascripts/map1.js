var InteractiveMap1 = Class.create();
InteractiveMap1.prototype = {
    initialize: function(id, options) {
        // Settings and defaults
        var defaults = {
            latitude: 49.1,
            longitude: 16.3,
            zoom: 5,
            searchURL: '/webservice/ortssuche.json'
        };
        if (options != null) {
            this.options = options;
        } else {
            this.options = {};
        }
        if(!this.options.latitude) { this.options.latitude = defaults.latitude }
        if(!this.options.longitude) { this.options.longitude = defaults.longitude }
        if(!this.options.zoom) { this.options.zoom = defaults.zoom }
        if(!this.options.searchURL) { this.options.searchURL = defaults.searchURL }

        // URL root
        this.options.urlRoot = window.location.pathname.split('/')[1] == 'archiv' ? '/archiv' : '';
        this.options.searchURL = this.options.urlRoot + this.options.searchURL;

        window.locationSearch = this;

        if(!this.options.images) {
            this.options.images = new Hash();
            this.options.images['default'] = new google.maps.MarkerImage(this.options.urlRoot + '/images/test_markers/interview_marker.png');
            ['place_of_birth', 'deportation_location', 'forced_labor_location', 'return_location', 'home_location'].each(function(icon){
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
        this.markers = [];

        // Event Listeners
        //google.maps.event.addListener(this.map, 'dragend', this.searchWithinBounds);
        //google.maps.event.addListener(this.map, 'zoom_changed', this.searchWithinBounds);
        google.maps.event.addListener(this.map, 'tilesloaded', this.searchWithinBounds);

        return this.map;
    },
    searchWithinBounds: function() {
        var bounds = this.getBounds();
        if(!bounds) { return }
        var lat1 = bounds.getSouthWest().lat();
        var lng1 = bounds.getSouthWest().lng();
        var lat2 = bounds.getNorthEast().lat();
        var lng2 = bounds.getNorthEast().lng();
        // window.imapBounds = '(' + Math.floor(lat1*100)/100 + ',' + Math.floor(lng1*100)/100 + ') to (' + Math.floor(lat2*100)/100 + ',' + Math.floor(lng2*100)/100 + ')';
        new Ajax.Request(window.locationSearch.options.searchURL, {
            parameters: {
                latitude: lat1,
                longitude: lng1,
                latitude2: lat2,
                longitude2: lng2
            },
            method: 'GET',
            onSuccess: window.locationSearch.addLocations
        });
        // alert('Map NE = ' + this.getBounds().getNorthEast() + '\n SW  = ' + this.getBounds().getSouthWest());
    },
    addLocations: function(response) {
        if(response.responseJSON.results) {
            // window.locationSearch.locations = [];

            var str = '';
            // str = str + window.imapBounds + '\n';
            // str = str + '(' + window.imapBounds.getSouthWest().lat() + ',' + window.imapBounds.getSouthWest().lng() + ')';
            // str = str + '(' + window.imapBounds.getNorthWest().lat() + ',' + window.imapBounds.getNorthWest().lng() + ')\n';
            response.responseJSON.results.each(function(location){
                // window.locationSearch.locations.push(location);
                // str = str + location.location + '\n';
                var markerIcon = window.locationSearch.options.images[location.referenceType];
                if(!markerIcon) { markerIcon = window.locationSearch.options.images['default']; }
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.latitude, location.longitude),
                    map: window.locationSearch.map,
                    title: location.interviewee + ' in ' + location.location,
                    icon: markerIcon
                });
                marker.location = location;
                if (window.locationSearch.markers.indexOf(marker) == -1) {
                    window.locationSearch.markers.push(marker);
                }
                google.maps.event.addListener(marker, 'click', window.locationSearch.showInfo);

            });
            // alert('Updated locations for bounds: '+ str);
            // alert('Received JSON results:\n' + response.responseJSON.results);
            // this.addLocations();
        }
        //var str = '';
        //locations.each(function(loc){
        //    str = str + loc.location + '\n';
        //});
        //alert('Locations:\n' + str);
    },
    // presents an infoWindow for the marker and location at index position
    showInfo: function() {
      var index = window.locationSearch.markers.indexOf(this);
      var marker = window.locationSearch.markers[index];
      var location = marker.location;
      var reference = window.locationSearch.translate(location.referenceType);
      var info = '<h3>' + location.locationType + ' ' + location.location + '</h3>';
      info = info + '<p style="font-weight: bold;">' + reference + '&nbsp;<a href="' + window.locationSearch.options.urlRoot + '/interviews/' + location.interviewId + '" target="_blank">' + location.interviewee + ' (' + location.interviewId + ')<br/><small>&raquo;zum Interview</small></a></p>';
      info = info + '<p style="font-size: 85%">' + location.experienceGroup + '<br/>';
      info = info + location.interviewType.capitalize() + ', ' + location.language + (location.translated ? ' (übersetzt)' : '') + '</p>';
      var infoWindow = new google.maps.InfoWindow({content: info, maxWidth: 320 });
      infoWindow.open(window.locationSearch.map, marker);
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

function mapSetup1(id) {
    new InteractiveMap1(id);
}

function searchWithinBounds1() {
    window.locationSearch.searchWithinBounds();
}



<!--
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

//-->