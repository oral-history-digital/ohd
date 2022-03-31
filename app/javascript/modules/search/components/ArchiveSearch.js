import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Observer from 'react-intersection-observer'
import { Helmet } from 'react-helmet';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { AuthorizedContent, AuthShowContainer, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { INDEX_SEARCH } from 'modules/sidebar';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import { VIEWMODE_GRID, VIEWMODE_LIST, VIEWMODE_WORKFLOW } from 'modules/constants';

import ResultTableContainer from './ResultTableContainer';
import SearchActionsContainer from './SearchActionsContainer';
import WorkflowResultsContainer from './WorkflowResultsContainer';
import ResultGrid from './ResultGrid';

export default function ArchiveSearch({
    currentViewMode,
    foundInterviews,
    hideSidebar,
    isArchiveSearching,
    isLoggedIn,
    query,
    resultPagesCount,
    resultsAvailable,
    resultsCount,
    searchInArchive,
    setSidebarTabsIndex,
    setViewMode,
    viewModes,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { isAuthorized } = useAuthorization();

    useEffect(() => {
        setSidebarTabsIndex(INDEX_SEARCH);
    }, []);

    useEffect(() => {
        search({
            ...query,
            page: 1,
        });
    }, [isLoggedIn]);

    function handleScroll(inView) {
        if (inView) {
            let page = (parseInt(query.page) || 0) + 1;
            search(Object.assign({}, query, {page: page}));
        }
    }

    function search(query={page: 1}) {
        const url = `${pathBase}/searches/archive`;

        searchInArchive(url, query);
    }

    function handleTabClick(tabIndex) {
        setViewMode(viewModes[tabIndex]);

        if (viewModes[tabIndex] === VIEWMODE_WORKFLOW) {
            hideSidebar();
        }
    }

    console.log(foundInterviews.length);

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <h1 className="search-results-title">
                    {t('interviews')}
                </h1>
                <div className="SearchResults-legend search-results-legend">
                    <AuthShowContainer ifLoggedIn>
                        <SearchActionsContainer />
                    </AuthShowContainer>
                    {
                        resultsAvailable && (
                            <div className="search-results-legend-text">
                                {resultsCount} {t('archive_results')}
                            </div>
                        )
                    }
                </div>

                <Tabs
                    className="Tabs"
                    keyboardActivation="manual"
                    index={(viewModes && viewModes.indexOf(currentViewMode)) || 0}
                    onChange={handleTabClick}
                >
                    <TabList className="Tabs-tabList">
                        {
                            viewModes?.map(viewMode => (
                                <Tab
                                    key={viewMode}
                                    className={classNames('Tabs-tab', {
                                        'hidden': viewModes.length < 2 || (viewMode === VIEWMODE_WORKFLOW && !isAuthorized({type: 'General'}, 'edit'))
                                    })}
                                >
                                    <span>{t(viewMode)}</span>
                                </Tab>
                            ))
                        }
                    </TabList>

                    <hr className="Rule u-mt" />

                    <TabPanels className="u-mt">
                        {
                            viewModes?.map(viewMode => {
                                let tabContent;
                                if (foundInterviews?.length === 0 && !isArchiveSearching) {
                                    tabContent = (
                                        <div className="search-result">
                                            {t('no_interviews_results')}
                                        </div>
                                    );
                                } else {
                                    switch (viewMode) {
                                    case VIEWMODE_LIST:
                                        tabContent = <ResultTableContainer/>;
                                        break;
                                    case VIEWMODE_WORKFLOW:
                                        tabContent = (
                                            <AuthorizedContent object={{type: 'General'}} action="edit">
                                                <WorkflowResultsContainer search={search} />
                                            </AuthorizedContent>
                                        );
                                        break;
                                    case VIEWMODE_GRID:
                                    default:
                                        tabContent = <ResultGrid interviews={foundInterviews} />;
                                        break;
                                    }
                                }

                                return (<TabPanel key={viewMode}>
                                    {
                                        isArchiveSearching && query['page'] === 1 && !foundInterviews ?
                                            <Spinner /> :
                                            (
                                                <>
                                                    {tabContent}
                                                    {
                                                        isArchiveSearching ?
                                                            <Spinner /> :
                                                            (
                                                                resultPagesCount > (Number.parseInt(query.page) || 1) &&
                                                                    <Observer onChange={handleScroll} />
                                                            )
                                                    }
                                                </>
                                            )
                                    }
                                </TabPanel>);
                            })
                        }
                    </TabPanels>
                </Tabs>
            </div>
        </ScrollToTop>
    );
}

ArchiveSearch.propTypes = {
    currentViewMode: PropTypes.string.isRequired,
    foundInterviews: PropTypes.array.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    isArchiveSearching: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    resultPagesCount: PropTypes.number.isRequired,
    resultsAvailable: PropTypes.bool.isRequired,
    resultsCount: PropTypes.number.isRequired,
    searchInArchive: PropTypes.func.isRequired,
    setSidebarTabsIndex: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
    viewModes: PropTypes.array.isRequired,
};
