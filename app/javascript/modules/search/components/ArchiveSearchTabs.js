import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classNames from 'classnames';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import {
    VIEWMODE_GRID,
    VIEWMODE_LIST,
    VIEWMODE_WORKFLOW,
} from 'modules/constants';
import { Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSidebar } from 'modules/sidebar';
import PropTypes from 'prop-types';

import ResultGrid from './ResultGrid';
import ResultTable from './ResultTable';
import WorkflowResults from './WorkflowResults';

/**
 * Switches search result views while retaining the separate collection resource loader.
 * Project display data is loaded by the grid/table consumers rather than a legacy project fetch.
 * @param {Object} props - Interview results, available/current views, and view-change callback.
 * @returns {React.ReactElement} Search result tabs and their selected view.
 */
export default function ArchiveSearchTabs({
    interviews,
    empty,
    loading,
    controls,
    className,
    viewModes,
    currentViewMode,
    setViewMode,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { hide, show } = useSidebar();

    function handleTabClick(tabIndex) {
        const nextViewMode = viewModes[tabIndex];
        setViewMode(nextViewMode);

        if (nextViewMode === VIEWMODE_WORKFLOW) {
            hide();
            return;
        }

        show();
    }

    return (
        <Tabs
            className={classNames('Tabs', className)}
            keyboardActivation="manual"
            index={(viewModes && viewModes.indexOf(currentViewMode)) || 0}
            onChange={handleTabClick}
        >
            <div className="SearchResults-controls">
                <TabList className="Tabs-tabList SearchResults-controlsTabs">
                    {viewModes?.map((viewMode) => (
                        <Tab
                            key={viewMode}
                            className={classNames('Tabs-tab', {
                                hidden:
                                    viewModes.length < 2 ||
                                    (viewMode === VIEWMODE_WORKFLOW &&
                                        !isAuthorized(
                                            { type: 'General' },
                                            'edit'
                                        )),
                            })}
                        >
                            <span>{t(viewMode)}</span>
                        </Tab>
                    ))}
                </TabList>
                {controls && (
                    <div className="SearchResults-controlsSort">{controls}</div>
                )}
            </div>

            <hr className="Rule u-mt" />

            <Fetch
                fetchParams={['collections', null, null, 'all']}
                testDataType="collections"
                testIdOrDesc={'all'}
            >
                <TabPanels className="u-mt">
                    {viewModes?.map((viewMode) => {
                        if (viewMode !== currentViewMode) {
                            return <TabPanel key={viewMode} />;
                        }

                        let tabContent;
                        if (empty) {
                            tabContent = (
                                <div className="search-result">
                                    {t('no_interviews_results')}
                                </div>
                            );
                        } else {
                            switch (viewMode) {
                                case VIEWMODE_LIST:
                                    tabContent = (
                                        <ResultTable interviews={interviews} />
                                    );
                                    break;
                                case VIEWMODE_WORKFLOW:
                                    tabContent = (
                                        <AuthorizedContent
                                            object={{ type: 'General' }}
                                            action="edit"
                                        >
                                            <WorkflowResults
                                                interviews={interviews}
                                            />
                                        </AuthorizedContent>
                                    );
                                    break;
                                case VIEWMODE_GRID:
                                default:
                                    tabContent = (
                                        <ResultGrid
                                            interviews={interviews}
                                            loading={loading}
                                        />
                                    );
                                    break;
                            }
                        }

                        return <TabPanel key={viewMode}>{tabContent}</TabPanel>;
                    })}
                </TabPanels>
            </Fetch>
        </Tabs>
    );
}

ArchiveSearchTabs.propTypes = {
    interviews: PropTypes.array,
    empty: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    controls: PropTypes.node,
    className: PropTypes.string,
    viewModes: PropTypes.array.isRequired,
    currentViewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
};
