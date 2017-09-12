import React from 'react';
import request from 'superagent';

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
      segments: [],
      headings: [],
    }
  }

  componentDidMount() {
    this.loadSegments();
  }

  loadSegments() {
    let url = '/de/interviews/' + this.state.interview.id + '/segments';
    request.get(url)
      .set('Accept', 'application/json')
      .end( (error, res) => {
        if (res) {
          if (res.error) {
            console.log("loading segments failed: " + error);
          } else {
            let json = JSON.parse(res.text);
            this.setState({ 
              segments: json.segments,
              headings: this.prepareHeadings(json.headings)
            });
          }
        }
      });
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

  render() {
    return (
      <div className='interview'>
        <VideoPlayer 
          src={this.props.src} 
          title={this.state.interview.title[this.state.lang]}
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
          interview={this.state.interview}
          segments={this.state.segments}
          headings={this.state.headings}
          lang={this.state.lang}
          handleSegmentClick={this.handleSegmentClick.bind(this)}
          handleTranscriptScroll={this.handleTranscriptScroll.bind(this)}
        />
      </div>
    );
  }
}

