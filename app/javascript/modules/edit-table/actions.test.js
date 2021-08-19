import * as types from './action-types';
import * as actions from './actions';

test('setFilter', () => {
    const actual = actions.setFilter('all');
    const expected = {
        type: types.SET_FILTER,
        payload: 'all',
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
