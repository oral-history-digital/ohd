import React from 'react';

export default class Segment extends React.Component {
  render () {
    return (
      <p>
        <span>{this.props.data.time}</span>
        <span>{this.props.data.transcripts[this.props.data.lang]}</span>
      </p>
    )
  }
}

