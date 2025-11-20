import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';
import range from 'lodash.range';

import { fetcher } from 'modules/api';
import { useMapReferenceTypes, sortByReferenceTypeOrder } from 'modules/map';
import { usePathBase } from 'modules/routes';
import { getEditView } from 'modules/archive';
import { getIsLoggedIn } from 'modules/user';
import { useSearchParams } from 'modules/query-string';
import { getMapFilter } from '../selectors';
import filterReferences from './filterReferences';
import groupByType from './groupByType';
import sortInterviewRefs from './sortInterviewRefs';
import groupSegmentRefs from './groupSegmentRefs';
import sortSegmentRefGroups from './sortSegmentRefGroups';
import sortSegmentRefs from './sortSegmentRefs';

export default function useMapReferences(registryEntryId) {
    const pathBase = usePathBase();
    const filter = useSelector(getMapFilter);
    const isEditView = useSelector(getEditView);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const { facets, yearOfBirthMin, yearOfBirthMax } = useSearchParams();

    const { referenceTypes, error: referenceTypesError } =
        useMapReferenceTypes();

    const params = {
        ...facets,
        year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
        all: isEditView ? true : undefined,
        // This is ignored in backend and only needed to create different keys for SWR.
        'logged-in': isLoggedIn ? true : undefined,
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });

    const path = `${pathBase}/searches/map_references/${registryEntryId}?${paramStr}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const interviewReferences = data?.interview_references;
    const segmentReferences = filter.includes('segment')
        ? data?.segment_references
        : [];
    const numSegmentRefs = segmentReferences?.length;

    let referenceGroups = [];
    if (referenceTypes && interviewReferences && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            curry(groupByType)(referenceTypes),
            curry(sortByReferenceTypeOrder)(referenceTypes, 'id'),
            sortInterviewRefs
        );
        referenceGroups = transformData(interviewReferences);
    }

    let segmentRefGroups = [];
    if (segmentReferences) {
        const transformData = flow(
            groupSegmentRefs,
            sortSegmentRefs,
            sortSegmentRefGroups
        );
        segmentRefGroups = transformData(segmentReferences);
    }

    return {
        isLoading: isValidating,
        referenceGroups,
        segmentRefGroups,
        numSegmentRefs,
        error,
    };
}
