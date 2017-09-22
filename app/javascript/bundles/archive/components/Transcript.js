import React from 'react';
import Segment from '../components/Segment';

export default class Transcript extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.props.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.props.handleScroll.bind(this));
  }

  showSegmentsFor(time) {
    let shownSegments = this.props.segments.filter( segment => {
      return (segment.tape_nbr <= 1 && segment.time >= time) && (segment.time <= time + 60);
    })
    return shownSegments;
  }


  render () {
    let shownSegments = this.props.transcriptScrollEnabled ? this.props.segments : this.showSegmentsFor(this.props.time);

    return ( 
      <div>
        {shownSegments.map( (segment, index) => {
          segment.lang = this.props.lang;
          return (
            <Segment 
              data={segment} 
              time={this.props.time}
              key={"segment-" + segment.id} 
              handleClick={this.props.handleSegmentClick}
            />
          )
        })}
      </div>
    );
  }
}

