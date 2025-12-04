import classNames from 'classnames';
import 'leaflet/dist/leaflet.css';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';

import MapPopup from './MapPopup';
import MapResizeHandler from './MapResizeHandler';
import MapTooltip from './MapTooltip';

export default function MapComponent({
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
        const result = marker.labels[locale]
            ? marker.labels[locale]
            : marker.labels[defaultLocale];
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

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {markers.map((marker) => {
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
                })}
                {children}
            </MapContainer>
        </div>
    );
}

MapComponent.propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string,
    markers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            lat: PropTypes.number.isRequired,
            long: PropTypes.number.isRequired,
            labels: PropTypes.object.isRequired,
            numReferences: PropTypes.number.isRequired,
            radius: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired,
        })
    ),
    bounds: PropTypes.arrayOf(PropTypes.array),
    popupComponent: PropTypes.elementType.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
