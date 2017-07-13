import React from 'react';
import '../styles/navigation'

export default class Navigation extends React.Component {

  changeLang() {
    let lang = this.props.lang === 'de' ? 'en' : 'de'; 
    //NavigationActionCreators.setLang(lang);
  }

  lang() {
    let lang = this.props.lang === 'de' ? 'en' : 'de'; 
    return <div className={'lang-' + lang} onClick={() => this.changeLang()} />;
  }

  playPause(){
    let css = 'video-';
    css += this.props.videoStatus === 'paused' ? 'play' : 'pause'; 
    return <div className={css}
             ref={(playPauseButton) => {this.playPauseButton = playPauseButton}} 
             onClick={() => this.props.handleVideoPlayPause()} 
           />;  
  }

  volumeWidth() {
    let value = this.props.videoVolume * 168;
    return value + 'px';
  }

  videoVolume(){
    return (<div className='video-volume'>
              <div className='turned-on' style={{width: this.volumeWidth()}}/>
              <input type='range' min='0' max='1' step='0.1' value={this.props.videoVolume}  
                ref={(videoVolume) => {this._videoVolume = videoVolume}}
                onChange={(event) => this.handleVideoVolume(event)} 
              />
            </div>);
  }

  timeWidth() {
    let value = this.props.videoTime * 1152;
    return value + 'px';
  }

  videoTime(){
    return (<div className='video-time'>
              <div className='time-past' style={{width: this.timeWidth()}}/>
              <input type='range' min='0' max='1' value={this.props.videoTime} 
                ref={(videoTime) => {this._videoTime = videoTime}}
                onChange={(event) => this.handleVideoTime(event)} 
              />
            </div>);
  }

  handleVideoVolume(event) {
    //NavigationActionCreators.setVideoVolume(event.target.value);
    //NavigationActionCreators.setVideoControlsVolume(event.target.value);
    //NavigationActionCreators.setVideoTime(this.state.videoTime + 0.001);
  }

  handleVideoTime(event) {
  }

  //handleMouseDownVideoStatus() {
    ////this.state.video.pause();
  //}

  //handleMMouseUpVideoStatus() {
    ////this.state.video.play();
  //}

  render() {
    return (
      <div className='navigation' >
        {this.lang()}
        {this.playPause()}
        {this.videoVolume()}
        {this.videoTime()}
      </div>
    );
  }
}

Navigation.propTypes = {
  handleVideoPlayPause: React.PropTypes.func,
};
