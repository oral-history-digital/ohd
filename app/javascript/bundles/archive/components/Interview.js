import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t, fullname, getInterviewee } from '../../../lib/utils';

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
            !this.props.interviewsStatus[this.props.match.params.archiveId] ||
            this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'reload'
        ) {
            this.props.fetchData('interviews', this.props.match.params.archiveId);
        }
    }

    interviewLoaded() {
        return this.props.interviewsStatus[this.props.match.params.archiveId] && 
            this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'fetched';
    }

    loadContributors() {
        if ( 
            this.interviewLoaded() &&
            !this.props.peopleStatus[`contributors_for_interview_${this.interview().id}`]
        ) {
            this.props.fetchData('people', null, null, this.props.locale, `contributors_for_interview=${this.interview().id}`);
        }
    }

    interview() {
        return this.interviewLoaded() ? this.props.interviews[this.props.match.params.archiveId] : {};
    }

    loadUserContents() {
        if (!this.props.userContentsStatus) {
            this.props.fetchData('user_contents');
        }
    }

    loadDoiContent() {
        if (!this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`]) {
            this.props.fetchData('interviews', this.props.match.params.archiveId, 'doi_contents');
        }
    }

    doiContentLoaded() {
        return this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`] && 
               this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`].split('-')[0] === 'fetched';
    }

    loggedOutContent() {
        if (this.interviewLoaded()) {
            return (
                <div>
                    <div className='wrapper-video' >
                        <div className={"video-title-container"}>
                            <h1 className='video-title'>
                                {fullname(this.props, getInterviewee(this.props), true)}
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
        if (this.interviewLoaded()){
            let tabIndex = this.props.locales.length + 3;
            return (
                <WrapperPageContainer tabIndex={tabIndex}>
                    <AuthShowContainer ifLoggedIn={true}>
                        <VideoPlayerContainer interview={this.interview()}/>
                        <InterviewTabsContainer interview={this.interview()}/>
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

