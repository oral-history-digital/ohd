import { getCurrentUser, getProjects, ProjectShow } from 'modules/data';
import { ContentField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { UserRoles } from 'modules/roles';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import UserTasks from './UserTasks';

export default function UserProject({
    userProject,
    roles,
    interviewPermissions,
    tasks,
    supervisedTasks,
}) {
    const { t, locale } = useI18n();
    const user = useSelector(getCurrentUser);
    const projects = useSelector(getProjects);
    const [showProject, setShowProject] = useState(false);
    const [showRoles, setShowRoles] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);

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
                    {hasRoles && (
                        <div className="roles">
                            <h4 className="title">
                                {t('activerecord.models.role.other')}
                                <button
                                    type="button"
                                    className="Button Button--transparent Button--icon"
                                    onClick={() =>
                                        setShowRoles((prev) => !prev)
                                    }
                                >
                                    {showRoles ? (
                                        <FaAngleUp className="Icon Icon--primary" />
                                    ) : (
                                        <FaAngleDown className="Icon Icon--primary" />
                                    )}
                                </button>
                            </h4>
                            {showRoles ? (
                                <UserRoles
                                    userRoles={roles}
                                    userId={user.id}
                                    hideEdit={true}
                                    hideAdd={true}
                                />
                            ) : null}
                        </div>
                    )}
                    {hasPermissions && (
                        <div className="interview_permissions">
                            <h4 className="title">
                                {t(
                                    'activerecord.models.interview_permission.other'
                                )}
                                <button
                                    type="button"
                                    className="Button Button--transparent Button--icon"
                                    onClick={() =>
                                        setShowPermissions((prev) => !prev)
                                    }
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
                                            a.name[locale].localeCompare(
                                                b.name[locale],
                                                undefined,
                                                { numeric: true }
                                            )
                                        )
                                        .map((permission, index) => (
                                            <li
                                                key={`interview-permission-${index}`}
                                                className="DetailList-item"
                                            >
                                                <LinkOrA
                                                    project={project}
                                                    to={`interviews/${permission.archive_id}`}
                                                >
                                                    {`${permission.archive_id}, ${permission.name[locale]}`}
                                                </LinkOrA>
                                            </li>
                                        ))}
                                </ul>
                            ) : null}
                        </div>
                    )}
                    {(hasTasks || hasSupervisedTasks) && (
                        <UserTasks
                            tasks={tasks || {}}
                            supervisedTasks={supervisedTasks || {}}
                        />
                    )}
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
