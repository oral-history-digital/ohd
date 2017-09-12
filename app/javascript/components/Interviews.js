import React from 'react';
import request from 'superagent';

import InterviewPreview from '../components/InterviewPreview';

export default class Interviews extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'de',
      interviews: [],
    }
  }

  componentDidMount() {
    this.loadInterviews();
  }

  loadInterviews() {
    let url = '/suchen';
    request.get(url)
      .set('Accept', 'application/json')
      .end( (error, res) => {
        if (res) {
          if (res.error) {
            console.log("loading interviews failed: " + error);
          } else {
            let json = JSON.parse(res.text);
            this.setState({ 
              interviews: json.interviews,
            });
          }
        }
      });
  }

  render() {
    debugger;
    return (
      <div className='interviews wrapper-content'>
        <h1 className='search-results-title'>Suchergebnisse</h1>
        {this.state.interviews.map( (interview, index) => {
          return <InterviewPreview interview={interview} key={"interview-" + interview.id} />;
        })}
      </div>
    )
  }
}

