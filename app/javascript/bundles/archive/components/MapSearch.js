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
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 1);

        this.props.setFlyoutTabsIndex(INDEX_MAP);

        if(this.props.foundMarkers && Object.keys(this.props.foundMarkers).length > 0){
            this.initMap()
        } else if (this.props.foundMarkers) {
            this.search()
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
        window.SucheKarte.map && window.SucheKarte.map.remove()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.foundMarkers === undefined && this.props.foundMarkers) {
            this.initMap()
        } else if (prevProps.foundMarkers !== this.props.foundMarkers) {
            this.removeMap()
            this.initMap()

        }
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            this.search(this.props.query)
        }
    }

    componentWillUnmount() {
        this.removeMap()
    }


    search(query={}) {
        let url = `${pathBase(this.props)}/searches/map`;
        this.props.searchInMap(url, query);
    }

    spinner(){
        if (this.props.isMapSearching) {
            return (
                <div style={{height: 500, background: "rgba(255,255,255,0.5)", position: "absolute", zIndex: 401, width: "100%", paddingLeft: 75, paddingTop: 11}} >
                    <Spinner />
                </div>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <div className='wrapper-content map'>
                {this.spinner()}
                <div id='map' />
                </div>
            </Fragment>
        )
    }


    static contextTypes = {
        router: PropTypes.object
    }
}
