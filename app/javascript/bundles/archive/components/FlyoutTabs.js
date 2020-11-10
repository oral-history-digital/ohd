import React from 'react';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import UploadTranscriptContainer from '../containers/UploadTranscriptContainer';
import InterviewContributorsContainer from '../containers/InterviewContributorsContainer';
import SelectedRegistryReferencesContainer from '../containers/SelectedRegistryReferencesContainer';
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
import ArchiveSearchTabPanelContainer from '../containers/flyout-tabs/ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from '../containers/flyout-tabs/RegistryEntriesTabPanelContainer';
import UserContentTabPanelContainer from '../containers/flyout-tabs/UserContentTabPanelContainer';
import UsersAdminTabPanelContainer from '../containers/flyout-tabs/UsersAdminTabPanelContainer';
import IndexingTabPanelContainer from '../containers/flyout-tabs/IndexingTabPanelContainer';
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

    interviewTabPanel() {
        if (this.props.archiveId && this.props.archiveId !== 'new') {
            return (
                <TabPanel key='interview'>
                    <div className='flyout-tab-title'>{t(this.props, 'interview')}</div>
                    <AuthShowContainer ifLoggedOut={this.props.projectId !== "campscapes"} ifNoProject={true}>
                        <AccountContainer/>
                    </AuthShowContainer>
                    <div className={`flyout-sub-tabs-container flyout-video ${this.props.projectId === "campscapes" ? "hidden": ""}`}>
                        <InterviewDataContainer
                            title={t(this.props, 'person_info')}
                            open={true}
                            content={
                                <div>
                                    <PersonDataContainer/>
                                    <SelectedRegistryReferencesContainer refObject={this.props.interviewee} />
                                </div>
                            }
                        />
                        <AuthShowContainer ifLoggedOut={this.props.projectId !== "campscapes"} ifNoProject={true}>
                            <InterviewDataContainer
                                title={t(this.props, 'interview_info')}
                                open={true}
                                content={ <InterviewInfoContainer/> }
                            />
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedIn={this.props.projectId !== "campscapes"}>
                            <InterviewDataContainer
                                title={t(this.props, 'interview_info')}
                                open={true}
                                content={ <div><InterviewInfoContainer/><InterviewContributorsContainer/> <InterviewTextMaterialsContainer/></div> }
                            />
                        </AuthShowContainer>
                        {this.transcriptAndContributions()}
                        {this.assignSpeakersForm()}
                        {this.markTextForm()}
                        {/* <InterviewDataContainer
                                title={t(this.props, 'activerecord.models.registry_references.other')}
                                content={ <SelectedRegistryReferencesContainer refObject={this.props.interviewee} />}
                            />
                        */}
                        <AuthShowContainer ifLoggedIn={this.props.projectId !== "campscapes"}>
                            {this.renderPhotos()}
                            {this.renderMap()}
                            <InterviewDataContainer
                                title={t(this.props, 'citation')}
                                open={true}
                                content={<CitationInfoContainer/>}
                            />
                            {this.renderAdminActions([this.props.archiveId])}
                        </AuthShowContainer>
                    </div>
                    {this.subTab('edit.downloads.title', this.downloads(), null, {type: 'Interview', action: 'download', id: this.props.archiveId}, this.props.archiveId && this.props.projectId !== "campscapes")}
                </TabPanel>
            );
        } else {
            return <TabPanel key='interview'/>;
        }
    }

    transcriptAndContributions() {
        if (admin(this.props, this.props.interview)) {
            return (
                <InterviewDataContainer
                    title={t(this.props, 'edit.upload_transcript.title')}
                    open={false}
                    content={ <div><UploadTranscriptContainer /><InterviewContributorsContainer withSpeakerDesignation={true}/></div> }
                />
            )
        }
    }

    renderAdminActions(archiveIds) {
        if (admin(this.props, {type: 'General', action: 'edit'})) {
            return <InterviewDataContainer
                title={t(this.props, 'admin_actions')}
                content={<AdminActionsContainer archiveIds={archiveIds} />}
            />
        } else {
            return null;
        }
    }

    assignSpeakersForm() {
        // speakers assignment does not work for dg at the moment, but we don't need it either
        if (admin(this.props, {type: 'Interview', action: 'update_speakers', interview_id: this.props.interview && this.props.interview.id}) && this.props.projectId !== 'dg') {
            return <InterviewDataContainer
                title={t(this.props, 'assign_speakers')}
                content={<AssignSpeakersFormContainer interview={this.props.interview} />}
            />
        } else {
            return null;
        }
    }

    markTextForm() {
        if (admin(this.props, {type: 'Interview', action: 'mark_texts', interview_id: this.props.interview && this.props.interview.id}) && this.props.projectId !== 'dg') {
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
        let css = admin(this.props, {type: 'General', action: 'edit'}) ? 'flyout-tab admin' : 'hidden';
        return <Tab selectedClassName='admin' className={css} key='indexing'>{t(this.props, 'edit.indexing')}</Tab>;
    }

    downloads() {
        //if (this.props.archiveId && this.props.archiveId !== 'new') {
        if (this.props.interview && admin(this.props, {type: 'Interview', action: 'download'})) {
            let links = [];
            for (var i=1; i <= parseInt(this.props.interview.tape_count); i++) {
                links.push(
                    <div key={`downloads-for-tape-${i}`}>
                        <h4>{`${t(this.props, 'tape')} ${i}:`}</h4>
                        <a href={`${pathBase(this.props)}/interviews/${this.props.archiveId}.ods?tape_number=${i}`} download>ods</a>&#44;&#xa0;
                        <a href={`${pathBase(this.props)}/interviews/${this.props.archiveId}.vtt?tape_number=${i}`} download>vtt</a>
                    </div>
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

    mapTabPanel() {
        return (
            <AuthShowContainer ifLoggedIn={this.props.hasMap}>
                <TabPanel key='map'>
                    <div className='flyout-tab-title'>{t(this.props, 'map')}</div>
                    <ArchiveSearchFormContainer map={true}/>
                    <div className='flyout-sub-tabs-container flyout-video'>
                        {this.renderAdminActions(this.props.selectedArchiveIds)}
                    </div>
                </TabPanel>
            </AuthShowContainer>
        )
    }

    renderMap() {
        return (
            <AuthShowContainer ifLoggedIn={this.props.hasMap}>
                <InterviewDataContainer
                    title={t(this.props, 'map')}
                    open={true}
                    content={<InterviewLocationsContainer/>}
                />
            </AuthShowContainer>
        )
    }

    renderPhotos() {
        return (
            <AuthShowContainer ifLoggedIn={this.props.projectId === "zwar"}>
                <InterviewDataContainer
                    title={t(this.props, 'photos')}
                    open={true}
                    content={<GalleryContainer/>}
                />
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

                    <TabPanel key='archive-search'>
                        <ArchiveSearchTabPanelContainer />
                    </TabPanel>

                    {this.interviewTabPanel()}

                    <TabPanel key="tabpanel-registry-entries">
                        <RegistryEntriesTabPanelContainer />
                    </TabPanel>

                    {this.props.hasMap && this.mapTabPanel()}

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
