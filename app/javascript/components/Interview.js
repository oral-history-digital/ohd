import React from 'react';

//import Navigation from '../components/Navigation';
import VideoPlayer from '../components/VideoPlayer';
//import Transcript from '../components/Transcript';
import InterviewTabs from '../components/InterviewTabs';

export default class Interview extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      playPause: 'paused',
      videoTime: 0,
      navigationTime: 0,
      transcriptTime: 0,
      volume: 1,
      lang: this.props.origLang,
    }
  }

  handleVideoTimeChange(event) {
    let navigationTime = (event.target.currentTime / this.props.duration);
    if (this.state.transcriptTime !== event.target.currentTime && this.state.navigationTime !== navigationTime) {
      this.setState({ 
        navigationTime: navigationTime,
        transcriptTime: event.target.currentTime,
        //videoTime: event.target.currentTime,
      })
    }
  }

  handleVideoEnded(event) {
    this.setState({ 
      playPause: 'paused',
      videoTime: 0,
      navigationTime: 0,
      transcriptTime: 0,
    })
  }

  handleNavigationPlayPause() {
    this.setState(function(prevState, props) {
      let playPause;
      if (prevState.playPause === 'paused') {
        playPause = 'play'
      } else {
        playPause = 'paused'
      }
      return { playPause: playPause }
    });
  }

  handleNavigationVolumeChange(event) {
    this.setState({ 
      volume: event.target.value,
    })
  }

  handleNavigationTimeChange(event) {
    let transcriptTime = this.props.duration * event.target.value;
    this.setState({ 
      videoTime: event.target.value,
      navigationTime: event.target.value,
      transcriptTime: transcriptTime,
    })
  }

  handleNavigationLangChange() {
    let lang = this.state.lang === 'de' ? this.props.origLang : 'de'; 
    this.setState({ 
      lang: lang,
    })
  }

        //<Navigation 
          //playPause={this.state.playPause}
          //time={this.state.navigationTime}
          //volume={this.state.volume}
          //duration={this.props.duration}
          //lang={this.state.lang}
          //handleNavigationPlayPause={this.handleNavigationPlayPause.bind(this)}
          //handleNavigationVolumeChange={this.handleNavigationVolumeChange.bind(this)}
          //handleNavigationTimeChange={this.handleNavigationTimeChange.bind(this)}
          //handleNavigationLangChange={this.handleNavigationLangChange.bind(this)}
        ///>

        //<Transcript
          //time={this.state.transcriptTime}
          //interviewId={this.props.interviewId}
          //lang={this.state.lang}
        ///>

  render() {
    return (
      <div className='app'>
        <VideoPlayer 
          src={this.props.src} 
          title={this.props.title}
          playPause={this.state.playPause}
          time={this.state.videoTime}
          volume={this.state.volume}
          handleVideoTimeChange={this.handleVideoTimeChange.bind(this)}
          handleVideoEnded={this.handleVideoEnded.bind(this)}
        />
        <InterviewTabs
          transcriptTime={this.state.transcriptTime}
          interviewId={this.props.interviewId}
          lang={this.state.lang}
        />
      </div>
    );
  }
}

