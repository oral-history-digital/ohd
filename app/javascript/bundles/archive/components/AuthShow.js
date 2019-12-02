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
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            this.loadAccount();
        }
    }

    loadAccount() {
        this.props.fetchData(this.props, 'accounts', 'current');
    }

    content() {
        if (this.props.isLoggedIn && this.props.ifLoggedIn) {
            return this.props.children;
        } else if (this.props.isLoggedIn && this.props.editView && this.props.ifAdmin) {
            return this.props.children;
        } else if (!this.props.isLoggedIn && this.props.ifLoggedOut) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        return <div>{this.content()}</div>;
    }
}

