import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import {
    VIEWMODE_GRID,
    VIEWMODE_LIST,
    VIEWMODE_WORKFLOW,
} from 'modules/constants';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { SearchSpinnerOverlay } from 'modules/spinners';
import ResultTable from './ResultTable';
import WorkflowResultsContainer from './WorkflowResultsContainer';
import ResultGrid from './ResultGrid';

export default function ArchiveSearchTabs({
    interviews,
    empty,
    loading,
    className,
    viewModes,
    currentViewMode,
    hideSidebar,
    setViewMode,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { projectId, project } = useProject();

    function handleTabClick(tabIndex) {
        setViewMode(viewModes[tabIndex]);

        if (viewModes[tabIndex] === VIEWMODE_WORKFLOW) {
            hideSidebar();
        }
    }

    return (
        <Tabs
            className={classNames('Tabs', className)}
            keyboardActivation="manual"
            index={(viewModes && viewModes.indexOf(currentViewMode)) || 0}
            onChange={handleTabClick}
        >
            <TabList className="Tabs-tabList">
                {viewModes?.map((viewMode) => (
                    <Tab
                        key={viewMode}
                        className={classNames('Tabs-tab', {
                            hidden:
                                viewModes.length < 2 ||
                                (viewMode === VIEWMODE_WORKFLOW &&
                                    !isAuthorized({ type: 'General' }, 'edit')),
                        })}
                    >
                        <span>{t(viewMode)}</span>
                    </Tab>
                ))}
            </TabList>

            <hr className="Rule u-mt" />

            <Fetch
                fetchParams={[
                    'projects',
                    project.is_ohd ? null : project.id,
                    null,
                    project.is_ohd ? 'all' : null,
                ]}
                testDataType="projects"
                testIdOrDesc={project.is_ohd ? 'all' : project.id}
            >
                <Fetch
                    fetchParams={['collections', null, null, 'all']}
                    //fetchParams={['collections', null, null, project.is_ohd ? 'all' : `for_projects=${project.id}`]}
                    testDataType="collections"
                    testIdOrDesc={'all'}
                    //testIdOrDesc={project.is_ohd ? 'all' : `for_projects_${project.id}`}
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
                                            <ResultTable
                                                interviews={interviews}
                                            />
                                        );
                                        break;
                                    case VIEWMODE_WORKFLOW:
                                        tabContent = (
                                            <AuthorizedContent
                                                object={{ type: 'General' }}
                                                action="edit"
                                            >
                                                <WorkflowResultsContainer
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
                                            />
                                        );
                                        break;
                                }
                            }

                            return (
                                <TabPanel key={viewMode}>
                                    <SearchSpinnerOverlay loading={loading}>
                                        {tabContent}
                                    </SearchSpinnerOverlay>
                                </TabPanel>
                            );
                        })}
                    </TabPanels>
                </Fetch>
            </Fetch>
        </Tabs>
    );
}

ArchiveSearchTabs.propTypes = {
    interviews: PropTypes.array,
    empty: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    className: PropTypes.string,
    viewModes: PropTypes.array.isRequired,
    currentViewMode: PropTypes.string.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
};
