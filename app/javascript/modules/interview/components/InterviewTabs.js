import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaRegFileAlt, FaRegClone, FaList, FaSearch, FaTags } from 'react-icons/fa';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import { TableOfContentsContainer } from 'modules/toc';
import { TranscriptContainer } from 'modules/transcript';
import { InterviewSearchContainer } from 'modules/interview-search';
import { RefTreeContainer } from 'modules/interview-references';
import { t } from 'modules/i18n';

export default class InterviewTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0
        }
    }

    resultsCount() {
        let count = 0;
        if (this.props.interviewSearchResults && this.props.interviewSearchResults.foundSegments) {
            count += this.props.interviewSearchResults.foundSegments.length +
                this.props.interviewSearchResults.foundRegistryEntries.length +
                this.props.interviewSearchResults.foundBiographicalEntries.length;
        }
        return count;
    }

    componentDidMount(){
        if (
            this.props.interviewSearchResults &&
            this.props.interviewSearchResults.fulltext &&
            this.props.interviewSearchResults.fulltext !== "" &&
            this.resultsCount() > 0
        ) {
            this.setState({['tabIndex']: 3});
        } else if(this.props.locale != this.props.interview.lang){
            this.setState({['tabIndex']: 1});
        } else {
            this.setState({['tabIndex']: 0});
        }
    }


    componentDidUpdate(prevProps) {
        if (
            !(prevProps.interviewSearchResults && prevProps.interviewSearchResults.fulltext) &&
            this.props.interviewSearchResults &&
            this.props.interviewSearchResults.fulltext &&
            this.props.interviewSearchResults.fulltext !== ""
        ) {
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
                <div className="Layout-contentTabs content-tabs">
                    <TabList className="content-tabs-nav">
                        <Tab className="content-tabs-nav-link">
                            <FaRegFileAlt />
                            <span>{t(this.props, 'transcript')}</span>
                        </Tab>
                        <Tab className={`content-tabs-nav-link ${(this.props.interview.lang === 'de') ? 'hidden' : ''}`}>
                            <FaRegClone />
                            <span>{t(this.props, 'translation')}</span>
                        </Tab>
                        <Tab className={`content-tabs-nav-link ${this.props.projectId == 'dg' ? 'hidden' : ''}`}>
                            <FaList />
                            <span>{t(this.props, 'table_of_contents')}</span>
                        </Tab>
                        <Tab className="content-tabs-nav-link">
                            <FaSearch />
                            <span>{t(this.props, 'interview_search')}</span>
                        </Tab>
                        <Tab className="content-tabs-nav-link">
                            <FaTags />
                            <span>{t(this.props, 'keywords')}</span>
                        </Tab>
                    </TabList>
                </div>

                <div className='wrapper-content'>
                    <TabPanel>
                        <TranscriptContainer originalLocale loadSegments />
                    </TabPanel>
                    <TabPanel>
                        <TranscriptContainer />
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

InterviewTabs.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object,
    tabIndex: PropTypes.number,
    setInterviewTabIndex: PropTypes.func.isRequired,
};
