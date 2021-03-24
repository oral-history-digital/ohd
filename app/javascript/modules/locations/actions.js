import { CALL_API } from 'modules/api';

import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

export function fetchLocations(url, archiveId) {
    return {
        [CALL_API]: {
            types: [FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED],
            endpoint: `${url}?archive_id=${archiveId}`,
        },
    };
}
