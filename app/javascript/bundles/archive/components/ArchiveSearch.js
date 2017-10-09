import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreview from '../components/InterviewPreview';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';

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
          <Tabs
            className='results'
            selectedTabClassName='active'
            selectedTabPanelClassName='active'
            defaultIndex={1}
          >
            <TabList>
              <Tab className='results-tab'> Interview-Suchergebnisse </Tab>
              <Tab className='results-tab'> Orte-Suchergebnisse </Tab>
            </TabList>
            <TabPanel className='column-content'>
              {this.content()}
            </TabPanel>
            <TabPanel className='column-content'>
              <ArchiveLocationsContainer  />
            </TabPanel>
          </Tabs>
        </div>
      </WrapperPageContainer>
    )
  }
}

