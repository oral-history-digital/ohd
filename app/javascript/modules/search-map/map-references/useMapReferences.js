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

    let referenceGroups = [];
    if (referenceTypes && data && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            addAbbreviationPoint,
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
