import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import TableOfContentsContainer from '../containers/TableOfContentsContainer';
import TranscriptContainer from '../containers/TranscriptContainer';
import InterviewSearchContainer from '../containers/InterviewSearchContainer';
import RefTreeContainer from '../containers/RefTreeContainer';
import ArchiveUtils from '../../../lib/utils';

export default class InterviewTabs extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabIndex: 0
        }
    }

    componentDidMount(){
        if (this.props.interviewFulltext && ( this.props.interviewFulltext !== "" )) {
            this.setState({['tabIndex']: 3});
        } else if(this.props.locale != this.props.data.lang){
            this.setState({['tabIndex']: 1});
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.interviewFulltext && this.props.interviewFulltext && ( this.props.interviewFulltext !== "" )) {
            this.setState({['tabIndex']: 3});
        }
    }


    render() {
        return (
            <Tabs
                selectedTabClassName='active'
                selectedTabPanelClassName='active'
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => this.setState({tabIndex})}
            >
                <div className='content-tabs'>
                    <TabList className={'content-tabs-nav'}>
                        <Tab className={'content-tabs-nav-link'}><i
                            className="fa fa-file-text-o"></i><span>{ArchiveUtils.translate(this.props, 'transcript')}</span></Tab>
                        <Tab className={'content-tabs-nav-link'}><i
                            className="fa fa-clone"></i><span>{ArchiveUtils.translate(this.props, 'translation')}</span></Tab>
                        <Tab className={'content-tabs-nav-link'}><i
                            className="fa fa-list"></i><span>{ArchiveUtils.translate(this.props, 'table_of_contents')}</span></Tab>
                        <Tab className={'content-tabs-nav-link'}><i
                            className="fa fa-search"></i><span>{ArchiveUtils.translate(this.props, 'interview_search')}</span></Tab>
                        <Tab className={'content-tabs-nav-link'}><i
                            className="fa fa-tags"></i><span>{ArchiveUtils.translate(this.props, 'keywords')}</span></Tab>
                    </TabList>
                </div>

                <div className='wrapper-content'>
                    <TabPanel>
                        <TranscriptContainer
                            originalLocale={true}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TranscriptContainer
                            originalLocale={false}
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
