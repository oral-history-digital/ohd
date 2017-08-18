import React from 'react';

import Segment from '../components/Segment';
import SearchForm from '../components/SearchForm';

export default class InterviewSearch extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
      facets: [],
      interviews: [],
    }
  }

  componentDidUpdate() {
    this.renderInterviews();
  }

  handleResults(results) {
    this.setState({ 
      segments: results.segments,
      facets: results.facets,
      interviews: results.interviews
    })
  }

  handleFacetClick() {
    console.log('Please implement handleFacetClick in InterviewSearch-component');
  }

  //handleInterviewClick() {
    //console.log('Please implement handleInterviewClick in InterviewSearch-component');
  //}

  renderSegments() {
    if(this.state.segments) {
      return this.state.segments.map( (segment, index) => {
        segment.lang = this.props.lang;
        return (
          <Segment 
            data={segment} 
            key={"segment-" + segment.id} 
            handleClick={this.props.handleSegmentClick}
          />
        )
      })
    }
  }

  renderFacets() {
    if(this.state.facets && this.state.facets.query_facets) {
      return this.state.facets.unqueried_facets.map( (facet, index) => {
        facet.lang = this.props.lang;
        return (
          <div className='facet'>
            ...
          </div>
        )
      })
    }
  }

  renderInterviews() {
    if(this.state.interviews) {
      if(this.state.interviews.length > 0) {
        $('.wrapper-content').replaceWith(this.state.interviews);
      }
    }
  }

  render () {
    return ( 
      <div>
        <SearchForm 
          url={this.props.url}
          interviewId={this.props.interviewId}
          handleResults={this.handleResults.bind(this)}
        />
        {this.renderSegments()}
        {this.renderFacets()}
      </div>
    );
  }
}

