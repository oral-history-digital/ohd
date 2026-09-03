import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { UserTable } from 'modules/users';
import { Helmet } from 'react-helmet';

export default function UsersAdminPage() {
    const { t } = useI18n();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{t('activerecord.models.user.other')}</title>
            </Helmet>

            <AuthShowContainer hasProjectAccess>
                <AuthorizedContent object={{ type: 'User' }} action="update">
                    <UserTable />
                </AuthorizedContent>
            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
