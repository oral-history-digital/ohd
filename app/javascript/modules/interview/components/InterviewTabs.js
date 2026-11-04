import { useEffect, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { RefTreeContainer } from 'modules/interview-references';
import {
    InterviewSearchContainer,
    useInterviewSearch,
} from 'modules/interview-search';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { TableOfContentsContainer } from 'modules/toc';
import { Transcript } from 'modules/transcript';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import {
    FaList,
    FaRegClone,
    FaRegFileAlt,
    FaSearch,
    FaTags,
} from 'react-icons/fa';

import LocaleSwitch from './LocaleSwitch';
import showTocTab from './showTocTab';
import showTranslationTab from './showTranslationTab';

/**
 * Shows interview content tabs using the current project's display settings.
 * Initial tab selection waits for project details; later updates preserve the user's choice.
 *
 * @param {Object} props - Interview context.
 * @param {Object} props.interview - Interview with transcript and translation availability.
 * @returns {React.ReactElement} Content tabs, loading indicator, or project error.
 */
export default function InterviewTabs({ interview }) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject({});
    const initialized = useRef(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [translationLocale, setTranslationLocale] = useState(
        interview.translation_alpha3
    );

    const { fulltext } = useSearchParams();
    // Pause searching while project details are loading or unavailable.
    const { numResults } = useInterviewSearch(
        interview.archive_id,
        fulltext,
        !isLoading && !error ? project : undefined
    );

    // Wait for project details before choosing the initial tab. The ref prevents
    // later data updates from overriding the tab the user has selected.
    useEffect(() => {
        if (!project || isLoading || error || initialized.current) return;
        initialized.current = true;
        // Prefer existing search matches, then a suitable translation; otherwise keep the transcript.
        if (fulltext && numResults > 0) {
            setTabIndex(3);
        } else if (
            locale !== interview.alpha2 &&
            showTranslationTab(project, interview, locale)
        ) {
            setTabIndex(1);
        }
    }, [project, isLoading, error, fulltext, numResults, interview, locale]);

    useEffect(() => {
        if (!project || isLoading || error) return;
        // Return to the transcript if the selected translation or contents tab becomes unavailable.
        if (
            (tabIndex === 1 &&
                !showTranslationTab(project, interview, locale)) ||
            (tabIndex === 2 && !showTocTab(project, interview, locale))
        ) {
            setTabIndex(0);
        }
    }, [project, isLoading, error, interview, locale, tabIndex]);

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    return (
        <Tabs
            className="Tabs"
            keyboardActivation="manual"
            index={tabIndex}
            onChange={setTabIndex}
            data-testid="interview-tabs"
        >
            <div className="Layout-contentTabs">
                <TabList
                    className="Tabs-tabList"
                    data-testid="interview-tabs-list"
                >
                    <Tab
                        className="Tabs-tab"
                        data-testid="interview-tab-transcript"
                    >
                        <FaRegFileAlt className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">
                            {`${t('transcript')} (${interview.alpha3})`}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        disabled={
                            !showTranslationTab(project, interview, locale)
                        }
                        data-testid="interview-tab-translation"
                    >
                        <FaRegClone className="Tabs-tabIcon" />
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
                        data-testid="interview-tab-toc"
                    >
                        <FaList className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">
                            {t('table_of_contents')}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        data-testid="interview-tab-search"
                    >
                        <FaSearch className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">
                            {t('interview_search')}
                        </span>
                    </Tab>
                    <Tab
                        className="Tabs-tab"
                        data-testid="interview-tab-keywords"
                    >
                        <FaTags className="Tabs-tabIcon" />
                        <span className="Tabs-tabText">{t('keywords')}</span>
                    </Tab>
                </TabList>
            </div>

            <div className="wrapper-content">
                <TabPanels>
                    {/* The conditional renderings are needed to prevent
                        various useEffect-related problems. */}
                    <TabPanel data-testid="interview-panel-transcript">
                        {tabIndex === 0 && (
                            <Transcript
                                transcriptLocale={interview.alpha3}
                                originalLocale
                                loadSegments
                            />
                        )}
                    </TabPanel>
                    <TabPanel data-testid="interview-panel-translation">
                        {tabIndex === 1 && (
                            <Transcript transcriptLocale={translationLocale} />
                        )}
                    </TabPanel>
                    <TabPanel data-testid="interview-panel-toc">
                        {tabIndex === 2 && (
                            <TableOfContentsContainer
                                alpha3={ALPHA2_TO_ALPHA3[locale]}
                            />
                        )}
                    </TabPanel>
                    <TabPanel data-testid="interview-panel-search">
                        {tabIndex === 3 && <InterviewSearchContainer />}
                    </TabPanel>
                    <TabPanel data-testid="interview-panel-keywords">
                        {tabIndex === 4 && <RefTreeContainer />}
                    </TabPanel>
                </TabPanels>
            </div>
        </Tabs>
    );
}

InterviewTabs.propTypes = {
    interview: PropTypes.object.isRequired,
};
