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
import MarkTextFormContainer from '../containers/MarkTextFormContainer';
import GalleryContainer from '../containers/GalleryContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import AccountContainer from '../containers/AccountContainer';
import CitationInfoContainer from '../containers/CitationInfoContainer';
import AdminActionsContainer from '../containers/AdminActionsContainer';
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
            // account
            loggedIn(this.props) && this.context.router.history.push(`/${this.props.locale}/accounts/current`);
        } else if (tabIndex > 0 && tabIndex < this.props.locales.length + 1) {
            // locales (language switchers)
            this.switchLocale(this.props.locales[tabIndex - 1]);
        } else if (tabIndex === this.props.locales.length + 1) {
            // arrchive-search
            this.context.router.history.push(`/${this.props.locale}/searches/archive`);
        } else if (tabIndex === this.props.locales.length + 2) {
            // interview
            this.context.router.history.push(`/${this.props.locale}/interviews/${this.props.archiveId}`);
        } else if (tabIndex === this.props.locales.length + 3) {
             // registry entries
            this.context.router.history.push(`/${this.props.locale}/registry_entries`);
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
                    <AuthShowContainer ifLoggedOut={true}>
                        <AccountContainer/>
                    </AuthShowContainer>
                    <div className='flyout-sub-tabs-container flyout-video'>
                        <InterviewDataContainer
                            title={t(this.props, 'person_info')}
                            open={true}
                            content={
                                <div>
                                    <PersonDataContainer/>
                                    <InterviewRegistryReferencesContainer
                                        refObjectType={'person'}
                                    />
                                </div>
                            }
                        /> 
                        <AuthShowContainer ifLoggedOut={true}>
                            <InterviewDataContainer
                                title={t(this.props, 'interview_info')}
                                open={true}
                                content={ <InterviewInfoContainer refObjectType={'interview'}/> }/>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedIn={true}>
                            <InterviewDataContainer
                                title={t(this.props, 'interview_info')}
                                open={true}
                                content={ <div><InterviewInfoContainer refObjectType={'interview'}/><InterviewContributorsContainer/> <InterviewTextMaterialsContainer/></div> }/>
                        </AuthShowContainer>
                        {this.assignSpeakersForm()}
                        {this.markTextForm()}
                        {/* <InterviewDataContainer
                            title={t(this.props, 'activerecord.models.registry_references.other')}
                            content={<InterviewRegistryReferencesContainer/>}/> */}
                        <AuthShowContainer ifLoggedIn={true}>
                            {this.renderPhotos()}
                            {/* {(this.props.project === 'mog' || this.props.project === 'zwar') && this.renderMap()} */}
                            {this.renderMap()}
                            <InterviewDataContainer
                                title={t(this.props, 'citation')}
                                open={true}
                                content={<CitationInfoContainer/>}/>
                            {this.renderAdminActions([this.props.archiveId])}
                        </AuthShowContainer>
                    </div>
                </TabPanel>
            );
        } else {
            return <TabPanel key='interview'/>;
        }
    }

    renderAdminActions(archiveIds) {
        if (admin(this.props, {type: 'Interview', action: 'dois'})) {
            return <InterviewDataContainer
                title={t(this.props, 'admin_actions')}
                content={<AdminActionsContainer archiveIds={archiveIds} />}
            /> 
        } else {
            return null;
        }
    }

    assignSpeakersForm() {
        if (admin(this.props, {type: 'Interview', action: 'update_speakers'})) {
            return <InterviewDataContainer
                title={t(this.props, 'assign_speakers')}
                content={<AssignSpeakersFormContainer interview={this.props.interview} />}
            />
        } else {
            return null;
        }
    }
     
    markTextForm() {
        if (admin(this.props, {type: 'Interview', action: 'mark_texts'})) {
            return <InterviewDataContainer
                title={t(this.props, 'mark_texts')}
                content={<MarkTextFormContainer interview={this.props.interview} />}
            />
        } else {
            return null;
        }
    }
     
    subTab(title, content, url, obj, condition=true) {
        if (admin(this.props, obj) && condition) {
            return (
                <div className='flyout-sub-tabs-container flyout-video'>
                    <InterviewDataContainer
                        title={t(this.props, title)}
                        content={content}
                        url={url}
                        open={false}
                    /> 
                </div>
            )
        } else {
            return null;
        }
    }

    indexingTab() {
        let css = admin(this.props, {type: 'Interview', action: 'update'}) ? 'flyout-tab' : 'hidden';
        return <Tab className={css} key='indexing'>{t(this.props, 'edit.indexing')}</Tab>;
    }

    indexingTabPanel() {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return (
                <TabPanel key={'tabpanel-indexing'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.indexing')}</div>
                    <div className='flyout-sub-tabs-container'>
                        {this.subTab('edit.interview.new', 'description', `/${this.props.locale}/interviews/new`, {type: 'Interview', action: 'create'})}
                        {this.subTab('edit.upload_transcript.title', 'description', `/${this.props.locale}/transcripts/new`, {type: 'Interview', action: 'update', id: this.props.archiveId})}
                        {this.subTab('edit.downloads.title', this.downloads(), null, {type: 'Interview', action: 'update', id: this.props.archiveId}, this.props.archiveId)}
                        {this.subTab('edit.upload.upload', 'description', `/${this.props.locale}/uploads/new`, {type: 'Interview', action: 'update'})}
                        {this.subTab('edit.person.new', 'description', `/${this.props.locale}/people/new`, {type: 'Person', action: 'create'})}
                    </div>
                </TabPanel>
            )
        } else {
            return <TabPanel key='tabpanel-indexing'/>;
        }
    }

    downloads() {
        if (this.props.archiveId) {
            let links = [];
            for (var i=1; i<parseInt(this.props.interview.tape_count); i++) {
                links.push(
                    <p>
                        <h4>{`${t(this.props, 'tape')} ${i}:`}</h4>
                        <a href={`/${this.props.locale}/interviews/${this.props.archiveId}.ods?tape_number=${i}`} download>ods</a>&#44;&#xa0;
                        <a href={`/${this.props.locale}/interviews/${this.props.archiveId}.vtt?tape_number=${i}`} download>vtt</a>
                    </p>
                );
            }
            return (
                <div>
                    <h4>{this.props.archiveId}:</h4>
                    {links}
                </div>
            );
        } else {
            return null;
        }
    }

    usersAdminTab() {
        let css = admin(this.props, {type: 'UserRegistration', action: 'update'}) ? 'flyout-tab' : 'hidden';
        return <Tab className={css} key='administration'>{t(this.props, 'edit.administration')}</Tab>;
    }

    usersAdminTabPanel() {
        if (admin(this.props, {type: 'UserRegistration', action: 'update'})) {
            return (
                <TabPanel key={'tabpanel-users-admin'}>
                    <div className='flyout-tab-title'>{t(this.props, 'edit.administration')}</div>
                    <div className='flyout-sub-tabs-container'>
                        {this.subTab(
                            'edit.users.admin', 
                            <div>
                                <UserRegistrationSearchFormContainer/>
                                <a href={`/${this.props.locale}/admin/user_statistics.csv`}>
                                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download_user_statistics')}></i>
                                    <span>{` ${t(this.props, 'download_user_statistics')}`}</span>
                                </a>
                            </div>,
                            `/${this.props.locale}/user_registrations`,
                            {type: 'UserRegistration', action: 'update'}
                        )}
                        {this.subTab(
                            'edit.role.admin', 
                            <RoleSearchFormContainer/>,
                            `/${this.props.locale}/roles`,
                            {type: 'Role', action: 'update'}
                        )}
                        {this.subTab(
                            'edit.permission.admin', 
                            <PermissionSearchFormContainer/>,
                            `/${this.props.locale}/permissions`,
                            {type: 'Permission', action: 'update'}
                        )}
                    </div>
                </TabPanel>
            )
        } else {
            return <TabPanel key='tabpanel-users-admin'/>;
        }
    }

    registryEntriesTab() {
        let css = loggedIn(this.props) ? 'flyout-tab' : 'hidden';
        return (
            <Tab className={css} key='registry'>
                {t(this.props, (this.props.project === 'mog') ? 'registry_mog' : 'registry')}
            </Tab>
        );
    }

    registryEntriesTabPanel() {
        return (
            <TabPanel key={'tabpanel-registry-entries'}>
                <div className='flyout-tab-title'>{t(this.props, (this.props.project === 'mog') ? 'registry_mog' : 'registry')}</div>
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
                open={true}
                content={<InterviewLocationsContainer/>}/>
        }
    }

    renderPhotos() {
        if (loggedIn(this.props)) {
            return <InterviewDataContainer
                title={t(this.props, 'photos')}
                open={true}
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
                        {this.loginTab()}
                        {this.localeTabs()}
                        <Tab className='flyout-tab' key='archive-search'>{t(this.props, 'archive_search')}</Tab>
                        {this.interviewTab()}
                        {this.registryEntriesTab()}
                        {this.indexingTab()}
                        {this.usersAdminTab()} 
                        {this.userContentTab()}
                    </TabList>

                    <TabPanel key='account'>
                        <AccountContainer/>
                    </TabPanel>
                    {this.localeTabPanels()}
                    <TabPanel key='archive-search'>
                        <div className='flyout-tab-title'>{t(this.props, 'archive_search')}</div>
                        <ArchiveSearchFormContainer/>
                        <div className='flyout-sub-tabs-container flyout-video'>
                            {this.renderAdminActions(this.props.selectedArchiveIds)}
                        </div>
                    </TabPanel>
                    {this.interviewTabPanel()}
                    {this.registryEntriesTabPanel()}
                    {this.indexingTabPanel()}
                    {this.usersAdminTabPanel()} 
                    {this.userContentTabPanel()}
                </div>
            </Tabs>
        );
    }
}
