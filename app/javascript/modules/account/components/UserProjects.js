import React from 'react';
import { useSelector } from 'react-redux';

import UserProject from './UserProject';
import { getCurrentProject, getCurrentAccount } from 'modules/data';

function UserProjects() {
    const account = useSelector(getCurrentAccount);
    const currentProject = useSelector(getCurrentProject);
    const currentUserRegistrationProject = Object.values(account.user_registration_projects).find(urp => urp.project_id === currentProject?.id);

    return (
        <>
            {
                currentProject &&
                <UserProject userRegistrationProject={currentUserRegistrationProject} />
            }
            {
                Object.values(account.user_registration_projects).map(urp => {
                    if (urp.project_id !== currentProject?.id) {
                        return (
                            <UserProject userRegistrationProject={urp} />
                        )
                    }
                })
            }
        </>
    )
}

export default UserProjects;
