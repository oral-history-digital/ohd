import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';
import { getMapQuery } from 'modules/search';
import { getMapFilter } from './selectors';
import fetchMapReferenceTypes from './fetchMapReferenceTypes';
import filterReferences from './filterReferences';
import groupByType from './groupByType';
import sortGroups from './sortGroups';

export default function useMapReferences(registryEntryId) {
    const pathBase = usePathBase();
    const filter = useSelector(getMapFilter);
    const query = useSelector(getMapQuery);

    // TODO: We need the query here, too.
    const url = `${pathBase}/searches/map_references/${registryEntryId}`;
    const { isValidating, data, error } = useSWRImmutable(url, fetcher);

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
