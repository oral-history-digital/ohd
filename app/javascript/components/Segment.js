import React from 'react';

export default class Segment extends React.Component {
  render () {
    return (
      <div>
        <span>{this.props.data.time}</span>
        <span>{this.props.data.transcripts[this.props.data.lang]}</span>
      </div>
    )
  }
}

