import { setCookie } from 'modules/persistence';

import { SET_COLUMNS, SET_FILTER } from './action-types';
import { setColumnsWithCookie, setFilter } from './actions';

jest.mock('modules/persistence', () => ({ setCookie: jest.fn() }));

test('setFilter', () => {
    const actual = setFilter('all');
    const expected = {
        type: SET_FILTER,
        payload: 'all',
    };
    expect(actual).toEqual(expected);
});

test('setColumnsWithCookie thunk dispatches and sets cookie', () => {
    const thunk = setColumnsWithCookie(['timecode']);
    expect(typeof thunk).toBe('function');

    const dispatch = jest.fn();
    thunk(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
        type: SET_COLUMNS,
        payload: ['timecode'],
    });

    expect(setCookie).toHaveBeenCalledWith(
        'editTableColumns',
        JSON.stringify(['timecode']),
        3
    );
});
