import React from 'react';

export default class VideoPlayer extends React.Component {

  componentDidUpdate() {
    if (this.video) {
      this.setVideoTime()
      this.setVideoVolumne()
      this.setVideoStatus()
    }
  }

  setVideoTime() {
    if (this.video.duration > 0 && this.props.videoTime > 0) {
      this.video.currentTime = this.props.videoTime * this.video.duration;
    }
  }

  setVideoVolumne() {
    this.video.volume = this.props.videoVolume;
  }

  setVideoStatus() {
    this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
  }


  render () {
    return (
      <video ref={(video) => { this.video = video; }}  
        onTimeUpdate={(event) => {this.props.handleVideoTimeUpdate(event)}}
        onEnded={(event) => {this.props.handleVideoEnded(event)}}
        onVolumeChange={this.props.handleVideoVolumeChange}
      >
        <source src={this.props.src}/>
      </video>
    );
  }
}

VideoPlayer.propTypes = {
  handleVideoTimeUpdate: React.PropTypes.func,
  handleVideoEnded: React.PropTypes.func,
  handleVideoVolumeChange: React.PropTypes.func,
};
