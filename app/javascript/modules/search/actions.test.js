import * as types from './action-types';
import * as actions from './actions';

test('requestMapSearch', () => {
    const actual = actions.requestMapSearch({
        'forced_labor_group[]': ['28218'],
    });
    const expected = {
        type: types.REQUEST_MAP_SEARCH,
        searchQuery: {
            'forced_labor_group[]': ['28218'],
        },
    };
    expect(actual).toEqual(expected);
});

test('toggleMapFilter', () => {
    const actual = actions.toggleMapFilter(3);
    const expected = {
        type: types.TOGGLE_MAP_FILTER,
        payload: 3,
    };
    expect(actual).toEqual(expected);
});
