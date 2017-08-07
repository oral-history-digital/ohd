import React from 'react';
import request from 'superagent';
import Heading from '../components/Heading';

export default class TableOfContents extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
    }
  }

  componentDidMount() {
    this.loadSegments();
  }

  loadSegments() {
    let url = '/de/interviews/' + this.props.interviewId + '/segments?only_headings=true';
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
    return ( 
      <div>
        {this.state.segments.map( (segment, index) => {
          segment.lang = this.props.lang;
          return <Heading data={segment} key={"segment-" + segment.id} handleChapterChange={this.props.handleChapterChange}/>
        })}
      </div>
    );
  }
}

