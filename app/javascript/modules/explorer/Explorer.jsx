import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { FaArchive, FaUniversity } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import { ArchivesList, InstitutionsList } from './components';
import { useExplorerParams } from './hooks';
import { resetExplorerFilters } from './utils';

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
                resetExplorerFilters(prev);
                if (index === 0) {
                    prev.delete('explorer_tab');
                } else {
                    prev.set('explorer_tab', index);
                }
                return prev;
            },
            { replace: true }
        );

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
