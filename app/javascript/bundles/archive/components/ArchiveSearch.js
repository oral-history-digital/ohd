import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';

export default class ArchiveSearch extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


  content() {
    if (this.props.isArchiveSearching) {
      return <img src="/images/eog/large_spinner.gif" className="archive-search-spinner"/>;
    } else {
      return (
        this.props.foundInterviews.map( (interview, index) => {
          //let interviewData = this.props.interviews[interview.archive_id];
          //let foundSegmentsForInterview = interviewData && interviewData.foundSegments || [];
                   //foundSegmentsForInterview={foundSegmentsForInterview}
          return <InterviewPreviewContainer
                   interview={interview}
                   key={"interview-" + interview.id}
                 />;
        })
      )
    }
  }


    handleClick(event){
        let page = ($(event.target).data().page);
        let query = this.props.searchQuery;
        query['page'] = page;
        this.props.searchInArchive(this.props.url, query);
    }


    renderPaginationTabs() {
        if (this.props.resultPagesCount > 1) {

            let resultPages = []
            for (let i = 1; i <= this.props.resultPagesCount; i++){
                resultPages.push(i);
            }

            return resultPages.map((page, index) => {
                return (
                    <button
                        className='pagination-button'
                        data-page={page}
                        key={"page-" + index}
                        onClick={this.handleClick}>
                        {page}
                    </button>
                )
            })
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
            <TabPanel forceRender={true} className='column-content'>
                {this.renderPaginationTabs()}
              {this.content()}
                {this.renderPaginationTabs() }
            </TabPanel>
            <TabPanel forceRender={true} className='column-content'>
              <ArchiveLocationsContainer  />
            </TabPanel>
          </Tabs>
        </div>
      </WrapperPageContainer>
    )
  }
}

