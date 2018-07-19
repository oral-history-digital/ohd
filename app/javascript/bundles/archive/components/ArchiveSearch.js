import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Observer from 'react-intersection-observer'

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import InterviewListRowContainer from '../containers/InterviewListRowContainer';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t, queryToText } from '../../../lib/utils';
import moment from 'moment';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class ArchiveSearch extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    content(displayType) {
        if (this.props.isArchiveSearching && this.props.query['page'] === 1) { 
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        } else {
            return (
                <div>
                    {/* {this.renderPagination()} */}
                    <div className={'search-results-container'}>
                        {this.foundInterviews(displayType)}
                    </div>
                    {/* {this.renderPagination()} */}
                    {this.renderScrollObserver()}
                </div>
            )
        }
    }

    foundInterviews(displayType) {
        if (this.props.foundInterviews.length == 0 && !this.props.isArchiveSearching) {
            return <div className={'search-result'}>{t(this.props, 'no_interviews_results')}</div>
        }
        else {
            if(displayType === 'grid') {
                return (
                    this.props.foundInterviews.map((interview, index) => {
                        return <InterviewPreviewContainer
                            interview={interview.data}
                            key={"interview-" + interview.archive_id}
                        />;
                    })
                )
            }
            else {
                return (
                    <table style={{padding: '0 20px'}}>
                        <thead>
                            <tr>
                                {/* <td>Archive ID</td> */}
                                <td>Name</td>
                                <td>Media Type</td>
                                <td>Duration</td>
                                <td>Language</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.foundInterviews.map((interview, index) => {
                                return <InterviewListRowContainer
                                    interview={interview.data}
                                    key={"interview-row-" + interview.archive_id}
                                />;
                            })}
                        </tbody>
                    </table>
                )
            }
        }   
    }

    handleScroll(inView) {
        if(inView){
            let query = this.props.query;
            query['page'] = (this.props.query['page'] || 1) + 1;
            let url = `/${this.props.locale}/searches/archive`;
            this.props.searchInArchive(url, query);
        }
    }

    renderPagination() {
        if (this.props.resultPagesCount > 1) {
            return (
                <div>
                    <ul className='search-results-pagination'>
                        {this.renderPaginationTabs()}
                    </ul>
                    <div className='search-results-from-to'>{this.resultsFromTo()}</div>
                </div>
            )
        }
    }

    renderScrollObserver() {
        if (this.props.isArchiveSearching) {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
        else if (this.props.resultPagesCount > (this.props.query['page'] || 1)) {
            return (
                <Observer
                    onChange={inView => this.handleScroll(inView)}
                />
            )
        }
    }

    resultsFromTo() {
        let from = (this.actualPage() -1) * 12 + 1;
        let to   = this.actualPage() * 12;
        to = Math.min(to, this.props.resultsCount);
        return `${t(this.props, 'archive_results')} ${from} - ${to}`;
    }

    actualPage() {
        return this.props.query['page'] != undefined ? this.props.query['page'] : 1;
    }

    renderPaginationTabs() {
        let resultPages = []
        for (let i = 1; i <= this.props.resultPagesCount; i++) {
            resultPages.push(i);
        }
        return resultPages.map((page, index) => {
            let pageClass = 'pagination-button'
            if (this.actualPage() == page) {
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
        let queryText = queryToText(this.props.query, this.props);
        let title = queryText === "" ? now : queryText + " - " + now;

        return <UserContentFormContainer
            title={title}
            description=''
            properties={this.props.query}
            type='Search'
            submitLabel={t(this.props, 'save_search')}
        />
    }

    saveSearchLink() {
        return <div className="search-results-ico-link" onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'save_search'),
                        content: this.saveSearchForm()
                    })}>
                    <i className="fa fa-star"></i><span>{t(this.props, 'save_search')}</span>
                </div>
    }

    renderArchiveResultsCount() {
        if(!this.props.isArchiveSearching || (this.props.query['page'] || 1) > 1) {
            return (
                <div className="search-results-legend-text">
                    {this.props.resultsCount} {t(this.props, 'archive_results')}
                </div>
            )
        }
    }

    render() {
        return (
            <WrapperPageContainer
                tabIndex={ this.props.locales.length + 2 }
                
            >
                <div className='wrapper-content interviews'>
                    <h1 className="search-results-title">{t(this.props, (this.props.project === 'mog') ? 'archive_results' : 'interviews')}</h1>
                    <div className="search-results-legend">
                                <AuthShowContainer ifLoggedIn={true}>
                                    {this.saveSearchLink()}
                                </AuthShowContainer>
                        {this.renderArchiveResultsCount()}
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
                                <span>{t(this.props, 'grid')}</span>
                            </Tab>
                            <Tab className='search-results-tab'>
                                <i className="fa fa-th-list"></i>
                                <span>{t(this.props, 'list')}</span>
                            </Tab>
                            <Tab className={'search-results-tab' + (this.props.project === 'zwar' && ' hidden' || '')}>
                                <i className="fa fa-map-o"></i>
                                <span>{t(this.props, 'places')}</span>
                            </Tab>
                        </TabList>
                        <TabPanel>
                            {this.content('grid')}
                        </TabPanel>
                        <TabPanel>
                            {/* <div> */}
                                {/* <div className='search-results-explanation'>{t(this.props, 'archive_map_explanation')}</div> */}
                                {/* {this.renderPagination()} */}
                                {/* <ArchiveLocationsContainer/> */}
                                {/* {this.renderPagination()} */}
                            {/* </div> */}
                            {this.content('list')}
                        </TabPanel>
                        <TabPanel>
                            <ArchiveLocationsContainer/>
                        </TabPanel>
                    </Tabs>
                </div>
            </WrapperPageContainer>
        )
    }
}

