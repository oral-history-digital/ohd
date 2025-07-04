import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaEyeSlash, FaKey } from 'react-icons/fa';

import classNames from 'classnames';

import { useProjectAccessStatus } from 'modules/auth';
import { useProject } from 'modules/routes';
import { getCurrentUser } from 'modules/data';
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
    const currentUser = useSelector(getCurrentUser);
    const permitted = currentUser?.interview_permissions.some(p => p.interview_id === interview.id);

    return (
        <>
            <InterviewImage interview={interview} project={project} />

            <div className={classNames('InterviewCard-title', isExpanded ? 'u-mt' : 'u-mt-small')}>
                {interview.workflow_state === 'unshared' &&
                    <FaEyeSlash className="u-mr-tiny" />
                }
                {interview.workflow_state === 'restricted' &&
                    <FaKey className="u-mr-tiny" style={{ filter: permitted ? 'brightness(150%)' : 'brightness(100%)' }} />
                }
                {projectAccessGranted && (
                    interview.workflow_state === 'public' ||
                    (interview.workflow_state === 'restricted' && permitted)
                ) ?
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
