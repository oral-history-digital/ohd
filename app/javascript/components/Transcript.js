import React from 'react';
import request from 'superagent';
import Segment from '../components/Segment';

export default class Transcript extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      //transcriptTime: 0,
      //lang: 'de',
      segments: [],
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

  // sth. has to be done  here for paginated content
  //componentDidUpdate(prevProps, prevState) {
    //if (prevState.segments.length === 0 && this.state.segments.length > 0) {
      //this.loadSegments();
    //}
  //}

  loadSegments() {
    let url = '/' + this.props.lang + '/interviews/' + this.props.interviewId + '/segments';
    debugger;
    request.get(url)
      .set('Accept', 'application/json')
      .end( (error, res) => {
        if (res) {
          if (res.error) {
            debugger;
            console.log("loading segments failed: " + error);
          } else {
            debugger;
            let json = JSON.parse(res.text);
            this.setState({ segments: json });
          }
        }
      });
  }

  render () {
    debugger;
    return ( 
      <div>
        {this.state.segments.map( (segment, index) => {
          segment.lang = this.state.lang;
          return <Segment data={segment} key={"segment-" + segment.id} />
        })}
      </div>
    );
  }
}

