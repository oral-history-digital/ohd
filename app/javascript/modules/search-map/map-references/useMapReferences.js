import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { fetcher } from 'modules/api';
import { useMapReferenceTypes, sortByReferenceTypeOrder } from 'modules/map';
import { usePathBase } from 'modules/routes';
import { getMapQuery } from 'modules/search';
import { getEditView } from 'modules/archive';
import { getMapFilter } from '../selectors';
import filterReferences from './filterReferences';
import addAbbreviationPoint from './addAbbreviationPoint';
import groupByType from './groupByType';
import groupSegmentRefs from './groupSegmentRefs';
import sortSegmentRefGroups from './sortSegmentRefGroups';

export default function useMapReferences(registryEntryId) {
    const pathBase = usePathBase();
    const filter = useSelector(getMapFilter);
    const isEditView = useSelector(getEditView);
    const query = useSelector(getMapQuery);

    const { referenceTypes, error: referenceTypesError } = useMapReferenceTypes();

    const params = {
        ...query,
    };
    if (isEditView) {
        params['all'] = true;
    }
    const paramStr = queryString.stringify(params);
    const path = `${pathBase}/searches/map_references/${registryEntryId}?${paramStr}`;
    const { isValidating, data, error } = useSWR(path, fetcher);

    const interviewReferences = data?.interview_references;
    const segmentReferences = filter.includes('S') ? data?.segment_references : [];

    let referenceGroups = [];
    if (referenceTypes && interviewReferences && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            addAbbreviationPoint,
            curry(groupByType)(referenceTypes),
            curry(sortByReferenceTypeOrder)(referenceTypes, 'id')
        );
        referenceGroups = transformData(interviewReferences);
    }

    let segmentRefGroups = [];
    if (segmentReferences) {
        const transformData = flow(
            groupSegmentRefs,
            sortSegmentRefGroups
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
