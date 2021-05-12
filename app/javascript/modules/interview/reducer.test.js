import reducer, { initialState } from './reducer';
import * as types from './action-types';

const state = {
    autoScroll: true,
    tabIndex: 0,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the setInterviewTabIndex action', () => {
    const action = {
        type: types.SET_INTERVIEW_TAB_INDEX,
        tabIndex: 2,
    };
    const expectedState = {
        ...state,
        tabIndex: 2,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the ENABLE_AUTO_SCROLL action', () => {
    const _state = {
        ...state,
        autoScroll: false,
    };
    const action = { type: types.ENABLE_AUTO_SCROLL };
    const expectedState = {
        ...state,
        autoScroll: true,
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});

test('handles the DISABLE_AUTO_SCROLL action', () => {
    const action = { type: types.DISABLE_AUTO_SCROLL };
    const expectedState = {
        ...state,
        autoScroll: false,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
