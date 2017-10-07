import React from 'react';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreview from '../components/InterviewPreview';

export default class ArchiveSearch extends React.Component {


  content() {
    if (this.props.isArchiveSearching) {
      return <img src="/images/eog/large_spinner.gif" className="archive-search-spinner"/>;
    } else {
      return (
        this.props.foundInterviews.map( (interview, index) => {
          let interviewData = this.props.interviews[interview.archive_id];
          let foundSegmentsForInterview = interviewData && interviewData.foundSegments || [];
          return <InterviewPreview 
                   interview={interview} 
                   key={"interview-" + interview.id} 
                   locale={this.props.match.params.locale}
                   foundSegmentsForInterview={foundSegmentsForInterview}
                 />;
        })
      )
    }
  }

  render() {
    return (
      <WrapperPageContainer 
        tabIndex={2}
      >
        <div className='interviews wrapper-content'>
          <h1 className='search-results-title'>Suchergebnisse</h1>
          {this.content()}
        </div>
      </WrapperPageContainer>
    )
  }
}

