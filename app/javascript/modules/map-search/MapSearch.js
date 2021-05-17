import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Tooltip, Map, CircleMarker, Popup, TileLayer } from 'react-leaflet';

import { usePathBase } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import MapOverlay from './MapOverlay';
import MapPopup from './MapPopup';
import markerColor from './markerColor';
import markerRadius from './markerRadius';

const leafletOptions = {
    maxZoom: 16,
    scrollWheelZoom: false,
    zoomAnimation: false,
};

export default function MapSearch({
    mapMarkers,
    mapBounds,
    mapReferenceTypes,
    markersFetched,
    isMapSearching,
    query,
    searchInMap,
    fetchMapReferenceTypes,
}) {
    const pathBase = usePathBase();

    useEffect(() => {
        const searchPath = `${pathBase}/searches/map`;
        searchInMap(searchPath, query);

        const typesPath = `${pathBase}/searches/map_reference_types`;
        fetchMapReferenceTypes(typesPath);
    }, [pathBase]);

    return (
        <ScrollToTop>
            <div className='wrapper-content map'>
                <Map
                    className="Map Map--search"
                    bounds={mapBounds}
                    {...leafletOptions}
                >
                    {
                        isMapSearching && <MapOverlay />
                    }
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {
                        mapReferenceTypes && mapMarkers?.map(marker => {
                            return (
                                <CircleMarker
                                    key={marker.id}
                                    center={[marker.lat, marker.lon]}
                                    radius={markerRadius(marker.numReferences)}
                                    fillColor={markerColor(marker.referenceTypes)}
                                    fillOpacity={0.5}
                                    stroke={0}
                                >
                                    <Tooltip>
                                        {marker.name} ({marker.numReferences})
                                    </Tooltip>
                                    <Popup>
                                        <MapPopup
                                            name={marker.name}
                                            registryEntryId={marker.id}
                                            query={query}
                                        />
                                    </Popup>
                                </CircleMarker>
                            );
                        })
                    }
                </Map>

            </div>
        </ScrollToTop>
    );
}

MapSearch.propTypes = {
    mapMarkers: PropTypes.array,
    mapBounds: PropTypes.array.isRequired,
    mapReferenceTypes: PropTypes.array,
    markersFetched: PropTypes.bool.isRequired,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    searchInMap: PropTypes.func.isRequired,
    fetchMapReferenceTypes: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
