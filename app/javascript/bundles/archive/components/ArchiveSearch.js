import React from 'react';

import WrapperPage from '../components/WrapperPage';
import InterviewPreview from '../components/InterviewPreview';

export default class ArchiveSearch extends React.Component {


  render() {
    return (
      <WrapperPage 
        tabIndex={2}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.props.foundInterviews.map( (interview, index) => {
            let foundSegmentsForInterview = this.props.foundSegmentsForInterviews[interview.archive_id] !== undefined ?  this.props.foundSegmentsForInterviews[interview.archive_id] : [];
            return <InterviewPreview 
                     interview={interview} 
                     key={"interview-" + interview.id} 
                     locale={this.props.match.params.locale}
                     foundSegmentsForInterview={foundSegmentsForInterview}
                   />;
          })}
        </div>
      </WrapperPage>
    )
  }
}

