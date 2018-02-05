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
import ArchiveUtils from '../../../lib/utils';
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
        if (!this.props.account.email) {
            this.props.fetchAccount()
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
        } else if (tabIndex === this.props.locales.length + 3) {
            // interview
            this.context.router.history.push(`/${this.props.locale}/interviews/${this.props.archiveId}`);
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

    localeTabs() {
        return this.props.locales.map((locale, index) => {
            let classNames = 'flyout-top-nav lang';
            if ((index + 1) === this.props.locales.length)
                classNames += ' top-nav-last' 
            return <Tab className={classNames} key={`tab-${locale}`}>{locale}</Tab>
        })
    }

    localeTabPanels() {
        return this.props.locales.map((locale, index) => {
            return <TabPanel key={`tabpanel-${locale}`} />
        })
    }

    render() {

        let interviewCSS = this.props.interview ? 'flyout-tab' : 'hidden';
        let userContentCSS = this.props.account.email ? 'flyout-tab' : 'hidden';

        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName='active'
                selectedTabPanelClassName='active'
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => this.handleTabClick(tabIndex)}
            >

                <TabList className='flyout'>
                    <Tab className='flyout-top-nav'>{ArchiveUtils.translate(this.props, 'home')}</Tab>
                    <Tab className='flyout-top-nav'>{ArchiveUtils.translate(this.props, 'login_page')}</Tab>
                    {this.localeTabs()}
                    <Tab className='flyout-tab'>{ArchiveUtils.translate(this.props, 'archive_search')}</Tab>
                    <Tab className={interviewCSS}>{ArchiveUtils.translate(this.props, 'interview')}</Tab>
                    <Tab className={userContentCSS}>{ArchiveUtils.translate(this.props, 'user_content')}</Tab>
                </TabList>


                <TabPanel>
                    <AccountContainer></AccountContainer>
                </TabPanel>
                <TabPanel>
                    <AccountContainer></AccountContainer>
                </TabPanel>
                {this.localeTabPanels()}
                <TabPanel>
                    <div className='flyout-tab-title'>{ArchiveUtils.translate(this.props, 'archive_search')}</div>
                    <ArchiveSearchFormContainer
                    />
                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>{ArchiveUtils.translate(this.props, 'interview')}</div>
                    <div className='flyout-sub-tabs-container flyout-video'>
                        <InterviewDataContainer
                            title={ArchiveUtils.translate(this.props, 'person_info')}
                            content={<PersonDataContainer/>}/>
                        <InterviewDataContainer
                            title={ArchiveUtils.translate(this.props, 'interview_info')}
                            content={<InterviewInfoContainer/>}/>
                        <InterviewDataContainer
                            title={ArchiveUtils.translate(this.props, 'photos')}
                            content={<GalleryContainer/>}/>
                        <InterviewDataContainer
                            title={ArchiveUtils.translate(this.props, 'map')}
                            content={<InterviewLocationsContainer/>}/>
                        <InterviewDataContainer
                            title={ArchiveUtils.translate(this.props, 'citation')}
                            content={<CitationInfoContainer/>}/>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>{ArchiveUtils.translate(this.props, 'user_content')}</div>
                    <div className='flyout-sub-tabs-container flyout-folder'>
                        <UserContentsContainer
                            type='Search'
                            title={ArchiveUtils.translate(this.props, 'saved_searches')}/>
                        <UserContentsContainer
                            type='InterviewReference'
                            title={ArchiveUtils.translate(this.props, 'saved_interviews')}/>
                        <UserContentsContainer
                            type='UserAnnotation'
                            title={ArchiveUtils.translate(this.props, 'saved_annotations')}/>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}
