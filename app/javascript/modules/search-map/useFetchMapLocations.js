import queryString from 'query-string';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useFetchMapLocations(query) {
    const pathBase = usePathBase();

    const params = queryString.stringify(query);
    const key = 'map-locations' + params;
    const url = `${pathBase}/searches/map?${params}`;
    const fetch = () => fetcher(url);

    return [key, fetch];
}
