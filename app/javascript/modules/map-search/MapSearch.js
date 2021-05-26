import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Tooltip, Map, CircleMarker, TileLayer } from 'react-leaflet';

import { usePathBase } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import { INDEX_MAP } from 'modules/flyout-tabs';
import MapOverlay from './MapOverlay';
import MapPopup from './MapPopup';
import MapFilterContainer from './MapFilterContainer';
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
    isMapSearching,
    query,
    flyoutTabsVisible,
    searchInMap,
    fetchMapReferenceTypes,
    setFlyoutTabsIndex,
}) {
    const pathBase = usePathBase();
    const mapEl = useRef(null);

    useEffect(() => {
        setFlyoutTabsIndex(INDEX_MAP);
    }, []);

    useEffect(() => {
        const typesPath = `${pathBase}/searches/map_reference_types`;
        fetchMapReferenceTypes(typesPath);
    }, [pathBase]);

    // TODO: Make this dependent on 'query', too.
    useEffect(() => {
        const searchPath = `${pathBase}/searches/map`;
        searchInMap(searchPath, query);
    }, [pathBase]);

    useEffect(() => {
        mapEl.current?.leafletElement?.invalidateSize();
    }, [flyoutTabsVisible]);

    return (
        <ScrollToTop>
            <div className='wrapper-content map'>
                <Map
                    className="Map Map--search"
                    bounds={mapBounds}
                    ref={mapEl}
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
                                    fillColor={markerColor(mapReferenceTypes, marker.referenceTypes)}
                                    fillOpacity={0.5}
                                    stroke={0}
                                >
                                    <Tooltip>
                                        {marker.name} ({marker.numReferences})
                                    </Tooltip>
                                    <MapPopup
                                        name={marker.name}
                                        registryEntryId={marker.id}
                                        query={query}
                                    />
                                </CircleMarker>
                            );
                        })
                    }
                </Map>

                <MapFilterContainer />
            </div>
        </ScrollToTop>
    );
}

MapSearch.propTypes = {
    mapMarkers: PropTypes.array,
    mapBounds: PropTypes.array.isRequired,
    mapReferenceTypes: PropTypes.array,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    flyoutTabsVisible: PropTypes.bool.isRequired,
    searchInMap: PropTypes.func.isRequired,
    fetchMapReferenceTypes: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
