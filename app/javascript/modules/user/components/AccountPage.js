import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { getCurrentUser } from 'modules/data';
import { Features } from 'modules/features';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { Modal } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import UserDetailsContainer from './UserDetailsContainer';
import UserDetailsFormContainer from './UserDetailsFormContainer';
import UserProjects from './UserProjects';
import TwoFAPopup from './TwoFAPopup';

export default function AccountPage() {
    const { t } = useI18n();
    const isEditor = useIsEditor();
    const user = useSelector(getCurrentUser);
    useTrackPageView();

    return (
        <div className="wrapper-content register account-page">
            <Helmet>
                <title>{t('account_page')}</title>
            </Helmet>
            <ErrorBoundary>
                <AuthShowContainer ifLoggedIn ifNoProject>
                    {isEditor && <HelpText code="account_page" />}

                    <div className="account-page-header">
                        <h1>{t('account_page')}</h1>

                        <div className="edit-account-icon">
                            <Modal
                                title={t('edit.user.edit')}
                                trigger={
                                    <FaPencilAlt className="Icon Icon--primary" />
                                }
                            >
                                {(close) => (
                                    <UserDetailsFormContainer
                                        onSubmit={close}
                                        onCancel={close}
                                    />
                                )}
                            </Modal>
                        </div>
                        <div className="edit-account-icon">
                            { user?.otp_required_for_login &&
                                <TwoFAPopup showDialogInitially={false} />
                            }
                         </div>
                    </div>

                    <div className="user-registration boxes">
                        {user && <UserDetailsContainer />}
                    </div>
                    <div className="user-registration boxes">
                        {user && <UserProjects />}
                    </div>
                    <AuthorizedContent
                        object={{ type: 'General' }}
                        action="edit"
                    >
                        <Features />
                    </AuthorizedContent>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </ErrorBoundary>
        </div>
    );
}
