import { CALL_API } from 'modules/api';
import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

export const fetchLocations = (pathBase, archiveId) => ({
    [CALL_API]: {
        types: [FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED],
        endpoint: `${pathBase}/locations?archive_id=${archiveId}`,
    },
});
