import { useMemo } from 'react';

import 'leaflet/dist/leaflet.css';
import MapResizeHandler from 'modules/map/components/MapResizeHandler';
import MapTooltip from 'modules/map/components/MapTooltip';
import PropTypes from 'prop-types';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';

import { buildInstitutionMarkers } from '../utils';

const MAP_CENTER = [51.1657, 10.4515]; // Germany center
const MAP_ZOOM = 5;
const MAP_MAX_ZOOM = 16;

const calcMarkerRadius = (interviews) =>
    Math.max(6, Math.min(20, Math.sqrt(interviews) * 2));

export function InstitutionsMap({ institutions, height }) {
    const markers = useMemo(
        () => buildInstitutionMarkers(institutions),
        [institutions]
    );

    if (markers.length === 0) return null;

    return (
        <div className="InstitutionsMap">
            <MapContainer
                className="Map Map--search InstitutionsMap-container"
                center={MAP_CENTER}
                zoom={MAP_ZOOM}
                maxZoom={MAP_MAX_ZOOM}
                scrollWheelZoom={false}
                zoomAnimation={false}
                style={{ height: `${height}px`, width: '100%' }}
            >
                <MapResizeHandler />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map((marker) => (
                    <CircleMarker
                        key={marker.id}
                        center={[marker.lat, marker.lng]}
                        radius={calcMarkerRadius(marker.interviews)}
                        fillColor="var(--primary-color, #8f201c)"
                        fillOpacity={0.6}
                        stroke={false}
                    >
                        <MapTooltip
                            placeName={marker.name}
                            numInterviewRefs={marker.interviews}
                            numSegmentRefs={0}
                        />
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

InstitutionsMap.propTypes = {
    institutions: PropTypes.array.isRequired,
    height: PropTypes.number,
};

export default InstitutionsMap;
