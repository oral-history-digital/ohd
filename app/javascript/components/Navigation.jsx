import React from 'react';
import '../styles/navigation'

export default class Navigation extends React.Component {
  
  //_onChange() {
    //this.setState({ 
      //videoTime: NavigationStore.getVideoTime(),
      //videoStatus: NavigationStore.getVideoStatus(),
      //videoVolume: NavigationStore.getVideoVolume(),
      //lang: NavigationStore.getLang(),
    //});
  //}

  constructor(props, context) {
    super(props, context);

    this.state = { 
      //linkID: this.props.linkID,
      videoStatus: this.props.videoStatus,
      videoTime: this.props.videoTime,
      videoVolume: this.props.videoVolume,
      lang: this.props.lang, 
    }

    //this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    //NavigationStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    //NavigationStore.removeChangeListener(this._onChange);
  }

  changeLang() {
    let lang = this.state.lang === 'de' ? 'en' : 'de'; 
    //NavigationActionCreators.setLang(lang);
  }

  lang() {
    let lang = this.state.lang === 'de' ? 'en' : 'de'; 
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
    let value = this.state.videoVolume * 168;
    return value + 'px';
  }

  videoVolume(){
    return (<div className='video-volume'>
              <div className='turned-on' style={{width: this.volumeWidth()}}/>
              <input type='range' min='0' max='1' step='0.1' value={this.state.videoVolume}  
                ref={(videoVolume) => {this._videoVolume = videoVolume}}
                onChange={(event) => this.handleVideoVolume(event)} 
              />
            </div>);
  }

  timeWidth() {
    let value = this.state.videoTime * 1152;
    return value + 'px';
  }

  videoTime(){
    return (<div className='video-time'>
              <div className='time-past' style={{width: this.timeWidth()}}/>
              <input type='range' min='0' max='1' value={this.state.videoTime} 
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
