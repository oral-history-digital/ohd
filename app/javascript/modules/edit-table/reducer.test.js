import reducer, { initialState } from './reducer';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the setSkipEmptyRows action', () => {
    const state = initialState;
    const action = {
        type: types.SET_SKIP_EMPTY_ROWS,
        payload: true,
    };
    const expectedState = {
        ...state,
        skipEmptyRows: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the setColumns action', () => {
    const state = initialState;
    const action = {
        type: types.SET_COLUMNS,
        payload: ['timecode'],
    };
    const expectedState = {
        ...state,
        columns: ['timecode'],
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
