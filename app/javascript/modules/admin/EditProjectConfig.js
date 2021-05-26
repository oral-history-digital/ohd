import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectConfigAttributesContainer from './EditProjectConfigAttributesContainer';

import { useI18n } from 'modules/i18n';

export default function EditProjectConfig() {
    const { t } = useI18n();

    return (
        <div className='wrapper-content register'>
            <AuthShowContainer ifLoggedIn={true}>
                <h1 className='registry-entries-title'>{t(`edit.project.config`)}</h1>
                <EditProjectConfigAttributesContainer />
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
