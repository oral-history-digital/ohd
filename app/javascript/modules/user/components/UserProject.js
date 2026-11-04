import { useState } from 'react';

import { ProjectShow, useProjectDetail } from 'modules/data';
import { ContentField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import UserProjectInterviewPermissions from './UserProjectInterviewPermissions';
import UserProjectRoles from './UserProjectRoles';
import UserTasks from './UserTasks';

/**
 * Loads a project's display data and shows the account's access status and roles.
 * Unavailable or denied projects stay hidden, as they do while loading.
 *
 * @param {Object} props - Account information for this project.
 * @param {Object} props.userProject - Project access record, including project_id and status dates.
 * @param {Object[]} [props.roles] - Project roles.
 * @param {Object[]} [props.interviewPermissions] - Interview permissions in this project.
 * @param {Object[]} [props.tasks] - Assigned tasks.
 * @param {Object[]} [props.supervisedTasks] - Supervised tasks.
 * @returns {?React.ReactElement} Project access row when the project is available.
 */
export default function UserProject({
    userProject,
    roles,
    interviewPermissions,
    tasks,
    supervisedTasks,
}) {
    const { t, locale } = useI18n();
    const { project } = useProjectDetail(userProject.project_id);
    const [showProject, setShowProject] = useState(false);

    const hasData = (obj) => obj && Object.keys(obj).length > 0;
    const hasContent =
        hasData(roles) ||
        hasData(interviewPermissions) ||
        hasData(tasks) ||
        hasData(supervisedTasks);

    return project ? (
        <ProjectShow data={project} hideLogo>
            {hasContent && (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={() => setShowProject((prev) => !prev)}
                >
                    {showProject ? (
                        <FaAngleUp className="Icon Icon--primary" />
                    ) : (
                        <FaAngleDown className="Icon Icon--primary" />
                    )}
                </button>
            )}
            <ContentField
                label={t(
                    `workflow_states.user_projects.${userProject.workflow_state}`
                )}
                value={new Date(
                    userProject.processed_at || userProject.created_at
                ).toLocaleDateString(locale, { dateStyle: 'medium' })}
            />
            {showProject ? (
                <>
                    <UserProjectRoles roles={roles} />
                    <UserProjectInterviewPermissions
                        interviewPermissions={interviewPermissions}
                        project={project}
                    />
                    <UserTasks
                        tasks={tasks}
                        supervisedTasks={supervisedTasks}
                    />
                </>
            ) : null}
        </ProjectShow>
    ) : null;
}

UserProject.propTypes = {
    userProject: PropTypes.object.isRequired,
    roles: PropTypes.array,
    interviewPermissions: PropTypes.array,
    tasks: PropTypes.array,
    supervisedTasks: PropTypes.array,
};
