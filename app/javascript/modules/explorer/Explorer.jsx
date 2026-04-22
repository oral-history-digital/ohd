import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import { InstitutionsList, ProjectList } from './components';
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
        instProjectMin,
        instProjectMax,
        institutionIds,
        institutionLevel,
    } = useExplorerParams();
    const projectsTabLabel = t('explorer.tab.projects_and_collections');
    const institutionsTabLabel = t('explorer.tab.institutions');
    const explorerTitle = isInstitutionsTab
        ? institutionsTabLabel
        : projectsTabLabel;

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
                            instProjectMin={instProjectMin}
                            instProjectMax={instProjectMax}
                            institutionLevel={institutionLevel}
                        />
                    </div>
                ) : (
                    <div className="Explorer-tabPanel">
                        <ProjectList
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
