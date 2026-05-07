import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';

import { useAuthorization } from './authorization-hook';

/**
 * Conditionally renders children based on authentication state, project access,
 * catalog mode, and restricted-interview permission checks.
 *
 * @param {Object} props
 * @param {boolean} props.isLoggedIn Real auth state from account/session store.
 * @param {boolean} props.ifLoggedIn Enables the "logged-in access" branch.
 * This branch still requires project-level access conditions (admin, project
 * grant flags, or granted user_project access) and restricted interview
 * permission when applicable.
 * @param {boolean} props.ifLoggedOut Enables the "logged-out" branch. In
 * current logic this also allows rendering for logged-in users on restricted
 * interviews when they do not have permission.
 * @param {boolean} props.ifNoProject Enables rendering for logged-in users who
 * are not admins and do not currently have project access.
 * @param {boolean} props.ifCatalog Enables rendering for catalog projects.
 * @param {Object|null} props.user Current user object used for project and
 * interview permission checks.
 * @param {Object|null} props.interview Optional interview context used for
 * restricted visibility checks.
 * @param {import('react').ReactNode} props.children Content to render when any
 * enabled branch conditions pass.
 * @returns {import('react').ReactNode|null}
 */
export default function AuthShow({
    isLoggedIn,
    ifLoggedIn,
    ifLoggedOut,
    ifNoProject,
    ifCatalog,
    user,
    interview,
    children,
}) {
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const isInterviewRestricted = interview?.workflow_state === 'restricted';
    const isCatalogProject = project?.is_catalog_project;
    const canViewInterview =
        isAuthorized(interview, 'show') ||
        user?.interview_permissions?.some(
            (perm) => perm.interview_id === interview?.id
        );
    const hasGrantedProjectAccess = Object.values(
        user?.user_projects || {}
    ).find(
        (userProject) =>
            userProject?.project_id === project?.id &&
            userProject?.workflow_state === 'project_access_granted'
    );

    if (
        // logged in and registered for the current project
        (((isInterviewRestricted && canViewInterview) ||
            !isInterviewRestricted) &&
            isLoggedIn &&
            ifLoggedIn &&
            user &&
            (user.admin ||
                project?.grant_access_without_login ||
                project?.grant_project_access_instantly ||
                hasGrantedProjectAccess)) ||
        // catalog-project
        (ifCatalog && isCatalogProject)
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
            !project?.grant_access_without_login &&
            !hasGrantedProjectAccess) ||
        (isLoggedIn &&
            ifLoggedOut &&
            isInterviewRestricted &&
            !canViewInterview)
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
    interview: PropTypes.object,
    children: PropTypes.node,
};
