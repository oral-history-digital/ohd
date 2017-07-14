import React from 'react';
import '../styles/pages'

import Navigation from '../components/Navigation';
import VideoPlayer from '../components/VideoPlayer';
import Transcript from '../components/Transcript';

export default class Interview extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      playPause: 'paused',
      videoTime: 0,
      navigationTime: 0,
      transcriptTime: 0,
      volume: 1,
      lang: 'de',
    }
  }

  handleVideoTimeChange(event) {
    let navigationTime = (event.target.currentTime / event.target.duration);
    this.setState({ 
      navigationTime: navigationTime,
      transcriptTime: navigationTime,
    })
  }

  handleVideoEnded(event) {
    this.setState({ 
      playPause: 'paused',
      videoTime: 0,
      navigationTime: 0,
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
      transcriptTime: transcriptTime,
    })
  }

  handleNavigationLangChange() {
    let lang = this.state.lang === 'de' ? 'en' : 'de'; 
    this.setState({ 
      lang: lang,
    })
  }

  render() {
    return (
      <div className='app'>
        <VideoPlayer 
          src={this.props.src} 
          playPause={this.state.playPause}
          time={this.state.videoTime}
          volume={this.state.volume}
          handleVideoTimeChange={this.handleVideoTimeChange.bind(this)}
          handleVideoEnded={this.handleVideoEnded.bind(this)}
        />
        <Navigation 
          playPause={this.state.playPause}
          time={this.state.navigationTime}
          volume={this.state.volume}
          duration={this.props.duration}
          lang={this.state.lang}
          handleNavigationPlayPause={this.handleNavigationPlayPause.bind(this)}
          handleNavigationVolumeChange={this.handleNavigationVolumeChange.bind(this)}
          handleNavigationTimeChange={this.handleNavigationTimeChange.bind(this)}
          handleNavigationLangChange={this.handleNavigationLangChange.bind(this)}
        />
        <Transcript
          time={this.state.transcriptTime}
          interviewId={this.state.interviewId}
        />
      </div>
    );
  }
}

