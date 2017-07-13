import React from 'react';
import '../styles/pages'

import Navigation from '../components/Navigation';

//let API = Constants.API;

export default class Pages extends React.Component {
  
  //_onChange() {
    //this.setState({ 
      //pages: PageStore.getPages(),
      //videoStatus: PageStore.getVideoStatus(),
      //videoTime: PageStore.getVideoTime(),
      //videoVolume: PageStore.getVideoVolume(),
      //lang: PageStore.getLang(),
    //});
  //}

  constructor(props, context) {
    super(props, context);

    this.state = {
      videoStatus: 'paused',
      videoTime: 0,
      videoVolume: 1,
      lang: 'de',
    }

    //this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    //PageStore.addChangeListener(this._onChange);
  }

  componentWillUpdate(nextProps, nextState) {
    //this.loadPages(nextProps);
  }

  componentDidUpdate() {
    this.setVideoState()
  }

  componentWillUnmount() {
    //PageStore.removeChangeListener(this._onChange);
  }


  videoPlayer() {
    return (
      <video ref={(video) => { this.video = video; }} 
        onTimeUpdate={(event) => {this.handleVideoTimeUpdate(event)}}
        onEnded={(event) => {this.handleVideoEnded(event)}}
        onVolumeChange={this.handleVideoVolumeChange}
      >
        <source src={this.props.src}/>
      </video>
    )
  }

  setVideoState() {
    if (this.video) {
      if (this.video.duration > 0) {
        this.video.currentTime = this.state.videoTime * this.video.duration;
      }
      this.video.volume = this.state.videoVolume;
      this.state.videoStatus === 'play' ? this.video.play() : this.video.pause();
    }
  }

  handleVideoTimeUpdate(event) {
    let value = (event.target.currentTime / this.video.duration);
    //PageActionCreators.setVideoControlsTime(value);
  }

  handleVideoEnded(event) {
    //PageActionCreators.setVideoControlsTime(0);
    //PageActionCreators.setVideoTime(0);
    //PageActionCreators.setVideoControlsStatus('paused');
    //PageActionCreators.setVideoStatus('paused');
  }

  handleVideoPlayPause() {
    this.setState(function(prevState, props) {
      let videoStatus;
      if (prevState.videoStatus === 'paused') {
        videoStatus = 'play'
      } else {
        videoStatus = 'paused'
      }
      return { videoStatus: videoStatus }
    });
    //NavigationActionCreators.setVideoTime(this.state.videoTime + 0.001);
  }

  render() {
    return (
      <div className='app'>
        {this.videoPlayer()}
        <Navigation 
          videoStatus={this.state.videoStatus}
          videoTime={this.state.videoTime}
          videoVolume={this.state.videoVolume}
          lang={this.state.lang}
          handleVideoPlayPause={this.handleVideoPlayPause.bind(this)}
        />
      </div>
    );
  }
}

