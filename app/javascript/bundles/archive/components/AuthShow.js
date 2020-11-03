import React from 'react';

export default class AuthShow extends React.Component {

    content() {
        if (
            // logged in and registered for the current project
            (this.props.isLoggedIn && this.props.ifLoggedIn && this.props.account && this.props.account.project_ids && this.props.account.project_ids.indexOf(this.props.projectId) > -1 ) ||
            // catalog-project
            (this.props.project.isCatalog && this.props.ifCatalog)
        ) {
            return this.props.children;
        } else if (
            // logged in and NOT registered for the current project
            (this.props.isLoggedIn && this.props.ifNoProject && this.props.account && this.props.account.project_ids && this.props.account.project_ids.indexOf(this.props.projectId) === -1 ) 
        ) {
            return this.props.children;
        } else if (
            // logged out
            (!this.props.isLoggedIn && this.props.ifLoggedOut) ||
            // logged in and NOT registered for the current project
            (this.props.isLoggedIn && this.props.ifNoProject && this.props.account && this.props.account.project_ids && this.props.account.project_ids.indexOf(this.props.projectId) === -1 )
        ) {
            // logged out or still not registered for a project
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}
