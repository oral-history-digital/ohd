import React from 'react';

import LoginFormContainer from '../containers/LoginFormContainer'
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer'
import {Link, hashHistory} from 'react-router-dom';

import { t } from '../../../lib/utils';

export default class Account extends React.Component {

    componentDidMount() {
        if (!this.props.account.email) {
            this.props.fetchAccount()
        }
    }

    info() {
        if (this.props.account.email) {
            return <div className='info'>
                {`${t(this.props, 'logged_in_as')} ${this.props.account.firstName} ${this.props.account.lastName}`}
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
                <div className={'register-link'}>
                    <Link to={'/' + this.props.locale + '/user_registrations/new'}>
                        {t(this.props, 'user_registration.registration')}
                    </Link>
                </div>
                <div className={'order-new-password-link'}>
                    <Link to={'/' + this.props.locale + '/user_accounts/password/new'}>
                        {t(this.props, 'order_new_password')}
                    </Link>
                </div>
            </div>
        }
    }

    render() {
        return (
            <div className={'flyout-login-container'}>
                <h2>{t(this.props, 'login_page')}</h2>
                {this.info()}
                {this.loginOrOut()}
            </div>
        );
    }
}
