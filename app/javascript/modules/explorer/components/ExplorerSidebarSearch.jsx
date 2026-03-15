import { useGetInstitutionsList, useGetProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useMatch, useSearchParams } from 'react-router-dom';

import {
    useArchivesAndCollectionsRange,
    useExplorerArchiveInstitutions,
    useExplorerInterviewRange,
    useExplorerYearRange,
} from '../hooks';
import {
    FILTER_PARAMS,
    applyCollectionRangeParams,
    applyInstArchiveRangeParams,
    applyInstitutionParam,
    applyInterviewRangeParams,
    applyQueryParam,
    applyYearRangeParams,
    resetExplorerFilters,
} from '../utils';
import { ExplorerInstitutionFilter } from './ExplorerInstitutionFilter';
import { ExplorerRangeFilter } from './ExplorerRangeFilter';
import { ExplorerResetFilters } from './ExplorerResetFilters';
import { ExplorerSearchInput } from './ExplorerSearchInput';

export function ExplorerSidebarSearch() {
    const { t } = useI18n();
    const match = useMatch('/:locale/explorer/*');
    const [searchParams, setSearchParams] = useSearchParams();
    const { projects: archives } = useGetProjects({
        all: true,
        workflowState: 'public',
    });
    const { institutions: institutionsList } = useGetInstitutionsList({
        all: true,
    });

    const tabIndex = Number(searchParams.get('explorer_tab')) || 0;
    const isArchivesTab = tabIndex === 0;

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
    const { globalYearMin, globalYearMax } = useExplorerYearRange({ archives });

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
    const yearMin =
        Number(searchParams.get('explorer_year_min')) || globalYearMin;
    const yearMax =
        Number(searchParams.get('explorer_year_max')) || globalYearMax;
    const institutionIds = searchParams.has('explorer_institution')
        ? searchParams
              .get('explorer_institution')
              .split(',')
              .map(Number)
              .filter(Boolean)
        : [];

    if (!match) return null;

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

    const handleYearRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyYearRangeParams(
                    prev,
                    min,
                    max,
                    globalYearMin,
                    globalYearMax
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
            />

            <ExplorerRangeFilter
                label={t('explorer.interviews')}
                globalMin={globalMin}
                globalMax={globalMax}
                value={[interviewMin, interviewMax]}
                onChange={handleInterviewRangeChange}
            />

            {isArchivesTab && (
                <ExplorerRangeFilter
                    label={t('explorer.collections')}
                    globalMin={globalCollectionMin}
                    globalMax={globalCollectionMax}
                    value={[collectionMin, collectionMax]}
                    onChange={handleCollectionRangeChange}
                />
            )}

            {!isArchivesTab && (
                <ExplorerRangeFilter
                    label={t('explorer.archives')}
                    globalMin={globalInstArchiveMin}
                    globalMax={globalInstArchiveMax}
                    value={[instArchiveMin, instArchiveMax]}
                    onChange={handleInstArchiveRangeChange}
                />
            )}

            {isArchivesTab && globalYearMin !== null && (
                <ExplorerRangeFilter
                    label={t('explorer.publication_year')}
                    globalMin={globalYearMin}
                    globalMax={globalYearMax}
                    value={[yearMin, yearMax]}
                    onChange={handleYearRangeChange}
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
