import PropTypes from 'prop-types';

export default function AuthShow({
    isLoggedIn,
    ifLoggedIn,
    ifLoggedOut,
    ifNoProject,
    ifCatalog,
    project,
    account,
    children,
}) {
    if (
        // logged in and registered for the current project
        //(isLoggedIn && ifLoggedIn) ||
        (
            isLoggedIn && ifLoggedIn && account &&
            Object.values(account.user_registration_projects).find(urp => urp.project_id === project?.id && urp.activated_at !== null)
        ) ||
        // catalog-project
        (ifCatalog && project.isCatalog)
    ) {
        return children;
    } else if (
        // logged out
        (!isLoggedIn && ifLoggedOut) ||
        // logged in and NOT registered for the current project
        (
            isLoggedIn && ifNoProject && account &&
            !Object.values(account.user_registration_projects).find(urp => urp.project_id === project?.id && urp.activated_at !== null)
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
    project: PropTypes.object.isRequired,
    account: PropTypes.object,
    children: PropTypes.node,
};
