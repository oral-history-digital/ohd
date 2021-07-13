import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

import { ScrollToTop } from 'modules/user-agent';
import { INDEX_MAP } from 'modules/flyout-tabs';
import { MapComponent } from 'modules/map';
import MapPopupContent from './MapPopupContent';
import MapFilterContainer from './MapFilterContainer';
import useSearchMap from '../useSearchMap';

export default function SearchMap({
    flyoutTabsVisible,
    setFlyoutTabsIndex,
}) {
    const mapEl = useRef(null);

    const { isLoading, markers, error } = useSearchMap();

    useEffect(() => {
        setFlyoutTabsIndex(INDEX_MAP);
    }, []);

    useEffect(() => {
        // TODO
        //mapEl.current?.leafletElement?.invalidateSize();
    }, [flyoutTabsVisible]);

    return (
        <ScrollToTop>
            <div className='wrapper-content map'>
                {
                    <MapComponent
                        loading={isLoading}
                        markers={markers || []}
                        popupComponent={MapPopupContent}
                    />
                }
                <MapFilterContainer />
            </div>
        </ScrollToTop>
    );
}

SearchMap.propTypes = {
    flyoutTabsVisible: PropTypes.bool.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
