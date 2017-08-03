import React from 'react';

import Transcript from '../components/Transcript';

export default class InterviewTabs extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeTab: 'transcript'
    }
  }

  render() {
    return (
      <div>
        <div className='content-tabs'>
          <ul>
            <li> Inhaltsverzeichnis</li>
            <li className='active'> Transkript</li>
            <li> Übersetzung</li>
            <li> Suche</li>
            <li> Karte</li>
          </ul>
        </div>
        <div className='wrapper-content'>
          <div className='column-content'>
            <Transcript
              time={this.props.transcriptTime}
              interviewId={this.props.interviewId}
              lang={this.props.lang}
            />
          </div>
        </div>
      </div>
    );
  }
}


