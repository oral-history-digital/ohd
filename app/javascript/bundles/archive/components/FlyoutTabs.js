import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import AccountContainer from '../containers/AccountContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import ArchiveSearchTabPanelContainer from '../containers/flyout-tabs/ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from '../containers/flyout-tabs/RegistryEntriesTabPanelContainer';
import UserContentTabPanelContainer from '../containers/flyout-tabs/UserContentTabPanelContainer';
import UsersAdminTabPanelContainer from '../containers/flyout-tabs/UsersAdminTabPanelContainer';
import IndexingTabPanelContainer from '../containers/flyout-tabs/IndexingTabPanelContainer';
import MapTabPanelContainer from '../containers/flyout-tabs/MapTabPanelContainer';
import InterviewTabPanelContainer from '../containers/flyout-tabs/InterviewTabPanelContainer';
import LocaleButtonsContainer from '../containers/flyout-tabs/LocaleButtonsContainer';
import { t, admin, pathBase } from '../../../lib/utils';

export default class FlyoutTabs extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context);

        this.state = { tabIndex: this.props.tabIndex }

        this.handleTabClick = this.handleTabClick.bind(this);
    }

    handleTabClick(tabIndex) {
        switch (tabIndex) {
        case 0:
            // account
            this.props.isLoggedIn && this.context.router.history.push(`${pathBase(this.props)}/accounts/current`);
            break;
        case 1:
            // arrchive-search
            this.context.router.history.push(`${pathBase(this.props)}/searches/archive`);
            break;
        case 2:
            // interview
            this.context.router.history.push(`${pathBase(this.props)}/interviews/${this.props.archiveId}`);
            break;
        case 3:
            // registry entries
            this.context.router.history.push(`${pathBase(this.props)}/registry_entries`);
            break;
        case 4:
            if (this.props.hasMap) {
                // map
                this.context.router.history.push(`${pathBase(this.props)}/searches/map`);
            }
            break;
        default:
        }

        this.setState({ tabIndex: tabIndex });
    }

    activeCss(index) {
        let offset = this.props.hasMap;
        return ((index === 4 + offset || index === 5 + offset) ? 'active activeadmin' : 'active')
    }

    render() {
        const { interview, projectId, archiveId, isLoggedIn, hasMap } = this.props;
        const { tabIndex } = this.state;

        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName={this.activeCss(tabIndex)}
                selectedTabPanelClassName={this.activeCss(tabIndex)}
                selectedIndex={tabIndex}
                onSelect={this.handleTabClick}
            >
                <div className='scroll-flyout'>
                    <TabList className='flyout'>
                        <Tab className='flyout-top-nav' key='account'>
                            { t(this.props, isLoggedIn ? 'account_page' : 'login_page') }
                        </Tab>

                        <LocaleButtonsContainer />

                        <Tab className='flyout-tab' key='archive-search'>
                            { t(this.props, (projectId === 'campscapes' && !archiveId) ? 'user_registration.notes_on_tos_agreement' : 'archive_search') }
                        </Tab>

                        <Tab className={interview ? 'flyout-tab' : 'hidden'} key='interview'>
                            { t(this.props, 'interview') }
                        </Tab>

                        <Tab className={isLoggedIn ? 'flyout-tab' : 'hidden'} key='registry'>
                            { t(this.props, projectId === 'mog' ? 'registry_mog' : 'registry') }
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

                        <Tab
                            selectedClassName='admin'
                            className={admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden'}
                            key='indexing'
                        >
                            { t(this.props, 'edit.indexing') }
                        </Tab>

                        <Tab
                            selectedClassName='admin'
                            className={admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden'}
                            key='administration'
                        >
                            { t(this.props, 'edit.administration') }
                        </Tab>

                        <AuthShowContainer ifLoggedIn>
                            <Tab className='flyout-tab' key='user-content'>
                                { t(this.props, 'user_content') }
                            </Tab>
                        </AuthShowContainer>
                    </TabList>

                    <TabPanel key='account'>
                        <AccountContainer/>
                    </TabPanel>

                    <TabPanel key="archive-search">
                        <ArchiveSearchTabPanelContainer />
                    </TabPanel>

                    <TabPanel key="interview">
                        <InterviewTabPanelContainer />
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

                    <TabPanel key="tabpanel-indexing">
                        <IndexingTabPanelContainer />
                    </TabPanel>

                    <TabPanel key="tabpanel-users-admin">
                        <UsersAdminTabPanelContainer />
                    </TabPanel>

                    <TabPanel key="user-content">
                        <UserContentTabPanelContainer />
                    </TabPanel>
                </div>
            </Tabs>
        );
    }
}
