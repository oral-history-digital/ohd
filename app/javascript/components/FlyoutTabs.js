import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import InterviewSearch from '../components/InterviewSearch';

export default class FlyoutTabs extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      tabIndex: this.props.tabIndex
    }
  }

  render() {
    return (
      <Tabs 
        className='flyout'
        selectedTabClassName='active' 
        selectedTabPanelClassName='active' 
        selectedIndex={this.state.tabIndex} 
        onSelect={tabIndex => this.setState({ tabIndex })}
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

        <TabPanel forceRender={true} className='column-content'>
          start
        </TabPanel>
        <TabPanel forceRender={true} className='column-content'>
          login logout name
        </TabPanel>
        <TabPanel forceRender={true} className='column-content'>
          <InterviewSearch
            url='/de/suchen/neu'
            lang={this.props.lang}
          />
        </TabPanel>
        <TabPanel className='column-content'>
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
