import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaRegFileAlt, FaRegClone, FaList, FaSearch, FaTags } from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { TableOfContentsContainer } from 'modules/toc';
import { TranscriptContainer } from 'modules/transcript';
import { InterviewSearchContainer } from 'modules/interview-search';
import { RefTreeContainer } from 'modules/interview-references';
import { t } from 'modules/i18n';
import showTranslationTab from './showTranslationTab';
import showTocTab from './showTocTab';

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
        const { interview, projectId, locale } = this.props;
        const { tabIndex } = this.state;

        return (
            <Tabs
                className="Tabs"
                keyboardActivation="manual"
                index={tabIndex}
                onChange={tabIndex => {this.setState({tabIndex}); this.props.setInterviewTabIndex(tabIndex)}}
            >
                <div className="Layout-contentTabs">
                    <TabList className="Tabs-tabList">
                        <Tab className="Tabs-tab">
                            <FaRegFileAlt className="Tabs-tabIcon"/>
                            <span className="Tabs-tabText">
                                {t(this.props, 'transcript')}
                            </span>
                        </Tab>
                        <Tab
                            className="Tabs-tab"
                            disabled={!showTranslationTab(projectId, interview.lang, locale)}
                        >
                            <FaRegClone className="Tabs-tabIcon"/>
                            <span className="Tabs-tabText">
                                {t(this.props, 'translation')}
                            </span>
                        </Tab>
                        <Tab
                            className="Tabs-tab"
                            disabled={!showTocTab(projectId)}
                        >
                            <FaList className="Tabs-tabIcon"/>
                            <span className="Tabs-tabText">
                                {t(this.props, 'table_of_contents')}
                            </span>
                        </Tab>
                        <Tab className="Tabs-tab">
                            <FaSearch className="Tabs-tabIcon"/>
                            <span className="Tabs-tabText">
                                {t(this.props, 'interview_search')}
                            </span>
                        </Tab>
                        <Tab className="Tabs-tab">
                            <FaTags className="Tabs-tabIcon"/>
                            <span className="Tabs-tabText">
                                {t(this.props, 'keywords')}
                            </span>
                        </Tab>
                    </TabList>
                </div>

                <div className='wrapper-content'>
                    <TabPanels>
                        {/* The conditional renderings are needed to prevent
                            various useEffect-related problems. */}
                        <TabPanel>
                            {tabIndex === 0 &&
                                <TranscriptContainer originalLocale loadSegments />
                            }
                        </TabPanel>
                        <TabPanel>
                            {tabIndex === 1 &&
                                <TranscriptContainer />
                            }
                        </TabPanel>
                        <TabPanel>
                            {tabIndex === 2 &&
                                <TableOfContentsContainer/>
                            }
                        </TabPanel>
                        <TabPanel>
                            {tabIndex === 3 &&
                                <InterviewSearchContainer/>
                            }
                        </TabPanel>
                        <TabPanel>
                            {tabIndex === 4 &&
                                <RefTreeContainer/>
                            }
                        </TabPanel>
                    </TabPanels>
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
