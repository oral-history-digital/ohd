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
        (isLoggedIn && ifLoggedIn && account?.project_ids.indexOf(project?.id) > -1 ) ||
        // catalog-project
        (ifCatalog && project.isCatalog)
    ) {
        return children;
    } else if (
        // logged out
        (!isLoggedIn && ifLoggedOut) ||
        // logged in and NOT registered for the current project
        (isLoggedIn && ifNoProject && account?.project_ids.indexOf(project?.id) === -1 )
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
