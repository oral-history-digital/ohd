import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectInfoAttributesContainer from './EditProjectInfoAttributesContainer';
import ExternalLinksContainer from './ExternalLinksContainer';
import InstitutionProjectsContainer from './InstitutionProjectsContainer';
import { Helmet } from 'react-helmet';

import { useI18n } from 'modules/i18n';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectInfo() {
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(`edit.project.info`)}</title>
                </Helmet>
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
        </EditViewOrRedirect>
    );
}
