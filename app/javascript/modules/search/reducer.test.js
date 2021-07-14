import reducer, { initialState } from './reducer';
import * as types from './action-types';

const state = {
    map: {
        facets: null,
        query: {},
    },
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the TOGGLE_MAP_FILTER action', () => {
    const _state = {
        ...state,
        map: {
            ...state.map,
            filter: [3, 4, 5],
        },
    };
    const action = {
        type: types.TOGGLE_MAP_FILTER,
        payload: 3,
    };
    const expectedState = {
        ...state,
        map: {
            ...state.map,
            filter: [4, 5],
        },
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});
