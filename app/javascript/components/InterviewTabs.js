import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Transcript from '../components/Transcript';

export default class InterviewTabs extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      tabIndex: 1
    }
  }

  render() {
    return (
      <Tabs 
        selectedTabClassName='active' 
        selectedTabPanelClassName='active' 
        selectedIndex={this.state.tabIndex} 
        onSelect={tabIndex => this.setState({ tabIndex })}
        >
        <div className='content-tabs'>
          <TabList>
            <Tab> Inhaltsverzeichnis</Tab>
            <Tab> Transkript</Tab>
            <Tab> Übersetzung</Tab>
            <Tab> Suche</Tab>
            <Tab> Karte</Tab>
          </TabList>
        </div>

        <div className='wrapper-content'>
          <TabPanel className='column-content'>
            <h2>Any content 1</h2>
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <Transcript
              time={this.props.transcriptTime}
              interviewId={this.props.interview.id}
              lang={this.props.interview.lang}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <Transcript
              time={this.props.transcriptTime}
              interviewId={this.props.interview.id}
              lang='de'
            />
          </TabPanel>
          <TabPanel className='column-content'>
            karte
          </TabPanel>
          <TabPanel className='column-content'>
            suche
          </TabPanel>
        </div>
      </Tabs>
    );
  }
}
