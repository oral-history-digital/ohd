import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { UserTable, useUsers } from 'modules/users';
import { hideSidebar } from 'modules/sidebar';

export default function UsersAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    const { data, isLoading } = useUsers();

    const usersCount = typeof data === 'undefined' ?
        undefined :
        Object.values(data).length;

    useEffect(() => {
        dispatch(hideSidebar());
    }, []);

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>
                    {t('activerecord.models.user_registration.other')}
                </title>
            </Helmet>

            <AuthShowContainer ifLoggedIn>
                <h1 className="registry-entries-title">
                    {usersCount} {t('activerecord.models.user_registration.other')}
                </h1>

                <UserTable />

            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
