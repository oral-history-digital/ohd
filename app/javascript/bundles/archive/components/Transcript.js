import React from 'react';
import SegmentContainer from '../containers/SegmentContainer';

export default class Transcript extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    let fixVideo = ($(document).scrollTop() > 80);
    if (fixVideo && !this.props.transcriptScrollEnabled) {
      this.props.handleTranscriptScroll(true)
      $("body").addClass("fix-video");
    } 
  }

  showSegmentsFor(time) {
    let shownSegments = this.segments().filter( segment => {
      return (segment.tape_nbr <= 1 && segment.time >= time) && (segment.time <= time + 60);
    })
    return shownSegments;
  }

  segments() {
    return this.props.interview && this.props.interview.segments || [];
  }

  render () {
    let shownSegments = this.props.transcriptScrollEnabled ? this.segments() : this.showSegmentsFor(this.props.transcriptTime);

    return ( 
      <div>
        {shownSegments.map( (segment, index) => {
          segment.locale = this.props.locale;
          return (
            <SegmentContainer
              data={segment} 
              key={"segment-" + segment.id} 
            />
          )
        })}
      </div>
    );
  }
}

