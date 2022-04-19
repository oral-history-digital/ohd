import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import { AccountContainer } from 'modules/account';
import { PersonDataContainer } from 'modules/interviewee-metadata';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { InterviewInfoContainer, InterviewContributorsContainer, InterviewTextMaterialsContainer,
    CitationInfoContainer } from 'modules/interview-metadata';
import { InterviewMap } from 'modules/interview-map';
import { GalleryContainer } from 'modules/gallery';
import { AssignSpeakersFormContainer, MarkTextFormContainer, UploadTranscriptContainer } from 'modules/interview-actions';
import { usePathBase } from 'modules/routes';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { PROJECT_CAMPSCAPES } from 'modules/constants';
import SubTab from './SubTab';
import AdminActionsContainer from './AdminActionsContainer';
import AdminSubTab from './AdminSubTab';
import DownloadLinks from './DownloadLinks';

export default function InterviewTabPanel({
    archiveId,
    projectId,
    interview,
    interviewee,
    hasMap,
    isCatalog,
    setViewMode,
    hideSidebar,
    isLoggedIn,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    const searchPath = `${pathBase}/searches/archive?fulltext=${archiveId}`;

    if (!archiveId || archiveId === 'new') {
        return null;
    }

    return (
        <>
            <h3 className='SidebarTabs-title'>
                {t('interview')}
            </h3>
            {projectId !== PROJECT_CAMPSCAPES && (
                <AuthShowContainer ifLoggedOut ifNoProject>
                    <AccountContainer/>
                </AuthShowContainer>
            )}
            <div className={classNames('flyout-sub-tabs-container', 'flyout-video', {
                'hidden': projectId === PROJECT_CAMPSCAPES,
            })}>
                <AuthorizedContent object={interview} action='update'>
                    <p>
                        <Link
                            onClick={() => {
                                setViewMode('workflow')
                                hideSidebar();
                            }}
                            to={searchPath}
                        >
                            {t('workflow')}
                        </Link>
                    </p>
                </AuthorizedContent>
                {!isCatalog && (
                    <>
                        <AuthorizedContent object={interview} action='show' showIfPublic>
                            <SubTab title={t('person_info')} open={!isLoggedIn}>
                                <PersonDataContainer/>
                                {
                                    interviewee && <SelectedRegistryReferencesContainer refObject={interviewee} />
                                }
                            </SubTab>
                        </AuthorizedContent>
                        <AuthShowContainer ifLoggedOut ifNoProject>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <SubTab title={t('interview_info')} open={!isLoggedIn}>
                                    <InterviewInfoContainer/>
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedIn>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <SubTab title={t('interview_info')}>
                                    <InterviewInfoContainer/>
                                    <InterviewContributorsContainer/>
                                    <InterviewTextMaterialsContainer/>
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>
                    </>
                )}
                <AuthorizedContent object={{type: 'Segment', interview_id: interview.id}} action='update'>
                    <SubTab title={t('edit.upload_transcript.title')}>
                        <UploadTranscriptContainer />
                    </SubTab>
                </AuthorizedContent>

                <AuthorizedContent object={{type: 'Interview', interview_id: interview.id}} action='update_speakers'>
                    <SubTab title={t('assign_speakers')}>
                        <AssignSpeakersFormContainer interview={interview} />
                    </SubTab>
                </AuthorizedContent>

                <AuthorizedContent object={{type: 'Interview', interview_id: interview.id}} action='mark_texts'>
                    <SubTab title={t('mark_texts')}>
                        <MarkTextFormContainer interview={interview} />
                    </SubTab>
                </AuthorizedContent>

                {projectId !== PROJECT_CAMPSCAPES && (
                    <AuthShowContainer ifLoggedIn>
                        <AuthShowContainer ifLoggedIn={hasMap}>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <SubTab title={t('map')}>
                                    <InterviewMap/>
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>

                        <AuthorizedContent object={interview} action='show' showIfPublic>
                            <SubTab title={t('photos')}>
                                <GalleryContainer/>
                            </SubTab>
                        </AuthorizedContent>

                        <AuthorizedContent object={interview} action='show' showIfPublic>
                            <SubTab title={t('citation')}>
                                <CitationInfoContainer/>
                            </SubTab>
                        </AuthorizedContent>

                        <AuthorizedContent object={interview} action='update'>
                            <SubTab title={t('admin_actions')} >
                                <AdminActionsContainer archiveIds={[archiveId]} />
                            </SubTab>
                        </AuthorizedContent>
                    </AuthShowContainer>
                )}
            </div>
            <div className="flyout-sub-tabs-container flyout-video">
                <AdminSubTab
                    title='edit.downloads.title'
                    obj={interview}
                    action='download'
                    >
                    <DownloadLinks
                        archiveId={archiveId}
                        numTapes={Number.parseInt(interview.tape_count)}
                        languages={interview.languages}
                        />
                </AdminSubTab>
            </div>
        </>
    );
}

InterviewTabPanel.propTypes = {
    archiveId: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    interview: PropTypes.object,
    interviewee: PropTypes.object,
    hasMap: PropTypes.bool.isRequired,
    isCatalog: PropTypes.bool.isRequired,
    setViewMode: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};
