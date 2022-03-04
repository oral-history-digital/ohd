import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { AccountContainer } from 'modules/account';
import { useAuthorization } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { getLocale } from 'modules/archive';
import { StateCheck, getCurrentInterviewFetched } from 'modules/data';
import ArchiveSearchTabPanelContainer from './ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from './RegistryEntriesTabPanelContainer';
import WorkbookTabPanel from './WorkbookTabPanel';
import UsersAdminTabPanelContainer from './UsersAdminTabPanelContainer';
import IndexingTabPanel from './IndexingTabPanel';
import MapTabPanelContainer from './MapTabPanelContainer';
import InterviewTabPanelContainer from './InterviewTabPanelContainer';
import ProjectConfigTabPanel from './ProjectConfigTabPanel';
import * as indexes from '../constants';

export default function SidebarTabs({
    sidebarTabsIndex,
    selectedArchiveIds,
    interview,
    projectId,
    project,
    archiveId,
    isLoggedIn,
    hasMap,
    setSidebarTabsIndex,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();
    const locale = useSelector(getLocale);
    const history = useHistory();

    function handleTabClick(index) {
        setSidebarTabsIndex(index);

        switch (index) {
        case indexes.INDEX_ACCOUNT:
            if (isLoggedIn) {
                history.push(`${pathBase}/accounts/current`);
            }
            break;
        case indexes.INDEX_SEARCH:
            history.push(`${pathBase}/searches/archive`);
            break;
        case indexes.INDEX_INTERVIEW:
            history.push(`${pathBase}/interviews/${archiveId}`);
            break;
        case indexes.INDEX_REGISTRY_ENTRIES:
            history.push(`${pathBase}/registry_entries`);
            break;
        case indexes.INDEX_MAP:
            if (hasMap) {
                history.push(`${pathBase}/searches/map`);
            }
            break;
        case indexes.INDEX_PROJECTS:
            history.push(`/${locale}/projects`);
            break;
        case indexes.INDEX_INSTITUTIONS:
            history.push(`/${locale}/institutions`);
            break;
        default:
        }
    }

    const showInterviewTab = !!interview;
    const showRegistryTab = project && (
        (!isLoggedIn && project.logged_out_visible_registry_entry_ids.length > 0) ||
        isLoggedIn
    )
    const showMapTab = hasMap && project;
    const showWorkbookTab = isLoggedIn;
    const showIndexingTab = project && isAuthorized({type: 'General'}, 'edit');
    const showAdministrationTab = project && isAuthorized({type: 'General'}, 'edit');
    const showProjectAdminTab = project && isAuthorized({type: 'Project'}, 'update');
    const showProjectsTab = !project && isAuthorized({type: 'Project'}, 'create');
    const showInstitutionsTab = !project && isAuthorized({type: 'Institution'}, 'create');

    return (
        <Tabs
            className="SidebarTabs"
            orientation="vertical"
            keyboardActivation="manual"
            index={sidebarTabsIndex}
            onChange={handleTabClick}
        >
            <TabList>
                <Tab
                    key="1"
                    className="SidebarTabs-tab"
                >
                    {t(isLoggedIn ? 'account_page' : 'login_page')}
                </Tab>

                <Tab
                    key="2"
                    className="SidebarTabs-tab"
                >
                    {t((projectId === 'campscapes' && !archiveId) ? 'user_registration.notes_on_tos_agreement' : 'archive_search')}
                </Tab>

                <Tab
                    key="3"
                    className="SidebarTabs-tab"
                    disabled={!showInterviewTab}
                >
                    {t('interview')}
                </Tab>

                <Tab
                    key="4"
                    className="SidebarTabs-tab"
                    disabled={!showRegistryTab}
                >
                    {t('registry')}
                </Tab>

                <Tab
                    key="5"
                    className="SidebarTabs-tab"
                    disabled={!showMapTab}
                >
                    {t('map')}
                </Tab>

                <Tab
                    key="6"
                    className="SidebarTabs-tab"
                    disabled={!showWorkbookTab}
                >
                    {t('user_content')}
                </Tab>

                <Tab
                    key="7"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showIndexingTab}
                >
                    {t('edit.indexing')}
                </Tab>

                <Tab
                    key="8"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showAdministrationTab}
                >
                    {t('edit.administration')}
                </Tab>

                <Tab
                    key="9"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showProjectAdminTab}
                >
                    {t('edit.project.admin')}
                </Tab>

                <Tab
                    key="10"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showProjectsTab}
                >
                    {t('edit.projects.admin')}
                </Tab>

                <Tab
                    key="11"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showInstitutionsTab}
                >
                    {t('edit.institution.admin')}
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel key="1">
                    <AccountContainer/>
                </TabPanel>

                <TabPanel key="2">
                    <ArchiveSearchTabPanelContainer selectedArchiveIds={selectedArchiveIds} />
                </TabPanel>

                <TabPanel key="3">
                    {showInterviewTab && (
                        <StateCheck
                            testSelector={getCurrentInterviewFetched}
                            fallback={<Spinner withPadding />}
                        >
                            <InterviewTabPanelContainer />
                        </StateCheck>
                    )}
                </TabPanel>

                <TabPanel key="4">
                    {showRegistryTab && (
                        <RegistryEntriesTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="5">
                    {showMapTab && (
                        <MapTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="6">
                    {showWorkbookTab && (
                        <WorkbookTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="7">
                    {showIndexingTab && (
                        <IndexingTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="8">
                    {showAdministrationTab && (
                        <UsersAdminTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="9">
                    {showProjectAdminTab && (
                        <ProjectConfigTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="10">
                    {false && showProjectsTab && (
                        <div className='flyout-tab-title'>{t('edit.projects.admin')}</div>
                    )}
                </TabPanel>

                <TabPanel key="11">
                    {false && showInstitutionsTab && (
                        <div className='flyout-tab-title'>{t('edit.institution.admin')}</div>
                    )}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

SidebarTabs.propTypes = {
    visible: PropTypes.bool.isRequired,
    interview: PropTypes.object,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    archiveId: PropTypes.string,
    hasMap: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    sidebarTabsIndex: PropTypes.number.isRequired,
    selectedArchiveIds: PropTypes.array,
    setSidebarTabsIndex: PropTypes.func.isRequired,
};
