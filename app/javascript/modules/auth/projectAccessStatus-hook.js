import { useSelector } from 'react-redux';

import { getCurrentProject, getCurrentAccount } from 'modules/data';

export function useProjectAccessStatus() {
    const account = useSelector(getCurrentAccount);
    const project = useSelector(getCurrentProject);

    const projectRegistration = account && Object.values(account.user_registration_projects).find(urp => urp.project_id === project.id);
    const projectAccessStatus = projectRegistration?.workflow_state;

    return { 
        projectAccessGranted: projectAccessStatus === 'project_access_granted',
        projectAccessStatus: projectAccessStatus,
    };
}
