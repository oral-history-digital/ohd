import React from 'react';

import WrapperPage from '../components/WrapperPage';
import InterviewPreview from '../components/InterviewPreview';

export default class Search extends React.Component {


  render() {
    return (
      <WrapperPage 
        tabIndex={2}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.props.foundInterviews.map( (interview, index) => {
            let segmentsForInterview = this.props.segmentsForInterviews[interview.archive_id] !== undefined ?  this.props.segmentsForInterviews[interview.archive_id] : [];
            return <InterviewPreview 
                     interview={interview} 
                     key={"interview-" + interview.id} 
                     locale={this.props.match.params.locale}
                     segmentsForInterview={segmentsForInterview}
                   />;
          })}
        </div>
      </WrapperPage>
    )
  }
}

