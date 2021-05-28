import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getCurrentAccount, ProjectShow, getProjects } from 'modules/data';
import { ContentField } from 'modules/forms'
import { UserRolesContainer } from 'modules/roles';
import UserTasks from './UserTasks';
import { useI18n } from 'modules/i18n';

function UserProject({
    userRegistrationProject,
    roles,
    tasks,
    supervisedTasks
}) {
    const account = useSelector(getCurrentAccount);
    const projects = useSelector(getProjects);
    const { t } = useI18n();
    const [showProject, setShowProject] = useState(false);
    const [showRoles, setShowRoles] = useState(false);

    const projectId = userRegistrationProject.project_id;

    return (
        <ProjectShow data={projects[projectId]} >
            <i className={`fa fa-angle-${showProject ? 'up' : 'down'}`} onClick={() => setShowProject(!showProject)}></i>
            <ContentField label={t('activerecord.attributes.user_registration.activated_at')} value={userRegistrationProject.activated_at} />
            {
                showProject ?
                <>
                    <p>
                        <div className={'roles box'}>
                            <h4 className='title' onClick={() => setShowRoles(!showRoles)} >
                                {t('activerecord.models.role.other')}
                                <i className={`fa fa-angle-${showRoles ? 'up' : 'down'}`}></i>
                            </h4>
                            {
                                showRoles ?
                                <UserRolesContainer
                                    userRoles={roles || {}}
                                    userAccountId={account.id}
                                    hideEdit={true}
                                    hideAdd={true}
                                /> : null
                            }
                        </div>
                    </p>
                    <p>
                        <div className={'tasks box'}>
                            <h4 className='title'>{t('activerecord.models.task.other')}</h4>
                            <UserTasks
                                tasks={tasks || {}}
                                supervisedTasks={supervisedTasks || {}}
                            />
                        </div>
                    </p>
                </> : null
            }
        </ProjectShow>
    )
}

export default UserProject;
