import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { getCurrentUser, ProjectShow, getProjects } from 'modules/data';
import { ContentField } from 'modules/forms'
import { UserRolesContainer } from 'modules/roles';
import UserTasks from './UserTasks';
import { useI18n } from 'modules/i18n';

export default function UserProject({
    userProject,
    roles,
    tasks,
    supervisedTasks
}) {
    const { t } = useI18n();
    const user = useSelector(getCurrentUser);
    const projects = useSelector(getProjects);
    const [showProject, setShowProject] = useState(false);
    const [showRoles, setShowRoles] = useState(false);

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
                <ContentField label={t(`workflow_states.user_projects.${userProject.workflow_state}`)} value={userProject.processed_at} />
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
                                    <UserRolesContainer
                                        userRoles={roles || {}}
                                        userAccountId={user.id}
                                        hideEdit={true}
                                        hideAdd={true}
                                    /> : null
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
    roles: PropTypes.object,
    tasks: PropTypes.object,
    supervisedTasks: PropTypes.object,
};
