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

test('receiveMapSearchResults', () => {
    const actual = actions.receiveMapSearchResults([
        {
            id: 2,
            name: 'London',
            lat: '34.2',
            lon: '36.0',
        },
    ]);
    const expected = {
        type: types.RECEIVE_MAP_SEARCH,
        payload: [{
            id: 2,
            name: 'London',
            lat: '34.2',
            lon: '36.0',
        }],
    };
    expect(actual).toEqual(expected);
});
