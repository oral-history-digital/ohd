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
import LocaleSwitch from './LocaleSwitch';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';

export default function InterviewTabs({
    interview,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const [tabIndex, setTabIndex] = useState(0);
    const [translationLocale, setTranslationLocale] = useState(interview.translation_alpha3);
    const [tocLocale, setTocLocale] = useState(ALPHA2_TO_ALPHA3[locale]);

    const { fulltext } = useSearchParams();
    const { numResults } = useInterviewSearch(interview.archive_id, fulltext, project);

    useEffect(() => {
        selectTabOnInit();
    }, []);

    useEffect(() => {
        checkSelectedTabAfterLocaleChange();
    }, [locale]);

    function selectTabOnInit() {
        if (directlyShowSearchResults()) {
            setTabIndex(3);
        } else if (translatedTranscriptIsMoreSuitable()) {
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    }

    function directlyShowSearchResults() {
        return fulltext && numResults > 0;
    }

    function translatedTranscriptIsMoreSuitable() {
        return locale !== interview.alpha2
            && showTranslationTab(project, interview, locale);
    }

    function checkSelectedTabAfterLocaleChange() {
        // When changing locales sometimes a formerly selected tab is not
        // available any more.
        if (selectedTabNotAvailable()) {
            setTabIndex(0);
        }
    }

    function selectedTabNotAvailable() {
        return tabIndex === 1 && !showTranslationTab(project, interview, locale)
            || tabIndex === 2 && !showTocTab(project, interview, locale);
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
                            {`${t('transcript')} (${interview.alpha3})`}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        disabled={!showTranslationTab(project, interview, locale)}
                    >
                        <FaRegClone className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('translation')}
                            <LocaleSwitch
                                alpha3s={interview.translation_alpha3s}
                                selected={translationLocale}
                                setTranslationLocale={setTranslationLocale}
                            />
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        disabled={!showTocTab(project, interview, locale)}
                    >
                        <FaList className="Tabs-tabIcon"/>
                        <span className="Tabs-tabText">
                            {t('table_of_contents')}
                            <LocaleSwitch
                                alpha3s={interview.toc_alpha3s}
                                selected={tocLocale}
                                setTranslationLocale={setTocLocale}
                            />
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
                            <TranscriptContainer
                                transcriptLocale={interview.alpha3}
                                originalLocale
                                loadSegments
                            />
                        }
                    </TabPanel>
                    <TabPanel>
                        {tabIndex === 1 &&
                            <TranscriptContainer
                                transcriptLocale={translationLocale}
                            />
                        }
                    </TabPanel>
                    <TabPanel>
                        {tabIndex === 2 &&
                            <TableOfContentsContainer
                                alpha3={tocLocale}
                            />
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
