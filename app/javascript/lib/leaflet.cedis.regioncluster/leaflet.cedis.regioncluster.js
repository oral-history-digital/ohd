(function ($) {

    window.SucheKarte = {settings: [], MarkerClusterGroups: [], clusteringEnabled: true, allMarkers: [], ClusterGroupsActiveState: [], borderShape : {}} ;

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
                            number: mymarkers.length,
                            svg: true

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
                        prefix: markers_data[0].icon_prefix,
                        svg: true

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

                //var svg = '<svg width="33" height="44" viewBox="0 0 35 45" xmlns="http://www.w3.org/2000/svg"><path d="M28.205 3.217H6.777c-2.367 0-4.286 1.87-4.286 4.179v19.847c0 2.308 1.919 4.179 4.286 4.179h5.357l5.337 13.58 5.377-13.58h5.357c2.366 0 4.285-1.87 4.285-4.179V7.396c0-2.308-1.919-4.179-4.285-4.179" fill="' + marker_color + '"></path><g opacity=".15" transform="matrix(1.0714 0 0 -1.0714 -233.22 146.783)"><path d="M244 134h-20c-2.209 0-4-1.746-4-3.9v-18.525c0-2.154 1.791-3.9 4-3.9h5L233.982 95 239 107.675h5c2.209 0 4 1.746 4 3.9V130.1c0 2.154-1.791 3.9-4 3.9m0-1c1.654 0 3-1.301 3-2.9v-18.525c0-1.599-1.346-2.9-3-2.9h-5.68l-.25-.632-4.084-10.318-4.055 10.316-.249.634H224c-1.654 0-3 1.301-3 2.9V130.1c0 1.599 1.346 2.9 3 2.9h20" fill="#231f20"></path></g></svg>';
                var svg = '<svg width="25" height="33" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M28.205 3.217H6.777c-2.367 0-4.286 1.87-4.286 4.179v19.847c0 2.308 1.919 4.179 4.286 4.179h5.357l5.337 13.58 5.377-13.58h5.357c2.366 0 4.285-1.87 4.285-4.179V7.396c0-2.308-1.919-4.179-4.285-4.179" fill="' + marker_color + '"></path><g opacity=".15" transform="matrix(1.0714 0 0 -1.0714 -233.22 146.783)"><path d="M244 134h-20c-2.209 0-4-1.746-4-3.9v-18.525c0-2.154 1.791-3.9 4-3.9h5L233.982 95 239 107.675h5c2.209 0 4 1.746 4 3.9V130.1c0 2.154-1.791 3.9-4 3.9m0-1c1.654 0 3-1.301 3-2.9v-18.525c0-1.599-1.346-2.9-3-2.9h-5.68l-.25-.632-4.084-10.318-4.055 10.316-.249.634H224c-1.654 0-3 1.301-3 2.9V130.1c0 1.599 1.346 2.9 3 2.9h20" fill="#231f20"></path></g></svg>';
                var  iconHTML = '<div class="legend leaflet-marker-icon extra-marker extra-marker-svg leaflet-zoom-animated leaflet-interactive" style="margin-left: -17px; margin-top: -42px; z-index: 1625; opacity: 1; outline: currentcolor none medium;" tabindex="0">' + svg + '<i style="color:#fff;" class="' + marker_icon_prefix + ' '  + marker_icon_class +'"></i></div>';
                //var iconHTML = '<div class=\"legend leaflet-marker-icon extra-marker-square-' + marker_color + ' extra-marker leaflet-zoom-animated leaflet-interactive\" tabindex=\"0\"><i style=\"color: #fff\" class=\"  ' + marker_icon_prefix + ' ' + marker_icon_class + '\"></i></div>';

                if (SucheKarte.ClusterGroupsActiveState[group_title] == 'active' || SucheKarte.ClusterGroupsActiveState[group_title] == undefined) {
                    mrkClusterGroup.addTo(SucheKarte.map);
                    SucheKarte.ClusterGroupsActiveState[group_title] = 'active'
                } else {
                    SucheKarte.ClusterGroupsActiveState[group_title] = 'inactive'
                }
                allMarkers = allMarkers.concat(mrkClusterGroup.getBounds());
                control_layers.addOverlay(mrkClusterGroup, iconHTML + '<div class="grouptitle">' +  group_title + '</div>');
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
                SucheKarte.borderShape = geoJson;
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


        SucheKarte.map.on('zoomend', function (e) {
            //after zooming, save current zoomsetting in SucheKarte.settings
            SucheKarte.settings['zoom'] = e.target._animateToZoom;
            //if we show borders, we hide them if zoomfactor >= 9 because our shapefile is not exact
            //enough and you start to see that here.
            if (options.showBorders) {
                var zoomfactor = SucheKarte.map.getZoom();
                if (zoomfactor >= 9) {
                    SucheKarte.borderShape.removeFrom(SucheKarte.map);
                } else {
                    SucheKarte.borderShape.addTo(SucheKarte.map);
                }
            }

        });

        //after moving, save current center in SucheKarte.settings
        SucheKarte.map.on('moveend', function(e) {
            SucheKarte.settings['center'] = SucheKarte.map.getCenter();
        });
    };

})(jQuery);