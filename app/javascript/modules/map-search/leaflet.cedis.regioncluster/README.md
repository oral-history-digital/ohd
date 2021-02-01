This plugin enables you to cluster markers by regions, for example countries/provinces/cities.

It depends on the leaflet plugin leaflet.markercluster-regionbound, for which a license is needed. See https://regionbound.com/.

Further Plugins that need to be included:
* leaflet.extramarkers (https://github.com/coryasilva/Leaflet.ExtraMarkers/). I use master branch, version 1.2.1, 
unfortunately there is no release package
* Leaflet.MarkerCluster.Freezable (https://github.com/ghybs/Leaflet.MarkerCluster.Freezable/releases/tag/v1.0.0)
* Font awesome

How to use this plugin

The following scripts and css need to be included (use correct paths) 

<script src="leaflet.extra-markers.min.js"></script>
<script src="leaflet.markercluster.freezable.js"></script>
<script src="leaflet.markercluster-regionbound.min.js"></script>
<script src="leaflet.cedis.regioncluster.js"></script>
<link rel="stylesheet" href="leaflet.extra-markers.min.css" type="text/css">
<link rel="stylesheet" href="MarkerCluster.Aggregations.css" type="text/css">
<link rel="stylesheet" href="MarkerCluster.css" type="text/css">
<link rel="stylesheet" href="MarkerCluster.Default.css" type="text/css">
<link rel="stylesheet" href="leaflet.cedis.regioncluster.css" type="text/css">


HTML: 
<div id="map" class="someclass" style="width: 100%; height: 300px;"></div>

JAVASCRIPT
<script>
 SucheKarte.init('map', data,  {
        useClustering: false,
        controlsCollapsed: false,
        showControls: false,
        fitBounds: true,
        allowClustersOfOne: false
    });
</script>

where data is a json string like the following example. 
The first level is a layer on the map which can be activated/deactivated from the legend.
Title is the title that appears for this layer in the legend
data is an array of markerdata:
    lat: latitude
    lon: longitude
    regions: array of regions for this marker from large to small
    popup text: html to be shown in the popup for the marker (if no clustering is active)
    icon: font awesome class of the icon that should be shown within the marker
    icon_prefix: font awesome class that should be used in combination with the icon class
    icon_color: color of the icon (background). Possible values: 'red', 'orange-dark', 'orange', 'yellow', 'blue-dark', 
        'cyan', 'purple', 'violet', 'pink', 'green-dark', 'green', 'green-light', 'black', 'white'.
     (Note: the possible colors are taken from the sprite in /icons/markers_default.png, which is not final yet)       
     
Example data Json: 

{
  "letzterwohnort": {
    "title": "Letzter Wohnort",
    "data": [
      {
        "lat": "51.65671",
        "lon": "7.09038",
        "regions": [
          "BRD",
          "Nordrhein-Westfalen"
        ],
        "popup_text": "<a href=\"/articlemd/bio-223/\">Kusnatzky, Anita</a><br>Letzter Wohnort: <br>Marl",
        "icon": "fa-home",
        "icon_prefix": "fas",
        "icon_color": "green-dark"
      }
    ]
  },
  "ort_des_zwischenfalls": {
    "title": "Ort des Vorfalls",
    "data": [
      {
        "lat": "52.215468",
        "lon": "11.082946",
        "regions": [
          "DDR",
          "Sachsen-Anhalt"
        ],
        "popup_text": "<a href=\"/articlemd/bio-223/\">Kusnatzky, Anita</a><br>Ort des Vorfalls: <br>DDR-Grenzkontrollpunkt Marienborn ",
        "icon": "fa-circle",
        "icon_prefix": "far",
        "icon_color": "red"
      },   
      {
        "lat": "52.990236",
        "lon": "11.734967",
        "regions": [
          "BRD",
          "Niedersachsen"
        ],
        "popup_text": "<a href=\"/articlemd/bio-157/\">Richter, Bärbel</a><br>Ort des Vorfalls: <br>Elbe bei Schnackenburg ",
        "icon": "fa-circle",
        "icon_prefix": "far",
        "icon_color": "red"
      }
    ]
  }
}