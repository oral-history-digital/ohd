import { useState } from 'react';

import classNames from 'classnames';
import { useProjectAccessStatus } from 'modules/auth';
import { MediaIcon } from 'modules/interview-helpers';
import PropTypes from 'prop-types';

export default function InterviewImage({ interview, project }) {
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const [error, setError] = useState(false);

    let imageAvailable =
        (project.show_preview_img || projectAccessGranted) &&
        interview.still_url &&
        !error;

    return (
        <div
            className={classNames('InterviewCard-image', 'aspect-ratio', {
                'InterviewCard-image--missing': !imageAvailable,
            })}
        >
            {imageAvailable ? (
                <img
                    className="aspect-ratio__inner"
                    src={interview.still_url}
                    onError={() => setError(true)}
                    alt=""
                />
            ) : (
                <div className="InterviewCard-icon aspect-ratio__inner">
                    <MediaIcon interview={interview} />
                </div>
            )}
        </div>
    );
}

InterviewImage.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};
