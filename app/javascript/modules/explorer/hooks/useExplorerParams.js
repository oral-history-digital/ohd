import { useCurrentPage } from 'modules/routes';
import { useSearchParams } from 'react-router-dom';

/**
 * Reads and parses all explorer-specific URL search params,
 * centralizing type conversion and default values.
 */
export const useExplorerParams = () => {
    const currentPage = useCurrentPage();
    const [searchParams] = useSearchParams();
    const isInstitutionsTab =
        currentPage.pageType === 'catalog_page' &&
        currentPage.params.catalogType === 'institutions';
    const tabIndex = isInstitutionsTab ? 1 : 0;

    return {
        tabIndex,
        query: searchParams.get('explorer_q') || '',
        interviewMin: searchParams.has('explorer_interviews_min')
            ? Number(searchParams.get('explorer_interviews_min'))
            : null,
        interviewMax: searchParams.has('explorer_interviews_max')
            ? Number(searchParams.get('explorer_interviews_max'))
            : null,
        collectionMin: searchParams.has('explorer_collections_min')
            ? Number(searchParams.get('explorer_collections_min'))
            : null,
        collectionMax: searchParams.has('explorer_collections_max')
            ? Number(searchParams.get('explorer_collections_max'))
            : null,
        instArchiveMin: searchParams.has('explorer_inst_archives_min')
            ? Number(searchParams.get('explorer_inst_archives_min'))
            : null,
        instArchiveMax: searchParams.has('explorer_inst_archives_max')
            ? Number(searchParams.get('explorer_inst_archives_max'))
            : null,
        yearMin: searchParams.has('explorer_year_min')
            ? Number(searchParams.get('explorer_year_min'))
            : null,
        yearMax: searchParams.has('explorer_year_max')
            ? Number(searchParams.get('explorer_year_max'))
            : null,
        institutionIds: searchParams.has('explorer_institution')
            ? searchParams
                  .get('explorer_institution')
                  .split(',')
                  .map(Number)
                  .filter(Boolean)
            : [],
    };
};
