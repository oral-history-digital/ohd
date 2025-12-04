import * as types from './action-types';
import reducer, { initialState } from './reducer';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the setFilter action', () => {
    const state = initialState;
    const action = {
        type: types.SET_FILTER,
        payload: 'filtered',
    };
    const expectedState = {
        ...state,
        filter: 'filtered',
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
