import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';

import { useProjectAccessStatus } from 'modules/auth';
import { useProject } from 'modules/routes';
import ThumbnailMetadata from './ThumbnailMetadata';
import InterviewImage from './InterviewImage';
import InterviewArchiveDisplay from './InterviewArchiveDisplay';

export default function InterviewPreviewInner({
    interview,
    project,
    locale,
    isExpanded
}) {
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { project: currentProject } = useProject();

    return (
        <>
            <InterviewImage interview={interview} project={project} />

            <div className="InterviewCard-title u-mt-small">
                {interview.workflow_state === 'unshared' &&
                    <FaEyeSlash className="u-mr-tiny" />
                }
                {projectAccessGranted ?
                    interview.short_title?.[locale] :
                    interview.anonymous_title[locale]
                }
            </div>

            {currentProject.is_ohd && (
                <InterviewArchiveDisplay project={project} />
            )}

            {!isExpanded && <ThumbnailMetadata interview={interview} />}
        </>
    );
};

InterviewPreviewInner.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
};
