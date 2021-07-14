import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';
import request from 'superagent';

import { usePathBase } from 'modules/routes';
import { getMapQuery } from 'modules/search';
import { getMapFilter } from '../selectors';
import fetchMapReferenceTypes from '../fetchMapReferenceTypes';
import filterReferences from './filterReferences';
import groupByType from './groupByType';
import sortGroups from './sortGroups';

function fetchMapReferences(pathBase, registryEntryId, query) {
    const url = `${pathBase}/searches/map_references/${registryEntryId}`;
    return request
        .get(url)
        .set('Accept', 'application/json')
        .query(query)
        .then(res => res.body);
}

export default function useMapReferences(registryEntryId) {
    const pathBase = usePathBase();
    const filter = useSelector(getMapFilter);
    const query = useSelector(getMapQuery);

    const key = `map_references_${registryEntryId}_${JSON.stringify(query)}`;
    const { isValidating, data, error } = useSWRImmutable(
        key,
        () => fetchMapReferences(pathBase, registryEntryId, query)
    );

    const { data: types, error: typesError } = useSWRImmutable(
        fetchMapReferenceTypes.name,
        () => fetchMapReferenceTypes(pathBase)
    );

    let referenceGroups = [];
    if (types && data && filter) {
        const transformData = flow(
            curry(filterReferences)(filter),
            curry(groupByType)(types),
            curry(sortGroups)(types)
        );
        referenceGroups = transformData(data);
    }

    return {
        isLoading: isValidating,
        referenceGroups,
        error,
    };
}
