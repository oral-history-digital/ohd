import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';

import { useAuthorization } from './authorization-hook';

export default function AuthShow({
    isLoggedIn,
    ifLoggedIn,
    ifLoggedOut,
    ifNoProject,
    ifCatalog,
    user,
    interview,
    isCatalog,
    children,
}) {
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const isRestricted = interview?.workflow_state === 'restricted';
    const hasPermission =
        isAuthorized(interview, 'show') ||
        user?.interview_permissions?.some(
            (perm) => perm.interview_id === interview?.id
        );

    if (
        // logged in and registered for the current project
        //(isLoggedIn && ifLoggedIn) ||
        (((isRestricted && hasPermission) || !isRestricted) &&
            isLoggedIn &&
            ifLoggedIn &&
            user &&
            (user.admin ||
                project.grant_access_without_login ||
                project?.grant_project_access_instantly ||
                Object.values(user.user_projects).find(
                    (urp) =>
                        urp.project_id === project?.id &&
                        urp.workflow_state === 'project_access_granted'
                ))) ||
        // catalog-project
        (ifCatalog && isCatalog)
    ) {
        return children;
    } else if (
        // logged out
        (!isLoggedIn && ifLoggedOut) ||
        // logged in and NOT registered for the current project
        (isLoggedIn &&
            ifNoProject &&
            user &&
            !user.admin &&
            !project?.grant_project_access_instantly &&
            !project.grant_access_without_login &&
            !Object.values(user.user_projects).find(
                (urp) =>
                    urp.project_id === project?.id &&
                    urp.workflow_state === 'project_access_granted'
            )) ||
        (isLoggedIn && ifLoggedOut && isRestricted && !hasPermission)
    ) {
        // logged out or still not registered for a project
        return children;
    } else {
        return null;
    }
}

AuthShow.propTypes = {
    isLoggedIn: PropTypes.bool,
    ifLoggedIn: PropTypes.bool,
    ifLoggedOut: PropTypes.bool,
    ifNoProject: PropTypes.bool,
    ifCatalog: PropTypes.bool,
    user: PropTypes.object,
    isCatalog: PropTypes.bool.isRequired,
    children: PropTypes.node,
};
