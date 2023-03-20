import reducer, { initialState } from './reducer';
import { LOGOUT } from 'modules/user';
import * as types from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the FETCH_WORKBOOK_STARTED action', () => {
    const state = {
        ...initialState,
        data: 'dummy',
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
        },
    };
    const expectedState = {
        ...state,
        isLoading: false,
        data: { 1: 'dummy' },
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

test('handles the CREATE_WORKBOOK_SUCCEEDED action', () => {
    const state = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
        },
    };
    const action = {
        type: types.CREATE_WORKBOOK_SUCCEEDED,
        payload: {
            data: {
                id: 3,
                title: 'dummy',
            },
            id: 3,
        },
    };
    const expectedState = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
            3: {
                id: 3,
                title: 'dummy',
            },
        },
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the UPDATE_WORKBOOK_SUCCEEDED action', () => {
    const state = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
            3: {
                id: 3,
                title: 'dummy',
            },
        },
    };
    const action = {
        type: types.UPDATE_WORKBOOK_SUCCEEDED,
        payload: {
            data: {
                id: 3,
                title: 'new-dummy',
            },
            id: 3,
        },
    };
    const expectedState = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
            3: {
                id: 3,
                title: 'new-dummy',
            },
        },
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the DELETE_WORKBOOK_SUCCEEDED action', () => {
    const state = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
        },
    };
    const action = {
        type: types.DELETE_WORKBOOK_SUCCEEDED,
        payload: {
            id: '2',
        },
    };
    const expectedState = {
        ...initialState,
        data: {
            1: 'dummy',
        },
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('delete workbook data on LOGOUT action', () => {
    const state = {
        ...initialState,
        data: {
            1: 'dummy',
            2: 'dummy',
        },
    };
    const action = { type: LOGOUT };
    const expectedState = {
        ...initialState,
        data: null,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
