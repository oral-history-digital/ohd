import React from 'react';
import '../styles/pages'

import Navigation from '../components/Navigation';
import VideoPlayer from '../components/VideoPlayer';

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

  handleVideoTimeUpdate(event) {
    let value = (event.target.currentTime / event.target.duration);
    //this.setState({ 
      //videoTime: value,
      ////videoStatus: 'play',
    //})
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

        //{this.videoPlayer()}
  render() {
    return (
      <div className='app'>
        <VideoPlayer 
          src={this.props.src} 
          videoStatus={this.state.videoStatus}
          videoTime={this.state.videoTime}
          videoVolume={this.state.videoVolume}
        />
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

