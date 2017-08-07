import React from 'react';

export default class Heading extends React.Component {

  text() {
    if (this.props.segment.mainheading === undefined) {
      return this.props.segment.subheading;
    } else {
      return this.props.segment.mainheading;
    }
  }

  render () {
    return (
      <p className={this.props.main ? 'mainheading' : 'subheading'}>
        <span>{this.props.index}</span>
        <a onClick={() => this.props.handleChapterChange(this.props.segment.time)}>
          {this.text()}
        </a> 
      </p>
    )
  }
}

