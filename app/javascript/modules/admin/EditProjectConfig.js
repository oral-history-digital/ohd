import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectConfigAttributesContainer from './EditProjectConfigAttributesContainer';
import { Helmet } from 'react-helmet';

import { useI18n } from 'modules/i18n';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectConfig() {
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(`edit.project.config`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>{t(`edit.project.config`)}</h1>
                    <EditProjectConfigAttributesContainer />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
