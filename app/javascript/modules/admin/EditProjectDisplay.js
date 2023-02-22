import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import LogosContainer from './LogosContainer';
import EditProjectDisplayAttributesContainer from './EditProjectDisplayAttributesContainer';
import SponsorLogosContainer from './SponsorLogosContainer';
import MediaStreamsContainer from './MediaStreamsContainer';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function EditProjectDisplay() {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(`edit.project.display`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>{t(`edit.project.display`)}</h1>
                    <EditProjectDisplayAttributesContainer />
                    <h2 className='registry-entries-title'>{t(`edit.logo.admin`)}</h2>
                    <LogosContainer
                        data={project.logos}
                        outerScope={'project'}
                        outerScopeId={project.id}
                        initialFormValues={{ref_id: project.id, ref_type: 'Project', type: 'Logo'}}
                    />
                    <h2 className='registry-entries-title'>{t(`edit.sponsor_logo.admin`)}</h2>
                    <SponsorLogosContainer />
                    <h2 className='registry-entries-title'>{t(`edit.media_stream.admin`)}</h2>
                    <MediaStreamsContainer />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
