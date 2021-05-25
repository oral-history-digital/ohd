import React from 'react';
import { useSelector } from 'react-redux';

import { ProjectShow, getProjects } from 'modules/data';
import { ContentField } from 'modules/forms'
import { useI18n } from 'modules/i18n';

function UserProject({
    userRegistrationProject
}) {
    const projects = useSelector(getProjects);
    const { t } = useI18n();

    return (
        <ProjectShow data={projects[userRegistrationProject.project_id]} >
            <p>
                <ContentField label={t('activerecord.attributes.user_registration.activated_at')} value={userRegistrationProject.activated_at} />
            </p>
        </ProjectShow>
    )
}

export default UserProject;
