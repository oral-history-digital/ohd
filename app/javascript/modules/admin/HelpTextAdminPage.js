import { useEffect } from 'react';

import { AuthShowContainer } from 'modules/auth';
import { HelpTextTable } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { hideSidebar } from 'modules/sidebar';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import EditViewOrRedirect from './EditViewOrRedirect';

export default function HelpTextAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideSidebar());
    }, []);

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t('activerecord.models.help_text.other')}</title>
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
        </EditViewOrRedirect>
    );
}
