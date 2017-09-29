import React from 'react';

export default class VideoPlayer extends React.Component {

  //shouldComponentUpdate(nextProps, nextState) {
    //let rerender = this.props.playPause !== nextProps.playPause || 
      //this.props.time !== nextProps.time || 
      //this.props.volume !== nextProps.volume 
    //return rerender;
  //}

  componentDidUpdate(prevProps, prevState) {
    if (this.video) {
      this.setVideoTime(prevProps)
      //this.setVideoVolume(prevProps)
      this.setVideoStatus(prevProps)
    }
  }

  setVideoTime(prevProps) {
    if (prevProps.time !== this.props.videoTime) {
      this.video.currentTime = this.props.videoTime;
    }
  }

  //setVideoVolume(prevProps) {
    //if (prevProps.volume !== this.props.volume) {
      //this.video.volume = this.props.volume;
    //}
  //}

  setVideoStatus(prevProps) {
    if (prevProps.videoStatus !== this.props.videoStatus) {
      this.props.videoStatus === 'play' ? this.video.play() : this.video.pause();
    }
  }


  render () {
    return (
      <div className='wrapper-video' onClick={ () => this.props.reconnectVideoProgress() }>
        <h1 className='video-title'>{this.props.interview.title[this.props.lang]}</h1>
        <div className='video-element'>
          <video ref={(video) => { this.video = video; }}  
            onTimeUpdate={(event) => {this.props.handleVideoTimeChange(event)}}
            onEnded={(event) => {this.props.handleVideoEnded()}}
            controls={true}
          >
            <source src={this.props.interview.src}/>
            <track kind="subtitles" label="Transcript" src={this.props.interview.archiveId +'.vtt?type=transcript'} srcLang="de" default></track>
            <track kind="subtitles" label="Translation" src={this.props.interview.archiveId +'.vtt?type=translation'} srcLang="en"></track>
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
