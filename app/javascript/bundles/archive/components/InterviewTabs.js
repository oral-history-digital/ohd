import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TableOfContentsContainer from '../containers/TableOfContentsContainer';
import TranscriptContainer from '../containers/TranscriptContainer';
import InterviewSearchContainer from '../containers/InterviewSearchContainer';

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
          </TabList>
        </div>

        <div className='wrapper-content'>
          <TabPanel forceRender={true} className='column-content'>
            <TableOfContentsContainer
              lang={this.props.lang}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <TranscriptContainer
              lang={this.props.lang}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <TranscriptContainer
              lang='de'
            />
          </TabPanel>
          <TabPanel className='column-content'>
            <InterviewSearchContainer
              lang={this.props.lang}
            />
          </TabPanel>
        </div>
      </Tabs>
    );
  }
}
