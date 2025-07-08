import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import groupBy from 'lodash.groupby';

import UserProject from './UserProject';
import { getCurrentProject, getCurrentUser } from 'modules/data';

function UserProjects() {

    const user = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);
    const currentUserProject = Object.values(user.user_projects).find(urp => urp.project_id === currentProject?.id);

    const roles = user?.user_roles && Object.values(user.user_roles);
    const groupedRoles = groupBy(roles, 'project_id');

    const interviewPermissions = user?.interview_permissions && Object.values(user.interview_permissions);
    const groupedInterviewPermissions= groupBy(interviewPermissions, 'project_id');

    const tasks = user?.tasks && Object.values(user.tasks);
    const groupedTasks = groupBy(tasks, 'project_id');

    const supervisedTasks = user?.supervisedTasks && Object.values(user.supervised_tasks);
    const groupedSupervisedTasks = groupBy(supervisedTasks, 'project_id');

    return (
        <>
            {
                currentProject && currentUserProject &&
                <UserProject
                    key={currentProject.id}
                    userProject={currentUserProject}
                    roles={groupedRoles[currentProject.id]}
                    interviewPermissions={groupedInterviewPermissions[currentProject.id]}
                    tasks={groupedTasks[currentProject.id]}
                    supervisedTasks={groupedSupervisedTasks[currentProject.id]}
                />
            }
            {
                Object.values(user.user_projects).map(urp => {
                    if (urp.project_id !== currentProject?.id) {
                        return (
                            <UserProject
                                key={urp.id}
                                userProject={urp}
                                roles={groupedRoles[urp.project_id]}
                                interviewPermissions={groupedInterviewPermissions[urp.project_id]}
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
