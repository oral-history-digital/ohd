import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';
import { FaArchive, FaUniversity } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

import { ArchivesList, InstitutionsList } from './components';
import { useExplorerParams } from './hooks';
import { resetExplorerFilters } from './utils';

export function Explorer() {
    const { t } = useI18n();
    const [, setSearchParams] = useSearchParams();
    const {
        tabIndex,
        query,
        interviewMin,
        interviewMax,
        collectionMin,
        collectionMax,
        instArchiveMin,
        instArchiveMax,
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
        <>
            <Helmet>
                <title>{t('modules.catalog.title')}</title>
            </Helmet>
            <div className="Explorer">
                <h1 className="Explorer--title">
                    {t('modules.catalog.title')}
                </h1>
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
                                {t('explorer.tab.archives_and_collections')}
                            </span>
                        </Tab>
                        <Tab className="Explorer-tab">
                            <FaUniversity className="Explorer-tabIcon" />
                            <span className="Explorer-tabText">
                                {t('explorer.tab.institutions')}
                            </span>
                        </Tab>
                    </TabList>

                    <TabPanels className="Explorer-tabPanels">
                        <TabPanel className="Explorer-tabPanel">
                            {tabIndex === 0 && (
                                <ArchivesList
                                    query={query}
                                    interviewMin={interviewMin}
                                    interviewMax={interviewMax}
                                    collectionMin={collectionMin}
                                    collectionMax={collectionMax}
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
                                    instArchiveMin={instArchiveMin}
                                    instArchiveMax={instArchiveMax}
                                />
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
    );
}

export default Explorer;
