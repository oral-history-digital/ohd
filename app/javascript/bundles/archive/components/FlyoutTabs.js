import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserContentsContainer from '../containers/UserContentsContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import GalleryContainer from '../containers/GalleryContainer';
import PersonDataContainer from '../containers/PersonDataContainer';


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

            case 1: //Login
                this.context.router.history.push(`/${this.props.locale}/account`);

            default:
                this.setState({tabIndex: tabIndex})
        }
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
        return (
            <Tabs
                className='wrapper-flyout'
                selectedTabClassName='active'
                selectedTabPanelClassName='active'
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => this.handleTabClick(tabIndex)}
            >

                <TabList className='flyout'>
                    <Tab className='flyout-top-nav'>Startseite </Tab>
                    <Tab className='flyout-top-nav top-nav-last'>Login </Tab>
                    <Tab className='flyout-tab'>Suche im Archiv</Tab>
                    <Tab className='flyout-tab'>Interview </Tab>
                    <Tab className='flyout-tab'>Arbeitsmappe </Tab>
                </TabList>


                <TabPanel>
                    start
                </TabPanel>
                <TabPanel>
                    login logout name
                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>Suche im Archiv</div>
                    <ArchiveSearchFormContainer
                    />
                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>Interview</div>
                    <div className='flyout-sub-tabs-container flyout-video'>

                        <InterviewDataContainer
                            title={'Zur Person'}
                            content={<PersonDataContainer/>}/>
                        <InterviewDataContainer
                            title={'Zum Interview'}
                            content={<div/>}/>
                        <InterviewDataContainer
                            title={'Bilder'}
                            content={<GalleryContainer/>}/>
                        <InterviewDataContainer
                            title={'Karte'}
                            content={<InterviewLocationsContainer/>}/>
                        <InterviewDataContainer
                            title={'Zitierweise'}
                            content={<div/>}/>
                    </div>

                </TabPanel>
                <TabPanel>
                    <div className='flyout-tab-title'>Arbeitsmappe</div>
                    <UserContentsContainer/>
                </TabPanel>

            </Tabs>
        );
    }
}
