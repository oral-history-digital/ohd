import { useRef } from 'react';

import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';

export default function MapPopup(props) {
    const popupEl = useRef(null);
    const MapPopupContent = props.popupComponent;

    return (
        <Popup ref={popupEl}>
            <MapPopupContent
                {...props}
                onUpdate={() => {
                    popupEl.current?.update();
                }}
            />
        </Popup>
    );
}

MapPopup.propTypes = {
    title: PropTypes.string.isRequired,
    registryEntryId: PropTypes.number.isRequired,
    popupComponent: PropTypes.elementType.isRequired,
};
