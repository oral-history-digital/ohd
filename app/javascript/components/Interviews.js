import React from 'react';
import request from 'superagent';

import WrapperPage from '../components/WrapperPage';
import InterviewPreview from '../components/InterviewPreview';

export default class Interviews extends React.Component {


  render() {
    return (
      <WrapperPage 
        tabIndex={2}
        appState={this.props.appState}
        archiveSearch={this.props.archiveSearch}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.props.appState.interviews.map( (interview, index) => {
            let segmentsForInterview = this.props.appState.segments_for_interviews[interview.archive_id] !== undefined ?  this.props.appState.segments_for_interviews[interview.archive_id] : [];
            return <InterviewPreview 
                     interview={interview} 
                     key={"interview-" + interview.id} 
                     lang={this.props.match.params.lang}
                     segmentsForInterview={segmentsForInterview}
                   />;
          })}
        </div>
      </WrapperPage>
    )
  }
}

