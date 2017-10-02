import React from 'react';

import WrapperPage from '../components/WrapperPage';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';

export default class Interview extends React.Component {
  
  componentDidMount() {
    if (!this.interviewLoaded()) {
      this.props.fetchInterview(this.props.match.params.archiveId);
    }
  }

  interviewLoaded() {
    return this.props.data && this.props.data.interview && this.props.archiveId === this.props.match.params.archiveId
  }

  //handleTranscriptScroll() {
    ////let fixVideo = $("body").hasClass("fix-video");
    //let fixVideo = ($(document).scrollTop() > 80);
    //if (fixVideo && !this.state.transcriptScrollEnabled) {
      //this.setState({ transcriptScrollEnabled: true });
    //} 
  //}

  //reconnectVideoProgress() {
    //this.setState({ transcriptScrollEnabled: false });
  //}

  content() {
    if (this.interviewLoaded()) {
      return (
        <WrapperPage 
          tabIndex={3}
        >
          <VideoPlayerContainer />
          <InterviewTabsContainer />
        </WrapperPage>
      );
    } else {
      return null;
    }
  }

  render() {
    return this.content();
  }
}

