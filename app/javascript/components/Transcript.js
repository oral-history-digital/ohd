import React from 'react';
import request from 'superagent';
import Segment from '../components/Segment';

export default class Transcript extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
      shownSegments: [],
    }
  }

  //shouldComponentUpdate(nextProps, nextState) {
    //let rerender = 
      ////this.props.lang !== nextProps.lang || 
      //this.props.time !== nextProps.time 
    //return rerender;
  //}

  componentDidMount() {
    this.loadSegments();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.time !== this.props.time) {
      this.setShownSegments();
    }
  }

  setShownSegments() {
    let shownSegments = this.state.segments.filter( segment => {
      return (segment.tape_nbr === 1 && segment.time >= this.props.time) && (segment.time <= this.props.time + 60);
    })
    this.setState({ shownSegments: shownSegments })
  }

  loadSegments() {
    //let url = '/' + this.props.lang + '/interviews/' + this.props.interviewId + '/segments';
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
              shownSegments: json.slice(0,10) 
            });
          }
        }
      });
  }

  render () {
    return ( 
      <div>
        {this.state.shownSegments.map( (segment, index) => {
          segment.lang = this.props.lang;
          return <Segment data={segment} key={"segment-" + segment.id} />
        })}
      </div>
    );
  }
}

