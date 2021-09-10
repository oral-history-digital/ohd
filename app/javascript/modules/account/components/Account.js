import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { AuthShowContainer } from 'modules/auth';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import LoginFormContainer from './LoginFormContainer';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';

export default class Account extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = { editView: this.props.editViewCookie };
    }

    componentDidMount() {
        this.props.changeToEditView(this.props.editViewCookie)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.editView !== this.props.editView) {
            this.setState({editView: this.props.editView})
        }
    }

    openLink(path, e) {
        e.preventDefault();
        this.props.history.push(path);
        if (isMobile()) {
            this.props.hideFlyoutTabs();
        }
    }

    changeToEditView() {
        if (
            this.props.account && (
                this.props.account.admin ||
                Object.keys(this.props.account.tasks).length > 0 ||
                Object.keys(this.props.account.supervised_tasks).length > 0 ||
                Object.keys(this.props.account.permissions).length > 0
            )
        ) {
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

    errorMsg() {
        if (this.props.error) {
            return <div className='error' dangerouslySetInnerHTML={{__html: t(this.props, this.props.error)}}/>;
        } else {
            return null;
        }
    }

    // FIXME: show this alert ifLoggedIn && ifNoProject
    projectAccessAlert() {
        const { account, project } = this.props;
        const unactivatedProject = account && Object.values(account.user_registration_projects).find(urp => urp.project_id === project?.id && urp.activated_at === null);

        if (unactivatedProject) {
            return <div className='error'>{`${t(this.props, 'project_access_in_process')}`}</div>
        } else {
            return (
                <>
                    <p className='error'>
                        {t(this.props, 'request_project_access_explanation')}
                    </p>
                    <div
                        className='flyout-sub-tabs-content-ico-link'
                        title={t(this.props, 'request_project_access_explanation')}
                        onClick={() => this.props.openArchivePopup({
                            title: t(this.props, 'request_project_access_link'),
                            content: <RequestProjectAccessFormContainer project={project} />
                        })}
                    >
                        {t(this.props, 'request_project_access_link')}
                    </div>
                </>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <div className="flyout-tab-title">
                    { t(this.props, this.props.isLoggedIn ? 'account_page' : 'login_page') }
                </div>
                <div className={'flyout-login-container'}>
                    <AuthShowContainer ifLoggedIn={true} ifNoProject={true}>
                        <div className='info'>
                            {`${t(this.props, 'logged_in_as')} ${this.props.firstName} ${this.props.lastName}`}
                        </div>
                        {this.changeToEditView()}
                        <div
                            className='logout'
                            onClick={() => {
                                // clear non-public data
                                if (this.props.archiveId) {
                                    this.props.clearStateData('interviews', this.props.archiveId, 'title');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'short_title');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'description');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'observations');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'contributions');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'photos');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'registry_references');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'segments');
                                }
                                this.props.clearStateData('accounts');
                                this.props.clearStateData('user_registrations');
                                this.props.clearSearch();
                                this.props.submitLogout(`${pathBase(this.props)}/user_accounts/sign_out`);
                            }}
                        >
                            {t(this.props, 'logout')}
                        </div>
                    </AuthShowContainer>
                    <AuthShowContainer ifNoProject={!!this.props.project}>
                        {this.projectAccessAlert()}
                    </AuthShowContainer>

                    {this.errorMsg()}

                    <AuthShowContainer ifLoggedOut={true}>
                        <p>
                            {/* do not show t('registration_needed') in campscapes. TODO: generalize this*/}
                            {(this.props.error || this.props.projectId === 'campscapes') ? '' : t(this.props, 'registration_needed')}
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
            </Fragment>
        )
    }

}
