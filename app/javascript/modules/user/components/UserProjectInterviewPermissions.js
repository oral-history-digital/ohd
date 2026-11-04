import { useEffect, useState } from 'react';

import { fetchData, getInterviews, getInterviewsStatus } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useInterviewContributors } from 'modules/person';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Links to one permitted interview using its owning project's contributor names or localized title.
 *
 * @param {Object} props - Public interview identifier, cached details, and owning project.
 * @param {string} props.archiveId - Public interview identifier used in navigation.
 * @param {Object} [props.interview] - Cached interview details, used only when the project matches.
 * @param {Object} props.project - Project display record from the account's project row.
 * @returns {React.ReactElement} Interview link, retaining its archive ID while the label loads.
 */
function InterviewPermissionLink({ archiveId, interview, project }) {
    const { locale } = useI18n();
    const scopedInterview =
        interview?.project_id === project.id ? interview : undefined;
    const { data: people } = useInterviewContributors(
        scopedInterview?.id,
        project
    );
    const name =
        people?.[scopedInterview?.interviewee_id]?.display_name ||
        scopedInterview?.short_title?.[locale] ||
        scopedInterview?.anonymous_title?.[locale];
    return (
        <LinkOrA project={project} to={`interviews/${archiveId}`}>
            {name ? `${name} (${archiveId})` : archiveId}
        </LinkOrA>
    );
}

InterviewPermissionLink.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object,
    project: PropTypes.object.isRequired,
};

/**
 * Shows an account's interview permissions with names and links from their owning project.
 * Loads interview details when expanded and retains archive IDs while labels are unavailable.
 *
 * @param {Object} props - Permissions and their owning project.
 * @param {Object[]} [props.interviewPermissions=[]] - Granted interviews identified by archive_id.
 * @param {Object} props.project - Project display record supplied by the account's project row.
 * @returns {React.ReactElement|null} Expandable permission list, or nothing when empty.
 */
function UserProjectInterviewPermissions({
    interviewPermissions = [],
    project,
}) {
    const { t, locale } = useI18n();
    const interviews = useSelector(getInterviews);
    const interviewStatuses = useSelector(getInterviewsStatus);
    const requestPath = `/${project.shortname}/${locale}`;
    const dispatch = useDispatch();
    const [showPermissions, setShowPermissions] = useState(false);
    const hasPermissions = interviewPermissions?.length > 0;

    useEffect(() => {
        if (!showPermissions) return;
        interviewPermissions.forEach(({ archive_id: archiveId }) => {
            if (
                interviews?.[archiveId]?.project_id !== project.id &&
                interviewStatuses?.[archiveId] !== 'fetching'
            ) {
                dispatch(
                    fetchData(
                        { pathBase: requestPath },
                        'interviews',
                        archiveId
                    )
                );
            }
        });
    }, [
        showPermissions,
        interviewPermissions,
        interviews,
        interviewStatuses,
        dispatch,
        project.id,
        requestPath,
    ]);

    if (!hasPermissions) {
        return null;
    }

    return (
        <div className="interview_permissions">
            <h4 className="title">
                {t('activerecord.models.interview_permission.other')}
                <button
                    aria-label={t(
                        'activerecord.models.interview_permission.other'
                    )}
                    aria-expanded={showPermissions}
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={() => setShowPermissions((prev) => !prev)}
                >
                    {showPermissions ? (
                        <FaAngleUp className="Icon Icon--primary" />
                    ) : (
                        <FaAngleDown className="Icon Icon--primary" />
                    )}
                </button>
            </h4>
            {showPermissions ? (
                <ul className="DetailList">
                    {[...interviewPermissions]
                        .sort((a, b) =>
                            a.archive_id.localeCompare(
                                b.archive_id,
                                undefined,
                                { numeric: true }
                            )
                        )
                        .map(({ archive_id: archiveId }) => (
                            <li key={archiveId} className="DetailList-item">
                                <InterviewPermissionLink
                                    archiveId={archiveId}
                                    project={project}
                                    interview={interviews?.[archiveId]}
                                />
                            </li>
                        ))}
                </ul>
            ) : null}
        </div>
    );
}

UserProjectInterviewPermissions.propTypes = {
    interviewPermissions: PropTypes.arrayOf(
        PropTypes.shape({
            archive_id: PropTypes.string.isRequired,
        })
    ),
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        shortname: PropTypes.string.isRequired,
        archive_domain: PropTypes.string,
    }).isRequired,
};

export default UserProjectInterviewPermissions;
