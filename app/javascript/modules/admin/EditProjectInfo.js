import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectInfoAttributesContainer from './EditProjectInfoAttributesContainer';
import ExternalLinksContainer from './ExternalLinksContainer';
import InstitutionProjectsContainer from './InstitutionProjectsContainer';

import { useI18n } from 'modules/i18n';

export default function EditProjectInfo() {
    const { t } = useI18n();

    return (
        <div className='wrapper-content register'>
            <AuthShowContainer ifLoggedIn={true}>
                <h1 className='registry-entries-title'>{t(`edit.project.info`)}</h1>
                <EditProjectInfoAttributesContainer />
                <h2 className='registry-entries-title'>{t(`edit.external_link.admin`)}</h2>
                <ExternalLinksContainer />
                <h2 className='registry-entries-title'>{t(`edit.institution_project.admin`)}</h2>
                <InstitutionProjectsContainer />
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
