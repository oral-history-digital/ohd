import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserContentsContainer from '../containers/UserContentsContainer';

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
        switch(tabIndex) {
            case 0: //Home
                this.context.router.history.push(`/${this.props.locale}`);

            case 1: //Login
                this.context.router.history.push(`/${this.props.locale}/account`);

            default:
                this.setState({ tabIndex: tabIndex })
        }
    }

    userContentForm() {
        return  <UserContentFormContainer 
                    title=''
                    description=''
                    properties={{title: this.props.interview.title}}
                    reference_id={this.props.interview.id}
                    reference_type='Interview'
                    media_id={this.props.interview.archive_id}
                    type='InterviewReference'
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
                    <Tab className='flyout-top-nav top-nav-last"'>Login </Tab>
                    <Tab className='flyout-tab'>Suche im Archiv</Tab>
                    <Tab className='flyout-tab'>Interview </Tab>
                    <Tab className='flyout-tab'>Arbeitsmappe </Tab>
                </TabList>


                <TabPanel >
                    start
                </TabPanel>
                <TabPanel >
                    login logout name
                </TabPanel>
                <TabPanel >
                    <div className='flyout-tab-title'>Suche im Archiv</div>
                    <ArchiveSearchFormContainer
                    />
                </TabPanel>
                <TabPanel >
                    <div className='flyout-tab-title'>Interview</div>
                    <div 
                        className='edit' 
                        onClick={() => this.props.openArchivePopup({
                            title: 'Save reference to this interview', 
                            content: this.userContentForm()
                        })}
                    >
                        {'Save reference to this interview'}
                    </div>
                    <InterviewLocationsContainer  />
                    biographie transcript daten zur za
                </TabPanel>
                <TabPanel >
                    <div className='flyout-tab-title'>Arbeitsmappe</div>
                    <UserContentsContainer />
                </TabPanel>

            </Tabs>
        );
    }
}
