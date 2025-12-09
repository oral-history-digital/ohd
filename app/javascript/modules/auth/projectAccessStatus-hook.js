import { getCurrentUser } from 'modules/data';
import { useSelector } from 'react-redux';

export function useProjectAccessStatus(project) {
    const user = useSelector(getCurrentUser);

    const projectRegistration =
        user &&
        project &&
        Object.values(user.user_projects).find(
            (urp) => urp.project_id === project.id
        );

    const projectAccessStatus = userHasAccessWithoutRegistration()
        ? 'project_access_granted'
        : projectRegistration?.workflow_state;

    function userHasAccessWithoutRegistration() {
        return (
            project.grant_access_without_login ||
            (user && project.grant_project_access_instantly) ||
            user?.admin === true
        );
    }

    return {
        projectAccessGranted: projectAccessStatus === 'project_access_granted',
        projectAccessStatus,
    };
}
