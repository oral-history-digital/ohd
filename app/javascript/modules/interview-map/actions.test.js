import { CALL_API } from 'modules/api';
import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';
import { fetchLocations } from './actions';

test('creates fetchLocations middleware action', () => {
    const actual = fetchLocations('/de', 'za001');
    const expected = {
        [CALL_API]: {
            types: [FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED],
            endpoint: '/de/locations?archive_id=za001',
        },
    };
    expect(actual).toEqual(expected);
});
