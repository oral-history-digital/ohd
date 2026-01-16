import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Helmet } from 'react-helmet';

import EditProjectConfigAttributesContainer from './EditProjectConfigAttributesContainer';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectConfig() {
    const { t } = useI18n();
    const { project } = useProject();

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.config`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`edit.project.config`)}
                    </h1>
                    <EditProjectConfigAttributesContainer data={project} />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
