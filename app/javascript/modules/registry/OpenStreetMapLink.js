import PropTypes from 'prop-types';
import { FaGlobeEurope } from 'react-icons/fa';

export default function OpenStreetMapLink({ lat, lng }) {
    return (
        <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=6`}
            target="_blank"
            rel="noreferrer"
            className="Link flyout-sub-tabs-content-ico-link"
            title={`${lat}, ${lng}`}
        >
            <FaGlobeEurope className="Icon Icon--primary" />
        </a>
    );
}

OpenStreetMapLink.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
};
