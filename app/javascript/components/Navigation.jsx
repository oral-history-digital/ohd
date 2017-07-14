import React from 'react';
import '../styles/navigation'

export default class Navigation extends React.Component {

  lang() {
    let lang = this.props.lang === 'de' ? 'en' : 'de'; 
    return <div className={'lang-' + lang} onClick={() => this.props.handleNavigationLangChange()} />;
  }

  playPause(){
    let css = 'video-';
    css += this.props.videoStatus === 'paused' ? 'play' : 'pause'; 
    return <div className={css}
             ref={(playPauseButton) => {this.playPauseButton = playPauseButton}} 
             onClick={() => this.props.handleNavigationPlayPause()} 
           />;  
  }

  volumeWidth() {
    let value = this.props.volume * 168;
    return value + 'px';
  }

  volume(){
    return (<div className='video-volume'>
              <div className='turned-on' style={{width: this.volumeWidth()}}/>
              <input type='range' min='0' max='1' step='0.1' value={this.props.volume}  
                ref={(volume) => {this._volume = volume}}
                onChange={(event) => this.props.handleNavigationVolumeChange(event)} 
              />
            </div>);
  }

  timeWidth() {
    let value = this.props.time * 1152;
    return value + 'px';
  }

  time(){
    return (<div className='video-time'>
              <div className='time-past' style={{width: this.timeWidth()}}/>
              <input type='range' min='0' max='1' value={this.props.time} 
                ref={(time) => {this._time = time}}
                onChange={(event) => this.props.handleNavigationTimeChange(event)} 
              />
            </div>);
  }

  render() {
    return (
      <div className='navigation' >
        {this.lang()}
        {this.playPause()}
        {this.volume()}
        {this.time()}
      </div>
    );
  }
}

Navigation.propTypes = {
  handleNavigationPlayPause: React.PropTypes.func,
  handleNavigationVolumeChange: React.PropTypes.func,
  handleNavigationTimeChange: React.PropTypes.func,
  handleNavigationLangChange: React.PropTypes.func,
};
