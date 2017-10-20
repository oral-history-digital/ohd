import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

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
                <div>
                    {this.renderPagination()}
                    {this.foundInterviews()}
                    {this.renderPagination()}
                </div>
            )
        }
    }


    foundInterviews() {
        return (
            this.props.foundInterviews.map((interview, index) => {
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

    handleClick(event) {
        let page = ($(event.target).data().page);
        let query = this.props.searchQuery;
        query['page'] = page;
        this.props.searchInArchive(query);
    }

    renderPagination() {
        if (this.props.resultPagesCount > 1) {
            return (
                <div className='pagination'>
                    {this.renderPaginationTabs()}
                </div>
            )
        }
    }


    renderPaginationTabs() {

        let resultPages = []
        for (let i = 1; i <= this.props.resultPagesCount; i++) {
            resultPages.push(i);
        }
        let query = this.props.searchQuery;
        let actualPage = query['page'] != undefined ? query['page'] : 1;


        return resultPages.map((page, index) => {
            let pageClass = 'pagination-button'
            if (actualPage == page) {
                pageClass = 'pagination-button active'
            }
            return (
                <div
                    className={pageClass}
                    data-page={page}
                    key={"page-" + index}
                    onClick={this.handleClick}>
                    {page}
                </div>
            )
        })

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
                            {this.content()}
                        </TabPanel>
                        <TabPanel forceRender={true} className='column-content'>
                            <div>
                                {this.renderPagination()}
                                <ArchiveLocationsContainer/>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            </WrapperPageContainer>
        )
    }
}

