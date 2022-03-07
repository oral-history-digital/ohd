import classNames from 'classnames';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

import MapPopup from './MapPopup';
import MapOverlay from './MapOverlay';
import MapTooltip from './MapTooltip';
import MapResizeHandler from './MapResizeHandler';

export default function MapComponent({
    loading = false,
    className,
    markers = [],
    bounds,
    popupComponent,
    children,
}) {
    return (
        <div style={{ position: 'relative' }}>
            <MapContainer
                className={classNames('Map', className)}
                bounds={bounds}
                maxZoom={16}
                scrollWheelZoom={false}
                zoomAnimation={false}
            >
                <MapResizeHandler />
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
                            <MapTooltip
                                placeName={marker.name}
                                numInterviewRefs={marker.numMetadataReferences}
                                numSegmentRefs={marker.numSegmentReferences}
                            />
                            <MapPopup
                                title={marker.name}
                                registryEntryId={marker.id}
                                popupComponent={popupComponent}
                            />
                        </CircleMarker>
                    ))
                }
                {children}
            </MapContainer>
        </div>
    );
}

MapComponent.propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string,
    markers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired,
        long: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        numReferences: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    })),
    bounds: PropTypes.arrayOf(PropTypes.array),
    popupComponent: PropTypes.elementType.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
