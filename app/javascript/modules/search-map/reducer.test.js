import reducer, { initialState } from './reducer';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the INITIALIZE_MAP_FILTER action', () => {
    const state = initialState;
    const action = {
        type: types.INITIALIZE_MAP_FILTER,
        payload: [1, 2, 3],
    };
    const expectedState = {
        ...initialState,
        filter: [1, 2, 3],
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

describe('TOGGLE_MAP_FILTER', () => {
    test('can enable a filter', () => {
        const state = {
            ...initialState,
            filter: [3, 4],
        };
        const action = {
            type: types.TOGGLE_MAP_FILTER,
            payload: 5,
        };
        const expectedState = {
            ...initialState,
            filter: [3, 4, 5],
        };
        expect(reducer(state, action)).toEqual(expectedState);
    });

    test('can disable a single filter', () => {
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
});
