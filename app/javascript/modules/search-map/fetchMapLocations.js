import queryString from 'query-string';

import { fetcher } from 'modules/api';

export function mapLocationsKey(query) {
    return 'map-locations' + JSON.stringify(query);
}

export default function fetchMapLocations(pathBase, query) {
    const params = queryString.stringify(query);
    const url = `${pathBase}/searches/map?${params}`;
    return fetcher(url);
}
