import React from 'react';
import PropTypes from 'prop-types';
import LoginFormContainer from '../containers/LoginFormContainer'
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer'
import {Link} from 'react-router-dom';

import { t } from '../../../lib/utils';

export default class Account extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

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

    loggedIn() {
        return this.props.authStatus.isLoggedIn && this.props.account.email;
    }

    info() {
        if (this.loggedIn()){
        //if (this.props.authStatus.isLoggedIn &&!this.props.authStatus.error) {
            return <div className='info'>
                {`${t(this.props, 'logged_in_as')} ${this.props.account.first_name} ${this.props.account.last_name}`}
            </div>
        } else if (this.props.authStatus.error) {
            return <div className='error' dangerouslySetInnerHTML={{__html: t(this.props, this.props.authStatus.error)}}/>
                
        } else {
            return null
        }
    }

    openLink(path, e) {
        e.preventDefault();
        this.context.router.history.push(path);
        if(window.getComputedStyle(document.body, ':after').getPropertyValue('content').includes('S')) {
            this.props.hideFlyoutTabs();
        }
    }

    loginOrOut() {
        if (this.loggedIn()){
            return (
                <div>
                    {this.changeToEditView()}
                    <div
                        className='logout'
                        onClick={() => this.props.submitLogout()}
                    >
                        {t(this.props, 'logout')}
                    </div>
                </div>
            )
        } else {
            return <div>
                <p>
                    {this.props.authStatus.error ? '' : t(this.props, 'registration_needed')}
                </p>
                <LoginFormContainer/>
                <div className={'register-link'}>
                    <a href='' onClick={(e) => this.openLink('/' + this.props.locale + '/user_registrations/new', e)}>
                        {t(this.props, 'user_registration.registration')}
                    </a>
                </div>
                <div className={'order-new-password-link'}>
                    <a href='' onClick={(e) => this.openLink('/' + this.props.locale + '/user_accounts/password/new', e)}>
                        {t(this.props, 'forget_password')}
                    </a>
                </div>
            </div>
        }
    }

    changeToEditView() {
        if (this.props.account.admin || 
            (this.props.account.permissions && this.props.account.permissions.length > 0) || 
            (this.props.account.tasks && this.props.account.tasks.length > 0)
        ){
            return (
                <div className="switch switch-light" onClick={() => this.props.changeToEditView(!this.props.editView)}>
                    <span className={`switch-input ${this.props.editView ? 'checked' : ''}`} type="checkbox" />
                    <span className="switch-label" data-on={t(this.props, 'admin.change_to_edit_view')} data-off={t(this.props, 'admin.change_to_edit_view')}></span> 
                    <span className="switch-handle"></span> 
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={'flyout-login-container'}>
                {this.info()}
                {this.loginOrOut()}
            </div>
        );
    }
}
