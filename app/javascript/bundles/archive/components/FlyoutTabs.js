import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserContentsContainer from '../containers/UserContentsContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import GalleryContainer from '../containers/GalleryContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import ArchiveUtils from '../../../lib/utils';

export default class FlyoutTabs extends React.Component {


    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabIndex: this.props.tabIndex
        }
    }

    handleTabClick(tabIndex) {
        switch (tabIndex) {
            case 0: //Home
                this.context.router.history.push(`/${this.props.locale}`);
                break;

            case 1: //Login
                this.context.router.history.push(`/${this.props.locale}/account`);
                break;

            case 2: //de
                this.switchLocale('de');
                break;

            case 3: //el
                this.switchLocale('el');
                break;

            default:
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


    render() {

        let interviewCSS = this.props.interview ? 'flyout-tab' : 'hidden';

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
                    <Tab className='flyout-top-nav lang'>de</Tab>
                    <Tab className='flyout-top-nav top-nav-last lang'>el</Tab>
                    <Tab className='flyout-tab'>{ArchiveUtils.translate(this.props, 'archive_search')}</Tab>
                    <Tab className={interviewCSS}>{ArchiveUtils.translate(this.props, 'interview')}</Tab>
                    <Tab className='flyout-tab'>{ArchiveUtils.translate(this.props, 'user_content')}</Tab>
                </TabList>


                <TabPanel>
                </TabPanel>
                <TabPanel>
                </TabPanel>
                <TabPanel>
                </TabPanel>
                <TabPanel>
                </TabPanel>
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
                            content={<div/>}/>
                    </div>

                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>{ArchiveUtils.translate(this.props, 'user_content')}</div>
                    <div className='flyout-sub-tabs-container flyout-folder'>
                        <UserContentsContainer
                            type={'Search'}
                            title='Gemerkte Suchergebnisse'/>
                        <UserContentsContainer
                            type={'InterviewReference'}
                            title='Gemerkte Interviewa'/>
                        <UserContentsContainer
                            type={'userAnnotation'}
                            title='Gemerkte Annotations'/>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }
}
