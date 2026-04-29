import { useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import MapPopup from 'modules/map/components/MapPopup';
import MapTooltip from 'modules/map/components/MapTooltip';
import PropTypes from 'prop-types';
import { CircleMarker, useMap } from 'react-leaflet';

import { InstitutionsMapPopup } from './InstitutionsMapPopup';

const MARKER_RADIUS = 5;

export function InstitutionMarker({ marker, isExpanded }) {
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
            radius={MARKER_RADIUS}
            pathOptions={{
                stroke: true,
                color: '#fff',
                weight: 1,
                fillColor: 'var(--primary-color, #8f201c)',
                fillOpacity: 0.8,
            }}
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
                variant={isExpanded ? 'expanded' : 'compact'}
                popupClassName={
                    isExpanded ? 'MapPopupContainer--wide' : undefined
                }
                popupOptions={{
                    keepInView: true,
                    autoPan: true,
                    autoPanPaddingTopLeft: [56, 72],
                    autoPanPaddingBottomRight: [16, 16],
                }}
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
    isExpanded: PropTypes.bool,
};

export default InstitutionMarker;
