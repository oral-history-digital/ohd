import { useRef } from 'react';

import PropTypes from 'prop-types';
import { Popup } from 'react-leaflet';

export default function MapPopup(props) {
    const popupEl = useRef(null);
    const MapPopupContent = props.popupComponent;
    const { popupClassName } = props;

    return (
        <Popup ref={popupEl} className={popupClassName}>
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
    popupClassName: PropTypes.string,
};
