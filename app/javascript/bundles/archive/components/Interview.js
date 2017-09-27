import React from 'react';

import WrapperPage from '../components/WrapperPage';
import VideoPlayer from '../components/VideoPlayer';
import InterviewTabs from '../components/InterviewTabs';

export default class Interview extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'de',
      playPause: 'paused',
      videoTime: this.props.videoTime || 0,
      transcriptTime: 0,
      transcriptScrollEnabled: false,
      volume: 1,
    }
  }

  componentDidMount() {
    if (!this.interviewLoaded()) {
      //Loader.getJson('/de/interviews/' + this.props.match.params.archiveId + '/segments', null, this.loadInterview.bind(this));
      //Loader.getJson('/de/interviews/' + this.props.match.params.archiveId + '/segments', null, this.props.setAppState);
      //fetchInterviewIfNeeded(this.props.match.params.archiveId)
      //const { dispatch, fetchInterview } = this.props
      this.props.fetchInterview(this.props.match.params.archiveId);

      //this.props.dispatch(fetchInterview(this.props.match.params.archiveId));
    }
  }

  componentDidUpdate() {
  }

  interviewLoaded() {
    return this.props.data && this.props.data.interview && this.props.archiveId === this.props.match.params.archiveId
  }

  prepareHeadings(segments) {
    let mainIndex = 0;
    let mainheading = '';
    let subIndex = 0;
    let subheading = '';
    let headings = [];

    segments.map( (segment, index) => {
      
      if (segment.mainheading !== '') {
        mainIndex += 1;
        subIndex = 0;
        mainheading = mainIndex + '. ' + segment.mainheading;
        headings.push({main: true, heading: mainheading, time: segment.time, subheadings: []});
      }
      if (segment.subheading !== '') {
        subIndex += 1;
        subheading = mainIndex + '.' + subIndex + '. ' + segment.subheading;
        headings[mainIndex - 1].subheadings.push({main: false, heading: subheading, time: segment.time});
      }
    })

    return headings;
  }

  handleVideoTimeChange(event) {
    if (this.state.transcriptTime !== event.target.currentTime) {
      this.setState({ 
        transcriptTime: event.target.currentTime,
        //videoTime: event.target.currentTime,
      })
    }
  }

  handleVideoEnded(event) {
    this.setState({ 
      playPause: 'paused',
      videoTime: 0,
      transcriptTime: 0,
    })
  }

  handleSegmentClick(time) {
    this.setState({ 
      videoTime: time,
      transcriptTime: time,
      transcriptScrollEnabled: false 
    })
  }

  handleTranscriptScroll() {
    //let fixVideo = $("body").hasClass("fix-video");
    let fixVideo = ($(document).scrollTop() > 80);
    if (fixVideo && !this.state.transcriptScrollEnabled) {
      this.setState({ transcriptScrollEnabled: true });
    } 
  }

  reconnectVideoProgress() {
    this.setState({ transcriptScrollEnabled: false });
  }

  content() {
    if (this.interviewLoaded()) {
      return (
        <WrapperPage 
          tabIndex={3}
          appState={this.props.appState}
          archiveSearch={this.props.archiveSearch}
        >
          <VideoPlayer 
            src={this.props.data.interview.src} 
            title={this.props.data.interview.title[this.state.lang]}
            playPause={this.state.playPause}
            time={this.state.videoTime}
            volume={this.state.volume}
            handleVideoTimeChange={this.handleVideoTimeChange.bind(this)}
            handleVideoEnded={this.handleVideoEnded.bind(this)}
            reconnectVideoProgress={this.reconnectVideoProgress.bind(this)}
          />
          <InterviewTabs
            transcriptScrollEnabled={this.state.transcriptScrollEnabled} 
            transcriptTime={this.state.transcriptTime}
            interview={this.props.data.interview}
            segments={this.props.data.segments}
            headings={this.prepareHeadings(this.props.data.headings)}
            lang={this.state.lang}
            handleSegmentClick={this.handleSegmentClick.bind(this)}
            handleTranscriptScroll={this.handleTranscriptScroll.bind(this)}
          />
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

