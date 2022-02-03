import { useSelector } from 'react-redux';
import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectDisplayAttributesContainer from './EditProjectDisplayAttributesContainer';
import LogosContainer from './LogosContainer';
import SponsorLogosContainer from './SponsorLogosContainer';
import MediaStreamsContainer from './MediaStreamsContainer';
import { getCurrentProject } from 'modules/data';

import { useI18n } from 'modules/i18n';

export default function EditProjectDisplay() {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);

    return (
        <div className='wrapper-content register'>
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
    );
}
