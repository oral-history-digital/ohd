import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    MarkTextFormContainer,
    UploadTranscriptContainer,
    UploadEditTableContainer,
    DestroyTranscript,
} from 'modules/interview-actions';
import {
    InterviewInfoContainer,
    InterviewContributorsContainer,
    InterviewTextMaterialsContainer,
    CitationInfoContainer,
} from 'modules/interview-metadata';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useIsEditor } from 'modules/archive';
import { HelpText } from 'modules/help-text';
import { PersonDataContainer, usePersonWithAssociations } from 'modules/person';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { Spinner } from 'modules/spinners';
import { InterviewMap } from 'modules/interview-map';
import { GalleryContainer } from 'modules/gallery';
import { MaterialList } from 'modules/materials';
import { usePathBase } from 'modules/routes';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { PROJECT_CAMPSCAPES } from 'modules/constants';
import SubTab from './SubTab';
import AdminActionsContainer from './AdminActionsContainer';
import AdminSubTab from './AdminSubTab';
import DownloadLinks from './DownloadLinks';
import { SingleValueWithFormContainer } from 'modules/forms';

export default function InterviewTabPanel({
    archiveId,
    projectId,
    interview,
    intervieweeId,
    hasMap,
    isCatalog,
    setViewMode,
    hideSidebar,
    isLoggedIn,
}) {
    const pathBase = usePathBase();
    const isEditor = useIsEditor();
    const { t } = useI18n();
    const { data: interviewee, isLoading: intervieweeIsLoading } =
        usePersonWithAssociations(intervieweeId);

    const searchPath = `${pathBase}/searches/archive?fulltext=${archiveId}`;

    if (!archiveId || archiveId === 'new') {
        return null;
    }

    const hasPhotos =
        interview.photos && Object.values(interview.photos).length > 0;
    const showGallerySection = hasPhotos || isEditor;

    const hasMaterials =
        interview.material_count && interview.material_count > 0;
    const showMaterialSection = hasMaterials || isEditor;

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('interview')}</h3>
            <div
                className={classNames(
                    'flyout-sub-tabs-container',
                    'flyout-video',
                    {
                        hidden: projectId === PROJECT_CAMPSCAPES,
                    }
                )}
            >
                <AuthorizedContent object={interview} action="update">
                    <p>
                        <Link
                            onClick={() => {
                                setViewMode('workflow');
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
                        <AuthorizedContent
                            object={interview}
                            action="show"
                            showIfPublic
                        >
                            <SubTab title={t('person_info')} open={!isLoggedIn}>
                                {isEditor && (
                                    <HelpText
                                        code="interview_person_data"
                                        small
                                    />
                                )}
                                <PersonDataContainer />
                                {intervieweeIsLoading ? (
                                    <Spinner />
                                ) : (
                                    interviewee && (
                                        <SelectedRegistryReferencesContainer
                                            refObject={interviewee}
                                        />
                                    )
                                )}
                            </SubTab>
                        </AuthorizedContent>
                        <AuthShowContainer ifLoggedOut ifNoProject>
                            <AuthorizedContent
                                object={interview}
                                action="show"
                                showIfPublic
                            >
                                <SubTab
                                    title={t('interview_info')}
                                    open={!isLoggedIn}
                                >
                                    <InterviewInfoContainer />
                                    <InterviewContributorsContainer />
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedIn>
                            <AuthorizedContent
                                object={interview}
                                action="show"
                                showIfPublic
                            >
                                <SubTab title={t('interview_info')}>
                                    {isEditor && (
                                        <HelpText
                                            code="interview_interview_data"
                                            small
                                        />
                                    )}
                                    <InterviewInfoContainer />
                                    <InterviewContributorsContainer />
                                    <InterviewTextMaterialsContainer />
                                    <SingleValueWithFormContainer
                                        obj={interview}
                                        value={interview?.links}
                                        attribute="pseudo_links"
                                        hideEmpty
                                        linkUrls
                                    />
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>
                    </>
                )}
                <AuthorizedContent
                    object={{ type: 'Segment', interview_id: interview.id }}
                    action="update"
                >
                    <SubTab title={t('edit.upload_transcript.title')}>
                        <HelpText
                            code="interview_upload_transcript"
                            className="u-mb"
                        />
                        <UploadTranscriptContainer />
                    </SubTab>
                </AuthorizedContent>

                {interview.alpha3s_with_transcript &&
                    interview.alpha3s_with_transcript.length > 0 && (
                        <AuthorizedContent
                            object={{
                                type: 'Segment',
                                interview_id: interview.id,
                            }}
                            action="update"
                        >
                            <SubTab title={t('edit.destroy_transcript.title')}>
                                <HelpText
                                    code="interview_destroy_transcript"
                                    className="u-mb"
                                />
                                <DestroyTranscript interview={interview} />
                            </SubTab>
                        </AuthorizedContent>
                    )}

                <AuthorizedContent object={interview} action="update">
                    <SubTab title={t('edit.upload_edit_table.title')}>
                        <UploadEditTableContainer />
                    </SubTab>
                </AuthorizedContent>

                {/* TODO: rework assign speaker functionality
                <AuthorizedContent object={interview} action='update_speakers'>
                    <SubTab title={t('assign_speakers')}>
                        <AssignSpeakersFormContainer interview={interview} />
                    </SubTab>
                </AuthorizedContent>*/}

                <AuthorizedContent object={interview} action="mark_texts">
                    <SubTab title={t('mark_texts')}>
                        <MarkTextFormContainer interview={interview} />
                    </SubTab>
                </AuthorizedContent>

                {projectId !== PROJECT_CAMPSCAPES && (
                    <AuthShowContainer ifLoggedIn>
                        <AuthShowContainer ifLoggedIn={hasMap}>
                            <AuthorizedContent
                                object={interview}
                                action="show"
                                showIfPublic
                            >
                                <SubTab title={t('map')}>
                                    {isEditor && (
                                        <HelpText
                                            code="interview_map"
                                            className="u-mb"
                                        />
                                    )}
                                    <InterviewMap />
                                </SubTab>
                            </AuthorizedContent>
                        </AuthShowContainer>

                        {showGallerySection && (
                            <AuthorizedContent
                                object={interview}
                                action="show"
                                showIfPublic
                            >
                                <SubTab title={t('photos')}>
                                    <GalleryContainer />
                                </SubTab>
                            </AuthorizedContent>
                        )}

                        {showMaterialSection && (
                            <AuthorizedContent
                                object={interview}
                                action="show"
                                showIfPublic
                            >
                                <SubTab title={t('materials')}>
                                    <MaterialList />
                                </SubTab>
                            </AuthorizedContent>
                        )}

                        <AuthorizedContent
                            object={interview}
                            action="show"
                            showIfPublic
                        >
                            <SubTab title={t('citation')}>
                                <CitationInfoContainer />
                            </SubTab>
                        </AuthorizedContent>

                        <AuthorizedContent object={interview} action="update">
                            <SubTab title={t('admin_actions')}>
                                <AdminActionsContainer
                                    archiveIds={[archiveId]}
                                />
                            </SubTab>
                        </AuthorizedContent>
                    </AuthShowContainer>
                )}
            </div>
            <div className="flyout-sub-tabs-container flyout-video">
                <AdminSubTab
                    title="edit.downloads.title"
                    obj={interview}
                    action="download"
                >
                    <DownloadLinks
                        archiveId={archiveId}
                        numTapes={Number.parseInt(interview.tape_count)}
                        interview={interview}
                    />
                </AdminSubTab>
            </div>
        </ErrorBoundary>
    );
}

InterviewTabPanel.propTypes = {
    archiveId: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    interview: PropTypes.object,
    intervieweeId: PropTypes.number,
    hasMap: PropTypes.bool.isRequired,
    isCatalog: PropTypes.bool.isRequired,
    setViewMode: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};
