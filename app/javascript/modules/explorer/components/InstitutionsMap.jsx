import { useMemo, useRef, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import MapPopup from 'modules/map/components/MapPopup';
import MapResizeHandler from 'modules/map/components/MapResizeHandler';
import MapTooltip from 'modules/map/components/MapTooltip';
import PropTypes from 'prop-types';
import { FaArrowsAltV } from 'react-icons/fa';
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';

import { buildInstitutionMarkers } from '../utils';
import { InstitutionsMapPopup } from './InstitutionsMapPopup';

const MAP_CENTER = [51.1657, 10.4515]; // Germany center
const MAP_ZOOM = 5;
const MAP_MAX_ZOOM = 16;
const COMPACT_MAP_HEIGHT = 260;
const EXPANDED_MAP_HEIGHT = 400;

const calcMarkerRadius = (interviews) =>
    Math.max(6, Math.min(20, Math.sqrt(interviews) * 2));

function InstitutionMarker({ marker }) {
    const map = useMap();
    const markerRef = useRef(null);

    const handleMarkerClick = () => {
        const leafletMarker = markerRef.current;
        if (!leafletMarker) return;

        const latLng = leafletMarker.getLatLng();
        leafletMarker.openPopup();

        map.panTo(latLng, { animate: true, duration: 0.25 });
        map.panInside(latLng, {
            paddingTopLeft: [220, 140],
            paddingBottomRight: [120, 80],
            animate: true,
        });
    };

    return (
        <CircleMarker
            ref={markerRef}
            center={[marker.lat, marker.lng]}
            radius={calcMarkerRadius(marker.interviews)}
            fillColor="var(--primary-color, #8f201c)"
            fillOpacity={0.6}
            stroke={false}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            <MapTooltip
                placeName={marker.name}
                numInterviewRefs={0}
                numSegmentRefs={0}
                showNumRefs={false}
            />
            <MapPopup
                title={marker.name}
                registryEntryId={marker.id}
                popupComponent={InstitutionsMapPopup}
                marker={marker}
                popupClassName="MapPopupContainer--wide"
            />
        </CircleMarker>
    );
}

InstitutionMarker.propTypes = {
    marker: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        interviews: PropTypes.number,
    }).isRequired,
};

export function InstitutionsMap({ institutions }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const mapHeight = isExpanded ? EXPANDED_MAP_HEIGHT : COMPACT_MAP_HEIGHT;
    const markers = useMemo(
        () => buildInstitutionMarkers(institutions),
        [institutions]
    );

    return (
        <div className="InstitutionsMap">
            <div
                className="InstitutionsMap-frame"
                style={{ height: `${mapHeight}px` }}
            >
                <MapContainer
                    key={mapHeight}
                    className="Map InstitutionsMap-container"
                    center={MAP_CENTER}
                    zoom={MAP_ZOOM}
                    maxZoom={MAP_MAX_ZOOM}
                    scrollWheelZoom={false}
                    zoomAnimation={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <MapResizeHandler />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    />
                    {markers.map((marker) => (
                        <InstitutionMarker key={marker.id} marker={marker} />
                    ))}
                </MapContainer>
            </div>

            <button
                type="button"
                className="InstitutionsMap-sizeToggle"
                onClick={() => setIsExpanded((value) => !value)}
                aria-label={isExpanded ? 'Collapse map' : 'Expand map'}
                title={isExpanded ? 'Collapse map' : 'Expand map'}
            >
                <FaArrowsAltV aria-hidden="true" />
            </button>
        </div>
    );
}

InstitutionsMap.propTypes = {
    institutions: PropTypes.array.isRequired,
};

export default InstitutionsMap;
