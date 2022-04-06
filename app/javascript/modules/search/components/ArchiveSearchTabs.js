import classNames from 'classnames';
import PropTypes from 'prop-types';
import Observer from 'react-intersection-observer';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { VIEWMODE_GRID, VIEWMODE_LIST, VIEWMODE_WORKFLOW } from 'modules/constants';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import ResultTableContainer from './ResultTableContainer';
import WorkflowResultsContainer from './WorkflowResultsContainer';
import ResultGrid from './ResultGrid';

export default function ArchiveSearchTabs({
    query,
    foundInterviews,
    isArchiveSearching,
    resultPagesCount,
    viewModes,
    currentViewMode,
    hideSidebar,
    setViewMode,
    onScroll,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    function handleTabClick(tabIndex) {
        setViewMode(viewModes[tabIndex]);

        if (viewModes[tabIndex] === VIEWMODE_WORKFLOW) {
            hideSidebar();
        }
    }

    return (
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
                                'hidden': (viewModes.length < 2 ||
                                    (viewMode === VIEWMODE_WORKFLOW && !isAuthorized({type: 'General'}, 'edit')))
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
                                        <WorkflowResultsContainer />
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
                                                            <Observer onChange={onScroll} />
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
    );
}

ArchiveSearchTabs.propTypes = {
    query: PropTypes.object.isRequired,
    foundInterviews: PropTypes.array.isRequired,
    isArchiveSearching: PropTypes.bool,
    resultPagesCount: PropTypes.number.isRequired,
    viewModes: PropTypes.array.isRequired,
    currentViewMode: PropTypes.string.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
};
