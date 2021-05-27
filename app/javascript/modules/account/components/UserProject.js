import React from 'react';
import { useSelector } from 'react-redux';

import { getCurrentAccount, ProjectShow, getProjects } from 'modules/data';
import { ContentField } from 'modules/forms'
import { UserRolesContainer } from 'modules/roles';
import { useI18n } from 'modules/i18n';

function UserProject({
    userRegistrationProject,
    roles
}) {
    const account = useSelector(getCurrentAccount);
    const projects = useSelector(getProjects);
    const { t } = useI18n();

    const projectId = userRegistrationProject.project_id;

    return (
        <ProjectShow data={projects[projectId]} >
            <p>
                <ContentField label={t('activerecord.attributes.user_registration.activated_at')} value={userRegistrationProject.activated_at} />

                <div className={'roles box'}>
                    <h3 className='title'>{t('activerecord.models.role.other')}</h3>
                    <UserRolesContainer
                        userRoles={roles || {}}
                        userAccountId={account.id}
                        hideEdit={true}
                        hideAdd={true}
                    />
                </div>

            </p>
        </ProjectShow>
    )
}

export default UserProject;
