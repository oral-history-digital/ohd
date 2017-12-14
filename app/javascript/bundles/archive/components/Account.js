import React from 'react';

import LoginFormContainer from '../containers/LoginFormContainer'
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer'
import {Link, hashHistory} from 'react-router-dom';


import ArchiveUtils from '../../../lib/utils';

import {
    REGISTER_NEW_URL,
    FORGOT_PASSWORD_URL,
} from '../constants/archiveConstants';

export default class Account extends React.Component {

    componentDidMount() {
        if (!this.props.account.email) {
            this.props.fetchAccount()
        }
    }

    info() {
        if (this.props.account.email) {
            return <div className='info'>
                {`logged in as ${this.props.account.firstName} ${this.props.account.lastName}`}
            </div>
        } else if (this.props.account.error) {
            return <div className='error'>
                {this.props.account.error}
            </div>
        } else {
            return null
        }
    }

    loginOrOut() {
        //if(this.props.account && this.props.account.isLoggedIn) {
        if (this.props.account.email) {
            return <div
                className='logout'
                onClick={() => this.props.submitLogout()}
            >
                Logout
            </div>
        } else {
            return <div>
                <LoginFormContainer/>
                {/*<div className={'register-link'}><a*/}
                    {/*href={FORGOT_PASSWORD_URL}>{ArchiveUtils.translate(this.props, 'forget_password_question')}</a>*/}
                {/*</div>*/}
                <div className={'register-link'}>
                    <Link
                        to={'/' + this.props.locale + '/user_registrations/new'}>
                        {ArchiveUtils.translate(this.props, 'registration')}
                    </Link>

                </div>
            </div>
        }
    }

    changePassword() {
        //if(this.props.account && this.props.account.isLoggedIn) {
        if (this.props.account.email) {
            return <ChangePasswordFormContainer/>
        } else {
            return null
        }
    }


    render() {
        return (
            <div className={'flyout-login-container'}>
                <h1>{ArchiveUtils.translate(this.props, 'login_page')}</h1>
                {this.info()}
                {this.loginOrOut()}
            </div>
        );
        //{this.changePassword()}
    }
}
