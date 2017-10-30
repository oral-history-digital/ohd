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
          <TabList className={'content-tabs-nav'}>
            <Tab className={'content-tabs-nav-link'}><i className="fa fa-ellipsis-v"></i><span>Inhaltsverzeichnis</span></Tab>
            <Tab className={'content-tabs-nav-link'}><i className="fa fa-file-text-o"></i><span>Transkript</span></Tab>
            <Tab className={'content-tabs-nav-link'}><i className="fa fa-clone"></i><span>Übersetzung</span></Tab>
            <Tab className={'content-tabs-nav-link'}><i className="fa fa-search"></i><span>Suche</span></Tab>
          </TabList>
        </div>

        <div className='wrapper-content'>
          <TabPanel forceRender={true} className='column-content'>
            <TableOfContentsContainer />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <TranscriptContainer
              originalLocale={true}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <TranscriptContainer
              originalLocale={false}
            />
          </TabPanel>
          <TabPanel className='column-content'>
            <InterviewSearchContainer />
          </TabPanel>
        </div>
      </Tabs>
    );
  }
}
