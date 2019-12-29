import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import TableOfContentsContainer from '../containers/TableOfContentsContainer';
import TranscriptContainer from '../containers/TranscriptContainer';
import InterviewSearchContainer from '../containers/InterviewSearchContainer';
import RefTreeContainer from '../containers/RefTreeContainer';
import { t } from '../../../lib/utils';

export default class InterviewTabs extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabIndex: 0
        }
    }

    componentDidMount(){
        if (this.props.interviewFulltext && ( this.props.interviewFulltext !== "" ) && (this.props.numberOfFoundSegments > 0)) {
            this.setState({['tabIndex']: 3});
        } else if(this.props.locale != this.props.interview.lang){
            this.setState({['tabIndex']: 1});
        } else {
            this.setState({['tabIndex']: 0});
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.interviewFulltext && this.props.interviewFulltext && ( this.props.interviewFulltext !== "" )) {
            this.setState({['tabIndex']: 3});
        } else if (prevProps.tabIndex !== this.props.tabIndex) {
            this.setState({['tabIndex']: this.props.tabIndex});
        }
    }


    render() {
        return (
            <Tabs
                selectedTabClassName='active'
                selectedTabPanelClassName='active'
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => {this.setState({tabIndex}); this.props.setInterviewTabIndex(tabIndex)}}
            >
                <div className='content-tabs'>
                    <TabList className={'content-tabs-nav'}>
                        <Tab className={'content-tabs-nav-link'}>
                            <i className="fa fa-file-text-o"/>
                            <span>{t(this.props, 'transcript')}</span>
                        </Tab>
                        <Tab className={`content-tabs-nav-link ${this.props.interview.lang === 'de' ? 'hidden' : ''}`}>
                            <i className="fa fa-clone"/>
                            <span>{t(this.props, 'translation')}</span>
                        </Tab>
                        <Tab className={`content-tabs-nav-link ${this.props.project == 'dg' ? 'hidden' : ''}`}>
                            <i className="fa fa-list"/>
                            <span>{t(this.props, 'table_of_contents')}</span>
                        </Tab>
                        <Tab className={'content-tabs-nav-link'}>
                            <i className="fa fa-search"/>
                            <span>{t(this.props, 'interview_search')}</span>
                        </Tab>
                        <Tab className={'content-tabs-nav-link'}>
                            <i className="fa fa-tags"/>
                            <span>{t(this.props, (this.props.project === 'mog') ? 'keywords_mog' : 'keywords')}</span>
                        </Tab>
                    </TabList>
                </div>

                <div className='wrapper-content'>
                    <TabPanel>
                        <TranscriptContainer
                            originalLocale={true}
                            loadSegments={true}
                            selectedIndex={this.state.tabIndex}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TranscriptContainer
                            originalLocale={false}
                            selectedIndex={this.state.tabIndex}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TableOfContentsContainer/>
                    </TabPanel>
                    <TabPanel>
                        <InterviewSearchContainer/>
                    </TabPanel>
                    <TabPanel>
                        <RefTreeContainer/>
                    </TabPanel>
                </div>
            </Tabs>
        );
    }
}
