import React from 'react';

import WrapperPage from '../components/WrapperPage';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabs from '../components/InterviewTabs';

export default class Interview extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'de',
      //transcriptScrollEnabled: false,
    }
  }

  componentDidMount() {
    if (!this.interviewLoaded()) {
      this.props.fetchInterview(this.props.match.params.archiveId);
    }
  }

  interviewLoaded() {
    return this.props.data && this.props.data.interview && this.props.archiveId === this.props.match.params.archiveId
  }

  //handleVideoTimeChange(event) {
    //if (this.state.transcriptTime !== event.target.currentTime) {
      //this.setState({ 
        //transcriptTime: event.target.currentTime,
        ////videoTime: event.target.currentTime,
      //})
    //}
  //}

  //handleVideoEnded(event) {
    //this.setState({ 
      //playPause: 'paused',
      //videoTime: 0,
      //transcriptTime: 0,
    //})
  //}

  //handleSegmentClick(time) {
    //this.setState({ 
      //videoTime: time,
      //transcriptTime: time,
      //transcriptScrollEnabled: false 
    //})
  //}

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
          <VideoPlayerContainer
            lang={this.state.lang}
          />
          <InterviewTabs
            lang={this.state.lang}
          />
        </WrapperPage>
      );
    } else {
      return null;
    }
  }

          //<VideoPlayer 
            //src={this.props.data.interview.src} 
            //title={this.props.data.interview.title[this.state.lang]}
            //archiveId={this.props.data.interview.archive_id}
            //time={this.state.videoTime}
            //handleVideoTimeChange={this.handleVideoTimeChange.bind(this)}
            //handleVideoEnded={this.handleVideoEnded.bind(this)}
            //reconnectVideoProgress={this.reconnectVideoProgress.bind(this)}
          ///>
          //<InterviewTabs
            //transcriptScrollEnabled={this.state.transcriptScrollEnabled} 
            //transcriptTime={this.state.transcriptTime}
            //interview={this.props.data.interview}
            //segments={this.props.data.segments}
            //headings={this.prepareHeadings(this.props.data.headings)}
            //lang={this.state.lang}
            //handleSegmentClick={this.handleSegmentClick.bind(this)}
            //handleTranscriptScroll={this.handleTranscriptScroll.bind(this)}
          ///>
  render() {
    return this.content();
  }
}

