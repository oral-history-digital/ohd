import { useMemo, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { useI18n } from 'modules/i18n';
import MapResizeHandler from 'modules/map/components/MapResizeHandler';
import PropTypes from 'prop-types';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { MapContainer, TileLayer } from 'react-leaflet';

import { buildInstitutionMarkers } from '../utils';
import { InstitutionMarker } from './InstitutionsMapMarker';

const MAP_CENTER = [51.1657, 10.4515]; // Germany center
const MAP_ZOOM = 5;
const MAP_MAX_ZOOM = 16;
const COMPACT_MAP_HEIGHT = 260;
const EXPANDED_MAP_HEIGHT = 400;

export function InstitutionsMap({ institutions, onExpandedChange }) {
    const { t } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const mapHeight = isExpanded ? EXPANDED_MAP_HEIGHT : COMPACT_MAP_HEIGHT;
    const markers = useMemo(
        () => buildInstitutionMarkers(institutions),
        [institutions]
    );

    const handleExpandedChange = () => {
        setIsExpanded((value) => {
            const nextValue = !value;
            if (typeof onExpandedChange === 'function') {
                onExpandedChange(nextValue);
            }
            return nextValue;
        });
    };

    const expandLabel = t('explorer.institutions_list.expand_map');
    const collapseLabel = t('explorer.institutions_list.collapse_map');

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
                        <InstitutionMarker
                            key={marker.id}
                            marker={marker}
                            isExpanded={isExpanded}
                        />
                    ))}
                </MapContainer>
            </div>

            <button
                type="button"
                className="InstitutionsMap-sizeToggle"
                onClick={handleExpandedChange}
                aria-label={isExpanded ? collapseLabel : expandLabel}
                title={isExpanded ? collapseLabel : expandLabel}
            >
                {isExpanded ? (
                    <FaCompressAlt aria-hidden="true" />
                ) : (
                    <FaExpandAlt aria-hidden="true" />
                )}
            </button>
        </div>
    );
}

InstitutionsMap.propTypes = {
    institutions: PropTypes.array.isRequired,
    onExpandedChange: PropTypes.func,
};

export default InstitutionsMap;
