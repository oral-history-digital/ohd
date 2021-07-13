import { useSelector } from 'react-redux';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { getMapQuery } from 'modules/search';
import { usePathBase } from 'modules/routes';
import { getMapFilter } from './selectors';
import fetchMapReferenceTypes from './fetchMapReferenceTypes';
import fetchMapLocations from './fetchMapLocations';

export default function useSearchMap() {
    const query = useSelector(getMapQuery);
    const filter = useSelector(getMapFilter);
    const pathBase = usePathBase();

    const { data: types, error: typesError } = useSWRImmutable(
        fetchMapReferenceTypes.name,
        () => fetchMapReferenceTypes(pathBase)
    );

    const { data: locations, error: locationsError } = useSWRImmutable(
        fetchMapLocations.name + queryString.stringify(query),
        () => fetchMapLocations(pathBase, query)
    );

    return { isLoading: !(types && locations), markers, locationsError };
}
