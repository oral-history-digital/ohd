import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaVideo, FaVolumeUp, FaFileAlt, FaTags } from 'react-icons/fa';

import { useProjectAccessStatus } from 'modules/auth';

export default function InterviewImage({
    interview,
    project,
}) {
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const [error, setError] = useState(false);

    let imageAvailable = (project.show_preview_img || projectAccessGranted)
        && interview.still_url
        && !error;

    let MediaIcon;
    switch (interview.media_type) {
    case 'video':
        MediaIcon = FaVideo;
        break;
    case 'audio':
        MediaIcon = FaVolumeUp;
        break;
    default:
        MediaIcon = FaFileAlt;
        break;
    }

    return (
        <div className={classNames('InterviewCard-image', 'aspect-ratio', {
            'InterviewCard-image--missing': !imageAvailable,
        })}>
            {imageAvailable ? (
                <img
                    className="aspect-ratio__inner"
                    src={interview.still_url}
                    onError={() => setError(true)}
                    alt=""
                />) : (
                <div className="InterviewCard-icon aspect-ratio__inner">
                    <MediaIcon />
                </div>
            )}
        </div>
    );
};

InterviewImage.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};
