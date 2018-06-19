import React from 'react';

export default class AuthShow extends React.Component {

    componentDidMount() {
        if (!this.props.account.email && !this.props.account.isFetchingAccount) {
            this.props.fetchAccount()
        }
    }

    content() {
        if (this.props.account.email && this.props.ifLoggedIn) {
            return this.props.children;
        } else if (this.props.account.email && this.props.account.admin && this.props.editView  && this.props.ifAdmin) {
            return this.props.children;
        } else if (!this.props.account.email && this.props.ifLoggedOut) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return <div>{this.content()}</div>;
    }
}

