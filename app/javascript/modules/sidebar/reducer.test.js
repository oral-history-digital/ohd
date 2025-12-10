import * as actions from './actions';
import reducer, { initialState } from './reducer';

const state = {
    visible: false,
    index: 1,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the show action', () => {
    const action = actions.showSidebar();
    const expectedState = {
        ...state,
        visible: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the hide action', () => {
    const action = actions.hideSidebar();
    const _state = {
        ...state,
        visible: true,
    };
    const expectedState = {
        ...state,
        visible: false,
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});

describe('toggle action', () => {
    test('shows if hidden', () => {
        const action = actions.toggleSidebar();
        const expectedState = {
            ...state,
            visible: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
    });

    test('hides if shown', () => {
        const action = actions.toggleSidebar();
        const _state = {
            ...state,
            visible: true,
        };
        const expectedState = {
            ...state,
            visible: false,
        };
        expect(reducer(_state, action)).toEqual(expectedState);
    });
});
