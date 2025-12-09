import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import EditProjectInfoAttributesContainer from './EditProjectInfoAttributesContainer';
import EditViewOrRedirect from './EditViewOrRedirect';
import ExternalLinksContainer from './ExternalLinksContainer';
import InstitutionProjectsContainer from './InstitutionProjectsContainer';

export default function EditProjectInfo() {
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.info`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`edit.project.info`)}
                    </h1>
                    <EditProjectInfoAttributesContainer />
                    <h2 className="registry-entries-title">
                        {t(`edit.external_link.admin`)}
                    </h2>
                    <ExternalLinksContainer />
                    <h2 className="registry-entries-title">
                        {t(`edit.institution_project.admin`)}
                    </h2>
                    <InstitutionProjectsContainer />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
