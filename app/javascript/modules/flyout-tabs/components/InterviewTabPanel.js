import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import { AccountContainer } from 'modules/account';
import { PersonDataContainer } from 'modules/interviewee-metadata';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { InterviewInfoContainer, InterviewContributorsContainer, InterviewTextMaterialsContainer,
    CitationInfoContainer } from 'modules/interview-metadata';
import { InterviewLocationsContainer } from 'modules/locations';
import { GalleryContainer } from 'modules/gallery';
import { AssignSpeakersFormContainer, MarkTextFormContainer, UploadTranscriptContainer } from 'modules/interview-actions';
import { pathBase } from 'modules/routes';
import { admin, AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { t } from 'modules/i18n';
import InterviewDataContainer from './InterviewDataContainer';
import AdminActionsContainer from './AdminActionsContainer';

class InterviewTabPanel extends Component {
    static propTypes = {
        archiveId: PropTypes.string,
        projectId: PropTypes.string.isRequired,
        interview: PropTypes.object,
        interviewee: PropTypes.object,
        hasMap: PropTypes.bool.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        account: PropTypes.object,
        editView: PropTypes.bool.isRequired,
    }

    subTab(title, content, url, obj, condition = true) {
        return (admin(this.props, obj) && condition) ?
            (<div className='flyout-sub-tabs-container flyout-video'>
                <InterviewDataContainer
                    title={t(this.props, title)}
                    content={content}
                    url={url}
                    open={false}
                />
            </div>) :
            null;
    }

    downloads() {
        const { interview, archiveId } = this.props;

        if (admin(this.props, {type: 'Interview', action: 'download'})) {
            let links = [];
            for (var i=1; i <= parseInt(interview.tape_count); i++) {
                links.push(
                    <div key={`downloads-for-tape-${i}`}>
                        <h4>{`${t(this.props, 'tape')} ${i}:`}</h4>
                        <a href={`${pathBase(this.props)}/interviews/${archiveId}.ods?tape_number=${i}`} download>ods</a>&#44;&#xa0;
                        <a href={`${pathBase(this.props)}/interviews/${archiveId}.vtt?tape_number=${i}`} download>vtt</a>
                    </div>
                );
            }
            return (
                <div>
                    <h4>{archiveId}:</h4>
                    {links}
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        const { archiveId, projectId, interview, interviewee, hasMap } = this.props;
        const searchPath = `${pathBase(this.props)}/searches/archive`;

        return (archiveId && archiveId !== 'new') ?
            (<Fragment>
                <div className='flyout-tab-title'>
                    { t(this.props, 'interview') }
                </div>
                <AuthShowContainer ifLoggedOut={projectId !== "campscapes"} ifNoProject>
                    <AccountContainer/>
                </AuthShowContainer>
                <div className={`flyout-sub-tabs-container flyout-video ${projectId === "campscapes" ? "hidden": ""}`}>
                    <AuthorizedContent object={this.props.interview}>
                        <p>
                            <Link
                                onClick={() => {
                                    this.props.searchInArchive(searchPath, {archive_id: this.props.interview.archive_id});
                                    this.props.setViewMode('workflow')
                                    this.props.hideFlyoutTabs();
                                }}
                                to={searchPath}
                            >
                                {t(this.props, 'workflow')}
                            </Link>
                        </p>
                    </AuthorizedContent>
                    <InterviewDataContainer
                        title={t(this.props, 'person_info')}
                        open={true}
                        content={
                            <div>
                                <PersonDataContainer/>
                                <SelectedRegistryReferencesContainer refObject={interviewee} />
                            </div>
                        }
                    />
                    <AuthShowContainer ifLoggedOut={projectId !== "campscapes"} ifNoProject={true}>
                        <InterviewDataContainer
                            title={t(this.props, 'interview_info')}
                            open={true}
                            content={ <InterviewInfoContainer/> }
                        />
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedIn={projectId !== "campscapes"}>
                        <InterviewDataContainer
                            title={t(this.props, 'interview_info')}
                            open={true}
                            content={ <div><InterviewInfoContainer/><InterviewContributorsContainer/> <InterviewTextMaterialsContainer/></div> }
                        />
                    </AuthShowContainer>

                    <AuthorizedContent object={interview}>
                        <InterviewDataContainer
                            title={t(this.props, 'edit.upload_transcript.title')}
                            open={false}
                            content={<UploadTranscriptContainer />}
                        />
                    </AuthorizedContent>

                    {
                        // speakers assignment does not work for dg at the moment, but we don't need it either
                        projectId !== 'dg' ?
                            (
                                <>
                                    <AuthorizedContent object={{type: 'Interview', action: 'update_speakers', interview_id: interview.id}}>
                                        <InterviewDataContainer
                                            title={t(this.props, 'assign_speakers')}
                                            content={<AssignSpeakersFormContainer interview={interview} />}
                                        />
                                    </AuthorizedContent>
                                    <AuthorizedContent object={{type: 'Interview', action: 'mark_texts', interview_id: interview.id}}>
                                        <InterviewDataContainer
                                            title={t(this.props, 'mark_texts')}
                                            content={<MarkTextFormContainer interview={interview} />}
                                        />
                                    </AuthorizedContent>
                                </>
                            ) :
                            null
                    }

                    <AuthShowContainer ifLoggedIn={projectId !== "campscapes"}>
                        <InterviewDataContainer
                            title={t(this.props, 'photos')}
                            open={true}
                            content={<GalleryContainer/>}
                        />

                        <AuthShowContainer ifLoggedIn={hasMap}>
                            <InterviewDataContainer
                                title={t(this.props, 'map')}
                                open={true}
                                content={<InterviewLocationsContainer/>}
                            />
                        </AuthShowContainer>

                        <InterviewDataContainer
                            title={t(this.props, 'citation')}
                            open={true}
                            content={<CitationInfoContainer/>}
                        />

                        <AuthorizedContent object={{type: 'General', action: 'edit'}}>
                            <InterviewDataContainer
                                title={t(this.props, 'admin_actions')}
                                content={<AdminActionsContainer archiveIds={[archiveId]} />}
                            />
                        </AuthorizedContent>
                    </AuthShowContainer>
                </div>
                {this.subTab('edit.downloads.title', this.downloads(), null, {type: 'Interview', action: 'download', id: archiveId}, archiveId && projectId !== "campscapes")}
            </Fragment>) :
            null;
    }
}

export default InterviewTabPanel;
