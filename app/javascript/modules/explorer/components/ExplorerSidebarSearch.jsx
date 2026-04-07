import { useGetInstitutionsList, useGetProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useCurrentPage } from 'modules/routes';
import { useSearchParams } from 'react-router-dom';

import {
    useArchivesAndCollectionsRange,
    useExplorerArchiveInstitutions,
    useExplorerInterviewRange,
} from '../hooks';
import {
    FILTER_PARAMS,
    applyCollectionRangeParams,
    applyInstitutionLevelParam,
    applyInstitutionParam,
    applyInterviewRangeParams,
    applyQueryParam,
    resetExplorerFilters,
} from '../utils';
import { ExplorerInstitutionFilter } from './ExplorerInstitutionFilter';
import { ExplorerInstitutionLevelFilter } from './ExplorerInstitutionLevelFilter';
import { ExplorerRangeFilter } from './ExplorerRangeFilter';
import { ExplorerResetFilters } from './ExplorerResetFilters';
import { ExplorerSearchInput } from './ExplorerSearchInput';

export function ExplorerSidebarSearch() {
    const { t } = useI18n();
    const currentPage = useCurrentPage();
    const [searchParams, setSearchParams] = useSearchParams();
    const { projects: archives } = useGetProjects({
        all: true,
        workflowState: 'public',
    });
    const { institutions: institutionsList } = useGetInstitutionsList({
        all: true,
    });

    const isCatalogPage = currentPage.pageType === 'catalog_page';
    const isCatalogRoot =
        isCatalogPage && currentPage.params.catalogType === 'root';
    const isInstitutionsIndex =
        isCatalogPage &&
        currentPage.params.catalogType === 'institutions' &&
        !currentPage.params.id;
    const showSidebarFilters = isCatalogRoot || isInstitutionsIndex;

    const isInstitutionsTab =
        isCatalogPage && currentPage.params.catalogType === 'institutions';
    const isArchivesTab = !isInstitutionsTab;

    const archiveInstitutions = useExplorerArchiveInstitutions({ archives });
    const { globalMin, globalMax } = useExplorerInterviewRange({
        items: isArchivesTab ? archives : (institutionsList ?? []),
    });
    const { globalCollectionMin, globalCollectionMax } =
        useArchivesAndCollectionsRange({ items: archives });

    const query = searchParams.get('explorer_q') || '';
    const interviewMin = searchParams.has('explorer_interviews_min')
        ? Number(searchParams.get('explorer_interviews_min'))
        : globalMin;
    const interviewMax = searchParams.has('explorer_interviews_max')
        ? Number(searchParams.get('explorer_interviews_max'))
        : globalMax;
    const collectionMin = searchParams.has('explorer_collections_min')
        ? Number(searchParams.get('explorer_collections_min'))
        : globalCollectionMin;
    const collectionMax = searchParams.has('explorer_collections_max')
        ? Number(searchParams.get('explorer_collections_max'))
        : globalCollectionMax;
    const institutionIds = searchParams.has('explorer_institution')
        ? searchParams
              .get('explorer_institution')
              .split(',')
              .map(Number)
              .filter(Boolean)
        : [];
    const institutionLevelParam = searchParams.get(
        'explorer_institution_level'
    );
    const institutionLevel = ['with_children', 'with_parent'].includes(
        institutionLevelParam
    )
        ? institutionLevelParam
        : 'all';

    if (!showSidebarFilters) return null;

    const handleQueryChange = (e) =>
        setSearchParams((prev) => applyQueryParam(prev, e.target.value), {
            replace: true,
        });

    const handleClear = () =>
        setSearchParams((prev) => applyQueryParam(prev, ''), { replace: true });

    const handleInterviewRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyInterviewRangeParams(prev, min, max, globalMin, globalMax),
            { replace: true }
        );

    const handleCollectionRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyCollectionRangeParams(
                    prev,
                    min,
                    max,
                    globalCollectionMin,
                    globalCollectionMax
                ),
            { replace: true }
        );

    const handleInstitutionChange = (id) => {
        const next = institutionIds.includes(id)
            ? institutionIds.filter((x) => x !== id)
            : [...institutionIds, id];
        setSearchParams((prev) => applyInstitutionParam(prev, next), {
            replace: true,
        });
    };

    const handleInstitutionClearAll = () =>
        setSearchParams((prev) => applyInstitutionParam(prev, []), {
            replace: true,
        });

    const handleInstitutionLevelChange = (e) =>
        setSearchParams(
            (prev) => applyInstitutionLevelParam(prev, e.target.value),
            {
                replace: true,
            }
        );

    const hasActiveFilters = FILTER_PARAMS.some((key) => searchParams.has(key));
    const searchPlaceholderKey = isArchivesTab
        ? 'explorer.search_placeholder.archives'
        : 'explorer.search_placeholder.institutions';

    const handleResetAll = () =>
        setSearchParams((prev) => resetExplorerFilters(prev), {
            replace: true,
        });

    return (
        <div className="ExplorerSidebarSearch">
            {hasActiveFilters && (
                <ExplorerResetFilters onClick={handleResetAll} />
            )}
            <ExplorerSearchInput
                value={query}
                onChange={handleQueryChange}
                onClear={handleClear}
                placeholderKey={searchPlaceholderKey}
            />

            <ExplorerRangeFilter
                label={t('explorer.filter.interviews')}
                globalMin={globalMin}
                globalMax={globalMax}
                value={[interviewMin, interviewMax]}
                onChange={handleInterviewRangeChange}
            />

            {isArchivesTab && (
                <ExplorerRangeFilter
                    label={t('explorer.filter.collections')}
                    globalMin={globalCollectionMin}
                    globalMax={globalCollectionMax}
                    value={[collectionMin, collectionMax]}
                    onChange={handleCollectionRangeChange}
                />
            )}

            {isArchivesTab && (
                <ExplorerInstitutionFilter
                    institutions={archiveInstitutions}
                    values={institutionIds}
                    onChange={handleInstitutionChange}
                    onClearAll={handleInstitutionClearAll}
                />
            )}

            {!isArchivesTab && (
                <ExplorerInstitutionLevelFilter
                    value={institutionLevel}
                    onChange={handleInstitutionLevelChange}
                />
            )}
        </div>
    );
}

export default ExplorerSidebarSearch;
