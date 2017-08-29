import React from 'react';
import request from 'superagent';
import Segment from '../components/Segment';

export default class Transcript extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
    }
  }

  componentDidMount() {
    this.loadSegments();
  }

  showSegmentsFor(time) {
    let shownSegments = this.state.segments.filter( segment => {
      return (segment.tape_nbr <= 1 && segment.time >= time) && (segment.time <= time + 60);
    })
    return shownSegments;
  }

  loadSegments() {
    let url = '/de/interviews/' + this.props.interviewId + '/segments';
    request.get(url)
      .set('Accept', 'application/json')
      .end( (error, res) => {
        if (res) {
          if (res.error) {
            console.log("loading segments failed: " + error);
          } else {
            let json = JSON.parse(res.text);
            this.setState({ 
              segments: json,
            });
          }
        }
      });
  }

  render () {

    let shownSegments = this.props.transcriptScrollEnabled ? this.state.segments : this.showSegmentsFor(this.props.time);

    return ( 
      <div>
        {shownSegments.map( (segment, index) => {
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

