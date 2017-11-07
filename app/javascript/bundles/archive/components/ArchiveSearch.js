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
            return <img src="/assets/eog/large_spinner.gif" className="archive-search-spinner"/>;
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
        console.log($(event.target).data().page);
        let page = ($(event.target).data().page);
        let query = this.props.searchQuery;
        query['page'] = page;
        this.props.searchInArchive(query);
    }

    renderPagination() {
        if (this.props.resultPagesCount > 1) {
            return (
                <ul className='search-results-pagination'>
                    {this.renderPaginationTabs()}
                </ul>
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
                <li
                    className={pageClass}
                    data-page={page}
                    key={"page-" + index}
                    onClick={this.handleClick}>
                    {page}
                </li>
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
                    <div className="search-results-legend">

                        <div className="search-results-ico-link" onClick={() => this.props.openArchivePopup({
                            title: 'Save search',
                            content: this.saveSearchForm()
                        })}>
                            <i className="fa fa-star"></i>Suche speichern
                        </div>

                        <div className="search-results-legend-text">{this.props.resultsCount} Suchergebnisse</div>
                    </div>



                    <Tabs
                        className='tabs'
                        selectedTabClassName='active'
                        selectedTabPanelClassName='active'
                        defaultIndex={0}
                    >
                        <TabList className={'search-results-tabs'}>
                            <Tab className='search-results-tab'>
                                <i className="fa fa-th"></i>
                                <span>Interview-Suchergebnisse</span>
                            </Tab>
                            <Tab className='search-results-tab'>
                                <i className="fa fa-map-o"></i>
                                <span>Orte-Suchergebnisse</span>
                            </Tab>
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

