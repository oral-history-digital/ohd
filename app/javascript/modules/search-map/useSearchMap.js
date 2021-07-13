import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';
import queryString from 'query-string';

import { getMapQuery } from 'modules/search';
import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';
import { getMapFilter } from './selectors';
import referenceTypesToColorMap from './referenceTypesToColorMap';
import filterReferenceTypes from './filterReferenceTypes';
import filterLocations from './filterLocations';
import transformIntoMarkers from './transformIntoMarkers';
import sortMarkers from './sortMarkers';

export default function useSearchMap() {
    const query = useSelector(getMapQuery);
    const filter = useSelector(getMapFilter);
    const pathBase = usePathBase();
    const typesUrl = `${pathBase}/searches/map_reference_types`;
    const { data: types, error: typesError } = useSWRImmutable(typesUrl, fetcher);

    const params = queryString.stringify(query);
    const locationsUrl = `${pathBase}/searches/map?${params.toString()}`;

    const { data: locations, error: locationsError } = useSWRImmutable(locationsUrl, fetcher);

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

    return { isLoading: !(types && locations), markers, locationsError };
}
