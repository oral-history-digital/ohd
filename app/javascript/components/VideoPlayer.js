import React from 'react';

export default class VideoPlayer extends React.Component {

  componentDidUpdate() {
    this.setVideoState()
  }

  setVideoState() {
    if (this.video) {
      this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
    }
  }

  render () {
    return (
      <video ref={(video) => { this.video = video; }}  
      >
        <source src={this.props.src}/>
      </video>
    );
  }
}

