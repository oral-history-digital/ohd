import { useSelector } from 'react-redux';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getMapQuery } from 'modules/search';

export default function useMapLocations() {
    const pathBase = usePathBase();
    const query = useSelector(getMapQuery);

    const params = queryString.stringify(query);
    const path = `${pathBase}/searches/map?${params}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isValidating, locations: data, error };
}
