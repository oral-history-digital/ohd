import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import useResizeAware from 'react-resize-aware';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

import MapPopup from './MapPopup';
import MapOverlay from './MapOverlay';
import { INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM } from '../constants';

export default function MapComponent({
    loading = false,
    className,
    initialCenter = INITIAL_MAP_CENTER,
    initialZoom = INITIAL_MAP_ZOOM,
    markers = [],
    popupComponent,
}) {
    const [resizeListener, sizes] = useResizeAware();
    const mapEl = useRef(null);

    useEffect(() => {
        mapEl.current?.leafletElement?.invalidateSize();
    }, [sizes.width, sizes.height]);

    return (
        <div style={{ position: 'relative' }}>
            {resizeListener}
            <Map
                ref={mapEl}
                className={classNames('Map', className)}
                center={initialCenter}
                maxZoom={16}
                scrollWheelZoom={false}
                zoom={initialZoom}
                zoomAnimation={false}
            >
                {
                    loading && <MapOverlay />
                }
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    markers.map(marker => (
                        <CircleMarker
                            key={marker.id}
                            center={[marker.lat, marker.long]}
                            radius={marker.radius}
                            fillColor={marker.color}
                            fillOpacity={0.5}
                            stroke={0}
                        >
                            <Tooltip>
                                {marker.name} ({marker.numReferences})
                            </Tooltip>
                            <MapPopup
                                title={marker.name}
                                registryEntryId={marker.id}
                                popupComponent={popupComponent}
                            />
                        </CircleMarker>
                    ))
                }
            </Map>
        </div>
    );
}

MapComponent.propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string,
    initialCenter: PropTypes.arrayOf(PropTypes.number),
    initialZoom: PropTypes.number,
    markers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        long: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        numReferences: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    })),
    popupComponent: PropTypes.elementType.isRequired,
};