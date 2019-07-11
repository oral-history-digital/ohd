import React from 'react';

export default class AuthShow extends React.Component {

    componentDidMount() {
        if (
            !this.props.accountsStatus.current 
        ) {
            this.loadAccount()
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.authStatus.isLoggedIn && this.props.authStatus.isLoggedIn) {
            this.loadAccount();
        }
    }

    loadAccount() {
        this.props.fetchData('accounts', 'current');
    }

    content() {
        if (!this.props.authStatus.isLoggedOut && this.props.account.email && !this.props.account.error && this.props.ifLoggedIn) {
            return this.props.children;
        } else if (!this.props.authStatus.isLoggedOut && this.props.account.email && this.props.account.admin && this.props.editView  && this.props.ifAdmin) {
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

