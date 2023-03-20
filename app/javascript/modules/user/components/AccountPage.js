import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useIsEditor } from 'modules/archive';
import { HelpText } from 'modules/help-text';
import { getCurrentUser } from 'modules/data';
import { Features } from 'modules/features';
import { useI18n } from 'modules/i18n';
import UserProjects from './UserProjects';
import UserDetailsContainer from './UserDetailsContainer';

export default function AccountPage() {
    const { t } = useI18n();
    const isEditor = useIsEditor();
    const user = useSelector(getCurrentUser);

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>{t('account_page')}</title>
            </Helmet>
            <ErrorBoundary>
                <AuthShowContainer ifLoggedIn ifNoProject >
                    {isEditor && <HelpText code="account_page" />}

                    <h1>{t('account_page')}</h1>

                    <div className='user-registration boxes'>
                        {
                            user && <UserDetailsContainer />
                        }
                    </div>
                    <div className='user-registration boxes'>
                        {
                            user && <UserProjects />
                        }
                    </div>
                    <AuthorizedContent object={{type: 'General'}} action='edit'>
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
