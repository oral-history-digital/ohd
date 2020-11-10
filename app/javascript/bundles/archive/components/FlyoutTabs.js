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

    loginTab() {
        let text = this.props.isLoggedIn ? 'account_page' : 'login_page';
        return <Tab className='flyout-top-nav' key='account'>{t(this.props, text)}</Tab>
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

    interviewTab() {
        let css = this.props.interview ? 'flyout-tab' : 'hidden';
        return <Tab className={css} key='interview'>{t(this.props, 'interview')}</Tab>
    }

    indexingTab() {
        let css = admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden';
        return <Tab selectedClassName='admin' className={css} key='indexing'>{t(this.props, 'edit.indexing')}</Tab>;
    }

    usersAdminTab() {
        let css = admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden';
        return <Tab selectedClassName='admin' className={css} key='administration'>{t(this.props, 'edit.administration')}</Tab>;
    }

    registryEntriesTab() {
        let css = this.props.isLoggedIn ? 'flyout-tab' : 'hidden';
        return (
            <Tab className={css} key='registry'>
                {t(this.props, (this.props.projectId === 'mog') ? 'registry_mog' : 'registry')}
            </Tab>
        );
    }

    userContentTab() {
        return (
            <AuthShowContainer ifLoggedIn={true}>
                <Tab className='flyout-tab' key='user-content'>{t(this.props, 'user_content')}</Tab>
            </AuthShowContainer>
        )
    }

    mapTab() {
        return (
            <AuthShowContainer ifLoggedIn={this.props.hasMap}>
                <Tab className='flyout-tab' key='map'>{t(this.props, 'map')}</Tab>
            </AuthShowContainer>
        )
    }

    renderSearchTheArchiveButton() {
        if (this.props.projectId === 'campscapes'&& !this.props.archiveId) {
            return t(this.props, 'user_registration.notes_on_tos_agreement')
        }
        else {
            return t(this.props, 'archive_search')
        }
    }

    activeCss(index) {
        let offset = this.props.hasMap + this.props.locales.length
        return ((index === 4 + offset || index === 5 + offset) ? 'active activeadmin' : 'active')
     }

    render() {
        let css = this.activeCss(this.state.tabIndex)
        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName={css}
                selectedTabPanelClassName={css}
                selectedIndex={this.state.tabIndex}
                onSelect={this.handleTabClick}
            >
                <div className='scroll-flyout'>
                    <TabList className='flyout'>
                        {this.loginTab()}
                        {this.localeTabs()}
                        <Tab className='flyout-tab' key='archive-search'>{this.renderSearchTheArchiveButton()}</Tab>
                        {this.interviewTab()}
                        {this.registryEntriesTab()}
                        {this.props.hasMap && this.mapTab()}
                        {this.indexingTab()}
                        {this.usersAdminTab()}
                        {this.userContentTab()}
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
                        this.props.hasMap ?
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
