import React from 'react';
import '../styles/pages'

import Navigation from '../components/Navigation';
import VideoPlayer from '../components/VideoPlayer';

export default class Pages extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      videoStatus: 'paused',
      videoTime: 0,
      navigationTime: 0,
      volume: 1,
      lang: 'de',
    }
  }

  handleVideoTimeUpdate(event) {
    let navigationTime = (event.target.currentTime / event.target.duration);
    this.setState({ 
      navigationTime: navigationTime,
    })
  }

  handleVideoEnded(event) {
    this.setState({ 
      videoStatus: 'paused',
      videoTime: 0,
      navigationTime: 0,
    })
  }

  handleNavigationPlayPause() {
    this.setState(function(prevState, props) {
      let videoStatus;
      if (prevState.videoStatus === 'paused') {
        videoStatus = 'play'
      } else {
        videoStatus = 'paused'
      }
      return { videoStatus: videoStatus }
    });
  }

  handleNavigationVolumeChange(event) {
    this.setState({ 
      volume: event.target.value,
    })
  }

  handleNavigationTimeChange(event) {
    this.setState({ 
      videoTime: event.target.value,
    })
  }

  render() {
    return (
      <div className='app'>
        <VideoPlayer 
          src={this.props.src} 
          videoStatus={this.state.videoStatus}
          videoTime={this.state.videoTime}
          volume={this.state.volume}
          handleVideoTimeUpdate={this.handleVideoTimeUpdate.bind(this)}
          handleVideoEnded={this.handleVideoEnded.bind(this)}
        />
        <Navigation 
          videoStatus={this.state.videoStatus}
          time={this.state.navigationTime}
          volume={this.state.volume}
          lang={this.state.lang}
          handleNavigationPlayPause={this.handleNavigationPlayPause.bind(this)}
          handleNavigationVolumeChange={this.handleNavigationVolumeChange.bind(this)}
          handleNavigationTimeChange={this.handleNavigationTimeChange.bind(this)}
        />
      </div>
    );
  }
}

