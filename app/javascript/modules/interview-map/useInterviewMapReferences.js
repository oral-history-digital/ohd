import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';

export default function useInterviewMapReferences(archiveId, registryEntryId) {
    const pathBase = usePathBase();

    const path = `${pathBase}/location_references?archive_id=${archiveId}&registry_entry_id=${registryEntryId}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const personReferences = data?.person_references;
    const segmentReferences = data?.segment_references;

    return {
        isLoading: isValidating,
        personReferences,
        segmentReferences,
        error,
    };
}
