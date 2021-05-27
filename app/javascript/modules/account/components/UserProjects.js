import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import groupBy from 'lodash.groupby';

import UserProject from './UserProject';
import { getCurrentProject, getCurrentAccount } from 'modules/data';

function UserProjects() {

    const account = useSelector(getCurrentAccount);
    const currentProject = useSelector(getCurrentProject);
    const currentUserRegistrationProject = Object.values(account.user_registration_projects).find(urp => urp.project_id === currentProject?.id);

    const roles = account?.user_roles && Object.values(account.user_roles);
    const groupedRoles = groupBy(roles, 'project_id');

    const tasks = account?.tasks && Object.values(account.tasks);
    const groupedTasks = groupBy(tasks, 'project_id');

    const supervisedTasks = account?.supervisedTasks && Object.values(account.supervised_tasks);
    const groupedSupervisedTasks = groupBy(supervisedTasks, 'project_id');

    return (
        <>
            {
                currentProject &&
                <UserProject
                    key={currentProject.id}
                    userRegistrationProject={currentUserRegistrationProject}
                    roles={groupedRoles[currentProject.id]}
                    tasks={groupedTasks[currentProject.id]}
                    supervisedTasks={groupedSupervisedTasks[currentProject.id]}
                />
            }
            {
                Object.values(account.user_registration_projects).map(urp => {
                    if (urp.project_id !== currentProject?.id) {
                        return (
                            <UserProject
                                key={urp.id}
                                userRegistrationProject={urp}
                                roles={groupedRoles[urp.project_id]}
                                tasks={groupedTasks[urp.project_id]}
                                supervisedTasks={groupedSupervisedTasks[urp.project_id]}
                            />
                        )
                    }
                })
            }
        </>
    )
}

export default UserProjects;
