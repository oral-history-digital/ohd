import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import InterviewLocationsContainer from '../containers/InterviewLocationsContainer';
import ArchiveSearchFormContainer from '../containers/ArchiveSearchFormContainer';
import UserContentsContainer from '../containers/UserContentsContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';

export default class FlyoutTabs extends React.Component {

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
          <ArchiveSearchFormContainer
          />
        </TabPanel>
        <TabPanel className='column-content'>
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
