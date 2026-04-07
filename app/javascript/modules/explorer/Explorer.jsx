import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import { ArchivesList, InstitutionsList } from './components';
import { useExplorerParams } from './hooks';

export function Explorer() {
    const { t } = useI18n();
    const {
        isInstitutionsTab,
        query,
        interviewMin,
        interviewMax,
        collectionMin,
        collectionMax,
        instArchiveMin,
        instArchiveMax,
        institutionIds,
        institutionLevel,
    } = useExplorerParams();
    const archivesTabLabel = t('explorer.tab.archives_and_collections');
    const institutionsTabLabel = t('explorer.tab.institutions');
    const explorerTitle = isInstitutionsTab
        ? institutionsTabLabel
        : archivesTabLabel;

    return (
        <>
            <Helmet>
                <title>{explorerTitle}</title>
            </Helmet>
            <div className="Explorer">
                <h1 className="Page-main-title Explorer--title">
                    {explorerTitle}
                </h1>
                {isInstitutionsTab ? (
                    <div className="Explorer-tabPanel">
                        <InstitutionsList
                            query={query}
                            interviewMin={interviewMin}
                            interviewMax={interviewMax}
                            instArchiveMin={instArchiveMin}
                            instArchiveMax={instArchiveMax}
                            institutionLevel={institutionLevel}
                        />
                    </div>
                ) : (
                    <div className="Explorer-tabPanel">
                        <ArchivesList
                            query={query}
                            interviewMin={interviewMin}
                            interviewMax={interviewMax}
                            collectionMin={collectionMin}
                            collectionMax={collectionMax}
                            institutionIds={institutionIds}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Explorer;
