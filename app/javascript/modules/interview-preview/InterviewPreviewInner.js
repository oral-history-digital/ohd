import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';

import { useProjectAccessStatus } from 'modules/auth';
import ThumbnailMetadata from './ThumbnailMetadata';
import InterviewImage from './InterviewImage';

export default function InterviewPreviewInner({
    interview,
    project,
    locale,
    isExpanded
}) {
    const { projectAccessGranted } = useProjectAccessStatus(project);

    return (
        <>
            <InterviewImage interview={interview} project={project} />

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
