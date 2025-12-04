import { useEffect } from 'react';

import PropTypes from 'prop-types';
import { useMapEvents } from 'react-leaflet';

export default function MapNewBoundsSetter({ bounds, view, onViewChange }) {
    const map = useMapEvents({
        zoomend: handleEvents,
        moveend: handleEvents,
    });

    function handleEvents() {
        const center = map.getCenter();
        onViewChange({
            center: [center.lat, center.lng],
            zoom: map.getZoom(),
        });
    }

    // Order is important here, otherwise the saved section is not loaded.
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [JSON.stringify(bounds)]);

    useEffect(() => {
        if (view) {
            map.setView(view.center, view.zoom);
        }
    }, []);

    return null;
}

MapNewBoundsSetter.propTypes = {
    bounds: PropTypes.array.isRequired,
    view: PropTypes.object,
    onViewChange: PropTypes.func.isRequired,
};
