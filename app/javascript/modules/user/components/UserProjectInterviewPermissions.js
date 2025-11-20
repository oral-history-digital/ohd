import { useEffect, useState } from 'react';

import { fetchData, getInterviews } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePeople } from 'modules/person';
import { LinkOrA, useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

function UserProjectInterviewPermissions({ interviewPermissions, project }) {
    const { t, locale } = useI18n();
    const interviews = useSelector(getInterviews);
    const { data: people } = usePeople();
    const { project: currentProject, projectId } = useProject();
    const dispatch = useDispatch();
    const [showPermissions, setShowPermissions] = useState(false);
    const hasPermissions =
        interviewPermissions && Object.keys(interviewPermissions).length > 0;

    // Load interview data for all interviews that have permissions
    // TODO: Instead of fetching here, use a centralized data loading mechanism
    useEffect(() => {
        if (hasPermissions) {
            interviewPermissions.forEach((permission) => {
                // Only load if not already loaded
                if (!interviews?.[permission.archive_id]) {
                    dispatch(
                        fetchData(
                            { projectId, locale, project: currentProject },
                            'interviews',
                            permission.archive_id
                        )
                    );
                }
            });
        }
    }, [
        hasPermissions,
        interviewPermissions,
        interviews,
        dispatch,
        projectId,
        locale,
        currentProject,
    ]);

    if (!hasPermissions) {
        return null;
    }

    // Helper function to get interviewee name for an interview
    const getIntervieweeName = (interview) => {
        if (!interview) return null;

        // Get the interviewee from the people data using display_name
        if (people && interview.interviewee_id) {
            const interviewee = people[interview.interviewee_id];
            if (interviewee?.display_name) {
                return interviewee.display_name;
            }
        }

        // Fallback to interview's title if interviewee not found in people data
        if (interview.short_title?.[locale]) {
            return interview.short_title[locale];
        }

        // Fallback to anonymous title if available
        if (interview.anonymous_title?.[locale]) {
            return interview.anonymous_title[locale];
        }

        return null;
    };

    return (
        <div className="interview_permissions">
            <h4 className="title">
                {t('activerecord.models.interview_permission.other')}
                <button
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
                    {interviewPermissions
                        ?.sort((a, b) =>
                            a.archive_id.localeCompare(
                                b.archive_id,
                                undefined,
                                { numeric: true }
                            )
                        )
                        .map((permission, index) => {
                            // Find the corresponding interview using the archive_id
                            const interview = interviews
                                ? interviews[permission.archive_id]
                                : null;
                            const intervieweeName =
                                getIntervieweeName(interview);

                            return (
                                <li
                                    key={`interview-permission-${index}`}
                                    className="DetailList-item"
                                >
                                    <LinkOrA
                                        project={project}
                                        to={`interviews/${permission.archive_id}`}
                                    >
                                        {intervieweeName ? (
                                            <span>
                                                {intervieweeName} (
                                                {permission.archive_id})
                                            </span>
                                        ) : (
                                            permission.archive_id
                                        )}
                                    </LinkOrA>
                                </li>
                            );
                        })}
                </ul>
            ) : null}
        </div>
    );
}

UserProjectInterviewPermissions.propTypes = {
    interviewPermissions: PropTypes.object,
    project: PropTypes.object.isRequired,
};

export default UserProjectInterviewPermissions;
