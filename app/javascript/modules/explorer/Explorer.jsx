import { useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { FaArchive, FaUniversity } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import { ArchivesList, InstitutionsList } from './components';
import { useGetArchives, useGetCollections, useGetInstitutions } from './hooks';

export function Explorer() {
    const [tabIndex, setTabIndex] = useState(0);
    const [searchParams] = useSearchParams();
    const explorerQuery = searchParams.get('explorer_q') || '';
    const explorerInterviewMin = searchParams.has('explorer_interviews_min')
        ? Number(searchParams.get('explorer_interviews_min'))
        : null;
    const explorerInterviewMax = searchParams.has('explorer_interviews_max')
        ? Number(searchParams.get('explorer_interviews_max'))
        : null;

    const {
        data: archives,
        loading: loadingArchives,
        error: errorArchives,
    } = useGetArchives();
    const { loading: loadingCollections, error: errorCollections } =
        useGetCollections();
    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useGetInstitutions();

    const isLoading =
        loadingArchives || loadingCollections || loadingInstitutions;
    const hasError = errorArchives || errorCollections || errorInstitutions;

    if (isLoading) {
        return (
            <div className="Explorer">
                <div className="Explorer-loading">Loading…</div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="Explorer">
                <div className="Explorer-error">
                    An error occurred while fetching data. Please try again
                    later.
                </div>
            </div>
        );
    }

    return (
        <div className="Explorer">
            <Tabs
                className="Explorer-tabs"
                index={tabIndex}
                onChange={setTabIndex}
                keyboardActivation="manual"
            >
                <TabList className="Explorer-tabList">
                    <Tab className="Explorer-tab">
                        <FaArchive className="Explorer-tabIcon" />
                        <span className="Explorer-tabText">
                            Archives &amp; Collections
                        </span>
                    </Tab>
                    <Tab className="Explorer-tab">
                        <FaUniversity className="Explorer-tabIcon" />
                        <span className="Explorer-tabText">Institutions</span>
                    </Tab>
                </TabList>

                <TabPanels className="Explorer-tabPanels">
                    <TabPanel className="Explorer-tabPanel">
                        {tabIndex === 0 && (
                            <ArchivesList
                                archives={archives}
                                query={explorerQuery}
                                interviewMin={explorerInterviewMin}
                                interviewMax={explorerInterviewMax}
                            />
                        )}
                    </TabPanel>
                    <TabPanel className="Explorer-tabPanel">
                        {tabIndex === 1 && (
                            <InstitutionsList
                                institutions={institutions}
                                query={explorerQuery}
                                interviewMin={explorerInterviewMin}
                                interviewMax={explorerInterviewMax}
                            />
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}

export default Explorer;
