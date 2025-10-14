import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
//import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { useAuthorization } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { usePathBase, useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { StateCheck, getCurrentInterviewFetched } from 'modules/data';
import ArchiveSearchTabPanel from './ArchiveSearchTabPanel';
import RegistryEntriesTabPanelContainer from './RegistryEntriesTabPanelContainer';
import WorkbookTabPanel from './WorkbookTabPanel';
import UsersAdminTabPanelContainer from './UsersAdminTabPanelContainer';
import IndexingTabPanel from './IndexingTabPanel';
import MapTabPanelContainer from './MapTabPanelContainer';
import InterviewTabPanelContainer from './InterviewTabPanelContainer';
import ProjectConfigTabPanel from './ProjectConfigTabPanel';
import * as indexes from '../constants';
//import tabIndexFromRoute from '../tabIndexFromRoute';

export default function SidebarTabs({
    selectedArchiveIds,
    interview,
    archiveId,
    isLoggedIn,
}) {
    const tabIndex = useSelector(state => state.archive.sidebarTabIndex);
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();
    //const navigate = useNavigate();
    const pathname = location.pathname;

    const hasMap = project?.has_map;
    const isCampscapesProject = project?.shortname === 'campscapes';

    useEffect(() => {
        setTabIndex(tabIndexFromRoute(pathBase, pathname, isCampscapesProject));
    }, [pathname]);

    function handleTabClick(index) {
        setTabIndex(index);

        switch (index) {
        case indexes.INDEX_SEARCH:
            location = `${pathBase}/searches/archive`;
            break;
        case indexes.INDEX_CATALOG:
            location = `${pathBase}/catalog`;
            break;
        case indexes.INDEX_INTERVIEW:
            location = `${pathBase}/interviews/${archiveId}`;
            break;
        case indexes.INDEX_REGISTRY_ENTRIES:
            location = `${pathBase}/registry_entries`;
            break;
        case indexes.INDEX_MAP:
            location = `${pathBase}/searches/map`;
            break;
        case indexes.INDEX_PROJECTS:
            location = `/${locale}/projects`;
            break;
        case indexes.INDEX_INSTITUTIONS:
            location = `/${locale}/institutions`;
            break;
        case indexes.INDEX_HELP_TEXTS:
            location = `/${locale}/help_texts`;
            break;
        default:
        }
    }

    const showCatalogTab = project.is_ohd;
    const showInterviewTab = !!interview;
    const showRegistryTab = (
        (!isLoggedIn && project.logged_out_visible_registry_entry_ids?.length > 0) ||
        isLoggedIn
    )
    const showMapTab = hasMap && !project.is_ohd;
    const showWorkbookTab = isLoggedIn;
    const showIndexingTab = isAuthorized({type: 'General'}, 'edit');
    const showAdministrationTab = isAuthorized({type: 'General'}, 'edit');
    const showProjectAdminTab = isAuthorized({type: 'Project'}, 'update');
    const showProjectsTab = project.is_ohd && isAuthorized({type: 'Project'}, 'create');
    const showInstitutionsTab = project.is_ohd && isAuthorized({type: 'Institution'}, 'create');
    const showHelpTextsTab = project.is_ohd && isAuthorized({type: 'HelpText'}, 'update');

    return (
        <Tabs
            className="SidebarTabs"
            orientation="vertical"
            keyboardActivation="manual"
            index={tabIndex}
            onChange={handleTabClick}
        >
            <TabList>
                <Tab
                    key="1"
                    className="SidebarTabs-tab"
                >
                    {t((isCampscapesProject && !archiveId) ?
                        ('user.notes_on_tos_agreement', {project: project.name[locale]}) :
                        (project.is_ohd ? 'modules.sidebar.search' : 'archive_search')
                    )}
                </Tab>

                <Tab
                    key="2"
                    className="SidebarTabs-tab"
                    disabled={!showCatalogTab}
                >
                    {t('modules.sidebar.catalog')}
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

                <Tab
                    key="12"
                    className="SidebarTabs-tab SidebarTabs-tab--admin"
                    disabled={!showHelpTextsTab}
                >
                    {t('activerecord.models.help_text.other')}
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel key="1">
                    {tabIndex === indexes.INDEX_SEARCH && (
                        <ArchiveSearchTabPanel selectedArchiveIds={selectedArchiveIds} />
                    )}
                </TabPanel>

                <TabPanel key="2" />

                <TabPanel key="3">
                    {showInterviewTab && tabIndex === indexes.INDEX_INTERVIEW && (
                        <StateCheck
                            testSelector={getCurrentInterviewFetched}
                            fallback={<Spinner withPadding />}
                        >
                            <InterviewTabPanelContainer />
                        </StateCheck>
                    )}
                </TabPanel>

                <TabPanel key="4">
                    {showRegistryTab && tabIndex === indexes.INDEX_REGISTRY_ENTRIES && (
                        <RegistryEntriesTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="5">
                    {showMapTab && tabIndex === indexes.INDEX_MAP && (
                        <MapTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="6">
                    {showWorkbookTab && tabIndex === indexes.INDEX_WORKBOOK && (
                        <WorkbookTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="7">
                    {showIndexingTab && tabIndex === indexes.INDEX_INDEXING && (
                        <IndexingTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="8">
                    {showAdministrationTab && tabIndex === indexes.INDEX_ADMINISTRATION && (
                        <UsersAdminTabPanelContainer />
                    )}
                </TabPanel>

                <TabPanel key="9">
                    {showProjectAdminTab && tabIndex === indexes.INDEX_PROJECT_ACCESS && (
                        <ProjectConfigTabPanel />
                    )}
                </TabPanel>

                <TabPanel key="10" />

                <TabPanel key="11" />

                <TabPanel key="12" />
            </TabPanels>
        </Tabs>
    );
}

SidebarTabs.propTypes = {
    interview: PropTypes.object,
    archiveId: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    selectedArchiveIds: PropTypes.array,
};
