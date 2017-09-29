import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TableOfContents from '../components/TableOfContents';
import Transcript from '../components/Transcript';
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
            <TableOfContents
              headings={this.props.headings}
              lang={this.props.interview.lang}
              handleSegmentClick={this.props.handleSegmentClick}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <Transcript
              transcriptScrollEnabled={this.props.transcriptScrollEnabled} 
              time={this.props.transcriptTime}
              segments={this.props.segments}
              lang={this.props.interview.lang}
              handleSegmentClick={this.props.handleSegmentClick}
              handleScroll={this.props.handleTranscriptScroll}
            />
          </TabPanel>
          <TabPanel forceRender={true} className='column-content'>
            <Transcript
              transcriptScrollEnabled={this.props.transcriptScrollEnabled} 
              time={this.props.transcriptTime}
              segments={this.props.segments}
              lang='de'
              handleSegmentClick={this.props.handleSegmentClick}
              handleScroll={this.props.handleTranscriptScroll}
            />
          </TabPanel>
          <TabPanel className='column-content'>
            <InterviewSearchContainer
              interviewId={this.props.interview.id}
              lang={this.props.lang}
              handleSegmentClick={this.props.handleSegmentClick}
            />
          </TabPanel>
        </div>
      </Tabs>
    );
  }
}
