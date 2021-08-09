import { CALL_API } from 'modules/api';
import * as types from './action-types';
import * as actions from './actions';

test('fetchWorkbook', () => {
    const actual = actions.fetchWorkbook('/de');
    const expected = {
        [CALL_API]: {
            types: [types.FETCH_WORKBOOK_STARTED, types.FETCH_WORKBOOK_SUCCEEDED, types.FETCH_WORKBOOK_FAILED],
            endpoint: '/de/user_contents',
        }
    };
    expect(actual).toEqual(expected);
});
