import React from 'react';
import { Link, hashHistory } from 'react-router-dom';

export default class InterviewPreview extends React.Component {
  
  render() {
    return (
      <Link 
        className='interview-preview search-result' 
        to={'/' + this.props.lang + '/interviews/' + this.props.interview.archive_id} 
      >
        <img src={this.props.interview.still_url} />
        <h3>{this.props.interview.short_title[this.props.lang]}</h3>
      </Link>
    );
  }
}

