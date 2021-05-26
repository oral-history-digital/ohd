import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';

import MapPopupContent from './MapPopupContent';

export default function MapPopup(props) {
    const popupEl = useRef(null);

    return (
        <Popup ref={popupEl}>
            <MapPopupContent
                {...props}
                onUpdate={() => popupEl.current?.leafletElement.update()}
            />
        </Popup>
    );
}

MapPopup.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
};
