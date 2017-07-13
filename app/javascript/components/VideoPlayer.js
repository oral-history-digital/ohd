import React from 'react';

export default class VideoPlayer extends React.Component {

  render () {
    return (
      <video ref={(video) => { this.video = video; }}  
        onTimeUpdate={(event) => {this.handleVideoTimeUpdate(event)}}
        onEnded={(event) => {this.handleVideoEnded(event)}}
        onVolumeChange={this.handleVideoVolumeChange}
      >
        <source src={this.url()}/>
      </video>
    );
  }
}

