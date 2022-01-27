import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { fetcher } from 'modules/api';
import { useMapReferenceTypes, sortByReferenceTypeOrder } from 'modules/map';
import { usePathBase } from 'modules/routes';
import { getMapQuery } from 'modules/search';
import { getEditView } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import { getMapFilter } from '../selectors';
import filterReferences from './filterReferences';
import addAbbreviationPoint from './addAbbreviationPoint';
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
    const query = useSelector(getMapQuery);

    const { referenceTypes, error: referenceTypesError } = useMapReferenceTypes();

    const params = {
        ...query,
    };
    if (isEditView) {
        params['all'] = true;
    }
    // This is ignored in backend and only needed to create different keys for SWR.
    if (isLoggedIn) {
        params['logged-in'] = true;
    }
    const paramStr = queryString.stringify(params)
    ;
    const path = `${pathBase}/searches/map_references/${registryEntryId}?${paramStr}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const interviewReferences = data?.interview_references;
    const segmentReferences = filter.includes('S') ? data?.segment_references : [];

    let referenceGroups = [];
    if (referenceTypes && interviewReferences && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            addAbbreviationPoint,
            curry(groupByType)(referenceTypes),
            curry(sortByReferenceTypeOrder)(referenceTypes, 'id'),
            sortInterviewRefs,
        );
        referenceGroups = transformData(interviewReferences);
    }

    let segmentRefGroups = [];
    if (segmentReferences) {
        const transformData = flow(
            groupSegmentRefs,
            sortSegmentRefs,
            sortSegmentRefGroups,
        );
        segmentRefGroups = transformData(segmentReferences);
    }

    return {
        isLoading: isValidating,
        referenceGroups,
        segmentRefGroups,
        error,
    };
}
