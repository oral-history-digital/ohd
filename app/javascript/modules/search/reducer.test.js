import reducer, { initialState } from './reducer';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the CLEAR_SINGLE_INTERVIEW_SEARCH action', () => {
    const state = {
        ...initialState,
        interviews: {
            cd008: 'dummy',
            cd009: 'dummy',
        },
    };
    const action = {
        type: types.CLEAR_SINGLE_INTERVIEW_SEARCH,
        payload: 'cd008',
    };
    const expectedState = {
        ...initialState,
        interviews: {
            cd009: 'dummy',
        },
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the CLEAR_ALL_INTERVIEW_SEARCH action', () => {
    const state = {
        ...initialState,
        interviews: {
            cd008: 'dummy',
            cd009: 'dummy',
        },
    };
    const action = { type: types.CLEAR_ALL_INTERVIEW_SEARCH };
    const expectedState = {
        ...initialState,
        interviews: {},
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
