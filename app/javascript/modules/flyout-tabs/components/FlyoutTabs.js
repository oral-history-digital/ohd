import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import { AccountContainer } from 'modules/account';
import { AuthShowContainer, admin } from 'modules/auth';
import { StateCheck, getCurrentInterviewFetched } from 'modules/data';
import ArchiveSearchTabPanelContainer from './ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from './RegistryEntriesTabPanelContainer';
import WorkbookTabPanel from './WorkbookTabPanel';
import UsersAdminTabPanelContainer from './UsersAdminTabPanelContainer';
import IndexingTabPanelContainer from './IndexingTabPanelContainer';
import MapTabPanelContainer from './MapTabPanelContainer';
import InterviewTabPanelContainer from './InterviewTabPanelContainer';
import ProjectConfigTabPanelContainer from './ProjectConfigTabPanelContainer';
import LocaleButtonsContainer from './LocaleButtonsContainer';
import * as indexes from '../constants';
import { Spinner } from 'modules/spinners';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';

export default class FlyoutTabs extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        flyoutTabsIndex: PropTypes.number.isRequired,
        setFlyoutTabsIndex: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);
    }

    handleTabClick(index) {
        const { history, isLoggedIn, hasMap, setFlyoutTabsIndex } = this.props;

        setFlyoutTabsIndex(index);

        switch (index) {
        case indexes.INDEX_ACCOUNT:
            if (isLoggedIn) {
                history.push(`${pathBase(this.props)}/accounts/current`);
            }
            break;
        case indexes.INDEX_SEARCH:
            history.push(`${pathBase(this.props)}/searches/archive`);
            break;
        case indexes.INDEX_INTERVIEW:
            history.push(`${pathBase(this.props)}/interviews/${this.props.archiveId}`);
            break;
        case indexes.INDEX_REGISTRY_ENTRIES:
            history.push(`${pathBase(this.props)}/registry_entries`);
            break;
        case indexes.INDEX_MAP:
            if (hasMap) {
                history.push(`${pathBase(this.props)}/searches/map`);
            }
            break;
        default:
        }
    }

    activeCss(index) {
        let offset = this.props.hasMap;
        return ((index === 5 + offset || index === 6 + offset) ? 'active activeadmin' : 'active')
    }

    render() {
        const { flyoutTabsIndex, interview, projectId, project, archiveId, isLoggedIn, hasMap } = this.props;

        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName="active"
                selectedTabPanelClassName="active"
                selectedIndex={flyoutTabsIndex}
                onSelect={this.handleTabClick}
            >
                <div className='scroll-flyout'>
                    <TabList className='flyout'>
                        <Tab className='flyout-top-nav' key='account'>
                            { t(this.props, isLoggedIn ? 'account_page' : 'login_page') }
                        </Tab>

                        <LocaleButtonsContainer />

                        <Tab className={isLoggedIn && project ? 'flyout-tab' : 'hidden'} key='archive-search'>
                            { t(this.props, (projectId === 'campscapes' && !archiveId) ? 'user_registration.notes_on_tos_agreement' : 'archive_search') }
                        </Tab>

                        <Tab className={interview && project ? 'flyout-tab' : 'hidden'} key='interview'>
                            { t(this.props, 'interview') }
                        </Tab>

                        <Tab className={isLoggedIn && project ? 'flyout-tab' : 'hidden'} key='registry'>
                            { t(this.props, 'registry') }
                        </Tab>

                        {
                            hasMap ?
                                (<AuthShowContainer ifLoggedIn={hasMap}>
                                    <Tab className='flyout-tab' key='map'>
                                        { t(this.props, 'map') }
                                    </Tab>
                                </AuthShowContainer>) :
                                null
                        }

                        <Tab className={isLoggedIn && project ? 'flyout-tab' : 'hidden'} key='user-content'>
                            { t(this.props, 'user_content') }
                        </Tab>

                        <Tab
                            selectedClassName='admin'
                            className={project && admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden'}
                            key='indexing'
                        >
                            { t(this.props, 'edit.indexing') }
                        </Tab>

                        <Tab
                            selectedClassName='admin'
                            className={project && admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden'}
                            key='administration'
                        >
                            { t(this.props, 'edit.administration') }
                        </Tab>
                        <Tab
                            selectedClassName='admin'
                            className={project && admin(this.props, {type: 'Project', action: 'update'}) ? 'flyout-tab admin' : 'hidden'}
                            key='project-administration'
                        >
                            { t(this.props, 'edit.project.admin') }
                        </Tab>
                    </TabList>

                    <TabPanel key='account'>
                        <AccountContainer/>
                    </TabPanel>

                    <TabPanel key="archive-search">
                        <ArchiveSearchTabPanelContainer selectedArchiveIds={this.props.selectedArchiveIds} />
                    </TabPanel>

                    <TabPanel key="interview">
                        <StateCheck
                            testSelector={getCurrentInterviewFetched}
                            fallback={<Spinner withPadding />}
                        >
                            <InterviewTabPanelContainer />
                        </StateCheck>
                    </TabPanel>

                    <TabPanel key="tabpanel-registry-entries">
                        <RegistryEntriesTabPanelContainer />
                    </TabPanel>

                    {
                        hasMap ?
                            (<TabPanel key='map'>
                                <MapTabPanelContainer />
                            </TabPanel>) :
                            null
                    }

                    <TabPanel key="user-content">
                        <WorkbookTabPanel />
                    </TabPanel>

                    <TabPanel key="tabpanel-indexing">
                        <IndexingTabPanelContainer />
                    </TabPanel>

                    <TabPanel key="tabpanel-users-admin">
                        <UsersAdminTabPanelContainer />
                    </TabPanel>

                    <TabPanel key="tabpanel-project-config">
                        <ProjectConfigTabPanelContainer />
                    </TabPanel>
                </div>
            </Tabs>
        );
    }
}