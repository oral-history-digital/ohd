import { useSelector } from 'react-redux';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { getMapQuery } from 'modules/search';
import { usePathBase } from 'modules/routes';
import { getMapFilter } from './selectors';
import referenceTypesToColorMap from './referenceTypesToColorMap';
import filterReferenceTypes from './filterReferenceTypes';
import filterLocations from './filterLocations';
import transformIntoMarkers from './transformIntoMarkers';
import sortMarkers from './sortMarkers';
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

    let markers = [];
    if (types && locations && filter) {
        const colorMap = referenceTypesToColorMap(types);

        const transformData = flow(
            curry(filterReferenceTypes)(filter),
            filterLocations,
            curry(transformIntoMarkers)(colorMap),
            sortMarkers
        );
        markers = transformData(locations);
    }

    return { isLoading: !(types && locations), markers, error: locationsError };
}
