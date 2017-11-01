import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';

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
                    <div className={'search-results-container'}>
                        {this.foundInterviews()}
                    </div>
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

    saveSearchForm() {
        return  <UserContentFormContainer
            title=''
            description=''
            properties={Object.assign({}, this.props.searchQuery, {fulltext: this.props.fulltext})}
            type='Search'
        />
    }


    render() {
        return (
            <WrapperPageContainer
                tabIndex={2}
            >
                <div className='interviews wrapper-content'>
                    <h1 className="search-results-title">Suchergebnisse</h1>
                    <div className="search-result-legend">
                        <div className="search-result-legend-text">50 Suchergebnisse</div>
                        <div className="search-result-legend-ico">
                            <div className="search-result-ico-link" onClick={() => this.props.openArchivePopup({
                                title: 'Save search',
                                content: this.saveSearchForm()
                            })}>
                                <i className="fa fa-search"></i>Suche speichern</div>
                        </div>

                    </div>

                    <Tabs
                        className='results'
                        selectedTabClassName='active'
                        selectedTabPanelClassName='active'
                        defaultIndex={0}
                    >
                        <TabList>
                            <Tab className='results-tab'> Interview-Suchergebnisse </Tab>
                            <Tab className='results-tab'> Orte-Suchergebnisse </Tab>
                        </TabList>
                        <TabPanel >
                            {this.content()}
                        </TabPanel>
                        <TabPanel >
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

