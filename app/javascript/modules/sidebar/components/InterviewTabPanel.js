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
import InterviewDataContainer from './InterviewDataContainer';
import AdminActionsContainer from './AdminActionsContainer';
import SubTab from './SubTab';
import DownloadLinks from './DownloadLinks';

export default function InterviewTabPanel({
    archiveId,
    projectId,
    interview,
    interviewee,
    hasMap,
    isCatalog,
    searchInArchive,
    setViewMode,
    hideSidebar,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    const searchPath = `${pathBase}/searches/archive`;

    if (!archiveId || archiveId === 'new') {
        return null;
    }

    return (
        <>
            <div className='flyout-tab-title'>
                {t('interview')}
            </div>
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
                                searchInArchive(searchPath, {archive_id: interview.archive_id});
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
                            <InterviewDataContainer title={t('person_info')} open>
                                <PersonDataContainer/>
                                {
                                    interviewee && <SelectedRegistryReferencesContainer refObject={interviewee} />
                                }
                            </InterviewDataContainer>
                        </AuthorizedContent>
                        <AuthShowContainer ifLoggedOut ifNoProject>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <InterviewDataContainer title={t('interview_info')} open>
                                    <InterviewInfoContainer/>
                                </InterviewDataContainer>
                            </AuthorizedContent>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedIn>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <InterviewDataContainer title={t('interview_info')} open>
                                    <InterviewInfoContainer/>
                                    <InterviewContributorsContainer/>
                                    <InterviewTextMaterialsContainer/>
                                </InterviewDataContainer>
                            </AuthorizedContent>
                        </AuthShowContainer>
                    </>
                )}
                <AuthorizedContent object={{type: 'Segment', interview_id: interview.id}} action='update'>
                    <InterviewDataContainer
                        title={t('edit.upload_transcript.title')}
                        open={false}
                    >
                        <UploadTranscriptContainer />
                    </InterviewDataContainer>
                </AuthorizedContent>

                <AuthorizedContent object={{type: 'Interview', interview_id: interview.id}} action='update_speakers'>
                    <InterviewDataContainer title={t('assign_speakers')}>
                        <AssignSpeakersFormContainer interview={interview} />
                    </InterviewDataContainer>
                </AuthorizedContent>

                <AuthorizedContent object={{type: 'Interview', interview_id: interview.id}} action='mark_texts'>
                    <InterviewDataContainer title={t('mark_texts')}>
                        <MarkTextFormContainer interview={interview} />
                    </InterviewDataContainer>
                </AuthorizedContent>

                {projectId !== PROJECT_CAMPSCAPES && (
                    <AuthShowContainer ifLoggedIn>
                        <AuthorizedContent object={interview} action='show' showIfPublic>
                            <InterviewDataContainer title={t('photos')} open>
                                <GalleryContainer/>
                            </InterviewDataContainer>
                        </AuthorizedContent>

                        <AuthShowContainer ifLoggedIn={hasMap}>
                            <AuthorizedContent object={interview} action='show' showIfPublic>
                                <InterviewDataContainer title={t('map')} open>
                                    <InterviewMap/>
                                </InterviewDataContainer>
                            </AuthorizedContent>
                        </AuthShowContainer>

                        <AuthorizedContent object={interview} action='show' showIfPublic>
                            <InterviewDataContainer title={t('citation')} open>
                                <CitationInfoContainer/>
                            </InterviewDataContainer>
                        </AuthorizedContent>

                        <AuthorizedContent object={interview} action='update'>
                            <InterviewDataContainer title={t('admin_actions')} >
                                <AdminActionsContainer archiveIds={[archiveId]} />
                            </InterviewDataContainer>
                        </AuthorizedContent>
                    </AuthShowContainer>
                )}
            </div>
            <SubTab
                title='edit.downloads.title'
                obj={interview}
                action='download'
            >
                <DownloadLinks
                    archiveId={archiveId}
                    numTapes={Number.parseInt(interview.tape_count)}
                    languages={interview.languages}
                />
            </SubTab>
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
    searchInArchive: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
};
