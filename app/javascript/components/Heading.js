import React from 'react';

export default class Heading extends React.Component {

  text() {
    if (this.props.data.mainheading === undefined) {
      return this.props.data.subheading;
    } else {
      return this.props.data.mainheading;
    }
  }

  render () {
    return (
      <p>
        <span>000</span>
        <a onClick={() => this.props.handleChapterChange(this.props.data.time)}>
          {this.text()}
        </a> 
      </p>
    )
  }
}

