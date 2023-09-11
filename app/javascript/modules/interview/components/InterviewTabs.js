import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaRegFileAlt, FaRegClone, FaList, FaSearch, FaTags } from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import { TableOfContentsContainer } from 'modules/toc';
import { TranscriptContainer } from 'modules/transcript';
import { InterviewSearchContainer, useInterviewSearch } from 'modules/interview-search';
import { RefTreeContainer } from 'modules/interview-references';
import { useSearchParams } from 'modules/query-string';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import showTranslationTab from './showTranslationTab';
import showTocTab from './showTocTab';

export default function InterviewTabs({
    interview,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const [tabIndex, setTabIndex] = useState(0);

    const { fulltext } = useSearchParams();
    const { numResults } = useInterviewSearch(interview.archive_id, fulltext, project);

    useEffect(() => {
        if (fulltext && numResults > 0) {
            setTabIndex(3);
        } else if (locale !== interview.lang){
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    }, [])

    // When changing locales sometimes tab 1 will be hidden, so if tab 1
    // was active we need to switch to tab 0.
    if (tabIndex === 1 && !showTranslationTab(projectId, interview.lang, locale)) {
        setTabIndex(0);
    }

    return (
        <Tabs
            className="Tabs"
            keyboardActivation="manual"
            index={tabIndex}
            onChange={setTabIndex}
        >
            <div className="Layout-contentTabs">
                <TabList className="Tabs-tabList">
                    <Tab className="Tabs-tab">
                        <FaRegFileAlt className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('transcript')}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        disabled={!showTranslationTab(projectId, interview.lang, locale)}
                    >
                        <FaRegClone className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('translation')}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        disabled={!showTocTab(projectId)}
                    >
                        <FaList className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('table_of_contents')}
                        </span>
                    </Tab>
                    <Tab className="Tabs-tab">
                        <FaSearch className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('interview_search')}
                        </span>
                    </Tab>
                    <Tab className="Tabs-tab">
                        <FaTags className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('keywords')}
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

InterviewTabs.propTypes = {
    interview: PropTypes.object.isRequired,
};
