import React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash.groupby';

import UserProject from './UserProject';
import { getCurrentProject, getCurrentAccount } from 'modules/data';

function UserProjects() {
    const account = useSelector(getCurrentAccount);
    const currentProject = useSelector(getCurrentProject);
    const currentUserRegistrationProject = Object.values(account.user_registration_projects).find(urp => urp.project_id === currentProject?.id);

    const roles = account?.user_roles && Object.values(account.user_roles);
    const groupedRoles = groupBy(roles, 'project_id');

    return (
        <>
            {
                currentProject &&
                <UserProject
                    userRegistrationProject={currentUserRegistrationProject}
                    roles={groupedRoles[currentProject.id]}
                />
            }
            {
                Object.values(account.user_registration_projects).map(urp => {
                    if (urp.project_id !== currentProject?.id) {
                        return (
                            <UserProject
                                userRegistrationProject={urp}
                                roles={groupedRoles[urp.project_id]}
                            />
                        )
                    }
                })
            }
        </>
    )
}

export default UserProjects;
