import React from 'react';

export default class AuthShow extends React.Component {

    content() {
        if (this.props.authStatus.isLoggedIn && this.props.account.email && !this.props.account.error && this.props.ifLoggedIn) {
            return this.props.children;
        } else if (this.props.authStatus.isLoggedIn && this.props.account.email && this.props.account.admin && this.props.editView  && this.props.ifAdmin) {
            return this.props.children;
        } else if ((this.props.authStatus.isLoggedOut || !this.props.account.email || this.props.account.error) && this.props.ifLoggedOut) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return <div>{this.content()}</div>;
    }
}

