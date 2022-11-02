import { useSelector } from 'react-redux';

import { getCurrentAccount } from 'modules/data';

export function useProjectAccessStatus(project) {
    const account = useSelector(getCurrentAccount);

    const projectRegistration = account &&
        Object.values(account.user_registration_projects).find(urp => urp.project_id === project.id);
    const projectAccessStatus = projectRegistration?.workflow_state;

    return {
        projectAccessGranted: account?.admin || projectAccessStatus === 'project_access_granted',
        projectAccessStatus: projectAccessStatus,
    };
}
