import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { getCurrentUser, ProjectShow, getProjects } from 'modules/data';
import { ContentField } from 'modules/forms'
import { LinkOrA } from 'modules/routes';
import { UserRoles } from 'modules/roles';
import UserTasks from './UserTasks';
import { useI18n } from 'modules/i18n';

export default function UserProject({
    userProject,
    roles,
    interviewPermissions,
    tasks,
    supervisedTasks
}) {
    const { t, locale } = useI18n();
    const user = useSelector(getCurrentUser);
    const projects = useSelector(getProjects);
    const [showProject, setShowProject] = useState(false);
    const [showRoles, setShowRoles] = useState(false);
    const [showinterviewPermissions, setShowinterviewPermissions] = useState(false);

    const project = projects[userProject?.project_id];

    return (
        project ?
            <ProjectShow data={project} hideLogo>
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={() => setShowProject(prev => !prev)}
                >
                    {
                        showProject ?
                            <FaAngleUp className="Icon Icon--primary" /> :
                            <FaAngleDown className="Icon Icon--primary" />
                    }
                </button>
                <ContentField
                    label={t(`workflow_states.user_projects.${userProject.workflow_state}`)}
                    value={new Date(userProject.processed_at || userProject.created_at).toLocaleDateString(locale, { dateStyle: 'medium' })}
                />
                {
                    showProject ?
                    <>
                        <p>
                            <div className="roles box">

                                <h4 className='title'>
                                    {t('activerecord.models.role.other')}
                                    <button
                                        type="button"
                                        className="Button Button--transparent Button--icon"
                                        onClick={() => setShowRoles(prev => !prev)}
                                    >
                                        {
                                            showRoles ?
                                                <FaAngleUp className="Icon Icon--primary" /> :
                                                <FaAngleDown className="Icon Icon--primary" />
                                        }
                                    </button>
                                </h4>
                                {
                                    showRoles ?
                                    <UserRoles
                                        userRoles={roles || {}}
                                        userId={user.id}
                                        hideEdit={true}
                                        hideAdd={true}
                                    /> : null
                                }
                            </div>
                        </p>
                        <p>
                            <div className="interview_permissions box">

                                <h4 className='title'>
                                    {t('activerecord.models.interview_permission.other')}
                                    <button
                                        type="button"
                                        className="Button Button--transparent Button--icon"
                                        onClick={() => setShowinterviewPermissions(prev => !prev)}
                                    >
                                        {
                                            showinterviewPermissions ?
                                                <FaAngleUp className="Icon Icon--primary" /> :
                                                <FaAngleDown className="Icon Icon--primary" />
                                        }
                                    </button>
                                </h4>
                                {
                                    showinterviewPermissions ?
                                    <ul className="DetailList">
                                        {
                                            interviewPermissions?.sort((a,b) =>
                                                a.name[locale].localeCompare(b.name[locale], undefined, { numeric: true })
                                            ).
                                            map((permission, index) => (
                                                <li key={`interview-permission-${index}`} className="DetailList-item">
                                                    <LinkOrA
                                                        project={project}
                                                        to={`interviews/${permission.archive_id}`}
                                                    >
                                                        {`${permission.archive_id}, ${permission.name[locale]}`}
                                                    </LinkOrA>
                                                </li>
                                            ))
                                        }
                                    </ul> : null
                                }
                            </div>
                        </p>
                        <p>
                            <div className="tasks box">
                                <h4 className='title'>{t('activerecord.models.task.other')}</h4>
                                <UserTasks
                                    tasks={tasks || {}}
                                    supervisedTasks={supervisedTasks || {}}
                                />
                            </div>
                        </p>
                    </> : null
                }
            </ProjectShow> :
            null
    )
}

UserProject.propTypes = {
    userProject: PropTypes.object.isRequired,
    roles: PropTypes.array,
    interviewPermissions: PropTypes.array,
    tasks: PropTypes.array,
    supervisedTasks: PropTypes.array,
};
