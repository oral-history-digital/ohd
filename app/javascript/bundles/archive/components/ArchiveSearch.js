import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import ArchiveUtils from '../../../lib/utils';
import moment from 'moment';
import spinnerSrc from '../../../images/large_spinner.gif'


export default class ArchiveSearch extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }


    content() {
        if (this.props.isArchiveSearching) {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
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
        let query = this.props.query;
        query['page'] = page;
        let url = `/${this.props.locale}/searches/archive`;
        this.props.searchInArchive(url, query);
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
        let query = this.props.query;
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
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        let queryText = ArchiveUtils.queryToText(this.props.query, this.props);
        let title = queryText === "" ? now : queryText + " - " + now;

        return <UserContentFormContainer
            title={title}
            description=''
            properties={this.props.query}
            type='Search'
            submitLabel={ArchiveUtils.translate(this.props, 'save_search')}
        />
    }

    saveSearchLink() {
        return <div className="search-results-ico-link" onClick={() => this.props.openArchivePopup({
                        title: ArchiveUtils.translate(this.props, 'save_search'),
                        content: this.saveSearchForm()
                    })}>
                    <i className="fa fa-star"></i><span>{ArchiveUtils.translate(this.props, 'save_search')}</span>
                </div>
    }

    render() {
        return (
            <WrapperPageContainer
                tabIndex={4}
            >
                <div className='wrapper-content interviews'>
                    <h1 className="search-results-title">{ArchiveUtils.translate(this.props, 'archive_results')}</h1>
                    <div className="search-results-legend">
                        <AuthShowContainer ifLoggedIn={true}>
                            {this.saveSearchLink()}
                        </AuthShowContainer>
                        <div className="search-results-legend-text">
                            {this.props.resultsCount} {ArchiveUtils.translate(this.props, 'archive_results')}
                        </div>
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
                                <span>{ArchiveUtils.translate(this.props, 'interview')}-{ArchiveUtils.translate(this.props, 'archive_results')}</span>
                            </Tab>
                            <Tab className='search-results-tab'>
                                <i className="fa fa-map-o"></i>
                                <span>{ArchiveUtils.translate(this.props, 'place')}-{ArchiveUtils.translate(this.props, 'archive_results')}</span>
                            </Tab>
                        </TabList>
                        <TabPanel>
                            {this.content()}
                        </TabPanel>
                        <TabPanel>
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

