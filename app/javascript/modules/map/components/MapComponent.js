import classNames from 'classnames';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
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
    const { locale } = useI18n();
    const { project } = useProject();
    const defaultLocale = project.default_locale;

    function getMarkerName(marker) {
        const result = marker.agg_names[locale]
            ? marker.agg_names[locale]
            : marker.agg_names[defaultLocale];
        return result || '';
    }

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

                {loading && <MapOverlay />}

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {
                    markers.map(marker => {
                        const markerName = getMarkerName(marker);
                        return (
                            <CircleMarker
                                key={marker.id}
                                center={[marker.lat, marker.long]}
                                radius={marker.radius}
                                fillColor={marker.color}
                                fillOpacity={0.5}
                                stroke={0}
                            >
                                <MapTooltip
                                    placeName={markerName}
                                    numInterviewRefs={marker.numMetadataReferences}
                                    numSegmentRefs={marker.numSegmentReferences}
                                />
                                <MapPopup
                                    title={markerName}
                                    registryEntryId={marker.id}
                                    popupComponent={popupComponent}
                                />
                            </CircleMarker>
                        );
                    })
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
        agg_names: PropTypes.object.isRequired,
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
