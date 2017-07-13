import React from 'react';

export default class VideoPlayer extends React.Component {

  componentDidUpdate() {
    if (this.video) {
      this.setVideoTime()
      this.setVideoStatus()
    }
  }

  setVideoTime(prevProps) {
    if (this.video.duration > 0 && this.props.videoTime > 0) {
      this.video.currentTime = this.props.videoTime * this.video.duration;
    }
  }

  setVideoStatus() {
    //this.video.volume = this.state.videoVolume;
    //debugger;
    //this.props.videoStatus === 'play' && !this.video.isPlaying ? this.video.play() : this.video.pause();
    this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
  }

        //onEnded={(event) => {this.handleVideoEnded(event)}}
        //onVolumeChange={this.handleVideoVolumeChange}

  render () {
    return (
      <video ref={(video) => { this.video = video; }}  
        onTimeUpdate={(event) => {this.props.handleVideoTimeUpdate(event)}}
      >
        <source src={this.props.src}/>
      </video>
    );
  }
}

VideoPlayer.propTypes = {
  handleVideoTimeUpdate: React.PropTypes.func,
};
