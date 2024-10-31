import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import groupBy from 'lodash.groupby';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getEditView } from 'modules/archive';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferences(registryEntry) {
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const isEditView = useSelector(getEditView);

    const params = {
        signed_in: isLoggedIn,
        all: isEditView ? true : undefined,
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });

    const path = `${pathBase}/registry_references/for_reg_entry/${registryEntry.id}?${paramStr}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    let interviewReferences, groupedRefs, segmentReferences, referenceCount = 0;

    if (data) {
        interviewReferences = data.interview_references;
        segmentReferences = data.segment_references;

        createMissingInterviewReferences(interviewReferences, segmentReferences);
        addEmptySegmentRefArrays(interviewReferences);
        addSegmentReferencesToInterviewReferences(interviewReferences, segmentReferences);
        sortInterviewReferences(interviewReferences);
        groupedRefs = groupByArchiveShortname(interviewReferences);

        referenceCount = interviewReferences.length;
    }

    return {
        isLoading,
        isValidating,
        groupedRefs,
        referenceCount,
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

function groupByArchiveShortname(interviewReferences) {
    let result = groupBy(interviewReferences, 'shortname');
    result = Object.entries(result);
    result.sort(([a, ], [b, ]) => a.localeCompare(b));
    return result;
}
