import classNames from 'classnames';
import 'leaflet/dist/leaflet.css';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';

import MapPopup from './MapPopup';
import MapResizeHandler from './MapResizeHandler';
import MapTooltip from './MapTooltip';

/**
 * Shows map markers with labels in the UI locale, falling back to the project locale.
 *
 * @param {Object} props - Map display properties.
 * @param {string} [props.className] - Additional map classes.
 * @param {Object[]} [props.markers=[]] - Marker positions, colors, labels, and reference counts.
 * @param {number[][]} [props.bounds] - Initial map bounds.
 * @param {React.ComponentType} props.popupComponent - Marker popup content component.
 * @param {React.ReactNode} [props.children] - Map controls or overlays.
 * @returns {React.ReactElement} Map or project loading/error status.
 */
export default function MapComponent({
    className,
    markers = [],
    bounds,
    popupComponent,
    children,
}) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject();

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;
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
