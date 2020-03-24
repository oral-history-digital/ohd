(function ($) {

    window.SucheKarte = {settings: [], MarkerClusterGroups: [], clusteringEnabled: true, allMarkers: [], ClusterGroupsActiveState: []};

    /**
     *
     * @param elementName: selector for the map
     * @param data:
     * @param options
     */
    SucheKarte.init = function (elementName, data, options) {
        var defaults = {
            showControls: false,
            controlsCollapsed: true,
            useClustering: true,
            clusterByRegions: true,
            allowClustersOfOne: true,
            fitBounds: false,
            showBorders: true,
            pathToBorderShapeFile: '/wp-content/themes/oes-grenzregime-theme/assets/Europe_1949_w_SU__CS.json',
            defaultZoom: 5,
            maxClusterRadius: 2000,
            defaultCenter: [51.582275, 10.653294],
            regionLevels : [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1]  // Associate each of the available zoom levels (0-18) with a region level
        };

        var options = $.extend({}, defaults, options || {});

        SucheKarte.clusteringEnabled = options.useClustering;

        console.dir(data);


        var tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Daten von <a href="http://www.openstreetmap.org/">OpenStreetMap</a> - Veröffentlicht unter <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a>'
        });

        /*var mqi = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });*/


        SucheKarte.markers = [];
        SucheKarte.map = L.map(elementName, {
            center: SucheKarte.settings['center'] == undefined ? options.defaultCenter : SucheKarte.settings['center'],
            zoom:  SucheKarte.settings['zoom'] == undefined ? options.defaultZoom : SucheKarte.settings['zoom'],
            layers: [tile],
            maxZoom: 18,
            scrollWheelZoom: false
        });


        var control_layers = new L.control.layers(null, null, {collapsed: options.controlsCollapsed});

        //use this to collect all markers from all layers, we need it when we use fitBounds
        var allMarkers = [];

        $.each(data, function (i, row) {
            var group_title = row.title;
            var markers_data = row.data;
            var markers = [];

            if (markers_data.length > 0) {
                var mrkClusterGroup = new L.markerClusterGroup({
                   iconCreateFunction: function (cluster) {
                        //count the number of markers
                        var mymarkers = cluster.getAllChildMarkers();
                        return L.ExtraMarkers.icon({
                            icon: 'fa-number',
                            markerColor: markers_data[0].icon_color,
                            shape: 'circle',
                            prefix: markers_data[0].icon_prefix,
                            number: mymarkers.length

                        });
                    },
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    maxClusterRadius: options.maxClusterRadius,
                    addRegionToolTips: 'without subregions',
                    regionLevels: options.regionLevels,
                    disableClusteringAtZoom: 11,
                    allowClustersOfOne: options.allowClustersOfOne

                });

                SucheKarte.MarkerClusterGroups.push(mrkClusterGroup);

                // Process markers per group
                var marker_icon_class;
                var marker_icon_prefix;
                var marker_color;
                markers_data.forEach(function (marker_data, index) {
                    var marker_icon = L.ExtraMarkers.icon({
                        icon: marker_data.icon,
                        markerColor: marker_data.icon_color,
                        shape: 'square',
                        prefix: markers_data[0].icon_prefix

                    });

                    marker_color = marker_data.icon_color;
                    marker_icon_class = marker_data.icon;
                    marker_icon_prefix = marker_data.icon_prefix;
                    var marker;
                    if (options.clusterByRegions && marker_data.regions && marker_data.regions[0] != null ) {
                         marker = L.marker(
                            [marker_data.lat, marker_data.lon],
                            {regions: marker_data.regions, 'icon': marker_icon}
                        ).bindPopup(marker_data.popup_text);
                    } else {
                        marker = L.marker(
                            [marker_data.lat, marker_data.lon],
                            {'icon': marker_icon}
                        ).bindPopup(marker_data.popup_text);
                    }

                    markers.push(marker);
                    mrkClusterGroup.addLayer(marker);

                });

                var iconHTML = '<div class=\"legend leaflet-marker-icon extra-marker-square-' + marker_color + ' extra-marker leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\"><i style=\"color: #fff\" class=\"  ' + marker_icon_prefix + ' ' + marker_icon_class + '\"></i></div>';

                if (SucheKarte.ClusterGroupsActiveState[group_title] == 'active' || SucheKarte.ClusterGroupsActiveState[group_title] == undefined) {
                    mrkClusterGroup.addTo(SucheKarte.map);
                    SucheKarte.ClusterGroupsActiveState[group_title] = 'active'
                } else {
                    SucheKarte.ClusterGroupsActiveState[group_title] = 'inactive'
                }
                allMarkers = allMarkers.concat(mrkClusterGroup.getBounds());
                control_layers.addOverlay(mrkClusterGroup, iconHTML + group_title);
                control_layers.addTo(SucheKarte.map);

                if (options.showControls == false) {
                    $('.leaflet-control-layers').hide(1);
                }

                allMarkers = allMarkers.concat(markers);

            }

        });

        SucheKarte.allMarkers = allMarkers;

        if (options.showBorders != false) {
            var geoJsonData = $.getJSON(options.pathToBorderShapeFile);
            var exteriorStyle = {
                "color": "#26e07d",
                "weight": 0,
                "fillOpacity": 0
            };
            geoJsonData.then(function(data){
                var geoJson = L.geoJSON(data,  {style: exteriorStyle}).addTo(SucheKarte.map);
            })
        }

        if (options.fitBounds != false) {
            SucheKarte.map.fitBounds(allMarkers, {padding: [15, 15]});
        }

        $('<div id="legend" class="hideShowLegend leaflet-control-layers-expanded leaflet-control">Legende / Filter&nbsp;&nbsp;<i class="fa fa-caret-down"></i></div>').insertBefore('div.leaflet-control-layers');

        $('<div class="mapHelp">Bitte wählen Sie nun die Arten von Angaben aus, die Sie interessieren:</div>').insertBefore('div.leaflet-control-layers-overlays');

        if (options.useClustering) {
            $('<div class="mapLegendClustering">Gruppierung aktivieren/deaktivieren</div>').insertAfter('div.leaflet-control-layers-overlays');
        }

        //set class inactive for all inactive clustergroups
        $(".leaflet-control-layers-selector").each(function(index, elem) {
            var html = $(this).next().outerHTML();
            test = html.split('</div>');
            var title = test[1].replace('</span>', '');
            if (SucheKarte.ClusterGroupsActiveState[title] == 'inactive')
           $(this).next().addClass('inactive');
        });

        /*add or remove class inactive on checkbox changed and add settings to SucheKarte.ClusterGroupsActiveState*/
        $(".leaflet-control-layers-selector").change(function () {

            var html = $(this).next().outerHTML();
            test = html.split('</div>');
            var title = test[1].replace('</span>', '');

            if ($(this).next().hasClass('inactive')) {
                SucheKarte.ClusterGroupsActiveState[title] = 'active'
            } else {
                SucheKarte.ClusterGroupsActiveState[title] = 'inactive'
            }
            $(this).next().toggleClass('inactive');
        });

        $('.mapLegendClustering').click(function () {
            $.each(SucheKarte.MarkerClusterGroups, function (i, mcg) {
                if (SucheKarte.clusteringEnabled) {
                    mcg.removeFrom(SucheKarte.map);
                    mcg.disableClustering();
                    mcg.addTo(SucheKarte.map);
                } else {
                    mcg.enableClustering();

                }
            });
            SucheKarte.clusteringEnabled = !SucheKarte.clusteringEnabled;
        });

        $('#legend').click(function () {
           $('.leaflet-control-layers').toggle('1000');

        });

        //after zooming, save current zoomsetting in SucheKarte.settings
        SucheKarte.map.on('zoomend', function (e) {
            SucheKarte.settings['zoom'] = e.target._animateToZoom;
        });

        //after moving, save current center in SucheKarte.settings
        SucheKarte.map.on('moveend', function(e) {
            SucheKarte.settings['center'] = SucheKarte.map.getCenter();
        });
    };

})(jQuery);