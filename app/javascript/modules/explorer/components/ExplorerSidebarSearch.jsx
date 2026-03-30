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
    applyInstArchiveRangeParams,
    applyInstitutionParam,
    applyInterviewRangeParams,
    applyQueryParam,
    resetExplorerFilters,
} from '../utils';
import { ExplorerInstitutionFilter } from './ExplorerInstitutionFilter';
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
    const {
        globalCollectionMin: globalInstArchiveMin,
        globalCollectionMax: globalInstArchiveMax,
    } = useArchivesAndCollectionsRange({
        items: institutionsList ?? [],
        getCount: (i) => i.archives?.length ?? 0,
    });

    const query = searchParams.get('explorer_q') || '';
    const interviewMin =
        Number(searchParams.get('explorer_interviews_min')) || globalMin;
    const interviewMax =
        Number(searchParams.get('explorer_interviews_max')) || globalMax;
    const collectionMin =
        Number(searchParams.get('explorer_collections_min')) ||
        globalCollectionMin;
    const collectionMax =
        Number(searchParams.get('explorer_collections_max')) ||
        globalCollectionMax;
    const instArchiveMin =
        Number(searchParams.get('explorer_inst_archives_min')) ||
        globalInstArchiveMin;
    const instArchiveMax =
        Number(searchParams.get('explorer_inst_archives_max')) ||
        globalInstArchiveMax;
    const institutionIds = searchParams.has('explorer_institution')
        ? searchParams
              .get('explorer_institution')
              .split(',')
              .map(Number)
              .filter(Boolean)
        : [];

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

    const handleInstArchiveRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyInstArchiveRangeParams(
                    prev,
                    min,
                    max,
                    globalInstArchiveMin,
                    globalInstArchiveMax
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

            {!isArchivesTab && (
                <ExplorerRangeFilter
                    label={t('explorer.filter.archives')}
                    globalMin={globalInstArchiveMin}
                    globalMax={globalInstArchiveMax}
                    value={[instArchiveMin, instArchiveMax]}
                    onChange={handleInstArchiveRangeChange}
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
        </div>
    );
}

export default ExplorerSidebarSearch;
