import { useEffect } from 'react';

import groupBy from 'lodash.groupby';
import {
    fetchData,
    getCurrentProject,
    getCurrentUser,
    getProjects,
    getProjectsStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import UserProject from './UserProject';

function UserProjects() {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const user = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const projectsStatus = useSelector(getProjectsStatus);
    const userProjects = Object.values(user?.user_projects || {});

    const currentUserProject = userProjects.find(
        (urp) => urp.project_id === currentProject?.id
    );

    // TODO: Remove this component-level fetch once project loading is unified.
    // On non-OHD reloads, Redux often starts with only current project + OHD.
    // UserProject needs projects[userProject.project_id], so we hydrate missing
    // projects referenced by user.user_projects here as a temporary bridge.
    useEffect(() => {
        if (!currentProject) {
            return;
        }

        userProjects.forEach((userProject) => {
            const projectId = userProject?.project_id;

            if (
                projectId &&
                !projects[projectId] &&
                // Prevent duplicate requests while the same project is in flight.
                !/^fetching/.test(projectsStatus[projectId] || '')
            ) {
                dispatch(
                    fetchData(
                        { locale, project: currentProject },
                        'projects',
                        projectId
                    )
                );
            }
        });
    }, [
        currentProject,
        dispatch,
        locale,
        projects,
        projectsStatus,
        userProjects,
    ]);

    const roles = user?.user_roles && Object.values(user.user_roles);
    const groupedRoles = groupBy(roles, 'project_id');

    const interviewPermissions =
        user?.interview_permissions &&
        Object.values(user.interview_permissions);
    const groupedInterviewPermissions = groupBy(
        interviewPermissions,
        'project_id'
    );

    const tasks = user?.tasks && Object.values(user.tasks);
    const groupedTasks = groupBy(tasks, 'project_id');

    const supervisedTasks =
        user?.supervisedTasks && Object.values(user.supervised_tasks);
    const groupedSupervisedTasks = groupBy(supervisedTasks, 'project_id');

    return (
        <>
            {/* Show current project first for stable ordering on account page. */}
            {currentProject && currentUserProject && (
                <UserProject
                    key={currentProject.id}
                    userProject={currentUserProject}
                    roles={groupedRoles[currentProject.id]}
                    interviewPermissions={
                        groupedInterviewPermissions[currentProject.id]
                    }
                    tasks={groupedTasks[currentProject.id]}
                    supervisedTasks={groupedSupervisedTasks[currentProject.id]}
                />
            )}
            {/* Render remaining project memberships after the current project. */}
            {userProjects.map((urp) => {
                if (urp.project_id !== currentProject?.id) {
                    return (
                        <UserProject
                            key={urp.id}
                            userProject={urp}
                            roles={groupedRoles[urp.project_id]}
                            interviewPermissions={
                                groupedInterviewPermissions[urp.project_id]
                            }
                            tasks={groupedTasks[urp.project_id]}
                            supervisedTasks={
                                groupedSupervisedTasks[urp.project_id]
                            }
                        />
                    );
                }
            })}
        </>
    );
}

export default UserProjects;
