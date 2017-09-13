import React from 'react';
import { Link, hashHistory } from 'react-router-dom';

export default class InterviewPreview extends React.Component {
  
  handleClick() {

  }

  render() {
    return (
      <div 
        className='interview-preview search-result'
        onClick={this.handleClick()}  
      >
        <img src={this.props.interview.still_url} />
        <h3>{this.props.interview.short_title[this.props.lang]}</h3>
      </div>
    );
  }
}

