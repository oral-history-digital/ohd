import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import { EditViewOrRedirect } from '../../components';
import { BreadcrumbLogosSection, HomepageSettingsSection } from './sections';

export default function InstanceSettingsAdminPage() {
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content AdminEditInstance">
                <Helmet>
                    <title>{t('edit.instance.title')}</title>
                </Helmet>

                <AuthShowContainer hasProjectAccess>
                    <AuthorizedContent
                        object={{ type: 'InstanceSetting' }}
                        action="update"
                    >
                        <h1 className="Page-main-title">
                            {t('edit.instance.title')}
                        </h1>
                        <BreadcrumbLogosSection />
                        <HomepageSettingsSection />
                    </AuthorizedContent>
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
