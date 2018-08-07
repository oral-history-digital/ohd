import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t, fullname } from '../../../lib/utils';

export default class Interview extends React.Component {

    componentDidMount() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
        this.loadUserContents();
        this.loadDoiContent();
    }

    componentDidUpdate() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
        this.loadUserContents();
        this.loadDoiContent();
    }

    setArchiveId() {
        if ( this.props.match.params.archiveId !== this.props.archiveId) {
            this.props.setArchiveId(this.props.match.params.archiveId);
        }
    }

    loadInterview() {
        if (
            //this.props.match.params.archiveId !== 'new' &&
            //this.props.match.params.archiveId !== this.props.archiveId &&
            //
            !this.props.interviews ||
            !this.props.interviews[`interviews_${this.props.match.params.archiveId}_status`]
        ) {
            this.props.fetchData('interviews', this.props.match.params.archiveId);
        }
    }

    interviewLoaded() {
        return this.props.interviews &&
            this.props.interviews[`interviews_${this.props.match.params.archiveId}_status`] === 'fetched';
    }

    loadContributors() {
        if ( 
            this.interviewLoaded() &&
            !this.props.data[`people_contributors_for_interview_${this.interview().id}_status`]
        ) {
            this.props.fetchData('people', null, null, this.props.locale, `contributors_for_interview=${this.interview().id}`);
        }
    }

    interview() {
        return this.interviewLoaded() ? this.props.interviews[this.props.archiveId] : {};
    }

    loadUserContents() {
        if (!this.props.userContentsStatus) {
            this.props.fetchData('user_contents');
        }
    }

    loadDoiContent() {
        if (
            !this.props.interviews ||
            !this.props.interviews[this.props.match.params.archiveId] ||
            !this.props.interviews[this.props.match.params.archiveId].doi_contents_status
        ) {
            this.props.fetchData('interviews', this.props.match.params.archiveId, 'doi_contents');
        }
    }

    doiContentLoaded() {
        return this.props.interviews &&
            this.props.interviews[this.props.archiveId] &&
            this.props.interviews[this.props.archiveId]['doi_contents_status'] === 'fetched';
    }

    loggedOutContent() {
        if (this.interviewLoaded()) {
            return (
                <div>
                    <div className='wrapper-video' >
                        <div className={"video-title-container"}>
                            <h1 className='video-title'>
                                {fullname(this.props, this.interviewee(), true)}
                            </h1>
                        </div>
                        <div className='video-element'>
                            <img src={this.interview().still_url}/>
                        </div>
                    </div>
                    {this.doiContent()}
                </div>
            )
        } else {
            return null;
        }
    }

    interviewee() {
        return this.props.people && this.props.people[this.interview().interviewee_id];
    }

    doiContent() {
        if (this.doiContentLoaded()) {
            return (
                <div className='wrapper-content'
                     dangerouslySetInnerHTML={{__html: this.interview().doi_contents[this.props.locale]}}
                />
            )
        } else {
            return null;
        }
    }

    content() {
        if (
            //this.props.interviews &&
            //this.props.interviews[`interviews_${this.props.match.params.archiveId}_status`] === 'fetched' 
            this.interviewLoaded()
        ){
            let tabIndex = this.props.locales.length + 3;
            return (
                <WrapperPageContainer tabIndex={tabIndex}>
                    <AuthShowContainer ifLoggedIn={true}>
                        <VideoPlayerContainer/>
                        <InterviewTabsContainer/>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {this.loggedOutContent()}
                    </AuthShowContainer>
                </WrapperPageContainer>
            );
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}

