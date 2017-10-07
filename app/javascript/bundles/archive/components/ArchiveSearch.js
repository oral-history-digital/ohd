import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreview from '../components/InterviewPreview';

export default class ArchiveSearch extends React.Component {


  render() {
    return (
      <WrapperPageContainer 
        tabIndex={2}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.props.foundInterviews.map( (interview, index) => {
            let interviewData = this.props.interviews[interview.archive_id];
            let foundSegmentsForInterview = interviewData && interviewData.foundSegments || [];
            return <InterviewPreview 
                     interview={interview} 
                     key={"interview-" + interview.id} 
                     locale={this.props.match.params.locale}
                     foundSegmentsForInterview={foundSegmentsForInterview}
                   />;
          })}
        </div>
      </WrapperPageContainer>
    )
  }
}

