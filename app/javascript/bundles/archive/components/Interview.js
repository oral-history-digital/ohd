import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';

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

    content() {
        if (this.interviewLoaded()) {
            return (
                <WrapperPageContainer 
                tabIndex={5}
                >
                <VideoPlayerContainer />
                <InterviewTabsContainer/>
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

