import React from 'react';
import request from 'superagent';

import WrapperPage from '../components/WrapperPage';
import InterviewPreview from '../components/InterviewPreview';

export default class Interviews extends React.Component {

  render() {
    return (
      <WrapperPage 
        tabIndex={this.props.tabIndex}
        appState={this.props.appState}
        archiveSearch={this.props.archiveSearch}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.props.appState.interviews.map( (interview, index) => {
            return <InterviewPreview 
                     interview={interview} 
                     key={"interview-" + interview.id} 
                     lang={this.props.match.params.lang}
                   />;
          })}
        </div>
      </WrapperPage>
    )
  }
}

