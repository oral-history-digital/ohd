import reducer, { initialState } from './reducer';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the FETCH_WORKBOOK_STARTED action', () => {
    const state = {
        ...initialState,
        data: 'dummy',
        userAccountId: 3,
    };
    const action = { type: types.FETCH_WORKBOOK_STARTED };
    const expectedState = {
        ...initialState,
        isLoading: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the FETCH_WORKBOOK_SUCCEEDED action', () => {
    const state = {
        ...initialState,
        isLoading: true,
    };
    const action = {
        type: types.FETCH_WORKBOOK_SUCCEEDED,
        payload: {
            data: { 1: 'dummy' },
            user_account_id: 3,
        },
    };
    const expectedState = {
        ...state,
        isLoading: false,
        data: { 1: 'dummy' },
        userAccountId: 3,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the FETCH_WORKBOOK_FAILED action', () => {
    const state = {
        ...initialState,
        isLoading: true,
    };
    const action = {
        type: types.FETCH_WORKBOOK_FAILED,
        error: 'network error',
    };
    const expectedState = {
        ...state,
        isLoading: false,
        error: 'network error',
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
