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

        this.setTabIndex = this.setTabIndex.bind(this);
    }

    resultsCount() {
        const { interviewSearchResults } = this.props;

        let count = 0;
        if (interviewSearchResults?.foundSegments) {
            count += interviewSearchResults.foundSegments.length +
                interviewSearchResults.foundRegistryEntries.length +
                interviewSearchResults.foundBiographicalEntries.length;
        }
        return count;
    }

    componentDidMount(){
        const { interviewSearchResults, locale, interview } = this.props;

        if (
            interviewSearchResults?.fulltext &&
            interviewSearchResults.fulltext !== "" &&
            this.resultsCount() > 0
        ) {
            this.setState({ tabIndex: 3 });
        } else if(locale != interview.lang){
            this.setState({ tabIndex: 1 });
        } else {
            this.setState({ tabIndex: 0 });
        }
    }

    componentDidUpdate(prevProps) {
        const { interviewSearchResults, tabIndex } = this.props;

        if (
            !(prevProps.interviewSearchResults && prevProps.interviewSearchResults.fulltext) &&
            interviewSearchResults?.fulltext &&
            interviewSearchResults.fulltext !== ""
        ) {
            this.setState({ tabIndex: 3});
        } else if (prevProps.tabIndex !== tabIndex) {
            this.setState({ tabIndex });
        }
    }

    setTabIndex(tabIndex) {
        const { setInterviewTabIndex } = this.props;

        // TODO: Why is this saved redundantly?
        this.setState({ tabIndex });
        setInterviewTabIndex(tabIndex)
    }

    render() {
        const { interview, projectId, locale } = this.props;
        const { tabIndex } = this.state;

        // When changing locales sometimes tab 1 will be hidden, so if tab 1
        // was active we need to switch to tab 0.
        if (tabIndex === 1 && !showTranslationTab(projectId, interview.lang, locale)) {
            this.setTabIndex(0);
        }

        return (
            <Tabs
                className="Tabs"
                keyboardActivation="manual"
                index={tabIndex}
                onChange={this.setTabIndex}
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
