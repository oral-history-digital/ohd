import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import ArchiveUtils from '../../../lib/utils';

export default class Interview extends React.Component {
  
    componentDidMount() {
        this.loadInterview();
    }

    componentDidUpdate() {
        this.loadInterview();
    }

    loadInterview() {
        if (!this.interviewLoaded()) {
            this.props.fetchInterview(this.props.match.params.archiveId);
        }
    }

    interviewLoaded() {
        return this.props.data && this.props.data.interview && this.props.archiveId === this.props.match.params.archiveId
    }

    loggedOutContent() {
        let intervieweeNames = this.props.data.interview.interviewees[0].names[this.props.locale];

        return (
            <div>
                <div className='wrapper-video' onClick={() => this.reconnectVideoProgress()}>
                    <div className={"video-title-container"}>
                        <h1 className='video-title'>
                            {intervieweeNames.firstname} {intervieweeNames.lastname} {intervieweeNames.birthname}
                        </h1>
                    </div>
                    <div className='video-element'>
                       <img src={this.props.data.interview.still_url}/>
                    </div>
                </div>
                <div className='wrapper-content'>
                    <p>{ArchiveUtils.translate(this.props, 'not_logged_in_interview_text')}</p>
                    <p>{ArchiveUtils.translate(this.props, 'not_logged_in_go_registration')}</p>
                </div>
            </div>
        )
    }

    content() {
        if (this.interviewLoaded()) {
            let tabIndex = this.props.account.email ? 5 : 1;
            return (
                <WrapperPageContainer tabIndex={tabIndex} >
                    <AuthShowContainer ifLoggedIn={true}>
                        <VideoPlayerContainer />
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

