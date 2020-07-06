import React from 'react';
import { admin } from '../../../lib/utils';

export default class AuthShow extends React.Component {

    content() {
        if (this.props.isLoggedIn && this.props.editView && this.props.ifAdmin && admin(this.props, this.props.obj)) {
            // admin
            return this.props.children;
        } else if (
            // logged in and registered for the current project
            (this.props.isLoggedIn && this.props.ifLoggedIn && this.props.account.project_ids.indexOf(this.props.projectId) > -1 ) ||
            (this.props.project.isCatalog && this.props.ifCatalog)
            )
        {
            return this.props.children;
        } else if (
            // logged out or still not registered for a project
            (
                !this.props.isLoggedIn ||
                (this.props.isLoggedIn && this.props.account.project_ids.indexOf(this.props.projectId) === -1)
            ) &&
            this.props.ifLoggedOut
        ) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}

