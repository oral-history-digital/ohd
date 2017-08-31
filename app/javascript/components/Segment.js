import React from 'react';
import '../css/segments';

export default class Segment extends React.Component {
  render () {
    let active = this.props.data.time >= this.props.time - 5 && this.props.data.time <= this.props.time + 20; 
    let klass = 'segment ' + (active ? 'active' : 'inactive');
    return (
      <p 
        onClick={() => this.props.handleClick(this.props.data.time)} 
        className={klass}
      >
        <span>{this.props.data.time}</span>
        <span>{this.props.data.transcripts[this.props.data.lang]}</span>
      </p>
    )
  }
}

