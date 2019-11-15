import React from 'react';
import PropTypes from 'prop-types';
import AuthShowContainer from '../containers/AuthShowContainer'
import LoginFormContainer from '../containers/LoginFormContainer'
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer'
import {Link} from 'react-router-dom';

import { t, loggedIn, pathBase } from '../../../lib/utils';

export default class Account extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            editView: this.props.editViewCookie,
        }
        this.props.changeToEditView(this.props.editViewCookie)
    }

    componentDidMount() {
        this.loadAccount()
    }

    componentDidUpdate(prevProps, prevState) {
        this.loadAccount();
        if (prevProps.editView !== this.props.editView) {
            debugger;
            this.setState({editView: this.props.editView})
        }
    }

    loadAccount() {
        if (
            !this.props.accountsStatus.current ||
            this.props.accountsStatus.current.split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'accounts', 'current');
        }
    }

    openLink(path, e) {
        e.preventDefault();
        this.context.router.history.push(path);
        if(window.getComputedStyle(document.body, ':after').getPropertyValue('content').includes('S')) {
            this.props.hideFlyoutTabs();
        }
    }

    changeToEditView() {
        if (
            this.props.account && (
                this.props.account.admin || 
                (this.props.account.permissions && Object.keys(this.props.account.permissions).length > 0) || 
                (this.props.account.tasks && Object.keys(this.props.account.tasks).length > 0)
            )
        ){
            return (
                <div className="switch switch-light" onClick={() => this.props.changeToEditView(!this.state.editView)}>
                    <span className={`switch-input ${this.state.editView ? 'checked' : ''}`} type="checkbox" />
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
                <AuthShowContainer ifLoggedIn={true}>
                    <div className='info'>
                        {`${t(this.props, 'logged_in_as')} ${this.props.account && this.props.account.first_name} ${this.props.account && this.props.account.last_name}`}
                    </div>
                    {this.changeToEditView()}
                    <div
                        className='logout'
                        onClick={() => this.props.submitLogout(`${pathBase(this.props)}/user_accounts/sign_out`)}
                    >
                        {t(this.props, 'logout')}
                    </div>
                </AuthShowContainer>

                <div className='error' dangerouslySetInnerHTML={{__html: t(this.props, this.props.authStatus.error)}}/>

                <AuthShowContainer ifLoggedOut={true}>
                    <p>
                        {/* do not show t('registration_needed') in campscapes. TODO: generalize this*/}
                        {(this.props.authStatus.error || this.props.projectId === 'campscapes') ? '' : t(this.props, 'registration_needed')}
                    </p>
                    <LoginFormContainer/>
                    <div className={'register-link'}>
                        <a href='' onClick={(e) => this.openLink(pathBase(this.props) + '/user_registrations/new', e)}>
                            {t(this.props, 'user_registration.registration')}
                        </a>
                    </div>
                    <div className={'order-new-password-link'}>
                        <a href='' onClick={(e) => this.openLink(pathBase(this.props) + '/user_accounts/password/new', e)}>
                            {t(this.props, 'forget_password')}
                        </a>
                    </div>
                </AuthShowContainer>
            </div>
        )
    }

}
