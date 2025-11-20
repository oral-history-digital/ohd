import curry from 'lodash.curry';
import flow from 'lodash.flow';
import { fetcher } from 'modules/api';
import { sortByReferenceTypeOrder, useMapReferenceTypes } from 'modules/map';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useInterviewMapReferences(archiveId, registryEntryId) {
    const pathBase = usePathBase();

    const { referenceTypes, error: referenceTypesError } =
        useMapReferenceTypes();

    const path = `${pathBase}/location_references?archive_id=${archiveId}&registry_entry_id=${registryEntryId}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const personReferences = data?.person_references;
    const segmentReferences = data?.segment_references;

    let sortedPersonReferences = [];
    if (referenceTypes && personReferences) {
        const transformData = flow(
            curry(sortByReferenceTypeOrder)(
                referenceTypes,
                'registry_reference_type_id'
            )
        );
        sortedPersonReferences = transformData(personReferences);
    }

    return {
        isLoading: isValidating,
        personReferences: sortedPersonReferences,
        segmentReferences,
        error,
    };
}
