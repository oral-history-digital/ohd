import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { HelpTextTable } from 'modules/help-text';
import { hideSidebar } from 'modules/sidebar';

export default function HelpTextAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideSidebar());
    }, []);

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>
                    {t('activerecord.models.help_text.other')}
                </title>
            </Helmet>

            <AuthShowContainer ifLoggedIn>
                <h1 className="registry-entries-title">
                    {t('activerecord.models.help_text.other')}
                </h1>

                <HelpTextTable />

            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
