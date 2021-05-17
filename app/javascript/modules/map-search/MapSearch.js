import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import 'leaflet/dist/leaflet.css';
import { Tooltip, Map, CircleMarker, Popup, TileLayer } from 'react-leaflet';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';

const OUTER_BOUNDS = [[[-80,-180], [80,180]]];

const leafletOptions = {
    maxZoom: 16,
    scrollWheelZoom: false,
    zoomAnimation: false,
};

export default function MapSearch({
    mapMarkers,
    markersFetched,
    isMapSearching,
    query,
    searchInMap,
}) {
    const pathBase = usePathBase();
    const { locale } = useI18n();

    useEffect(() => {
        const path = `${pathBase}/searches/map`;
        searchInMap(path, query);
    }, [locale]);

    return (
        <ScrollToTop>
            <div className='wrapper-content map'>
                {
                    (!markersFetched || isMapSearching) ?
                        <Spinner /> :
                        (
                            <div>
                                {mapMarkers.length} Markers
                            </div>
                        )
                }
            </div>
        </ScrollToTop>
    );
}

MapSearch.propTypes = {
    mapMarkers: PropTypes.array,
    markersFetched: PropTypes.bool.isRequired,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    searchInMap: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
