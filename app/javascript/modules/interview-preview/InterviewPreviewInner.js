import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';

import { useProjectAccessStatus } from 'modules/auth';
import missingStill from 'assets/images/missing_still.png';
import ThumbnailMetadata from './ThumbnailMetadata';

export default function InterviewPreviewInner({
    interview,
    project,
    locale,
    isExpanded
}) {
    const { projectAccessGranted } = useProjectAccessStatus(project);

    return (
        <>
            <div className="InterviewCard-image aspect-ratio">
                <img
                    className="aspect-ratio__inner"
                    src={interview.still_url || 'missing_still'}
                    onError={ (e) => { e.target.src = missingStill; }}
                    alt=""
                />
            </div>

            <p className="InterviewCard-title">
                {interview.workflow_state === 'unshared' &&
                    <FaEyeSlash className="u-mr-tiny" />
                }
                {projectAccessGranted ?
                    interview.short_title?.[locale] :
                    interview.anonymous_title[locale]
                }
            </p>

            {!isExpanded && (
                <ThumbnailMetadata
                    interview={interview}
                    project={project}
                />
            )}
        </>
    );
};

InterviewPreviewInner.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
};
