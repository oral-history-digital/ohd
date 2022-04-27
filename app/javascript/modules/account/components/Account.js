import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { AuthShowContainer } from 'modules/auth';
import { Modal } from 'modules/ui';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import LoginForm from './LoginForm';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = { editView: this.props.editViewCookie };

        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    componentDidMount() {
        this.props.changeToEditView(this.props.editViewCookie)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.editView !== this.props.editView) {
            this.setState({editView: this.props.editView})
        }
    }

    handleLinkClick() {
        if (isMobile()) {
            this.props.hideSidebar();
        }
    }

    changeToEditView() {
        if (
            this.props.account && Object.keys(this.props.account).length > 0 && (
                this.props.account.admin ||
                Object.keys(this.props.account.tasks).length > 0 ||
                Object.keys(this.props.account.supervised_tasks).length > 0 ||
                Object.keys(this.props.account.permissions).length > 0
            )
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent switch switch-light"
                    onClick={() => this.props.changeToEditView(!this.state.editView)}
                >
                    <span className={`switch-input ${this.state.editView ? 'checked' : ''}`} type="checkbox" />
                    <span className="switch-label" data-on={t(this.props, 'admin.change_to_edit_view')} data-off={t(this.props, 'admin.change_to_edit_view')}></span>
                    <span className="switch-handle"></span>
                </button>
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
        const unactivatedProject = account?.user_registration_projects && Object.values(account.user_registration_projects).find(urp => urp.project_id === project?.id && urp.activated_at === null);

        if (unactivatedProject) {
            return <div className='error'>{`${t(this.props, 'project_access_in_process')}`}</div>
        } else {
            return (
                <>
                    <p className='error'>
                        {t(this.props, 'request_project_access_explanation')}
                    </p>
                    <Modal
                        title={t(this.props, 'request_project_access_link')}
                        triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                        trigger={t(this.props, 'request_project_access_link')}
                    >
                        {close => (
                            <RequestProjectAccessFormContainer
                                project={project}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}
                    </Modal>
                </>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <h3 className="SidebarTabs-title">
                    { t(this.props, this.props.isLoggedIn ? 'account_page' : 'login_page') }
                </h3>

                <div className={'flyout-login-container'}>
                    <AuthShowContainer ifLoggedIn={true} ifNoProject={true}>
                        <div className='info'>
                            {`${t(this.props, 'logged_in_as')} ${this.props.firstName} ${this.props.lastName}`}
                        </div>
                        {this.changeToEditView()}
                        <button
                            type="button"
                            className='Button Button--fullWidth Button--secondaryAction u-mt-small'
                            onClick={() => {
                                // clear non-public data
                                if (this.props.archiveId) {
                                    this.props.clearStateData('interviews', this.props.archiveId, 'title');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'short_title');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'description');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'observations');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'photos');
                                    this.props.clearStateData('interviews', this.props.archiveId, 'segments');
                                    this.props.clearStateData('statuses', 'people');
                                    Object.keys(this.props.projects).map(pid => {
                                        this.props.clearStateData('projects', pid, 'people');
                                    })
                                }
                                this.props.clearStateData('accounts');
                                this.props.clearStateData('user_registrations');
                                this.props.clearSearch();
                                this.props.submitLogout(`${pathBase(this.props)}/user_accounts/sign_out`);
                            }}
                        >
                            {t(this.props, 'logout')}
                        </button>
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
                        <LoginForm />
                        <div
                            className="register-link"
                            onClick={this.handleLinkClick}
                        >
                            <Link
                                className="Link"
                                to={pathBase(this.props) + '/user_registrations/new'}
                            >
                                {t(this.props, 'user_registration.registration')}
                            </Link>
                        </div>
                        <div
                            className="order-new-password-link"
                            onClick={this.handleLinkClick}
                        >
                            <Link
                                className="Link"
                                to={pathBase(this.props) + '/user_accounts/password/new'}
                            >
                                {t(this.props, 'forget_password')}
                            </Link>
                        </div>
                    </AuthShowContainer>
                </div>
            </Fragment>
        )
    }
}
