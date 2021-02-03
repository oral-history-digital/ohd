import PropTypes from 'prop-types';

export default function AuthShow({
    isLoggedIn,
    ifLoggedIn,
    ifLoggedOut,
    ifNoProject,
    ifCatalog,
    projectId,
    project,
    account,
    children,
}) {
    if (
        // logged in and registered for the current project
        (isLoggedIn && ifLoggedIn && account && account.project_ids && account.project_ids.indexOf(projectId) > -1 ) ||
        // catalog-project
        (project.isCatalog && ifCatalog)
    ) {
        return children;
    } else if (
        // logged in and NOT registered for the current project
        (isLoggedIn && ifNoProject && account && account.project_ids && account.project_ids.indexOf(projectId) === -1 )
    ) {
        return children;
    } else if (
        // logged out
        (!isLoggedIn && ifLoggedOut) ||
        // logged in and NOT registered for the current project
        (isLoggedIn && ifNoProject && account && account.project_ids && account.project_ids.indexOf(projectId) === -1 )
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
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    account: PropTypes.object,
    children: PropTypes.node,
};
