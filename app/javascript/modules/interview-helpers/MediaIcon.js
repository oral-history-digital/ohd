import PropTypes from 'prop-types';
import { FaVideo, FaVolumeUp, FaFileAlt } from 'react-icons/fa';

export default function MediaIcon({ interview, className }) {
    switch (interview.media_type) {
        case 'video':
            return <FaVideo className={className} />;
        case 'audio':
            return <FaVolumeUp className={className} />;
        default:
            return <FaFileAlt className={className} />;
    }
}

MediaIcon.propTypes = {
    interview: PropTypes.object.isRequired,
    className: PropTypes.string,
};
