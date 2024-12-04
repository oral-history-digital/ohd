import '../../__mocks__/matchMediaMock';
import { CALL_API } from 'modules/api';
import * as types from './action-types';
import * as actions from './actions';

test('createWorkbook', () => {
    const actual = actions.createWorkbook('/de', 'dummy-params');
    const expected = {
        [CALL_API]: {
            types: [types.CREATE_WORKBOOK_STARTED, types.CREATE_WORKBOOK_SUCCEEDED, types.CREATE_WORKBOOK_FAILED],
            method: 'POST',
            endpoint: '/de/user_contents',
            body: 'dummy-params',
        },
    };
    expect(actual).toEqual(expected);
});

test('updateWorkbook', () => {
    const actual = actions.updateWorkbook('/de', 3, 'dummy-params');
    const expected = {
        [CALL_API]: {
            types: [types.UPDATE_WORKBOOK_STARTED, types.UPDATE_WORKBOOK_SUCCEEDED, types.UPDATE_WORKBOOK_FAILED],
            method: 'PUT',
            endpoint: '/de/user_contents/3',
            body: 'dummy-params',
        },
    };
    expect(actual).toEqual(expected);
});
