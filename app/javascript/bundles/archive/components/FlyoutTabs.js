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

            default:
                this.setState({ tabIndex })
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
        <TabList>
          <Tab className='flyout-tab'> Startseite </Tab>
          <Tab className='flyout-tab'> Account </Tab>
          <Tab className='flyout-tab'> Suche </Tab>
          <Tab className='flyout-tab'> Interview </Tab>
          <Tab className='flyout-tab'> Sprache </Tab>
          <Tab className='flyout-tab'> Arbeitsmappe </Tab>
          <Tab className='flyout-tab'> Zuletzt angesehen </Tab>
          <Tab className='flyout-tab'> Hilfe </Tab>
        </TabList>

        <TabPanel className='column-content'>
          start
        </TabPanel>
        <TabPanel className='column-content'>
          login logout name
        </TabPanel>
        <TabPanel className='column-content'>
          <ArchiveSearchFormContainer
          />
        </TabPanel>
        <TabPanel className='column-content'>
          <InterviewLocationsContainer  />
          biographie transcript daten zur za
        </TabPanel>
        <TabPanel className='column-content'>
          sprache
        </TabPanel>
        <TabPanel className='column-content'>
            <UserContentsContainer />
        </TabPanel>
        <TabPanel className='column-content'>
          zuletzt angesehen
        </TabPanel>
        <TabPanel className='column-content'>
          hilfe
        </TabPanel>
      </Tabs>
    );
  }
}
