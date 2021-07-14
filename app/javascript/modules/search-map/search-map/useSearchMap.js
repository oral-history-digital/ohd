import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { getMapQuery } from 'modules/search';
import { getMapFilter } from '../selectors';
import useFetchMapReferenceTypes from '../useFetchMapReferenceTypes';
import useFetchMapLocations from '../useFetchMapLocations';
import referenceTypesToColorMap from './referenceTypesToColorMap';
import filterReferenceTypes from './filterReferenceTypes';
import filterLocations from './filterLocations';
import transformIntoMarkers from './transformIntoMarkers';
import sortMarkers from './sortMarkers';

export default function useSearchMap() {
    const query = useSelector(getMapQuery);
    const filter = useSelector(getMapFilter);

    const [mapReferenceTypesKey, fetchMapReferenceTypes] = useFetchMapReferenceTypes();
    const { data: types, error: typesError } = useSWRImmutable(mapReferenceTypesKey, fetchMapReferenceTypes);

    const [mapLocationsKey, fetchMapLocations] = useFetchMapLocations(query);
    const { data: locations, error: locationsError } = useSWRImmutable(mapLocationsKey, fetchMapLocations);

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
