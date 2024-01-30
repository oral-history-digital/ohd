import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferencesAlt(registryEntry) {
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const path = `${pathBase}/registry_references/for_reg_entry/${registryEntry.id}?signed_in=${isLoggedIn}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    let interviewReferences, segmentReferences;

    if (data) {
        interviewReferences = data?.interview_references;
        segmentReferences = data?.segment_references;

        // Create missing reference objects
        segmentReferences.forEach((segmentRef) => {
            if (!interviewReferences.find((interviewRef) =>
                interviewRef.archive_id === segmentRef.archive_id)) {
                interviewReferences.push({
                    archive_id: segmentRef.archive_id,
                    display_name: segmentRef.display_name,
                    first_name: segmentRef.first_name,
                    last_name: segmentRef.last_name,
                    project_id: segmentRef.project_id,
                });
            }
        });

        // Add empty segment refs array for each ref:
        interviewReferences.forEach((interviewRef) => {
            interviewRef.segment_references = [];
        });

        // Add segment references to interview objects.
        segmentReferences.forEach((segmentRef) => {
            const archiveId = segmentRef.archive_id;

            const interviewReference = interviewReferences.find((interviewRef) =>
                interviewRef.archive_id === archiveId);

            if (!interviewReference) {
                return;
            }

            interviewReference.segment_references.push(segmentRef);
        });

        // Sort it
        interviewReferences.sort((a, b) =>
            a.last_name.localeCompare(b.last_name));
    }

    return {
        isLoading,
        isValidating,
        interviewReferences,
        segmentReferences,
        error,
    };
}
