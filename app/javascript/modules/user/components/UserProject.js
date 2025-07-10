import { getProjects, ProjectShow } from 'modules/data';
import { ContentField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import UserProjectInterviewPermissions from './UserProjectInterviewPermissions';
import UserProjectRoles from './UserProjectRoles';
import UserTasks from './UserTasks';

export default function UserProject({
    userProject,
    roles,
    interviewPermissions,
    tasks,
    supervisedTasks,
}) {
    const { t, locale } = useI18n();
    const projects = useSelector(getProjects);
    const [showProject, setShowProject] = useState(false);

    const project = projects[userProject?.project_id];

    const hasRoles = roles && Object.keys(roles).length > 0;
    const hasPermissions =
        interviewPermissions && Object.keys(interviewPermissions).length > 0;
    const hasTasks = tasks && Object.keys(tasks).length > 0;
    const hasSupervisedTasks =
        supervisedTasks && Object.keys(supervisedTasks).length > 0;

    const hasContent =
        hasRoles || hasPermissions || hasTasks || hasSupervisedTasks;

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
    roles: PropTypes.object,
    interviewPermissions: PropTypes.object,
    tasks: PropTypes.object,
    supervisedTasks: PropTypes.object,
};
