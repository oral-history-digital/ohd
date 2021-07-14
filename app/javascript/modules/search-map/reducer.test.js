import reducer, { initialState } from './reducer';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the TOGGLE_MAP_FILTER action', () => {
    const state = {
        ...initialState,
        filter: [3, 4, 5],
    };
    const action = {
        type: types.TOGGLE_MAP_FILTER,
        payload: 3,
    };
    const expectedState = {
        ...initialState,
        filter: [4, 5],
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
