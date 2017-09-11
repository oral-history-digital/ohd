import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import InterviewSearch from '../components/InterviewSearch';
import Locations from '../components/Locations';

export default class FlyoutTabs extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      tabIndex: this.props.tabIndex
    }
  }

  handleTabClick(tabIndex) {
    switch(tabIndex) {
      case 0:
        if(window.location !== '/') {
          window.location = '/';
        }
        break;
      case 2:
        if(window.location !== '/suchen') {
          window.location = '/suchen';
        }
        break;
      default:
        this.setState({ tabIndex })
    }
  }

  render() {
    return (
      <Tabs
        className='flyout'
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
          {/*
          <InterviewSearch
            url='/suchen'
            lang={this.props.lang}
          />
          */}
        </TabPanel>
        <TabPanel className='column-content'>
          <Locations position={[37.9838, 23.7275]} zoom={13} />
          biographie transcript daten zur za
        </TabPanel>
        <TabPanel className='column-content'>
          sprache
        </TabPanel>
        <TabPanel className='column-content'>
          arbeitsmappe
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
