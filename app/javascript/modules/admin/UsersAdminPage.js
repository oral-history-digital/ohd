import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { UserTable } from 'modules/users';
import { hideSidebar } from 'modules/sidebar';

export default function UsersAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    // INTARCH-2924: do not hide sidebar
    //useEffect(() => {
        //dispatch(hideSidebar());
    //}, []);

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>
                    {t('activerecord.models.user.other')}
                </title>
            </Helmet>

            <AuthShowContainer ifLoggedIn>
                <AuthorizedContent object={{ type: 'User' }} action='update' >
                    <UserTable />
                </AuthorizedContent>
            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
