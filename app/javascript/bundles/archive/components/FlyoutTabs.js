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

        console.log(this.props.tabIndex);
        this.state = {
            tabIndex: this.props.tabIndex
        }
    }

    handleTabClick(tabIndex) {
        switch(tabIndex) {
            case 0: //Home
                this.context.router.history.push(`/${this.props.locale}`);
                break;
            case 1: //Login
                this.context.router.history.push(`/${this.props.locale}/account`);
                break;
            default:
                this.setState({ tabIndex })
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
                    <div className={'flyout-top-nav-container'}>
                        <div className={'flyout-top-nav'}>
                            <Tab className=''> Startseite </Tab>
                            <Tab className=''> Login </Tab>
                        </div>
                    </div>


                    <Tab className='flyout-tab'> Suche </Tab>
                    <Tab className='flyout-tab'> Interview </Tab>
                    <Tab className='flyout-tab'> Arbeitsmappe </Tab>

                </TabList>

                <TabPanel >
                    start
                </TabPanel>
                <TabPanel >
                    login logout name
                </TabPanel>
                <TabPanel >
                    <ArchiveSearchFormContainer
                    />
                </TabPanel>
                <TabPanel >
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
                    <UserContentsContainer />
                </TabPanel>

            </Tabs>
        );
    }
}
