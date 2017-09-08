import React from 'react';

export default class VideoPlayer extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    let rerender = this.props.playPause !== nextProps.playPause || 
      this.props.time !== nextProps.time || 
      this.props.volume !== nextProps.volume 
    return rerender;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.video) {
      this.setVideoTime(prevProps)
      this.setVideoVolume(prevProps)
      this.setVideoStatus(prevProps)
    }
  }

  setVideoTime(prevProps) {
    if (prevProps.time !== this.props.time) {
      this.video.currentTime = this.props.time;
    }
  }

  setVideoVolume(prevProps) {
    if (prevProps.volume !== this.props.volume) {
      this.video.volume = this.props.volume;
    }
  }

  setVideoStatus(prevProps) {
    if (prevProps.playPause !== this.props.playPause) {
      this.props.playPause === 'play' ? this.video.play() : this.video.pause();
    }
  }


  render () {
    return (
      <div className='wrapper-video' onClick={ () => this.props.reconnectVideoProgress() }>
        <h1 className='video-title'>{this.props.title}</h1>
        <div className='video-element'>
          <video ref={(video) => { this.video = video; }}  
            onTimeUpdate={(event) => {this.props.handleVideoTimeChange(event)}}
            onEnded={(event) => {this.props.handleVideoEnded(event)}}
            controls={true}
          >
            <source src={this.props.src}/>
          </video>
        </div>
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  handleVideoTimeUpdate: React.PropTypes.func,
  handleVideoEnded: React.PropTypes.func,
};
