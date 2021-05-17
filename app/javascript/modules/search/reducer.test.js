import reducer, { initialState } from './reducer';
import * as types from './action-types';

const state = {
    map: {
        facets: null,
        query: {},
        foundMarkers: null,
    },
    isMapSearching: false,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the RECEIVE_MAP_SEARCH action', () => {
    const _state = {
        ...state,
        isMapSearching: true,
    };
    const action = {
        type: types.RECEIVE_MAP_SEARCH,
        payload: [
            {
                id: 1,
                name: 'London',
                lat: '34.2',
                lon: '67.2',
                ref_types: '1,2,3',
            },
        ],
    };
    const expectedState = {
        ...state,
        map: {
            ...state.map,
            foundMarkers: [
                {
                    id: 1,
                    name: 'London',
                    lat: '34.2',
                    lon: '67.2',
                    ref_types: '1,2,3',
                },
            ],
        },
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});
