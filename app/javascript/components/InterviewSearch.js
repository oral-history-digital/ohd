import React from 'react';

import Segment from '../components/Segment';
import SearchForm from '../components/SearchForm';

export default class InterviewSearch extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
    }
  }

  handleResults(results) {
    this.setState({ 
      segments: results.segments
    })
  }

  render () {
    return ( 
      <div>
        <SearchForm 
          url={this.props.url}
          interviewId={this.props.interviewId}
          handleResults={this.handleResults.bind(this)}
        />
        {this.state.segments.map( (segment, index) => {
          segment.lang = this.props.lang;
          return (
            <Segment 
              data={segment} 
              key={"segment-" + segment.id} 
              handleClick={this.props.handleSegmentClick}
            />
          )
        })}
      </div>
    );
  }
}

