import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';
import fetcher from './fetcher';

export default function useInterviewMapReferences(archiveId, registryEntryId) {
    const pathBase = usePathBase();
    const url = `${pathBase}/location_references.json?archive_id=${archiveId}&registry_entry_id=${registryEntryId}`;
    const { isValidating, data, error } = useSWRImmutable(url, fetcher);

    return { isLoading: isValidating, data, error };
}
