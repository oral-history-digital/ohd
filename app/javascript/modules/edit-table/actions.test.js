import * as types from './action-types';
import * as actions from './actions';

test('setSkipEmptyRows', () => {
    const actual = actions.setSkipEmptyRows(true);
    const expected = {
        type: types.SET_SKIP_EMPTY_ROWS,
        payload: true,
    };
    expect(actual).toEqual(expected);
});

test('setColumns', () => {
    const actual = actions.setColumns(['timecode']);
    const expected = {
        type: types.SET_COLUMNS,
        payload: ['timecode'],
    };
    expect(actual).toEqual(expected);
});
