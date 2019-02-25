import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserRegistrationSearchFormContainer from '../containers/UserRegistrationSearchFormContainer';
import RoleSearchFormContainer from '../containers/RoleSearchFormContainer';
import PermissionSearchFormContainer from '../containers/PermissionSearchFormContainer';
import RegistryEntrySearchFormContainer from '../containers/RegistryEntrySearchFormContainer';
import AllUserContentsContainer from '../containers/AllUserContentsContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import InterviewContributorsContainer from '../containers/InterviewContributorsContainer';
import InterviewRegistryReferencesContainer from '../containers/InterviewRegistryReferencesContainer';
import InterviewTextMaterialsContainer from '../containers/InterviewTextMaterialsContainer';
import AssignSpeakersFormContainer from '../containers/AssignSpeakersFormContainer';
import GalleryContainer from '../containers/GalleryContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import AccountContainer from '../containers/AccountContainer';
import CitationInfoContainer from '../containers/CitationInfoContainer';
import ExportInterviewContainer from '../containers/ExportInterviewContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t, admin, loggedIn } from '../../../lib/utils';

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
        } else if (tabIndex === 1) {
            // account
            this.context.router.history.push(`/${this.props.locale}/accounts/current`);
        } else if (tabIndex > 1 && tabIndex < this.props.locales.length + 2) {
            // locales (language switchers)
            this.switchLocale(this.props.locales[tabIndex - 2]);
        } else if (tabIndex === this.props.locales.length + 2) {
            // arrchive-search
            let url = `/${this.props.locale}/searches/archive`;
            this.context.router.history.push(url);
        } else if (tabIndex === this.props.locales.length + 3) {
            // interview
            this.context.router.history.push(`/${this.props.locale}/interviews/${this.props.archiveId}`);
        } else if (tabIndex === this.props.locales.length + 4) {
             // registry entries
            this.context.router.history.push(`/${this.props.locale}/registry_entries`);
        } else if (tabIndex === this.props.locales.length + 5) {
             //edit interview
            this.context.router.history.push(`/${this.props.locale}/interviews/new`);
        } else if (tabIndex === this.props.locales.length + 6) {
             // upload transcript
            this.context.router.history.push(`/${this.props.locale}/transcripts/new`);
        } else if (tabIndex === this.props.locales.length + 7) {
             // uploads
            this.context.router.history.push(`/${this.props.locale}/uploads/new`);
        } else if (tabIndex === this.props.locales.length + 8) {
             // add person
            this.context.router.history.push(`/${this.props.locale}/people/new`);
        } else if (tabIndex === this.props.locales.length + 9) {
             // users administration
            this.context.router.history.push(`/${this.props.locale}/user_registrations`);
        } else if (tabIndex === this.props.locales.length + 10) {
             // roles
            this.context.router.history.push(`/${this.props.locale}/roles`);
        } else if (tabIndex === this.props.locales.length + 11) {
             // permissions
            this.context.router.history.push(`/${this.props.locale}/permissions`);
        }
        this.setState({tabIndex: tabIndex});
    }

    switchLocale(locale) {
        let newPath = this.context.router.route.location.pathname.replace(/^\/[a-z]{2}\//, `/${locale}/`);
        this.context.router.history.push(newPath);
        this.props.setLocale(locale);
    }

    loginTab() {
        let text = loggedIn(this.props) ? 'account_page' : 'login_page';
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
                            content={<div><PersonDataContainer/><InterviewRegistryReferencesContainer/></div>}/> 
                        <InterviewDataContainer
                            title={t(this.props, 'interview_info')}
                            content={
                                <div>
                                    <InterviewInfoContainer/>
                                    <AuthShowContainer ifLoggedIn={true}>
                                        <InterviewContributorsContainer/>
                                        <InterviewTextMaterialsContainer/>
                                    </AuthShowContainer>
                                </div>
                            }/>
                        {this.assignSpeakersForm()}
                        {/* <InterviewDataContainer
                            title={t(this.props, 'activerecord.models.registry_references.other')}
                            content={<InterviewRegistryReferencesContainer/>}/> */}
                        <AuthShowContainer ifLoggedIn={true}>
                            {this.renderPhotos()}
                            {/* {(this.props.project === 'mog' || this.props.project === 'zwar') && this.renderMap()} */}
                            <InterviewDataContainer
                                title={t(this.props, 'citation')}
                                content={<CitationInfoContainer/>}/>
                            {this.renderExport([this.props.archiveId])}
                        </AuthShowContainer>
                    </div>
                </TabPanel>
            );
        } else {
            return <TabPanel key='interview'/>;
        }
    }

    renderExport(archiveIds) {
        if (admin(this.props)) {
            return <InterviewDataContainer
                title={t(this.props, 'export')}
                content={<ExportInterviewContainer archiveIds={archiveIds} />}
            /> 
        } else {
            return null;
        }
    }

    assignSpeakersForm() {
        if (admin(this.props)) {
            return <InterviewDataContainer
                title={t(this.props, 'assign_speakers')}
                content={<AssignSpeakersFormContainer interview={this.props.interview} />}
            />
        } else {
            return null;
        }
    }
     
    showEditView() {
        // TODO: this is a fast unsafe way to decide whether user is admin!
        // make it better!!
        return admin(this.props) && this.props.editView;
    }

    editTabs() {
        let css = this.showEditView() ? 'flyout-tab' : 'hidden';
        return [
            //<Tab className={css} key='edit_interview.new'>{t(this.props, 'edit_interview.new')}</Tab>,
            <Tab className={css} key='edit.interview.new'>{t(this.props, 'edit.interview.new')}</Tab>,
            <Tab className={css} key='edit.upload_transcript'>{t(this.props, 'edit.upload_transcript')}</Tab>,
            <Tab className={css} key='edit.upload.upload'>{t(this.props, 'edit.upload.upload')}</Tab>,
            <Tab className={css} key='edit.person.new'>{t(this.props, 'edit.person.new')}</Tab>,
            <Tab className={css} key='edit.users.admin'>{t(this.props, 'edit.users.admin')}</Tab>,
            <Tab className={css} key='edit.role.admin'>{t(this.props, 'edit.role.admin')}</Tab>,
            <Tab className={css} key='edit.permission.admin'>{t(this.props, 'edit.permission.admin')}</Tab>,
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
                <TabPanel key={'tabpanel-uploads'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.upload.upload')}</div>
                </TabPanel>,
                <TabPanel key={'tabpanel-add-person'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.person.new')}</div>
                </TabPanel>,
                <TabPanel key={'tabpanel-users-admin'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.users.admin')}</div>
                    <div className='flyout-sub-tabs-container'>
                        <UserRegistrationSearchFormContainer/>
                        <a href={`/${this.props.locale}/admin/user_statistics.csv`}>
                            <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download_user_statistics')}></i>
                            <span>{` ${t(this.props, 'download_user_statistics')}`}</span>
                        </a>
                    </div>
                </TabPanel>,
                <TabPanel key={'tabpanel-role-admin'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.role.admin')}</div>
                    <RoleSearchFormContainer/>
                </TabPanel>,
                <TabPanel key={'tabpanel-permission-admin'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.permission.admin')}</div>
                    <PermissionSearchFormContainer/>
                </TabPanel>
            ];
        } else {
            return [
                <TabPanel key='tabpanel-edit-interview'/>,
                <TabPanel key='tabpanel-upload-transcript'/>,
                <TabPanel key='tabpanel-uploads'/>,
                <TabPanel key='tabpanel-add-person'/>,
                <TabPanel key='tabpanel-users-admin'/>,
                <TabPanel key='tabpanel-role-admin'/>,
                <TabPanel key='tabpanel-permission-admin'/>,
            ]
        }
    }

    registryEntriesTab() {
        let css = loggedIn(this.props) ? 'flyout-tab' : 'hidden';
        return (
            <Tab className={css} key='registry'>
                {t(this.props, 'registry')}
            </Tab>
        );
    }

    registryEntriesTabPanel() {
        return (
            <TabPanel key={'tabpanel-registry-entries'}>
                <div className='flyout-tab-title'>{t(this.props, 'registry')}</div>
                <div className='flyout-sub-tabs-container'>
                    <RegistryEntrySearchFormContainer />
                    <div>
                        <button onClick={() => this.props.changeRegistryEntriesViewMode(!this.props.showRegistryEntriesTree)}>
                            {t(this.props, 'activerecord.models.registry_entries.actions.' + (this.props.showRegistryEntriesTree ? 'show_search_results' : 'show_tree'))}
                        </button>
                    </div>
                    {/* <a href={`/${this.props.locale}/registry_entries.pdf`}>
                        <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                        <span>{` ${t(this.props, 'download')}`}</span>
                    </a> */}
                </div>
            </TabPanel>
        )
    }

    userContentTab() {
        let css = loggedIn(this.props) ? 'flyout-tab' : 'hidden';
        return <Tab className={css} key='user-content'>{t(this.props, 'user_content')}</Tab>;
    }

    userContentTabPanel() {
        return (
            <TabPanel key='user-content'>
                <div className='flyout-tab-title'>{t(this.props, 'user_content')}</div>
                <div className='flyout-sub-tabs-container flyout-folder'>
                    <AllUserContentsContainer />
                </div>
            </TabPanel>
        )
    }

    renderMap() {
        if (loggedIn(this.props)) {
            return <InterviewDataContainer
                title={t(this.props, 'map')}
                content={<InterviewLocationsContainer/>}/>
        }
    }

    renderPhotos() {
        if (loggedIn(this.props)) {
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
                        {this.registryEntriesTab()}
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
                        <div className='flyout-sub-tabs-container flyout-video'>
                            {this.renderExport(this.props.selectedArchiveIds)}
                        </div>
                    </TabPanel>
                    {this.interviewTabPanel()}
                    {this.registryEntriesTabPanel()}
                    {this.editTabPanels()}
                    {this.userContentTabPanel()}
                </div>
            </Tabs>
        );
    }
}
