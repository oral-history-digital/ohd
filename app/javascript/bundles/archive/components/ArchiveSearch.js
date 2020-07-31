import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Observer from 'react-intersection-observer'

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import InterviewListRowContainer from '../containers/InterviewListRowContainer';
import InterviewWorkflowRowContainer from '../containers/InterviewWorkflowRowContainer';
import ArchiveLocationsContainer from '../containers/ArchiveLocationsContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t, admin, queryToText, pathBase } from '../../../lib/utils';
import moment from 'moment';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class ArchiveSearch extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            this.search()
        }
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

    listHeader() {
        let props = this.props
        let headers = [];

        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            headers.push(<td key={'list-header-column-selected'}><strong>{t(this.props, 'selected')}</strong></td>);
        }

        props.listColumns.map(function(column, i){
            let label = (props.project && props.project.metadata_fields[column.id].label[props.locale]) || t(props, column.name);
            headers.push (
                <td key={`list-header-column-${i}`}><strong>{label}</strong></td>
            )
        })

        if (this.props.query.fulltext) {
            headers.push(<td key={'list-header-column-count'}><strong>{t(this.props, 'archive_results')}</strong></td>);
        }

        return headers;
    }

    box(value) {
        return (
            <div className='box-8 header'>
                {t(this.props, value)}
            </div>
        )
    }

    workflowHeader() {
        return (
            <div className='data boxes' key='header-boxes'>
                {this.box('interview')}
                {this.box('id')}
                {this.box('activerecord.attributes.interview.media_type')}
                {this.box('activerecord.attributes.interview.duration')}
                {this.box('activerecord.attributes.interview.language')}
                {this.box('activerecord.attributes.interview.collection_id')}
                {this.box('activerecord.attributes.interview.tasks_states')}
                {this.box('activerecord.attributes.interview.workflow_state')}
            </div>
        )
    }

    foundInterviews(displayType) {
        if (this.props.foundInterviews && this.props.foundInterviews.length == 0 && !this.props.isArchiveSearching) {
            return <div className={'search-result'}>{t(this.props, 'no_interviews_results')}</div>
        }
        else {
            if(displayType === 'grid') {
                return (
                    this.props.foundInterviews.map((interview, index) => {
                        return <InterviewPreviewContainer
                            interview={interview}
                            key={"interview-" + interview.archive_id + "-" + index}
                        />;
                    })
                )
            } else if (displayType === 'list') {
                return (
                    <table style={{padding: '0 20px', width: '100%'}}>
                        <thead>
                            <tr>
                                <td><strong>{t(this.props, 'interviewee_name')}</strong></td>
                                {this.listHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.foundInterviews.map((interview, index) => {
                                return <InterviewListRowContainer
                                    interview={interview}
                                    key={"interview-row-" + interview.archive_id + "-" + index}
                                />;
                            })}
                        </tbody>
                    </table>
                )
            } else if (displayType === 'workflow') {
                return (
                    <AuthShowContainer ifAdmin={true} obj={{type: 'Interview', action: 'update'}}>
                        {this.workflowHeader()}
                        {this.props.foundInterviews.map((interview, index) => {
                            return <InterviewWorkflowRowContainer
                                interview={interview}
                                key={"interview-row-" + interview.archive_id + "-" + index}
                            />;
                        })}
                    </AuthShowContainer>
                )
            }
        }   
    }

    handleScroll(inView) {
        if(inView){
            let query = this.props.query;
            let page = (this.props.query.page || 0) + 1;
            this.search(Object.assign({}, this.props.query, {page: page}));
        }
    }

    search(query={}) {
        let url = `${pathBase(this.props)}/searches/archive`;
        //let url = `/${this.context.router.route.match.params.projectId}/${this.context.router.route.match.params.locale}/searches/archive`;
        this.props.searchInArchive(url, query);
    }

    handleTabClick(tabIndex) {
        this.props.setViewMode(this.props.viewModes[tabIndex])
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
        else if (this.props.resultPagesCount > (this.props.query.page || 1)) {
            return (
                <Observer
                    onChange={inView => this.handleScroll(inView)}
                />
            )
        }
    }

    resultsFromTo() {
        let from = (this.currentPage() -1) * 12 + 1;
        let to   = this.currentPage() * 12;
        to = Math.min(to, this.props.resultsCount);
        return `${t(this.props, 'archive_results')} ${from} - ${to}`;
    }

    currentPage() {
        return this.props.query['page'] != undefined ? this.props.query['page'] : 1;
    }

    renderPaginationTabs() {
        let resultPages = []
        for (let i = 1; i <= this.props.resultPagesCount; i++) {
            resultPages.push(i);
        }
        return resultPages.map((page, index) => {
            let pageClass = 'pagination-button'
            if (this.currentPage() == page) {
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

    exportSearch() {
        let query = this.props.query;
        delete query['page'];
        let url = `/${this.props.locale}/searches/archive.csv`;
        for (let i = 0, len = Object.keys(query).length; i < len; i++) {
            let param = Object.keys(query)[i]
            url += (i === 0) ? '?' : '&'
            if(query[param] && query[param].length > 0) url += `${param}=${query[param]}` 
        }
        return (
            <ul>
                <li>
                    <a href={url}>CSV</a>
                </li>
            </ul>
        )
    }

    exportSearchLink() {
        if(Object.keys(this.props.query).length > 0 && this.props.projectId !== "dg") {
            return (
                <div className="search-results-ico-link" onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'export_search_results'),
                    content: this.exportSearch()
                })}>
                <i className="fa fa-download"></i><span>{t(this.props, 'export_search_results')}</span>
                </div>
            )
        } else return null;
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

    searchResultTabs() {
        if (this.props.viewModes) {
            let _this = this;
            return _this.props.viewModes.map(function(viewMode, i) {
                let visibility = (_this.props.viewModes.length < 2 || (viewMode === 'workflow' && !admin(_this.props, {type: 'Interview', action: 'update'}))) ? 'hidden' : ''
                return (
                    <Tab className={'search-results-tab ' + visibility} key={i}>
                        <span>{t(_this.props, viewMode)}</span>
                    </Tab>
                )   
            })
        } else {
            return null;
        }
    }

    tabPanels() {
        if (this.props.viewModes) {
            let _this = this
            return this.props.viewModes.map(function(viewMode, i) {
                if (viewMode !== 'workflow' || (viewMode === 'workflow' && admin(_this.props, {type: 'Interview', action: 'update'}))) {
                    return (
                        <TabPanel key={i}>
                            {_this.content(viewMode)}
                        </TabPanel>
                    )
                }
            })
        } else {
            return null;
        }
    }

    render() {
        return (
            <WrapperPageContainer
                tabIndex={ this.props.locales.length + 1 }
            >
                <div className='wrapper-content interviews'>
                    <h1 className="search-results-title">{t(this.props, (this.props.projectId === 'mog') ? 'archive_results' : 'interviews')}</h1>
                    <div className="search-results-legend">
                        <AuthShowContainer ifLoggedIn={true}>
                            {this.saveSearchLink()}
                            {this.exportSearchLink()}
                        </AuthShowContainer>
                        {this.renderArchiveResultsCount()}
                    </div>

                    <Tabs
                        className='tabs'
                        selectedTabClassName='active'
                        selectedTabPanelClassName='active'
                        selectedIndex={(this.props.viewModes && this.props.viewModes.indexOf(this.props.viewMode)) || 0}
                        onSelect={tabIndex => this.handleTabClick(tabIndex)}
                    >
                        <TabList className={'search-results-tabs'}>
                            {this.searchResultTabs()}
                        </TabList>
                        {this.tabPanels()}
                    </Tabs>
                </div>
            </WrapperPageContainer>
        )
    }

    static contextTypes = {
        router: PropTypes.object
    }
}

