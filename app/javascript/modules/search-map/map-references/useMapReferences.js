import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { fetcher } from 'modules/api';
import { useMapReferenceTypes, sortByReferenceTypeOrder } from 'modules/map';
import { usePathBase } from 'modules/routes';
import { getMapQuery } from 'modules/search';
import { getMapFilter } from '../selectors';
import filterReferences from './filterReferences';
import groupByType from './groupByType';

export default function useMapReferences(registryEntryId) {
    const pathBase = usePathBase();
    const filter = useSelector(getMapFilter);
    const query = useSelector(getMapQuery);

    const { referenceTypes, error: referenceTypesError } = useMapReferenceTypes();

    const params = queryString.stringify(query);
    const path = `${pathBase}/searches/map_references/${registryEntryId}?${params}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    let referenceGroups = [];
    if (referenceTypes && data && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            curry(groupByType)(referenceTypes),
            curry(sortByReferenceTypeOrder)(referenceTypes, 'id')
        );
        referenceGroups = transformData(data);
    }

    return {
        isLoading: isValidating,
        referenceGroups,
        error,
    };
}
