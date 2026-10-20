import { fetcher } from 'modules/api';
import { useProjectAccessStatus } from 'modules/auth';
import { searchResultCount } from 'modules/interview-preview';
import { usePathBase } from 'modules/routes';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';

/**
 * Searches interview content only while its project is available and access is granted.
 * Cached results are hidden when the query is cleared, access is lost, or a request fails.
 *
 * @param {string} archiveId - Public interview identifier.
 * @param {string|undefined} fulltext - Search term; empty skips fetching.
 * @param {Object|undefined} project - The interview's project, which may differ from the route project.
 * @returns {Object} Request status, visible result data, count, and result arrays by category.
 */
export default function useInterviewSearch(archiveId, fulltext, project) {
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const params = {
        id: archiveId,
        fulltext,
    };
    const paramStr = queryString.stringify(params);
    const path = `${pathBase}/searches/interview?${paramStr}`;

    const shouldFetch = Boolean(
        project && fulltext?.length > 0 && projectAccessGranted
    );

    const { isValidating, isLoading, data, error } = useSWRImmutable(
        shouldFetch ? path : null,
        fetcher,
        {
            keepPreviousData: false,
        }
    );

    const visibleData = shouldFetch && !error ? data : undefined;

    return {
        data: visibleData,
        error: shouldFetch ? error : undefined,
        isValidating: shouldFetch && isValidating,
        isLoading: shouldFetch && isLoading,
        numResults: searchResultCount(visibleData),
        segmentResults: visibleData?.found_segments || [],
        headingResults: visibleData?.found_headings || [],
        registryEntryResults: visibleData?.found_registry_entries || [],
        photoResults: visibleData?.found_photos || [],
        biographyResults: visibleData?.found_biographical_entries || [],
        annotationResults: visibleData?.found_annotations || [],
        observationsResults: visibleData?.found_observations || [],
    };
}
