import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Observer from 'react-intersection-observer'
import moment from 'moment';

import { InterviewPreviewContainer, InterviewListRowContainer } from 'modules/interview-preview';
import { InterviewWorkflowRowContainer } from 'modules/workflow';
import { UserContentFormContainer } from 'modules/workbook';
import { AuthShowContainer, admin } from 'modules/auth';
import { Modal } from 'modules/ui';
import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { INDEX_SEARCH } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import queryToText from '../queryToText';

export default class ArchiveSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortables: {
                title: 'asc',
                archive_id: 'asc',
                media_type: 'asc',
                duration: 'asc',
                language: 'asc',
                workflow_state: 'asc',
            }
        }
    }

    componentDidMount() {
        this.props.setFlyoutTabsIndex(INDEX_SEARCH);
    }

    content(displayType) {
        if (this.props.isArchiveSearching && this.props.query['page'] === 1) {
            return <Spinner />;
        } else {
            return (
                <div>
                    <div className={'search-results-container'}>
                        {this.foundInterviews(displayType)}
                    </div>
                    {this.renderScrollObserver()}
                </div>
            )
        }
    }

    listHeader() {
        let props = this.props
        let headers = [];

        if (admin(this.props, {type: 'General', action: 'edit'})) {
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

    sort(column, direction) {
        this.search(Object.assign({}, this.props.query, {order: `${column}-${direction}`, page: 1}));
    }

    sortButton(column) {
        if (column) {
            let _this = this;
            let direction = this.state.sortables[column] === 'desc' ? 'asc' : 'desc';
            return (
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    onClick={() => {
                        _this.setState({sortables: Object.assign({}, _this.state.sortables, {[column]: direction})});
                        _this.sort(column, direction);
                    }}
                >
                    <i className={`fa fa-angle-${direction === 'desc' ? 'down' : 'up'}`}></i>
                </span>
            );
        } else {
            return null;
        }
    }

    // width is in percent - points in decimal numbers are replaced by '-'
    // the classes have to exist in grid.scss.
    // have a look for examples
    //
    box(value, width, sortColumn) {
        return (
            <div className={`box-${width} header`}>
                {t(this.props, value)}
                {this.sortButton(sortColumn)}
            </div>
        )
    }

    workflowHeader() {
        return (
            <div className='data boxes workflow-header' key='header-boxes'>
                {this.box('interview', '10', 'title')}
                {this.box('id', '10', 'archive_id')}
                {this.box('activerecord.attributes.interview.media_type', '10', 'media_type')}
                {this.box('activerecord.attributes.interview.duration', '10', 'duration')}
                {this.box('activerecord.attributes.interview.language', '10', 'language')}
                {this.box('activerecord.attributes.interview.collection_id', '10')}
                {this.box('activerecord.attributes.interview.tasks_states', '30')}
                {this.box('activerecord.attributes.interview.workflow_state', '10', 'workflow_state')}
            </div>
        )
    }

    foundInterviews(displayType) {
        if (this.props.foundInterviews?.length == 0 && !this.props.isArchiveSearching) {
            return <div className={'search-result'}>{t(this.props, 'no_interviews_results')}</div>
        }
        else {
            if(displayType === 'grid') {
                return (
                    this.props.foundInterviews?.map((interview, index) => {
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
                            {this.props.foundInterviews?.map((interview, index) => {
                                return <InterviewListRowContainer
                                    interview={interview}
                                    key={"interview-row-" + interview.archive_id + "-" + index}
                                />;
                            })}
                        </tbody>
                    </table>
                )
            } else if (displayType === 'workflow' && admin(this.props, {type: 'General', action: 'edit'})) {
                return (
                    <div>
                        {this.workflowHeader()}
                        {this.props.foundInterviews?.map((interview, index) => {
                            return <InterviewWorkflowRowContainer
                                interview={interview}
                                key={"interview-row-" + interview.archive_id + "-" + index}
                            />;
                        })}
                    </div>
                )
            }
        }
    }

    handleScroll(inView) {
        if(inView){
            let page = (this.props.query.page || 0) + 1;
            this.search(Object.assign({}, this.props.query, {page: page}));
        }
    }

    search(query={}) {
        let url = `${pathBase(this.props)}/searches/archive`;
        this.props.searchInArchive(url, query);
    }

    handleTabClick(tabIndex) {
        this.props.setViewMode(this.props.viewModes[tabIndex])
        if (this.props.viewModes[tabIndex] === 'workflow') {
            this.props.hideFlyoutTabs();
        }
    }

    renderScrollObserver() {
        if (this.props.isArchiveSearching) {
            return <Spinner />;
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

    saveSearchForm(onSubmit) {
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
            onSubmit={onSubmit}
        />
    }

    saveSearchLink() {
        return (
            <Modal
                title={t(this.props, 'save_search')}
                trigger={<><i className="fa fa-star"></i><span>{t(this.props, 'save_search')}</span></>}
                triggerClassName="search-results-ico-link"
            >
                {close => this.saveSearchForm(close)}
            </Modal>
        );
    }

    exportSearch() {
        let query = this.props.query;
        delete query['page'];
        let url = `${pathBase(this.props)}/searches/archive.csv`;
        for (let i = 0, len = Object.keys(query).length; i < len; i++) {
            let param = Object.keys(query)[i]
            url += (i === 0) ? '?' : '&'
            if(query[param] && query[param].length > 0) url += `${param}=${query[param]}`
        }
        return (
            <ul>
                <li>
                    <a href={url} download>CSV</a>
                </li>
            </ul>
        )
    }

    exportSearchLink() {
        if(Object.keys(this.props.query).length > 0 && this.props.projectId !== "dg") {
            return (
                <Modal
                    title={t(this.props, 'export_search_results')}
                    trigger={<><i className="fa fa-download"></i><span>{t(this.props, 'export_search_results')}</span></>}
                    triggerClassName="search-results-ico-link"
                >
                    {this.exportSearch()}
                </Modal>
            );
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
        const { viewModes } = this.props;

        if (viewModes) {
            return viewModes.map((viewMode, i) => {
                let visibility = (
                        viewModes.length < 2 ||
                        (viewMode === 'workflow' && !admin(this.props, {type: 'General', action: 'edit'}))
                    ) ?
                    'hidden' :
                    '';

                return (
                    <Tab
                        key={i}
                        className={classNames('search-results-tab', visibility)}
                    >
                        <span>{t(this.props, viewMode)}</span>
                    </Tab>
                )
            })
        } else {
            return null;
        }
    }

    tabPanels() {
        const { viewModes } = this.props;

        if (viewModes) {
            return viewModes.map((viewMode, i) => (
                <TabPanel key={i}>
                    {this.content(viewMode)}
                </TabPanel>
            ));
        } else {
            return null;
        }
    }

    render() {
        return (
            <ScrollToTop>
                <div className='wrapper-content interviews'>
                    <h1 className="search-results-title">
                        {t(this.props, 'interviews')}
                    </h1>
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
            </ScrollToTop>
        );
    }
}

ArchiveSearch.propTypes = {
    isArchiveSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    viewModes: PropTypes.array.isRequired,
    viewMode: PropTypes.string.isRequired,
    foundInterviews: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object,
    facets: PropTypes.object.isRequired,
    resultsCount: PropTypes.number.isRequired,
    resultPagesCount: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    listColumns: PropTypes.array.isRequired,
    setViewMode: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    hideFlyoutTabs: PropTypes.func.isRequired,
    searchInArchive: PropTypes.func.isRequired,
};
