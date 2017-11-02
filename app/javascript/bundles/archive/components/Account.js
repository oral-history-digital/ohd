import React from 'react';

import LoginFormContainer from '../containers/LoginFormContainer'
import RegisterFormContainer from '../containers/RegisterFormContainer'
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer'
import WrapperPageContainer from '../containers/WrapperPageContainer'

export default class Account extends React.Component {

    componentDidMount() {
        if(!this.props.account.email) {
            this.props.fetchAccount()
        }
    }

    info() {
        if(this.props.account.email) {
            return <div className='info'>
                       {`logged in as ${this.props.account.firstName} ${this.props.account.lastName}`}
                   </div>
        } else if(this.props.account.error) {
            return <div className='error'>
                       {this.props.account.error}
                   </div>
        } else {
            return null
        }
    }

    loginOrOut() {
        //if(this.props.account && this.props.account.isLoggedIn) {
        if(this.props.account.email) {
            return <div 
                       className='logout'
                       onClick={() => this.props.submitLogout()}
                   >
                       Logout
                   </div>
        } else {
            return <LoginFormContainer />
        }
    }

    changePassword() {
        //if(this.props.account && this.props.account.isLoggedIn) {
        if(this.props.account.email) {
            return <ChangePasswordFormContainer />
        } else {
            return null
        }
    }

    register() {
        //if(this.props.account && this.props.account.isLoggedIn) {
        if(this.props.account.email) {
            return null
        } else {
            return <RegisterFormContainer />
        }
    }

    render() {
        return (
            <WrapperPageContainer 
              tabIndex={1}
            >
                {this.info()}
                {this.loginOrOut()}
            </WrapperPageContainer>
        );
                //{this.changePassword()}
                //{this.register()}
    }
}
