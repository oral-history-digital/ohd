import React from 'react';
import { admin } from '../../../lib/utils';

export default class AuthShow extends React.Component {

    content() {
        if (this.props.isLoggedIn && this.props.editView && this.props.ifAdmin && admin(this.props, this.props.obj)) {
            return this.props.children;
        } else if (this.props.isLoggedIn && this.props.ifLoggedIn) {
            return this.props.children;
        } else if (!this.props.isLoggedIn && this.props.ifLoggedOut) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}

