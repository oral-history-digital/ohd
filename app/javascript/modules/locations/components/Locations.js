import React from 'react';
import PropTypes from 'prop-types';

// This import order of these four items is important.
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

export default class Locations extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            if (this.map) {
                this.map.leafletElement.invalidateSize();
                const locations = this.props.data.map(location => [location.latitude, location.longitude]);
                this.map.leafletElement.fitBounds(locations);
            }
        }
    }

    render() {
        const { data, loaded } = this.props;

        const locations = data.map(location => [location.latitude, location.longitude]);

        if (loaded && data.length > 0) {
            return(
                <Map
                    bounds={locations}
                    maxZoom={16}
                    ref={(map) => { this.map = map; }}
                >
                    <TileLayer
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MarkerClusterGroup maxClusterRadius={40}>
                        {
                            data.map((location, index) => (
                                <Marker
                                    key={index}
                                    position={[location.latitude, location.longitude]}
                                >
                                    <Popup>
                                        {this.props.popupContent(location)}
                                    </Popup>
                                </Marker>
                            ))
                        }
                    </MarkerClusterGroup>
                </Map>
            );
        } else {
            return null;
        }
    }
}

Locations.propTypes = {
    loaded: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    popupContent: PropTypes.func.isRequired,
};
