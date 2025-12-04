import * as types from './action-types';
import reducer, { initialState } from './reducer';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the SET_AVAILABLE_VIEW_MODES action', () => {
    const state = initialState;
    const action = {
        type: types.SET_AVAILABLE_VIEW_MODES,
        payload: ['grid', 'list'],
    };
    const expectedState = {
        ...state,
        viewModes: ['grid', 'list'],
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the SET_VIEW_MODE action', () => {
    const state = initialState;
    const action = {
        type: types.SET_VIEW_MODE,
        payload: 'grid',
    };
    const expectedState = {
        ...state,
        viewMode: 'grid',
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the CLEAR_VIEW_MODES action', () => {
    const state = {
        ...initialState,
        viewModes: ['grid', 'list'],
        viewMode: 'grid',
    };
    const action = { type: types.CLEAR_VIEW_MODES };
    const expectedState = initialState;
    expect(reducer(state, action)).toEqual(expectedState);
});
