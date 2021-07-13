import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

import { usePathBase } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import { INDEX_MAP } from 'modules/flyout-tabs';

import { MapComponent } from 'modules/map';
import MapPopupContent from './MapPopupContent';
import MapFilterContainer from './MapFilterContainer';

export default function MapSearch({
    mapMarkers,
    isMapSearching,
    query,
    flyoutTabsVisible,
    searchInMap,
    fetchMapReferenceTypes,
    setFlyoutTabsIndex,
}) {
    const pathBase = usePathBase();
    const mapEl = useRef(null);

    console.log(mapMarkers);

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
                {
                    true && <MapComponent
                        loading={isMapSearching}
                        markers={mapMarkers || []}
                        popupComponent={MapPopupContent}
                    />
                }
                <MapFilterContainer />
            </div>
        </ScrollToTop>
    );
}

MapSearch.propTypes = {
    mapMarkers: PropTypes.array,
    mapReferenceTypes: PropTypes.array,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    flyoutTabsVisible: PropTypes.bool.isRequired,
    searchInMap: PropTypes.func.isRequired,
    fetchMapReferenceTypes: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
