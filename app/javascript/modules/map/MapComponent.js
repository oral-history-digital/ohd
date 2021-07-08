import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer } from 'react-leaflet';

import MapOverlay from './MapOverlay';
import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from './constants';

const leafletOptions = {
    center: INITIAL_MAP_CENTER,
    zoom: INITIAL_MAP_ZOOM,
    maxZoom: 16,
    scrollWheelZoom: false,
    zoomAnimation: false,
};

export default function MapComponent({
    loading = false,
}) {
    return (
        <Map
            className="Map Map--search"
            {...leafletOptions}
        >
            {
                loading && <MapOverlay />
            }
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
        </Map>
    );
}

MapComponent.propTypes = {
    loading: PropTypes.bool,
};
