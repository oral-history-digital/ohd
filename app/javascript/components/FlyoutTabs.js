import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Locations from '../components/Locations';
import ArchiveSearchForm from '../components/ArchiveSearchForm';

export default class FlyoutTabs extends React.Component {

  render() {
    return (
      <Tabs
        className='wrapper-flyout'
        selectedTabClassName='active'
        selectedTabPanelClassName='active'
        defaultIndex={this.props.tabIndex}
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
          <ArchiveSearchForm
            url='/de/suchen'
            appState={this.props.appState}
            archiveSearch={this.props.archiveSearch}
          />
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
