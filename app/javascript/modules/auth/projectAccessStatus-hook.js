import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';

export function useProjectAccessStatus(project) {
    const user = useSelector(getCurrentUser);

    const projectRegistration = user && project &&
        Object.values(user.user_projects).find(urp => urp.project_id === project.id);
    const projectAccessStatus = (project?.grant_project_access_instantly || project.grant_access_without_login) ?
        'project_access_granted' : projectRegistration?.workflow_state;

    return {
        projectAccessGranted: user?.admin || projectAccessStatus === 'project_access_granted',
        projectAccessStatus: projectAccessStatus,
    };
}
