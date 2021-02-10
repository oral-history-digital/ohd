import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import 'leaflet';  // Needed to provide global L for leaflet-extra-markers import.
import 'leaflet-extra-markers'
import 'leaflet.markercluster'
import './leaflet.markercluster-regionbound/leaflet.markercluster-regionbound.min.js'
import './leaflet.cedis.regioncluster/leaflet.cedis.regioncluster.js'

import './leaflet.markercluster-regionbound/MarkerCluster.Aggregations.css'
import './leaflet.markercluster-regionbound/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import './leaflet.cedis.regioncluster/leaflet.cedis.regioncluster.css'

import { pathBase } from 'lib/utils';
import { INDEX_MAP } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';

export default class MapSearch extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 1);

        this.props.setFlyoutTabsIndex(INDEX_MAP);

        if (this.props.markersFetched) {
            this.initMap();
        } else {
            this.search();
        }
    }

    initMap() {
        window.SucheKarte.init('map', this.props.foundMarkers,  {
            useClustering: true,
            controlsCollapsed: false,
            showControls: true,
            fitBounds: true,
            allowClustersOfOne: false,
            showBorders: false,
        });
    }

    removeMap() {
        window.SucheKarte.map?.remove();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.markersFetched && this.props.markersFetched) {
            this.initMap()
        } else if (Object.keys(prevProps.foundMarkers).length !== Object.keys(this.props.foundMarkers).length) {
            this.removeMap();
            this.initMap();
        }
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.search(this.props.query);
        }
    }

    componentWillUnmount() {
        this.removeMap();
    }

    search(query={}) {
        let url = `${pathBase(this.props)}/searches/map`;
        this.props.searchInMap(url, query);
    }

    render() {
        return (
            <Fragment>
                <div className='wrapper-content map'>
                    {
                        this.props.isMapSearching ?
                            <Spinner /> :
                            null
                    }
                    <div id='map' />
                </div>
            </Fragment>
        )
    }
}

MapSearch.propTypes = {
    markersFetched: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMapSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    foundMarkers: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    searchInMap: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
