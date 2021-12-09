import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Observer from 'react-intersection-observer'

import { AuthorizedContent, AuthShowContainer, admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { INDEX_SEARCH } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { VIEWMODE_GRID, VIEWMODE_LIST, VIEWMODE_WORKFLOW } from 'modules/constants';

import ResultTableContainer from './ResultTableContainer';
import SearchActionsContainer from './SearchActionsContainer';
import WorkflowResultsContainer from './WorkflowResultsContainer';
import ResultGrid from './ResultGrid';

export default class ArchiveSearch extends Component {
    constructor(props) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        const { setFlyoutTabsIndex, query } = this.props;

        setFlyoutTabsIndex(INDEX_SEARCH);
        this.search({
            ...query,
            page: 1,
        });
    }

    componentDidUpdate(prevProps) {
        const { isLoggedIn, query } = this.props;

        if (prevProps.isLoggedIn !== isLoggedIn) {
            this.search({
                ...query,
                page: 1,
            });
        }
    }

    componentWillUnmount() {
        const { clearSearch } = this.props;

        clearSearch();
    }

    foundInterviews(displayType) {
        const { foundInterviews, isArchiveSearching } = this.props;

        if (foundInterviews?.length === 0 && !isArchiveSearching) {
            return (
                <div className="search-result">
                    {t(this.props, 'no_interviews_results')}
                </div>
            );
        }

        switch (displayType) {
        case VIEWMODE_LIST:
            return <ResultTableContainer/>;
        case VIEWMODE_WORKFLOW:
            return (
                <AuthorizedContent object={{type: 'General'}} action="edit">
                    <WorkflowResultsContainer search={this.search} />
                </AuthorizedContent>
            );
        case VIEWMODE_GRID:
        default:
            return <ResultGrid interviews={foundInterviews} />;
        }
    }

    handleScroll(inView) {
        const { query } = this.props;

        if (inView) {
            let page = (parseInt(query.page) || 0) + 1;
            this.search(Object.assign({}, query, {page: page}));
        }
    }

    search(query={page: 1}) {
        const { searchInArchive } = this.props;

        let url = `${pathBase(this.props)}/searches/archive`;

        searchInArchive(url, query);
    }

    handleTabClick(tabIndex) {
        const { setViewMode, viewModes, hideFlyoutTabs } = this.props;

        setViewMode(viewModes[tabIndex]);

        if (viewModes[tabIndex] === VIEWMODE_WORKFLOW) {
            hideFlyoutTabs();
        }
    }

    render() {
        const { isArchiveSearching, query, resultPagesCount, resultsCount, currentViewMode,
            viewModes, foundInterviews, resultsAvailable } = this.props;

        return (
            <ScrollToTop>
                <div className="wrapper-content interviews">
                    <h1 className="search-results-title">
                        {t(this.props, 'interviews')}
                    </h1>
                    <div className="SearchResults-legend search-results-legend">
                        <AuthShowContainer ifLoggedIn>
                            <SearchActionsContainer />
                        </AuthShowContainer>
                        {
                            resultsAvailable && (
                                <div className="search-results-legend-text">
                                    {resultsCount} {t(this.props, 'archive_results')}
                                </div>
                            )
                        }
                    </div>

                    <Tabs
                        className='tabs'
                        selectedTabClassName='active'
                        selectedTabPanelClassName='active'
                        selectedIndex={(viewModes && viewModes.indexOf(currentViewMode)) || 0}
                        onSelect={this.handleTabClick}
                    >
                        <TabList className="search-results-tabs">
                            {
                                viewModes?.map(viewMode => (
                                    <Tab
                                        key={viewMode}
                                        className={classNames('search-results-tab', {
                                            'hidden': viewModes.length < 2 ||
                                                (viewMode === VIEWMODE_WORKFLOW &&
                                                !admin(this.props, {type: 'General'}, 'edit'))
                                        })}
                                    >
                                        <span>{t(this.props, viewMode)}</span>
                                    </Tab>
                                ))
                            }
                        </TabList>

                        {
                            viewModes?.map(viewMode => (
                                <TabPanel key={viewMode}>
                                    {
                                        isArchiveSearching && query['page'] === 1 && !foundInterviews ?
                                            <Spinner /> :
                                            (
                                                <>
                                                    {this.foundInterviews(viewMode)}
                                                    {
                                                        isArchiveSearching ?
                                                            <Spinner /> :
                                                            (
                                                                resultPagesCount > (Number.parseInt(query.page) || 1) &&
                                                                    <Observer onChange={inView => this.handleScroll(inView)} />
                                                            )
                                                    }
                                                </>
                                            )
                                    }
                                </TabPanel>
                            ))
                        }
                    </Tabs>
                </div>
            </ScrollToTop>
        );
    }
}

ArchiveSearch.propTypes = {
    resultsAvailable: PropTypes.bool.isRequired,
    isArchiveSearching: PropTypes.bool,
    query: PropTypes.object.isRequired,
    viewModes: PropTypes.array.isRequired,
    currentViewMode: PropTypes.string.isRequired,
    foundInterviews: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
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
    clearSearch: PropTypes.func.isRequired,
};
