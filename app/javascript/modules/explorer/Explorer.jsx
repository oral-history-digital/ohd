import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import { InstitutionsList, ProjectList } from './components';
import { useExplorerParams } from './hooks';

export function Explorer() {
    const { t } = useI18n();
    const {
        isInstitutionsList,
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

    const explorerTitle = isInstitutionsList
        ? t('explorer.tab.institutions')
        : t('explorer.tab.projects_and_collections');

    return (
        <>
            <Helmet>
                <title>{explorerTitle}</title>
            </Helmet>
            <div className="Explorer">
                <h1 className="Page-main-title Explorer--title">
                    {explorerTitle}
                </h1>
                <div className="Explorer-tabPanel">
                    {isInstitutionsList ? (
                        <InstitutionsList
                            query={query}
                            interviewMin={interviewMin}
                            interviewMax={interviewMax}
                            instProjectMin={instProjectMin}
                            instProjectMax={instProjectMax}
                            institutionLevel={institutionLevel}
                        />
                    ) : (
                        <ProjectList
                            query={query}
                            interviewMin={interviewMin}
                            interviewMax={interviewMax}
                            collectionMin={collectionMin}
                            collectionMax={collectionMax}
                            institutionIds={institutionIds}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Explorer;
