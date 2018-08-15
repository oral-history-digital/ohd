import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserContentsContainer from '../containers/UserContentsContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import GalleryContainer from '../containers/GalleryContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import { t } from '../../../lib/utils';
import AccountContainer from '../containers/AccountContainer';
import CitationInfoContainer from '../containers/CitationInfoContainer';

export default class FlyoutTabs extends React.Component {


    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabIndex: this.props.tabIndex
        }
    }

    componentDidMount() {
        if (!this.props.account.email && !this.props.account.isFetchingAccount) {
            this.props.fetchAccount()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tabIndex !== this.props.tabIndex) {
            this.setState({ 
                tabIndex: nextProps.tabIndex
            })
        }
    }

    handleTabClick(tabIndex) {
        if (tabIndex === 0) {
            // home
            this.context.router.history.push(`/${this.props.locale}`);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex > 1 && tabIndex < this.props.locales.length + 2) {
            // locales (language switchers)
            this.switchLocale(this.props.locales[tabIndex - 2]);
        } else if (tabIndex === this.props.locales.length + 2) {
            // arrchive-search
            let url = `/${this.props.locale}/searches/archive`;
            this.context.router.history.push(url);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex === this.props.locales.length + 3) {
            // interview
            this.context.router.history.push(`/${this.props.locale}/interviews/${this.props.archiveId}`);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex === this.props.locales.length + 4) {
             //edit interview
            this.context.router.history.push(`/${this.props.locale}/interviews/new`);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex === this.props.locales.length + 5) {
             // upload transcript
            this.context.router.history.push(`/${this.props.locale}/transcripts/new`);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex === this.props.locales.length + 6) {
             // add person
            this.context.router.history.push(`/${this.props.locale}/people/new`);
            this.setState({tabIndex: tabIndex});
        } else if (tabIndex === this.props.locales.length + 7) {
             // registry entries
            this.context.router.history.push(`/${this.props.locale}/registry_entries`);
            this.setState({tabIndex: tabIndex});
        } else {
            this.setState({tabIndex: tabIndex})
        }
    }

    switchLocale(locale) {
        let newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2}\//, `/${locale}/`);
        this.context.router.history.push(newPath);
        this.props.setLocale(locale);
    }

    saveSearchForm() {
        return <UserContentFormContainer
            title=''
            description=''
            properties={Object.assign({}, this.props.searchQuery, {fulltext: this.props.fulltext})}
            type='Search'
        />
    }

    loginTab() {
        let text = this.props.account.email ? 'logout_page' : 'login_page';
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

    interviewTabPanel() {
        if (this.props.archiveId && this.props.archiveId !== 'new') {
            return (
                <TabPanel key='interview'>
                    <div className='flyout-tab-title'>{t(this.props, 'interview')}</div>
                    <div className='flyout-sub-tabs-container flyout-video'>
                        <InterviewDataContainer
                            title={t(this.props, 'person_info')}
                            content={<PersonDataContainer/>}/>
                        <InterviewDataContainer
                            title={t(this.props, 'interview_info')}
                            content={<InterviewInfoContainer/>}/>
                        {this.renderPhotos()}
                        {this.renderMap()}
                        <InterviewDataContainer
                            title={t(this.props, 'citation')}
                            content={<CitationInfoContainer/>}/>
                    </div>
                </TabPanel>
            );
        } else {
            return <TabPanel key='interview'/>;
        }
    }
     
    showEditView() {
        // TODO: this is a fast unsafe way to decide whether user is admin!
        // make it better!!
        return this.props.account.admin && this.props.editView;
    }

    editTabs() {
        let css = this.showEditView() ? 'flyout-tab' : 'hidden';
        return [
            //<Tab className={css} key='edit_interview.new'>{t(this.props, 'edit_interview.new')}</Tab>,
            <Tab className={css} key='edit.interview.new'>{t(this.props, 'edit.interview.new')}</Tab>,
            <Tab className={css} key='edit.upload_transcript'>{t(this.props, 'edit.upload_transcript')}</Tab>,
            <Tab className={css} key='edit.person.new'>{t(this.props, 'edit.person.new')}</Tab>,
            <Tab className={css} key='edit.registry_entries'>{t(this.props, 'edit.registry_entries')}</Tab>,
        ];
    }

    editTabPanels() {
        if (this.showEditView()) {
            return [
                //<TabPanel key={'tabpanel-new-interview'}>
                    //<div className='flyout-tab-title'>{t(this.props, 'edit_interview.new')}</div>
                //</TabPanel>,
                <TabPanel key={'tabpanel-edit-interview'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.interview.new')}</div>
                </TabPanel>,
                <TabPanel key={'tabpanel-upload-transcript'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.upload_transcript')}</div>
                </TabPanel>,
                <TabPanel key={'tabpanel-add-person'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.person.new')}</div>
                </TabPanel>,
                <TabPanel key={'tabpanel-registry-entries'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.registry_entries')}</div>
                </TabPanel>,
            ];
        } else {
            return [
                <TabPanel key='tabpanel-edit-interview'/>,
                <TabPanel key='tabpanel-upload-transcript'/>,
                <TabPanel key='tabpanel-add-person'/>,
                <TabPanel key='tabpanel-registry-entries'/>
            ]
        }
    }

    userContentTab() {
        let css = this.props.account.email ? 'flyout-tab' : 'hidden';
        return <Tab className={css} key='user-content'>{t(this.props, 'user_content')}</Tab>;
    }

    userContentTabPanel() {
        return (
            <TabPanel key='user-content'>
                <div className='flyout-tab-title'>{t(this.props, 'user_content')}</div>
                <div className='flyout-sub-tabs-container flyout-folder'>
                    <UserContentsContainer
                        type='Search'
                        title={t(this.props, 'saved_searches')}/>
                    <UserContentsContainer
                        type='InterviewReference'
                        title={t(this.props, 'saved_interviews')}/>
                    <UserContentsContainer
                        type='UserAnnotation'
                        title={t(this.props, 'saved_annotations')}/>
                </div>
            </TabPanel>
        )
    }

    renderMap() {
        if (this.props.account.email) {
            return <InterviewDataContainer
                title={t(this.props, 'map')}
                content={<InterviewLocationsContainer/>}/>
        }
    }

    renderPhotos() {
        if (this.props.account.email) {
            return <InterviewDataContainer
                title={t(this.props, 'photos')}
                content={<GalleryContainer/>}/>
        }
    }


    render() {
        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName='active'
                selectedTabPanelClassName='active'
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => this.handleTabClick(tabIndex)}
            >
                <div className='scroll-flyout'>
                    <TabList className='flyout'>
                        <Tab className='flyout-top-nav' key='home'>{t(this.props, 'home')}</Tab>
                        {this.loginTab()}
                        {this.localeTabs()}
                        <Tab className='flyout-tab' key='archive-search'>{t(this.props, 'archive_search')}</Tab>
                        {this.interviewTab()}
                        {this.editTabs()}
                        {this.userContentTab()}
                    </TabList>

                    <TabPanel key='home'>
                        <AccountContainer/>
                    </TabPanel>
                    <TabPanel key='account'>
                        <AccountContainer/>
                    </TabPanel>
                    {this.localeTabPanels()}
                    <TabPanel key='archive-search'>
                        <div className='flyout-tab-title'>{t(this.props, 'archive_search')}</div>
                        <ArchiveSearchFormContainer/>
                    </TabPanel>
                    {this.interviewTabPanel()}
                    {this.editTabPanels()}
                    {this.userContentTabPanel()}
                </div>
            </Tabs>
        );
    }
}
