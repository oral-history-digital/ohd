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

  handleResults(results) {
    this.setState({ 
      segments: results.segments
    })
  }

  handleFacetClick() {
    console.log('Please implement handleFacetClick in InterviewSearch-component');
  }

  handleInterviewClick() {
    console.log('Please implement handleInterviewClick in InterviewSearch-component');
  }

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
    if(this.state.facets) {
      return this.state.facets.map( (facet, index) => {
        facet.lang = this.props.lang;
        return (
          <Segment 
            data={facet} 
            key={"facet-" + facet.id} 
            handleClick={this.handleFacetClick}
          />
        )
      })
    }
  }

  renderInterviews() {
    if(this.state.interviews) {
      return this.state.interviews.map( (interview, index) => {
        interview.lang = this.props.lang;
        return (
          <Segment 
            data={interview} 
            key={"interview-" + interview.id} 
            handleClick={this.handleInterviewClick}
          />
        )
      })
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

        //{
      //this.state.segments.map( (segment, index) => {
        //segment.lang = this.props.lang;
        //return (
          //<Segment 
            //data={segment} 
            //key={"segment-" + segment.id} 
            //handleClick={this.props.handleSegmentClick}
          ///>
        //)
      //})
        //}
