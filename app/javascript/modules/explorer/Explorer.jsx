import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { useI18n } from 'modules/i18n';
import { useCurrentPage } from 'modules/routes';
import { Helmet } from 'react-helmet';
import { FaArchive, FaUniversity } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ArchivesList, InstitutionsList } from './components';
import { useExplorerParams } from './hooks';
import { resetExplorerFilters } from './utils';

export function Explorer() {
    const { t } = useI18n();
    const currentPage = useCurrentPage();
    const navigate = useNavigate();
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
        institutionIds,
    } = useExplorerParams();
    const archivesTabLabel = t('explorer.tab.archives_and_collections');
    const institutionsTabLabel = t('explorer.tab.institutions');
    const explorerTitle =
        tabIndex === 1 ? institutionsTabLabel : archivesTabLabel;

    const handleTabChange = (index) => {
        const catalogBasePath = `${currentPage.pathBase}/catalog`;
        const nextPath =
            index === 1 ? `${catalogBasePath}/institutions` : catalogBasePath;

        setSearchParams(
            (prev) => {
                resetExplorerFilters(prev);
                return prev;
            },
            { replace: true }
        );

        navigate(nextPath, { replace: true });
    };

    return (
        <>
            <Helmet>
                <title>{explorerTitle}</title>
            </Helmet>
            <div className="Explorer">
                <h1 className="Explorer--title">{explorerTitle}</h1>
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
                                {archivesTabLabel}
                            </span>
                        </Tab>
                        <Tab className="Explorer-tab">
                            <FaUniversity className="Explorer-tabIcon" />
                            <span className="Explorer-tabText">
                                {institutionsTabLabel}
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
