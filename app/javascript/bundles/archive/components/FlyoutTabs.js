import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import classNames from 'classnames';

import AccountContainer from '../containers/AccountContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import ArchiveSearchTabPanelContainer from '../containers/flyout-tabs/ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from '../containers/flyout-tabs/RegistryEntriesTabPanelContainer';
import UserContentTabPanelContainer from '../containers/flyout-tabs/UserContentTabPanelContainer';
import UsersAdminTabPanelContainer from '../containers/flyout-tabs/UsersAdminTabPanelContainer';
import IndexingTabPanelContainer from '../containers/flyout-tabs/IndexingTabPanelContainer';
import MapTabPanelContainer from '../containers/flyout-tabs/MapTabPanelContainer';
import InterviewTabPanelContainer from '../containers/flyout-tabs/InterviewTabPanelContainer';
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
        if (tabIndex === 0) {
            // account
            this.props.isLoggedIn && this.context.router.history.push(`${pathBase(this.props)}/accounts/current`);
        } else if (tabIndex > 0 && tabIndex < this.props.locales.length + 1) {
            // locales (language switchers)
            this.switchLocale(this.props.locales[tabIndex - 1]);
        } else if (tabIndex === this.props.locales.length + 1) {
            // arrchive-search
            this.context.router.history.push(`${pathBase(this.props)}/searches/archive`);
        } else if (tabIndex === this.props.locales.length + 2) {
            // interview
            this.context.router.history.push(`${pathBase(this.props)}/interviews/${this.props.archiveId}`);
        } else if (tabIndex === this.props.locales.length + 3) {
             // registry entries
            this.context.router.history.push(`${pathBase(this.props)}/registry_entries`);
        } else if (this.props.hasMap && tabIndex === this.props.locales.length + 4) {
            // map
            this.context.router.history.push(`${pathBase(this.props)}/searches/map`);
        }
        if (tabIndex === 0 || tabIndex >= this.props.locales.length + 1) {
            this.setState({tabIndex: tabIndex});
        }
    }

    switchLocale(locale) {
        // with projectId
        let newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2,4}\/[a-z]{2}\//, `/${this.props.projectId}/${locale}/`);
        // workaround: (without projectId in path), TODO: fit this when multi-project is finished
        if (newPath === this.context.router.route.location.pathname) {
            newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2}\//, `/${locale}/`);
        }
        this.context.router.history.push(newPath);
        this.props.setLocale(locale);
    }

    localeTabs() {
        return this.props.locales.map((locale, index) => {
            let classNames = 'flyout-top-nav lang';
            if ((index + 1) === this.props.locales.length)
                classNames += ' top-nav-last'
            if (locale === this.props.locale)
                classNames += ' active'
            return <Tab className={classNames} key={`tab-${locale}`}>{locale}</Tab>
        })
    }

    localeTabPanels() {
        return this.props.locales.map((locale, index) => {
            return <TabPanel key={`tabpanel-${locale}`}/>
        })
    }

    activeCss(index) {
        let offset = this.props.hasMap + this.props.locales.length
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

                        {this.localeTabs()}

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

                    {this.localeTabPanels()}

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
