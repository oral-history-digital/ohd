import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferences(registryEntry) {
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const path = `${pathBase}/registry_references/for_reg_entry/${registryEntry.id}?signed_in=${isLoggedIn}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    let interviewReferences, segmentReferences;

    if (data) {
        interviewReferences = data.interview_references;
        segmentReferences = data.segment_references;

        createMissingInterviewReferences(interviewReferences, segmentReferences);
        addEmptySegmentRefArrays(interviewReferences);
        addSegmentReferencesToInterviewReferences(interviewReferences, segmentReferences);
        sortInterviewReferences(interviewReferences);
    }

    return {
        isLoading,
        isValidating,
        interviewReferences,
        segmentReferences,
        error,
    };
}

function createMissingInterviewReferences(interviewReferences, segmentReferences) {
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
}

function addEmptySegmentRefArrays(interviewReferences) {
    interviewReferences.forEach((interviewRef) => {
        interviewRef.segment_references = [];
    });
}

function addSegmentReferencesToInterviewReferences(interviewReferences, segmentReferences) {
    segmentReferences.forEach((segmentRef) => {
        const archiveId = segmentRef.archive_id;

        const interviewReference = interviewReferences.find((interviewRef) =>
            interviewRef.archive_id === archiveId);

        if (!interviewReference) {
            return;
        }

        interviewReference.segment_references.push(segmentRef);
    });
}

function sortInterviewReferences(interviewReferences) {
    interviewReferences.sort((a, b) =>
        a.last_name.localeCompare(b.last_name));
}
