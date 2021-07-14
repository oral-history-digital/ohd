import * as types from './action-types';
import * as actions from './actions';

test('toggleMapFilter', () => {
    const actual = actions.toggleMapFilter(3);
    const expected = {
        type: types.TOGGLE_MAP_FILTER,
        payload: 3,
    };
    expect(actual).toEqual(expected);
});
