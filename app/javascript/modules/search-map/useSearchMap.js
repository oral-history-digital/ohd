import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';
import flow from 'lodash.flow';
import curry from 'lodash.curry';
import queryString from 'query-string';

import { getMapQuery } from 'modules/search';
import { usePathBase } from 'modules/routes';
import { fetcher } from 'modules/api';
import transformIntoMarkers from './transformIntoMarkers';
import referenceTypesToColorMap from './referenceTypesToColorMap';

export default function useSearchMap() {
    const query = useSelector(getMapQuery);
    const pathBase = usePathBase();
    const typesUrl = `${pathBase}/searches/map_reference_types`;
    const { data: types, error: typesError } = useSWRImmutable(typesUrl, fetcher);

    const params = queryString.stringify(query);
    const locationsUrl = `${pathBase}/searches/map?${params.toString()}`;

    const { data: locations, error: locationsError } = useSWRImmutable(locationsUrl, fetcher);

    let markers = [];
    if (types && locations) {
        const colorMap = referenceTypesToColorMap(types);

        const transformData = flow(
            curry(transformIntoMarkers)(colorMap)
        );
        markers = transformData(locations);
    }

    return { isLoading: !(types && locations), markers, locationsError };
}
