import PropTypes from 'prop-types';

export default function AuthShow({
    isLoggedIn,
    ifLoggedIn,
    ifLoggedOut,
    ifNoProject,
    ifCatalog,
    project,
    user,
    isCatalog,
    children,
}) {
    if (
        // logged in and registered for the current project
        //(isLoggedIn && ifLoggedIn) ||
        (
            isLoggedIn && ifLoggedIn && user && (
                user.admin ||
                Object.values(user.user_projects).find(urp => urp.project_id === project?.id && urp.activated_at !== null)
            )
        ) ||
        // catalog-project
        (ifCatalog && isCatalog)
    ) {
        return children;
    } else if (
        // logged out
        (!isLoggedIn && ifLoggedOut) ||
        // logged in and NOT registered for the current project
        (
            isLoggedIn && ifNoProject && user && !user.admin &&
            !Object.values(user.user_projects).find(urp => urp.project_id === project?.id && urp.activated_at !== null)
        )
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
    project: PropTypes.object,
    user: PropTypes.object,
    isCatalog: PropTypes.bool.isRequired,
    children: PropTypes.node,
};
