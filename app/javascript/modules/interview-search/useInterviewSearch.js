import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';

import { fetcher } from 'modules/api';
import { useProjectAccessStatus } from 'modules/auth';
import { usePathBase } from 'modules/routes';
import { searchResultCount } from 'modules/interview-preview';

export default function useInterviewSearch(archiveId, fulltext, project) {
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const params = {
        id: archiveId,
        fulltext,
    };
    const paramStr = queryString.stringify(params);
    const path = `${pathBase}/searches/interview?${paramStr}`;

    const shouldFetch = (fulltext?.length > 0)
        && projectAccessGranted;

    const { isValidating, isLoading, data, error } = useSWRImmutable(
        shouldFetch ? path : null, fetcher, {
        keepPreviousData: false,
    });

    return {
        data,
        error,
        isValidating,
        isLoading,
        numResults: searchResultCount(data),
        segmentResults: data?.found_segments,
        headingResults: data?.found_headings,
        registryEntryResults: data?.found_registry_entries,
        photoResults: data?.found_photos,
        biographyResults: data?.found_biographical_entries,
        annotationResults: data?.found_annotations,
        observationsResults: data?.found_observations,
    };
}
