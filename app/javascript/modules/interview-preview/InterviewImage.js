import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { useProjectAccessStatus } from 'modules/auth';
import { MediaIcon } from 'modules/interview-helpers';

export default function InterviewImage({ interview, project }) {
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

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
                <>
                    {!loaded && (
                        <div className="aspect-ratio__inner">
                            <Skeleton height="100%" />
                        </div>
                    )}
                    <img
                        className="aspect-ratio__inner"
                        src={interview.still_url}
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                        alt=""
                        style={{ display: loaded ? 'block' : 'none' }}
                    />
                </>
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
