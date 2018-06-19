import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t } from '../../../lib/utils';

export default class Interview extends React.Component {

    componentDidMount() {
        this.loadInterview();
        this.loadUserContents();
    }

    componentDidUpdate() {
        this.loadInterview();
        this.loadUserContents();
    }

    loadInterview() {
        if (
            !this.props.isFetchingInterview && 
            this.props.match.params.archiveId !== 'new' &&
            this.props.match.params.archiveId !== this.props.archiveId
        ) {
            this.props.fetchInterview(this.props.match.params.archiveId);
        }
    }

    loadUserContents() {
        if (!this.userContentsLoaded() && !this.props.isFetchingUserContents) {
            this.props.fetchUserContents();
        }
    }

    userContentsLoaded() {
        return this.props.userContents && !this.props.userContents.fetched;
    }

    loggedOutContent() {
        let intervieweeNames = this.props.data.interview.interviewees[0].names[this.props.locale];

        return (
            <div>
                <div className='wrapper-video' >
                    <div className={"video-title-container"}>
                        <h1 className='video-title'>
                            {intervieweeNames.firstname} {intervieweeNames.lastname} {intervieweeNames.birthname}
                        </h1>
                    </div>
                    <div className='video-element'>
                        <img src={this.props.data.interview.still_url}/>
                    </div>
                </div>
                <div className='wrapper-content'
                     dangerouslySetInnerHTML={{__html: this.props.data.doiContent[this.props.locale]}}
                />
            </div>
        )
    }

    content() {
        if (this.props.fetchedInterview) {
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

