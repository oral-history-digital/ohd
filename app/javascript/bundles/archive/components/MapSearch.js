import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import 'leaflet-extra-markers'
import 'leaflet.markercluster'
import 'lib/leaflet.markercluster-regionbound/leaflet.markercluster-regionbound.min.js'
import 'lib/leaflet.cedis.regioncluster/leaflet.cedis.regioncluster.js'

import 'lib/leaflet.markercluster-regionbound/MarkerCluster.Aggregations.css'
import 'lib/leaflet.markercluster-regionbound/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'lib/leaflet.cedis.regioncluster/leaflet.cedis.regioncluster.css'

import { pathBase } from 'lib/utils';
import { INDEX_MAP } from '../constants/flyoutTabs';
import Spinner from './Spinner';

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
    isMapSearching: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    foundMarkers: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    searchInMap: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
