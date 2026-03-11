import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { FaArchive, FaUniversity } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import { ArchivesList, InstitutionsList } from './components';
import {
    useExplorerParams,
    useGetCollections,
    useGetInstitutions,
} from './hooks';

export function Explorer() {
    const [, setSearchParams] = useSearchParams();
    const {
        tabIndex,
        query,
        interviewMin,
        interviewMax,
        yearMin,
        yearMax,
        institutionIds,
    } = useExplorerParams();

    const handleTabChange = (index) =>
        setSearchParams(
            (prev) => {
                if (index === 0) {
                    prev.delete('explorer_tab');
                } else {
                    prev.set('explorer_tab', index);
                }
                return prev;
            },
            { replace: true }
        );

    const { loading: loadingCollections, error: errorCollections } =
        useGetCollections();
    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useGetInstitutions();

    const isLoading = loadingCollections || loadingInstitutions;
    const hasError = errorCollections || errorInstitutions;

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
                onChange={handleTabChange}
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
                                query={query}
                                interviewMin={interviewMin}
                                interviewMax={interviewMax}
                                yearMin={yearMin}
                                yearMax={yearMax}
                                institutionIds={institutionIds}
                            />
                        )}
                    </TabPanel>
                    <TabPanel className="Explorer-tabPanel">
                        {tabIndex === 1 && (
                            <InstitutionsList
                                institutions={institutions}
                                query={query}
                                interviewMin={interviewMin}
                                interviewMax={interviewMax}
                            />
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}

export default Explorer;
