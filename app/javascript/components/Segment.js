import React from 'react';

export default class Segment extends React.Component {
  render () {
    return (
      <p onClick={() => this.props.handleClick(this.props.data.time)} className={this.props.className}>
        <span>{this.props.data.time}</span>
        <span>{this.props.data.transcripts[this.props.data.lang]}</span>
      </p>
    )
  }
}

