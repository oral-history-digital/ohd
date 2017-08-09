import React from 'react';
import request from 'superagent';

export default class TableOfContents extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      headings: [],
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
              headings: this.prepareHeadings(json)
            });
          }
        }
      });
  }

  prepareHeadings(segments) {
    let mainIndex = 0;
    let mainheading = '';
    let subIndex = 0;
    let subheading = '';
    let headings = [];

    segments.map( (segment, index) => {
      
      if (segment.mainheading !== '') {
        mainIndex += 1;
        subIndex = 0;
        mainheading = mainIndex + '. ' + segment.mainheading;
        headings.push({main: true, heading: mainheading, time: segment.time});
      }
      if (segment.subheading !== '') {
        subIndex += 1;
        subheading = mainIndex + '.' + subIndex + '. ' + segment.subheading;
        headings.push({main: false, heading: subheading, time: segment.time});
      }
    })

    return headings;
  }

  content(heading, index) {
    return (
      <p className={heading.main ? 'mainheading' : 'subheading'} key={'heading-' + index} >
        <a onClick={() => this.props.handleSegmentClick(heading.time)}>
          {heading.heading}
        </a> 
      </p>
    );
  }

  render () {
    return ( 
      <div>
        {this.state.headings.map( (heading, index) => {
          return this.content(heading, index);
        })}
      </div>
    );
  }
}

