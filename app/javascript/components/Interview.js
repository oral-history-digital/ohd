import React from 'react';

import VideoPlayer from '../components/VideoPlayer';
import InterviewTabs from '../components/InterviewTabs';

export default class Interview extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      playPause: 'paused',
      videoTime: 0,
      transcriptTime: 0,
      transcriptScrollEnabled: false,
      volume: 1,
      lang: 'de',
      interview: JSON.parse(this.props.interview),
    }
  }

  handleVideoTimeChange(event) {
    if (this.state.transcriptTime !== event.target.currentTime && !this.state.transcriptScrollEnabled) {
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
    })
  }

  handleTranscriptScroll() {
    //let fixVideo = $("body").hasClass("fix-video");
    let fixVideo = ($(document).scrollTop() > 80);
    if (fixVideo && !this.state.transcriptScrollEnabled) {
      this.setState({ transcriptScrollEnabled: true });
    } else if (!fixVideo && this.state.transcriptScrollEnabled) {
      this.setState({ transcriptScrollEnabled: false });
    }
  }

  render() {
    return (
      <div className='app'>
        <VideoPlayer 
          src={this.props.src} 
          title={this.state.interview.title}
          playPause={this.state.playPause}
          time={this.state.videoTime}
          volume={this.state.volume}
          handleVideoTimeChange={this.handleVideoTimeChange.bind(this)}
          handleVideoEnded={this.handleVideoEnded.bind(this)}
        />
        <InterviewTabs
          transcriptScrollEnabled={this.state.transcriptScrollEnabled} 
          transcriptTime={this.state.transcriptTime}
          interview={this.state.interview}
          lang={this.state.lang}
          handleSegmentClick={this.handleSegmentClick.bind(this)}
          handleTranscriptScroll={this.handleTranscriptScroll.bind(this)}
        />
      </div>
    );
  }
}

