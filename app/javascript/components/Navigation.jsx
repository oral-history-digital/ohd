import React from 'react';
import '../styles/navigation'

export default class Navigation extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    let rerender = this.props.lang !== nextProps.lang || 
      this.props.videoStatus !== nextProps.videoStatus || 
      this.props.time !== nextProps.time || 
      this.props.volume !== nextProps.volume 
    return rerender;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props;
  }

  lang() {
    let lang = this.props.lang === 'de' ? 'en' : 'de'; 
    return <div className={'lang-' + lang} onClick={() => this.props.handleNavigationLangChange()} />;
  }

  playPause(){
    let css = 'video-';
    css += this.props.videoStatus === 'paused' ? 'play' : 'pause'; 
    return <div className={css}
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
              <input type='range' min='0' max='1' step='0.0001' value={this.props.volume}  
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
              <input type='range' min='0' max='1' step={1/this.props.duration} value={this.props.time} 
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
  handleNavigationLangChange: React.PropTypes.func,
  handleNavigationPlayPause: React.PropTypes.func,
  handleNavigationVolumeChange: React.PropTypes.func,
  handleNavigationTimeChange: React.PropTypes.func,
};
